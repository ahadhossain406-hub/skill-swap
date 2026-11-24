import fs from 'node:fs/promises';
import path from 'node:path';
import { pool } from '../config/db.js';
import AppError from '../utils/AppError.js';
import { RECORDINGS_DIR } from '../utils/upload.js';
import { getSessionById } from './sessionService.js';

// Recording-er shathe session-er teacher/learner-o ane, jate kon duijon dekhte pare bujha jay.
const RECORDING_SELECT = `
  SELECT r.*, s.skill_id, s.teacher_id, s.learner_id
  FROM recordings r
  JOIN sessions s ON s.id = r.session_id
`;

function formatRecording(row) {
  return {
    id: row.id,
    sessionId: row.session_id,
    skillId: row.skill_id,
    teacherId: row.teacher_id,
    learnerId: row.learner_id,
    recordedBy: row.recorded_by,
    title: row.title,
    durationSec: row.duration_sec,
    sizeBytes: row.size_bytes,
    mimeType: row.mime_type,
    createdAt: row.created_at,
  };
}

// Recording khuje ber kore. Je session-er duijon-er ekjon na, tar kache "nai" (404).
async function findRecordingRow(recordingId, userId) {
  const [rows] = await pool.query(`${RECORDING_SELECT} WHERE r.id = ?`, [recordingId]);
  const row = rows[0];

  if (!row || (row.teacher_id !== userId && row.learner_id !== userId)) {
    throw new AppError('Recording not found.', 404);
  }
  return row;
}

export async function getRecordingsForUser(userId) {
  const [rows] = await pool.query(
    `${RECORDING_SELECT} WHERE s.teacher_id = ? OR s.learner_id = ? ORDER BY r.created_at DESC, r.id DESC`,
    [userId, userId]
  );
  return rows.map(formatRecording);
}

// file = multer-er req.file (upload hoye geche, disk-e ache).
export async function createRecording(userId, { sessionId, durationSec, title }, file) {
  if (!file) {
    throw new AppError('Please attach a video file in a form field named "video".', 400);
  }
  if (!Number.isInteger(sessionId) || sessionId < 1) {
    throw new AppError('sessionId must be a valid session id.', 400);
  }
  if (!Number.isInteger(durationSec) || durationSec < 1 || durationSec > 14400) {
    throw new AppError('durationSec must be between 1 and 14400.', 400);
  }

  const cleanTitle = (title ?? '').trim();
  if (cleanTitle.length < 1 || cleanTitle.length > 150) {
    throw new AppError('Title must be between 1 and 150 characters.', 400);
  }

  const session = await getSessionById(sessionId);
  if (!session || (session.teacherId !== userId && session.learnerId !== userId)) {
    throw new AppError('Session not found.', 404);
  }
  if (session.status === 'cancelled') {
    throw new AppError('You cannot record a cancelled session.', 400);
  }

  const [result] = await pool.query(
    `INSERT INTO recordings (session_id, recorded_by, title, file_path, duration_sec, size_bytes, mime_type)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [sessionId, userId, cleanTitle, file.filename, durationSec, file.size, file.mimetype]
  );

  return formatRecording(await findRecordingRow(result.insertId, userId));
}

// Video chalanor jonno: file-er nam ar type.
export async function getRecordingFile(recordingId, userId) {
  const row = await findRecordingRow(recordingId, userId);
  return { filename: row.file_path, mimeType: row.mime_type };
}

export async function deleteRecording(recordingId, userId) {
  const row = await findRecordingRow(recordingId, userId);

  if (row.recorded_by !== userId) {
    throw new AppError('Only the person who recorded it can delete it.', 403);
  }

  await pool.query('DELETE FROM recordings WHERE id = ?', [recordingId]);

  // Disk theke file-o muche dei. File age-i na thakle (ENOENT) kono somossha na.
  await fs.unlink(path.join(RECORDINGS_DIR, row.file_path)).catch((error) => {
    if (error.code !== 'ENOENT') throw error;
  });
}