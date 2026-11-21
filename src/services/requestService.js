import { getItem, setItem } from './storage';
import { getUserById } from './userService';
import { STORAGE_KEYS } from '../utils/constants';
import { mockRequests } from '../data/requests';

function loadRequests() {
  const stored = getItem(STORAGE_KEYS.REQUESTS, null);
  if (stored) return stored;
  setItem(STORAGE_KEYS.REQUESTS, mockRequests);
  return mockRequests;
}

function saveRequests(list) {
  setItem(STORAGE_KEYS.REQUESTS, list);
}

// Ei user-er pathano ba paowa shob request, notun ager-e.
export async function getRequestsForUser(userId) {
  return loadRequests()
    .filter((r) => r.fromUserId === userId || r.toUserId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function createRequest({ fromUser, toUserId, offeredSkillId, requestedSkillId, message }) {
  if (fromUser.id === toUserId) {
    throw new Error('You cannot send a request to yourself.');
  }

  const toUser = await getUserById(toUserId);
  if (!toUser) throw new Error('This user does not exist.');

  if (!fromUser.teaches.some((t) => t.skillId === offeredSkillId)) {
    throw new Error('You can only offer a skill that is on your profile.');
  }
  if (!toUser.teaches.some((t) => t.skillId === requestedSkillId)) {
    throw new Error('This user does not teach that skill.');
  }

  const all = loadRequests();

  // Duijon-er moddhe ekta pending request thakle notun ekta pathano jabe na.
  const alreadyPending = all.some(
    (r) =>
      r.status === 'pending' &&
      ((r.fromUserId === fromUser.id && r.toUserId === toUserId) ||
        (r.fromUserId === toUserId && r.toUserId === fromUser.id))
  );
  if (alreadyPending) {
    throw new Error('There is already a pending request between you two.');
  }

  const newRequest = {
    id: Date.now(),
    fromUserId: fromUser.id,
    toUserId,
    offeredSkillId,
    requestedSkillId,
    message: message.trim(),
    status: 'pending',
    createdAt: new Date().toISOString(),
    respondedAt: null,
  };

  saveRequests([...all, newRequest]);
  return newRequest;
}

// action = 'accept' | 'decline' | 'cancel'
export async function updateRequestStatus(requestId, userId, action) {
  const all = loadRequests();
  const request = all.find((r) => r.id === requestId);

  if (!request) throw new Error('Request not found.');
  if (request.status !== 'pending') throw new Error('This request is no longer pending.');

  // Kon action ke korte pare, ar kon status hobe.
  const rules = {
    accept: { allowedUserId: request.toUserId, newStatus: 'accepted' },
    decline: { allowedUserId: request.toUserId, newStatus: 'declined' },
    cancel: { allowedUserId: request.fromUserId, newStatus: 'cancelled' },
  };

  const rule = rules[action];
  if (!rule) throw new Error('Unknown action.');
  if (rule.allowedUserId !== userId) throw new Error('You are not allowed to do this.');

  const updated = { ...request, status: rule.newStatus, respondedAt: new Date().toISOString() };
  saveRequests(all.map((r) => (r.id === requestId ? updated : r)));
  return updated;
}