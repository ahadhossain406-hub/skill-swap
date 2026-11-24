import * as reviewService from '../services/reviewService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { parseId } from '../utils/parseId.js';

export const listUserReviews = asyncHandler(async (req, res) => {
  res.json(await reviewService.getReviewsForUser(parseId(req.params.userId, 'User')));
});

export const getSessionReview = asyncHandler(async (req, res) => {
  const review = await reviewService.getReviewForSession(
    parseId(req.params.sessionId, 'Session'),
    req.user.id
  );
  res.json({ review });
});

export const createReview = asyncHandler(async (req, res) => {
  const { sessionId, rating, comment } = req.body;

  const review = await reviewService.createReview(req.user.id, {
    sessionId: Number(sessionId),
    rating: Number(rating),
    comment,
  });
  res.status(201).json({ review });
});