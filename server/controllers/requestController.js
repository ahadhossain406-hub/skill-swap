import * as requestService from '../services/requestService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { parseId } from '../utils/parseId.js';

export const listRequests = asyncHandler(async (req, res) => {
  res.json({ requests: await requestService.getRequestsForUser(req.user.id) });
});

export const createRequest = asyncHandler(async (req, res) => {
  const { toUserId, offeredSkillId, requestedSkillId, message } = req.body;

  const request = await requestService.createRequest(req.user.id, {
    toUserId: Number(toUserId),
    offeredSkillId: Number(offeredSkillId),
    requestedSkillId: Number(requestedSkillId),
    message,
  });
  res.status(201).json({ request });
});

export const respondToRequest = asyncHandler(async (req, res) => {
  const request = await requestService.updateRequestStatus(
    parseId(req.params.id, 'Request'),
    req.user.id,
    req.body.action
  );
  res.json({ request });
});