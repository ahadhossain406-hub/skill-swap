import * as notificationService from '../services/notificationService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { parseId } from '../utils/parseId.js';

// Protita action-er por notun list ar unread count pathai,
// jate frontend ekbar-i shob update kore nite pare.
async function sendList(res, userId) {
  const notifications = await notificationService.getNotificationsForUser(userId);
  res.json({ notifications, unreadCount: notifications.filter((n) => !n.read).length });
}

export const listNotifications = asyncHandler(async (req, res) => {
  await sendList(res, req.user.id);
});

export const markRead = asyncHandler(async (req, res) => {
  await notificationService.markAsRead(parseId(req.params.id, 'Notification'), req.user.id);
  await sendList(res, req.user.id);
});

export const markAllRead = asyncHandler(async (req, res) => {
  await notificationService.markAllAsRead(req.user.id);
  await sendList(res, req.user.id);
});