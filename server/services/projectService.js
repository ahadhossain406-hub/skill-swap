import { pool } from '../config/db.js';
import AppError from '../utils/AppError.js';
import { withTransaction } from '../utils/transaction.js';

// Project-er shob data alada alada table-e thake (skill, member, like, comment, contribution).
// Ei function 6-ta query-te shob ane (protita project-er jonno alada query na),
// tarpor frontend-er project object-er moto jore dey.
async function loadProjects(whereSql = '', params = []) {
  const [rows] = await pool.query(
    `SELECT * FROM projects ${whereSql} ORDER BY created_at DESC, id DESC`,
    params
  );
  if (rows.length === 0) return [];

  const ids = rows.map((row) => row.id);

  const [skills] = await pool.query(
    'SELECT project_id, skill_id FROM project_skills WHERE project_id IN (?) ORDER BY skill_id',
    [ids]
  );
  // Owner shobar age, tarpor jar joined_at age.
  const [members] = await pool.query(
    `SELECT m.project_id, m.user_id, m.role
     FROM project_members m
     JOIN projects p ON p.id = m.project_id
     WHERE m.project_id IN (?)
     ORDER BY (m.user_id = p.owner_id) DESC, m.joined_at, m.user_id`,
    [ids]
  );
  const [likes] = await pool.query(
    'SELECT project_id, user_id FROM project_likes WHERE project_id IN (?)',
    [ids]
  );
  const [comments] = await pool.query(
    'SELECT id, project_id, user_id, text, created_at FROM project_comments WHERE project_id IN (?) ORDER BY created_at, id',
    [ids]
  );
  const [contributions] = await pool.query(
    'SELECT id, project_id, user_id, description, hours, created_at FROM contributions WHERE project_id IN (?) ORDER BY created_at, id',
    [ids]
  );

  const forProject = (list, projectId) => list.filter((item) => item.project_id === projectId);

  return rows.map((row) => ({
    id: row.id,
    ownerId: row.owner_id,
    title: row.title,
    description: row.description,
    skillIds: forProject(skills, row.id).map((s) => s.skill_id),
    githubUrl: row.github_url,
    demoUrl: row.demo_url,
    createdAt: row.created_at,
    likes: forProject(likes, row.id).map((l) => l.user_id),
    comments: forProject(comments, row.id).map((c) => ({
      id: c.id,
      userId: c.user_id,
      text: c.text,
      createdAt: c.created_at,
    })),
    members: forProject(members, row.id).map((m) => ({ userId: m.user_id, role: m.role })),
    contributions: forProject(contributions, row.id).map((c) => ({
      id: c.id,
      userId: c.user_id,
      description: c.description,
      hours: Number(c.hours), // DECIMAL database theke string hishebe ashe, number-e bodlai
      createdAt: c.created_at,
    })),
  }));
}

export async function getAllProjects() {
  return loadProjects();
}

export async function getProjectById(projectId) {
  const [project] = await loadProjects('WHERE id = ?', [projectId]);
  return project ?? null;
}

// Project na thakle 404. Onno service-o eta use kore.
export async function requireProject(projectId) {
  const project = await getProjectById(projectId);
  if (!project) throw new AppError('Project not found.', 404);
  return project;
}

export function requireOwner(project, userId) {
  if (project.ownerId !== userId) {
    throw new AppError('Only the project owner can do this.', 403);
  }
}

// Skill gulo duplicate na, ar database-e ache kina.
async function checkSkillsExist(connection, skillIds) {
  if (new Set(skillIds).size !== skillIds.length) {
    throw new AppError('Each skill can be chosen only once.', 400);
  }
  const [found] = await connection.query('SELECT id FROM skills WHERE id IN (?)', [skillIds]);
  if (found.length !== skillIds.length) {
    throw new AppError('One or more skills do not exist.', 400);
  }
}

export async function createProject(
  ownerId,
  { title, description, skillIds, githubUrl = '', demoUrl = '' }
) {
  const projectId = await withTransaction(async (connection) => {
    await checkSkillsExist(connection, skillIds);

    const [result] = await connection.query(
      'INSERT INTO projects (owner_id, title, description, github_url, demo_url) VALUES (?, ?, ?, ?, ?)',
      [ownerId, title, description, githubUrl, demoUrl]
    );

    await connection.query('INSERT INTO project_skills (project_id, skill_id) VALUES ?', [
      skillIds.map((skillId) => [result.insertId, skillId]),
    ]);

    // Je banay, se-i prothom member (owner).
    await connection.query(
      "INSERT INTO project_members (project_id, user_id, role) VALUES (?, ?, 'Owner')",
      [result.insertId, ownerId]
    );

    return result.insertId;
  });

  return getProjectById(projectId);
}

export async function updateProject(
  projectId,
  userId,
  { title, description, skillIds, githubUrl = '', demoUrl = '' }
) {
  const project = await requireProject(projectId);
  requireOwner(project, userId);

  await withTransaction(async (connection) => {
    await checkSkillsExist(connection, skillIds);

    await connection.query(
      'UPDATE projects SET title = ?, description = ?, github_url = ?, demo_url = ? WHERE id = ?',
      [title, description, githubUrl, demoUrl, projectId]
    );

    await connection.query('DELETE FROM project_skills WHERE project_id = ?', [projectId]);
    await connection.query('INSERT INTO project_skills (project_id, skill_id) VALUES ?', [
      skillIds.map((skillId) => [projectId, skillId]),
    ]);
  });

  return getProjectById(projectId);
}

export async function deleteProject(projectId, userId) {
  const project = await requireProject(projectId);
  requireOwner(project, userId);

  // ON DELETE CASCADE: project-er comment, member, like, contribution nijeii muche jay.
  await pool.query('DELETE FROM projects WHERE id = ?', [projectId]);
}

// Like thakle muche dey, na thakle like dey.
export async function toggleLike(projectId, userId) {
  const project = await requireProject(projectId);

  if (project.likes.includes(userId)) {
    await pool.query('DELETE FROM project_likes WHERE project_id = ? AND user_id = ?', [
      projectId,
      userId,
    ]);
  } else {
    await pool.query('INSERT INTO project_likes (project_id, user_id) VALUES (?, ?)', [
      projectId,
      userId,
    ]);
  }

  return getProjectById(projectId);
}