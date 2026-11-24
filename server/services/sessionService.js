import { pool } from '../config/db.js';
import AppError from '../utils/AppError.js';
import { notify } from './notificationService.js';
import { getRequestById } from './requestService.js';

function formatSession(row) {
  return {
    id: row.id,
    requestId: row.request_id,
    teacherId: row.teacher_id,
    learnerId: row.learner_id,
    skillId: row.skill_id,
    date: row.session_date, // "2026-11-25"
    time: String(row.session_time).slice(0, 5), // "18:00:00" -> "18:00"
    durationMins: row.duration_mins,
    mode: row.mode,
    location: row.location,
    notes: row.notes,
    status: row.status,
    createdAt: row.created_at,
    completedAt: row.completed_at,
  };
}

// Ei user ja-ja session-e shekhay ba shekhe.
export async function getSessionsForUser(userId) {
  const [rows] = await pool.query(
    'SELECT * FROM sessions WHERE teacher_id = ? OR learner_id = ? ORDER BY session_date, session_time',
    [userId, userId]
  );
  return rows.map(formatSession);
}

export async function getSessionById(sessionId) {
  const [rows] = await pool.query('SELECT * FROM sessions WHERE id = ?', [sessionId]);
  return rows[0] ? formatSession(rows[0]) : null;
}

export async function createSession(
  creatorId,
  { requestId, skillId, date, time, durationMins, mode, location = '', notes = '' }
) {
  // Shudhu accepted swap-er jonno session banano jay.
  const request = await getRequestById(requestId);
  if (!request || (request.fromUserId !== creatorId && request.toUserId !== creatorId)) {
    throw new AppError('Swap request not found.', 404);
  }
  if (request.status !== 'accepted') {
    throw new AppError('You can only schedule a session for an accepted swap.', 400);
  }

  // Kon skill, tar upor depend kore kke shekhabe.
  // offeredSkill = sender shekhay. requestedSkill = receiver shekhay.
  let teacherId;
  let learnerId;
  if (skillId === request.offeredSkillId) {
    teacherId = request.fromUserId;
    learnerId = request.toUserId;
  } else if (skillId === request.requestedSkillId) {
    teacherId = request.toUserId;
    learnerId = request.fromUserId;
  } else {
    throw new AppError('This skill is not part of the swap.', 400);
  }

  // Date/time shotti-i bhobishyote kina. (Server-er local time-e tulona kora hoy.)
  const when = new Date(`${date}T${time}`);
  if (Number.isNaN(when.getTime())) throw new AppError('Invalid date or time.', 400);
  if (when <= new Date()) throw new AppError('Please choose a time in the future.', 400);

  if (mode === 'in-person' && !location.trim()) {
    throw new AppError('Please enter a meeting place for an in-person session.', 400);
  }

  const [result] = await pool.query(
    `INSERT INTO sessions
       (request_id, teacher_id, learner_id, skill_id, session_date, session_time, duration_mins, mode, location, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      requestId,
      teacherId,
      learnerId,
      skillId,
      date,
      time,
      durationMins,
      mode,
      mode === 'in-person' ? location : '',
      notes,
    ]
  );

  await notify({
    toUserId: teacherId === creatorId ? learnerId : teacherId,
    byUserId: creatorId,
    text: 'scheduled a session with you.',
    link: '/sessions',
  });

  return getSessionById(result.insertId);
}

// action = 'complete' | 'cancel'. Duijon-er je keu korte pare.
export async function updateSessionStatus(sessionId, userId, action) {
  const session = await getSessionById(sessionId);

  if (!session || (session.teacherId !== userId && session.learnerId !== userId)) {
    throw new AppError('Session not found.', 404);
  }
  if (session.status !== 'scheduled') {
    throw new AppError('Only scheduled sessions can be changed.', 409);
  }

  if (action === 'complete') {
    await pool.query(
      "UPDATE sessions SET status = 'completed', completed_at = UTC_TIMESTAMP() WHERE id = ? AND status = 'scheduled'",
      [sessionId]
    );
  } else if (action === 'cancel') {
    await pool.query(
      "UPDATE sessions SET status = 'cancelled' WHERE id = ? AND status = 'scheduled'",
      [sessionId]
    );
  } else {
    throw new AppError('Unknown action.', 400);
  }

  await notify({
    toUserId: session.teacherId === userId ? session.learnerId : session.teacherId,
    byUserId: userId,
    text: action === 'complete' ? 'marked a session as completed.' : 'cancelled a session.',
    link: '/sessions',
  });

  return getSessionById(sessionId);
}