import * as sessionService from '../services/sessionService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { parseId } from '../utils/parseId.js';

export const listSessions = asyncHandler(async (req, res) => {
  res.json({ sessions: await sessionService.getSessionsForUser(req.user.id) });
});

export const createSession = asyncHandler(async (req, res) => {
  const { requestId, skillId, date, time, durationMins, mode, location, notes } = req.body;

  const session = await sessionService.createSession(req.user.id, {
    requestId: Number(requestId),
    skillId: Number(skillId),
    date,
    time,
    durationMins: Number(durationMins),
    mode,
    location,
    notes,
  });
  res.status(201).json({ session });
});

export const updateSession = asyncHandler(async (req, res) => {
  const session = await sessionService.updateSessionStatus(
    parseId(req.params.id, 'Session'),
    req.user.id,
    req.body.action
  );
  res.json({ session });
});