import { pool } from '../config/db.js';
import AppError from '../utils/AppError.js';
import { notify } from './notificationService.js';

function formatRequest(row) {
  return {
    id: row.id,
    fromUserId: row.from_user_id,
    toUserId: row.to_user_id,
    offeredSkillId: row.offered_skill_id,
    requestedSkillId: row.requested_skill_id,
    message: row.message,
    status: row.status,
    createdAt: row.created_at,
    respondedAt: row.responded_at,
  };
}

// Ei user-er pathano ba paowa shob request, notun ager-e.
export async function getRequestsForUser(userId) {
  const [rows] = await pool.query(
    'SELECT * FROM exchange_requests WHERE from_user_id = ? OR to_user_id = ? ORDER BY created_at DESC, id DESC',
    [userId, userId]
  );
  return rows.map(formatRequest);
}

export async function getRequestById(requestId) {
  const [rows] = await pool.query('SELECT * FROM exchange_requests WHERE id = ?', [requestId]);
  return rows[0] ? formatRequest(rows[0]) : null;
}

// Ei user ki ei skill shekhay (teach list-e ache)?
async function teachesSkill(userId, skillId) {
  const [rows] = await pool.query(
    "SELECT 1 FROM user_skills WHERE user_id = ? AND skill_id = ? AND type = 'teach'",
    [userId, skillId]
  );
  return rows.length > 0;
}

export async function createRequest(
  fromUserId,
  { toUserId, offeredSkillId, requestedSkillId, message = '' }
) {
  if (fromUserId === toUserId) {
    throw new AppError('You cannot send a request to yourself.', 400);
  }

  const [targets] = await pool.query("SELECT id FROM users WHERE id = ? AND role <> 'admin'", [
    toUserId,
  ]);
  if (targets.length === 0) throw new AppError('This user does not exist.', 404);

  if (!(await teachesSkill(fromUserId, offeredSkillId))) {
    throw new AppError('You can only offer a skill that is on your profile.', 400);
  }
  if (!(await teachesSkill(toUserId, requestedSkillId))) {
    throw new AppError('This user does not teach that skill.', 400);
  }

  // Duijon-er moddhe ekta pending request thakle notun ekta pathano jabe na.
  const [pending] = await pool.query(
    `SELECT id FROM exchange_requests
     WHERE status = 'pending'
       AND ((from_user_id = ? AND to_user_id = ?) OR (from_user_id = ? AND to_user_id = ?))`,
    [fromUserId, toUserId, toUserId, fromUserId]
  );
  if (pending.length > 0) {
    throw new AppError('There is already a pending request between you two.', 409);
  }

  const [result] = await pool.query(
    `INSERT INTO exchange_requests (from_user_id, to_user_id, offered_skill_id, requested_skill_id, message)
     VALUES (?, ?, ?, ?, ?)`,
    [fromUserId, toUserId, offeredSkillId, requestedSkillId, message]
  );

  await notify({
    toUserId,
    byUserId: fromUserId,
    text: 'sent you a swap request.',
    link: '/requests',
  });

  return getRequestById(result.insertId);
}

// action = 'accept' | 'decline' | 'cancel'
export async function updateRequestStatus(requestId, userId, action) {
  const request = await getRequestById(requestId);

  // Je request-er shathe tumi jorito na, seta tumi dekhte-i parbe na (404).
  if (!request || (request.fromUserId !== userId && request.toUserId !== userId)) {
    throw new AppError('Request not found.', 404);
  }
  if (request.status !== 'pending') {
    throw new AppError('This request is no longer pending.', 409);
  }

  // Accept/decline shudhu receiver korte pare. Cancel shudhu sender.
  const rules = {
    accept: { allowedUserId: request.toUserId, newStatus: 'accepted' },
    decline: { allowedUserId: request.toUserId, newStatus: 'declined' },
    cancel: { allowedUserId: request.fromUserId, newStatus: 'cancelled' },
  };

  const rule = rules[action];
  if (!rule) throw new AppError('Unknown action.', 400);
  if (rule.allowedUserId !== userId) throw new AppError('You are not allowed to do this.', 403);

  // "AND status = 'pending'": duijon ekshathe click korleo shudhu ekta kaj korbe.
  await pool.query(
    "UPDATE exchange_requests SET status = ?, responded_at = UTC_TIMESTAMP() WHERE id = ? AND status = 'pending'",
    [rule.newStatus, requestId]
  );

  const texts = {
    accept: 'accepted your swap request.',
    decline: 'declined your swap request.',
    cancel: 'cancelled their swap request.',
  };
  await notify({
    toUserId: action === 'cancel' ? request.toUserId : request.fromUserId,
    byUserId: userId,
    text: texts[action],
    link: '/requests',
  });

  return getRequestById(requestId);
}