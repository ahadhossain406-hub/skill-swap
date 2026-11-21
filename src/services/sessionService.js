import { getItem, setItem } from './storage';
import { getRequestById } from './requestService';
import { STORAGE_KEYS, DURATION_OPTIONS } from '../utils/constants';
import { mockSessions } from '../data/sessions';
import { sessionDateTime } from '../utils/dateTime';

function loadSessions() {
  const stored = getItem(STORAGE_KEYS.SESSIONS, null);
  if (stored) return stored;
  setItem(STORAGE_KEYS.SESSIONS, mockSessions);
  return mockSessions;
}

function saveSessions(list) {
  setItem(STORAGE_KEYS.SESSIONS, list);
}

// Ei user ja-ja session-e shekhay ba shekhe.
export async function getSessionsForUser(userId) {
  return loadSessions().filter((s) => s.teacherId === userId || s.learnerId === userId);
}

export async function createSession({
  creatorId,
  requestId,
  skillId,
  date,
  time,
  durationMins,
  mode,
  location,
  notes,
}) {
  // Shudhu accepted swap-er jonno session banano jay.
  const request = await getRequestById(requestId);
  if (!request || request.status !== 'accepted') {
    throw new Error('You can only schedule a session for an accepted swap.');
  }
  if (request.fromUserId !== creatorId && request.toUserId !== creatorId) {
    throw new Error('You are not part of this swap.');
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
    throw new Error('This skill is not part of the swap.');
  }

  if (!date || !time) throw new Error('Please choose a date and a time.');
  if (sessionDateTime(date, time) <= new Date()) {
    throw new Error('Please choose a time in the future.');
  }
  if (!DURATION_OPTIONS.includes(durationMins)) throw new Error('Invalid duration.');
  if (mode !== 'online' && mode !== 'in-person') throw new Error('Invalid session type.');
  if (mode === 'in-person' && !location.trim()) {
    throw new Error('Please enter a meeting place for an in-person session.');
  }

  const newSession = {
    id: Date.now(),
    requestId,
    teacherId,
    learnerId,
    skillId,
    date,
    time,
    durationMins,
    mode,
    location: mode === 'in-person' ? location.trim() : '',
    notes: notes.trim(),
    status: 'scheduled',
    createdAt: new Date().toISOString(),
    completedAt: null,
  };

  saveSessions([...loadSessions(), newSession]);
  return newSession;
}

// action = 'complete' | 'cancel'. Duijon-er je keu korte pare.
export async function updateSessionStatus(sessionId, userId, action) {
  const all = loadSessions();
  const session = all.find((s) => s.id === sessionId);

  if (!session) throw new Error('Session not found.');
  if (session.teacherId !== userId && session.learnerId !== userId) {
    throw new Error('You are not part of this session.');
  }
  if (session.status !== 'scheduled') {
    throw new Error('Only scheduled sessions can be changed.');
  }

  let updated;
  if (action === 'complete') {
    updated = { ...session, status: 'completed', completedAt: new Date().toISOString() };
  } else if (action === 'cancel') {
    updated = { ...session, status: 'cancelled' };
  } else {
    throw new Error('Unknown action.');
  }

  saveSessions(all.map((s) => (s.id === sessionId ? updated : s)));
  return updated;
}