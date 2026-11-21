import { getItem, setItem } from './storage';
import { getUserById } from './userService';
import { STORAGE_KEYS } from '../utils/constants';
import { mockProjects } from '../data/projects';

const MAX_SKILLS = 5;
const MAX_MEMBERS = 8;

function loadProjects() {
  const stored = getItem(STORAGE_KEYS.PROJECTS, null);
  if (stored) return stored;
  setItem(STORAGE_KEYS.PROJECTS, mockProjects);
  return mockProjects;
}

function saveProjects(list) {
  setItem(STORAGE_KEYS.PROJECTS, list);
}

// Ekta project khuje, change(project) diye notun version banay, save kore return kore.
function changeProject(projectId, change) {
  const all = loadProjects();
  const project = all.find((p) => p.id === projectId);
  if (!project) throw new Error('Project not found.');

  const updated = change(project);
  saveProjects(all.map((p) => (p.id === projectId ? updated : p)));
  return updated;
}

function requireOwner(project, userId) {
  if (project.ownerId !== userId) throw new Error('Only the project owner can do this.');
}

function cleanFields({ title, description, skillIds, githubUrl = '', demoUrl = '' }) {
  const cleanTitle = title.trim();
  const cleanDescription = description.trim();
  const github = githubUrl.trim();
  const demo = demoUrl.trim();

  if (cleanTitle.length < 3 || cleanTitle.length > 80) {
    throw new Error('Title must be between 3 and 80 characters.');
  }
  if (cleanDescription.length < 10 || cleanDescription.length > 600) {
    throw new Error('Description must be between 10 and 600 characters.');
  }
  if (skillIds.length === 0) throw new Error('Choose at least one skill.');
  if (skillIds.length > MAX_SKILLS) throw new Error(`Choose up to ${MAX_SKILLS} skills.`);

  for (const url of [github, demo]) {
    if (url && !/^https?:\/\/\S+$/i.test(url)) {
      throw new Error('Links must start with http:// or https://');
    }
  }

  return { title: cleanTitle, description: cleanDescription, skillIds, githubUrl: github, demoUrl: demo };
}

export async function getAllProjects() {
  return loadProjects();
}

export async function getProjectById(projectId) {
  return loadProjects().find((p) => p.id === projectId) ?? null;
}

export async function createProject({ ownerId, ...fields }) {
  const newProject = {
    id: Date.now(),
    ownerId,
    ...cleanFields(fields),
    createdAt: new Date().toISOString(),
    likes: [],
    comments: [],
    members: [{ userId: ownerId, role: 'Owner' }],
    contributions: [],
  };

  saveProjects([...loadProjects(), newProject]);
  return newProject;
}

export async function editProject(projectId, userId, fields) {
  return changeProject(projectId, (project) => {
    requireOwner(project, userId);
    return { ...project, ...cleanFields(fields) };
  });
}

export async function deleteProject(projectId, userId) {
  const all = loadProjects();
  const project = all.find((p) => p.id === projectId);
  if (!project) throw new Error('Project not found.');
  requireOwner(project, userId);
  saveProjects(all.filter((p) => p.id !== projectId));
}

export async function toggleLike(projectId, userId) {
  return changeProject(projectId, (project) => {
    const liked = project.likes.includes(userId);
    return {
      ...project,
      likes: liked ? project.likes.filter((id) => id !== userId) : [...project.likes, userId],
    };
  });
}

export async function addComment(projectId, userId, text) {
  const cleanText = text.trim();
  if (cleanText.length < 1 || cleanText.length > 300) {
    throw new Error('Comment must be between 1 and 300 characters.');
  }

  return changeProject(projectId, (project) => ({
    ...project,
    comments: [
      ...project.comments,
      { id: Date.now(), userId, text: cleanText, createdAt: new Date().toISOString() },
    ],
  }));
}

// Comment-er lekhok ba project-er owner delete korte pare.
export async function deleteComment(projectId, commentId, userId) {
  return changeProject(projectId, (project) => {
    const comment = project.comments.find((c) => c.id === commentId);
    if (!comment) throw new Error('Comment not found.');
    if (comment.userId !== userId && project.ownerId !== userId) {
      throw new Error('You cannot delete this comment.');
    }
    return { ...project, comments: project.comments.filter((c) => c.id !== commentId) };
  });
}

export async function addMember(projectId, ownerId, newUserId, role) {
  const user = await getUserById(newUserId);
  if (!user) throw new Error('This user does not exist.');

  const cleanRole = role.trim() || 'Contributor';
  if (cleanRole.length > 30) throw new Error('Role must be 30 characters or less.');

  return changeProject(projectId, (project) => {
    requireOwner(project, ownerId);
    if (project.members.some((m) => m.userId === newUserId)) {
      throw new Error('This user is already on the team.');
    }
    if (project.members.length >= MAX_MEMBERS) {
      throw new Error(`A team can have at most ${MAX_MEMBERS} members.`);
    }
    return { ...project, members: [...project.members, { userId: newUserId, role: cleanRole }] };
  });
}

// Member remove korleo tar ager contribution history thake.
export async function removeMember(projectId, ownerId, memberUserId) {
  return changeProject(projectId, (project) => {
    requireOwner(project, ownerId);
    if (memberUserId === project.ownerId) throw new Error('The owner cannot be removed.');
    return { ...project, members: project.members.filter((m) => m.userId !== memberUserId) };
  });
}

export async function addContribution(projectId, userId, { description, hours }) {
  const cleanDescription = description.trim();
  if (cleanDescription.length < 3 || cleanDescription.length > 150) {
    throw new Error('Description must be between 3 and 150 characters.');
  }
  if (!Number.isFinite(hours) || hours < 0.5 || hours > 24) {
    throw new Error('Hours must be between 0.5 and 24.');
  }

  return changeProject(projectId, (project) => {
    if (!project.members.some((m) => m.userId === userId)) {
      throw new Error('Only team members can log contributions.');
    }
    return {
      ...project,
      contributions: [
        ...project.contributions,
        {
          id: Date.now(),
          userId,
          description: cleanDescription,
          hours: Math.round(hours * 10) / 10,
          createdAt: new Date().toISOString(),
        },
      ],
    };
  });
}

// Log-er lekhok ba project-er owner delete korte pare.
export async function deleteContribution(projectId, contributionId, userId) {
  return changeProject(projectId, (project) => {
    const entry = project.contributions.find((c) => c.id === contributionId);
    if (!entry) throw new Error('Contribution not found.');
    if (entry.userId !== userId && project.ownerId !== userId) {
      throw new Error('You cannot delete this entry.');
    }
    return {
      ...project,
      contributions: project.contributions.filter((c) => c.id !== contributionId),
    };
  });
}