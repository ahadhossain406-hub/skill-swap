import { pool } from '../config/db.js';
import AppError from '../utils/AppError.js';
import { notify } from './notificationService.js';
import { getSessionById } from './sessionService.js';

function formatReview(row) {
  return {
    id: row.id,
    sessionId: row.session_id,
    reviewerId: row.reviewer_id,
    reviewerName: row.reviewer_name,
    revieweeId: row.reviewee_id,
    skillId: row.skill_id,
    rating: row.rating,
    comment: row.comment,
    createdAt: row.created_at,
  };
}

// Review-er shathe reviewer-er nam-o ane (JOIN), jate frontend-e alada kore khujte na hoy.
const REVIEW_SELECT = `
  SELECT r.*, u.name AS reviewer_name
  FROM reviews r
  JOIN users u ON u.id = r.reviewer_id
`;

// Kono user-er (teacher-er) shob review ar average rating. Eta shobar jonno khola.
export async function getReviewsForUser(userId) {
  const [rows] = await pool.query(
    `${REVIEW_SELECT} WHERE r.reviewee_id = ? ORDER BY r.created_at DESC, r.id DESC`,
    [userId]
  );
  const reviews = rows.map(formatReview);

  const count = reviews.length;
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  const average = count === 0 ? 0 : Math.round((total / count) * 10) / 10;

  return { reviews, summary: { average, count } };
}

// Ekta session-er review. Shudhu oi session-er duijon dekhte pare.
export async function getReviewForSession(sessionId, userId) {
  const session = await getSessionById(sessionId);
  if (!session || (session.teacherId !== userId && session.learnerId !== userId)) {
    throw new AppError('Session not found.', 404);
  }

  const [rows] = await pool.query(`${REVIEW_SELECT} WHERE r.session_id = ?`, [sessionId]);
  return rows[0] ? formatReview(rows[0]) : null;
}

// Learner teacher-ke rate kore. Ekta session-e ekta-i review.
export async function createReview(reviewerId, { sessionId, rating, comment = '' }) {
  const session = await getSessionById(sessionId);
  if (!session || (session.teacherId !== reviewerId && session.learnerId !== reviewerId)) {
    throw new AppError('Session not found.', 404);
  }
  if (session.status !== 'completed') {
    throw new AppError('You can only review a completed session.', 400);
  }
  if (session.learnerId !== reviewerId) {
    throw new AppError('Only the learner can review the teacher.', 403);
  }

  const [existing] = await pool.query('SELECT id FROM reviews WHERE session_id = ?', [sessionId]);
  if (existing.length > 0) {
    throw new AppError('This session has already been reviewed.', 409);
  }

  await pool.query(
    `INSERT INTO reviews (session_id, reviewer_id, reviewee_id, skill_id, rating, comment)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [sessionId, reviewerId, session.teacherId, session.skillId, rating, comment]
  );

  await notify({
    toUserId: session.teacherId,
    byUserId: reviewerId,
    text: `rated your session ${rating} ${rating === 1 ? 'star' : 'stars'}.`,
    link: '/profile',
  });

  return getReviewForSession(sessionId, reviewerId);
}