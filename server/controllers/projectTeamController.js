import * as teamService from '../services/projectTeamService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { parseId } from '../utils/parseId.js';

export const addComment = asyncHandler(async (req, res) => {
  const project = await teamService.addComment(
    parseId(req.params.id, 'Project'),
    req.user.id,
    req.body.text
  );
  res.status(201).json({ project });
});

export const deleteComment = asyncHandler(async (req, res) => {
  const project = await teamService.deleteComment(
    parseId(req.params.id, 'Project'),
    parseId(req.params.commentId, 'Comment'),
    req.user.id
  );
  res.json({ project });
});

export const addMember = asyncHandler(async (req, res) => {
  const project = await teamService.addMember(
    parseId(req.params.id, 'Project'),
    req.user.id,
    Number(req.body.userId),
    req.body.role
  );
  res.status(201).json({ project });
});

export const removeMember = asyncHandler(async (req, res) => {
  const project = await teamService.removeMember(
    parseId(req.params.id, 'Project'),
    req.user.id,
    parseId(req.params.userId, 'User')
  );
  res.json({ project });
});

export const addContribution = asyncHandler(async (req, res) => {
  const { description, hours } = req.body;
  const project = await teamService.addContribution(parseId(req.params.id, 'Project'), req.user.id, {
    description,
    hours: Number(hours),
  });
  res.status(201).json({ project });
});

export const deleteContribution = asyncHandler(async (req, res) => {
  const project = await teamService.deleteContribution(
    parseId(req.params.id, 'Project'),
    parseId(req.params.contributionId, 'Contribution'),
    req.user.id
  );
  res.json({ project });
});