import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import * as notificationService from '../services/notificationService';
import { useAuth } from './AuthContext';

const NotificationsContext = createContext(null);

export function NotificationsProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id;
  const [notifications, setNotifications] = useState([]);

  const refresh = useCallback(async () => {
    const next = userId ? await notificationService.getNotificationsForUser(userId) : [];
    // Kichu bodlay ni hole state change korbo na (faltu re-render ar-i).
    setNotifications((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
  }, [userId]);

  // Login-er por load kori, tarpor proti 4 second-e notun notification check kori.
  useEffect(() => {
    refresh();
    if (!userId) return;
    const id = setInterval(refresh, 4000);
    return () => clearInterval(id);
  }, [userId, refresh]);

  const markRead = async (notificationId) => {
    await notificationService.markNotificationRead(notificationId, userId);
    await refresh();
  };

  const markAllRead = async () => {
    await notificationService.markAllNotificationsRead(userId);
    await refresh();
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationsContext.Provider
      value={{ notifications, unreadCount, refresh, markRead, markAllRead }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) throw new Error('useNotifications must be used inside <NotificationsProvider>');
  return context;
}