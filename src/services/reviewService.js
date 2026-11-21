import { getItem, setItem } from './storage';
import { getSessionById } from './sessionService';
import { getUserById } from './userService';
import { addNotification } from './notificationService';
import { STORAGE_KEYS } from '../utils/constants';
import { mockReviews } from '../data/reviews';

function loadReviews() {
  const stored = getItem(STORAGE_KEYS.REVIEWS, null);
  if (stored) return stored;
  setItem(STORAGE_KEYS.REVIEWS, mockReviews);
  return mockReviews;
}

export async function getReviewsForUser(userId) {
  return loadReviews()
    .filter((r) => r.revieweeId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function getReviewForSession(sessionId) {
  return loadReviews().find((r) => r.sessionId === sessionId) ?? null;
}

export async function createReview({ reviewerId, sessionId, rating, comment }) {
  const session = await getSessionById(sessionId);
  if (!session) throw new Error('Session not found.');
  if (session.status !== 'completed') throw new Error('You can only review a completed session.');
  if (session.learnerId !== reviewerId) throw new Error('Only the learner can review the teacher.');

  const all = loadReviews();
  if (all.some((r) => r.sessionId === sessionId)) {
    throw new Error('This session has already been reviewed.');
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new Error('Please choose a rating from 1 to 5 stars.');
  }

  const cleanComment = comment.trim();
  if (cleanComment.length > 300) throw new Error('Comment must be 300 characters or less.');

  const newReview = {
    id: Date.now(),
    sessionId,
    reviewerId,
    revieweeId: session.teacherId,
    skillId: session.skillId,
    rating,
    comment: cleanComment,
    createdAt: new Date().toISOString(),
  };
  setItem(STORAGE_KEYS.REVIEWS, [...all, newReview]);

  const reviewer = await getUserById(reviewerId);
  await addNotification({
    userId: session.teacherId,
    message: `${reviewer?.name ?? 'Someone'} rated your session ${rating} ${rating === 1 ? 'star' : 'stars'}.`,
    link: '/profile',
  });

  return newReview;
}