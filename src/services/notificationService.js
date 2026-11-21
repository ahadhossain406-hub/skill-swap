import { getItem, setItem } from './storage';
import { STORAGE_KEYS } from '../utils/constants';
import { mockNotifications } from '../data/notifications';

function loadAll() {
  const stored = getItem(STORAGE_KEYS.NOTIFICATIONS, null);
  if (stored) return stored;
  setItem(STORAGE_KEYS.NOTIFICATIONS, mockNotifications);
  return mockNotifications;
}

function saveAll(list) {
  setItem(STORAGE_KEYS.NOTIFICATIONS, list);
}

export async function getNotificationsForUser(userId) {
  return loadAll()
    .filter((n) => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

// Onno service (request, session, review) ei function diye notification pathay.
export async function addNotification({ userId, message, link = '' }) {
  const notification = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    userId,
    message,
    link,
    read: false,
    createdAt: new Date().toISOString(),
  };
  saveAll([...loadAll(), notification]);
  return notification;
}

export async function markNotificationRead(notificationId, userId) {
  saveAll(
    loadAll().map((n) => (n.id === notificationId && n.userId === userId ? { ...n, read: true } : n))
  );
}

export async function markAllNotificationsRead(userId) {
  saveAll(loadAll().map((n) => (n.userId === userId ? { ...n, read: true } : n)));
}