import * as matchService from '../services/matchService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listMatches = asyncHandler(async (req, res) => {
  res.json({ matches: await matchService.getMatchesForUser(req.user.id) });
});