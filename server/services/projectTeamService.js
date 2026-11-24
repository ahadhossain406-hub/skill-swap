import { pool } from '../config/db.js';
import AppError from '../utils/AppError.js';
import { getProjectById, requireOwner, requireProject } from './projectService.js';

const MAX_MEMBERS = 8;

// Protita function kaj shesh kore updated project return kore,
// jate frontend ekbar-i shob notun data pay.

export async function addComment(projectId, userId, text) {
  await requireProject(projectId);

  await pool.query('INSERT INTO project_comments (project_id, user_id, text) VALUES (?, ?, ?)', [
    projectId,
    userId,
    text,
  ]);

  return getProjectById(projectId);
}

// Comment-er lekhok ba project-er owner delete korte pare.
export async function deleteComment(projectId, commentId, userId) {
  const project = await requireProject(projectId);

  const comment = project.comments.find((c) => c.id === commentId);
  if (!comment) throw new AppError('Comment not found.', 404);
  if (comment.userId !== userId && project.ownerId !== userId) {
    throw new AppError('You cannot delete this comment.', 403);
  }

  await pool.query('DELETE FROM project_comments WHERE id = ?', [commentId]);
  return getProjectById(projectId);
}

export async function addMember(projectId, ownerId, newUserId, role) {
  const project = await requireProject(projectId);
  requireOwner(project, ownerId);

  const [users] = await pool.query("SELECT id FROM users WHERE id = ? AND role <> 'admin'", [
    newUserId,
  ]);
  if (users.length === 0) throw new AppError('This user does not exist.', 404);

  if (project.members.some((m) => m.userId === newUserId)) {
    throw new AppError('This user is already on the team.', 409);
  }
  if (project.members.length >= MAX_MEMBERS) {
    throw new AppError(`A team can have at most ${MAX_MEMBERS} members.`, 400);
  }

  await pool.query('INSERT INTO project_members (project_id, user_id, role) VALUES (?, ?, ?)', [
    projectId,
    newUserId,
    role || 'Contributor',
  ]);

  return getProjectById(projectId);
}

// Member remove korleo tar ager contribution history thake.
export async function removeMember(projectId, ownerId, memberUserId) {
  const project = await requireProject(projectId);
  requireOwner(project, ownerId);

  if (memberUserId === project.ownerId) {
    throw new AppError('The owner cannot be removed.', 400);
  }
  if (!project.members.some((m) => m.userId === memberUserId)) {
    throw new AppError('This user is not on the team.', 404);
  }

  await pool.query('DELETE FROM project_members WHERE project_id = ? AND user_id = ?', [
    projectId,
    memberUserId,
  ]);

  return getProjectById(projectId);
}

// Contribution tracker: shudhu team member kaj log korte pare.
export async function addContribution(projectId, userId, { description, hours }) {
  const project = await requireProject(projectId);

  if (!project.members.some((m) => m.userId === userId)) {
    throw new AppError('Only team members can log contributions.', 403);
  }

  await pool.query(
    'INSERT INTO contributions (project_id, user_id, description, hours) VALUES (?, ?, ?, ?)',
    [projectId, userId, description, Math.round(hours * 10) / 10]
  );

  return getProjectById(projectId);
}

// Log-er lekhok ba project-er owner delete korte pare.
export async function deleteContribution(projectId, contributionId, userId) {
  const project = await requireProject(projectId);

  const entry = project.contributions.find((c) => c.id === contributionId);
  if (!entry) throw new AppError('Contribution not found.', 404);
  if (entry.userId !== userId && project.ownerId !== userId) {
    throw new AppError('You cannot delete this entry.', 403);
  }

  await pool.query('DELETE FROM contributions WHERE id = ?', [contributionId]);
  return getProjectById(projectId);
}