import * as projectService from '../services/projectService.js';
import AppError from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { parseId } from '../utils/parseId.js';

// Body theke shudhu dorkari field nei.
function pickFields(body) {
  const { title, description, skillIds, githubUrl, demoUrl } = body;
  return { title, description, skillIds: skillIds.map(Number), githubUrl, demoUrl };
}

export const listProjects = asyncHandler(async (req, res) => {
  res.json({ projects: await projectService.getAllProjects() });
});

export const getProject = asyncHandler(async (req, res) => {
  const project = await projectService.getProjectById(parseId(req.params.id, 'Project'));
  if (!project) throw new AppError('Project not found.', 404);
  res.json({ project });
});

export const createProject = asyncHandler(async (req, res) => {
  const project = await projectService.createProject(req.user.id, pickFields(req.body));
  res.status(201).json({ project });
});

export const updateProject = asyncHandler(async (req, res) => {
  const project = await projectService.updateProject(
    parseId(req.params.id, 'Project'),
    req.user.id,
    pickFields(req.body)
  );
  res.json({ project });
});

export const deleteProject = asyncHandler(async (req, res) => {
  await projectService.deleteProject(parseId(req.params.id, 'Project'), req.user.id);
  res.json({ message: 'Project deleted.' });
});

export const likeProject = asyncHandler(async (req, res) => {
  const project = await projectService.toggleLike(parseId(req.params.id, 'Project'), req.user.id);
  res.json({ project });
});