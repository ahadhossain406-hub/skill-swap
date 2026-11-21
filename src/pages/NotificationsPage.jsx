import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck } from 'lucide-react';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import { useNotifications } from '../context/NotificationsContext';

function formatDateTime(isoString) {
  return new Date(isoString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { notifications, unreadCount, refresh, markRead, markAllRead } = useNotifications();

  // Page khulle ekbar notun data ane.
  useEffect(() => {
    refresh();
  }, [refresh]);

  const openNotification = async (notification) => {
    if (!notification.read) await markRead(notification.id);
    if (notification.link) navigate(notification.link);
  };

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          <p className="mt-1 text-slate-600">
            {unreadCount > 0 ? `You have ${unreadCount} unread.` : 'You are all caught up.'}
          </p>
        </div>
        <Button variant="outline" onClick={markAllRead} disabled={unreadCount === 0}>
          <CheckCheck className="h-4 w-4" />
          Mark all as read
        </Button>
      </div>

      <div className="mt-6">
        {notifications.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No notifications"
            text="Requests, sessions and reviews will show up here."
          />
        ) : (
          <ul className="space-y-2">
            {notifications.map((n) => (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => openNotification(n)}
                  className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition hover:shadow-sm ${
                    n.read ? 'border-slate-200 bg-white' : 'border-brand-100 bg-brand-50'
                  }`}
                >
                  <span
                    className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                      n.read ? 'bg-transparent' : 'bg-brand-600'
                    }`}
                  />
                  <span className="min-w-0 flex-1">
                    <span className={`block text-sm ${n.read ? 'text-slate-600' : 'font-semibold text-slate-900'}`}>
                      {n.message}
                    </span>
                    <span className="mt-0.5 block text-xs text-slate-400">{formatDateTime(n.createdAt)}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}