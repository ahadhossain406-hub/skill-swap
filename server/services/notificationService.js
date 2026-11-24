import { pool } from '../config/db.js';
import AppError from '../utils/AppError.js';

function formatNotification(row) {
  return {
    id: row.id,
    userId: row.user_id,
    message: row.message,
    link: row.link,
    read: Boolean(row.is_read),
    createdAt: row.created_at,
  };
}

export async function getNotificationsForUser(userId) {
  const [rows] = await pool.query(
    'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC, id DESC',
    [userId]
  );
  return rows.map(formatNotification);
}

// Onno service gulo (request, session, review) ei function diye notification pathay.
// byUserId-er nam message-er shuru-te boshe:
//   "Tanvir Hasan" + " sent you a swap request."
export async function notify({ toUserId, byUserId, text, link = '' }) {
  const [users] = await pool.query('SELECT name FROM users WHERE id = ?', [byUserId]);
  const name = users[0]?.name ?? 'Someone';

  await pool.query('INSERT INTO notifications (user_id, message, link) VALUES (?, ?, ?)', [
    toUserId,
    `${name} ${text}`,
    link,
  ]);
}

export async function markAsRead(notificationId, userId) {
  // user_id-o milai, jate keu onner notification-e hat dite na pare.
  const [rows] = await pool.query('SELECT id FROM notifications WHERE id = ? AND user_id = ?', [
    notificationId,
    userId,
  ]);
  if (rows.length === 0) throw new AppError('Notification not found.', 404);

  await pool.query('UPDATE notifications SET is_read = TRUE WHERE id = ?', [notificationId]);
}

export async function markAllAsRead(userId) {
  await pool.query('UPDATE notifications SET is_read = TRUE WHERE user_id = ? AND is_read = FALSE', [
    userId,
  ]);
}