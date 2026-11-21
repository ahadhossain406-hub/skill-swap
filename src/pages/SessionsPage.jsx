import { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import SessionCard from '../components/sessions/SessionCard';
import ScheduleSessionButton from '../components/sessions/ScheduleSessionButton';
import EmptyState from '../components/common/EmptyState';
import useUsers from '../hooks/useUsers';
import { useAuth } from '../context/AuthContext';
import { useSessions } from '../context/SessionsContext';
import { useToast } from '../context/ToastContext';
import { sessionDateTime } from '../utils/dateTime';

const TABS = [
  { key: 'scheduled', label: 'Upcoming' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

const EMPTY_TEXT = {
  scheduled: 'No upcoming sessions. Schedule one with a partner whose swap you have accepted.',
  completed: 'Sessions you finish will show up here.',
  cancelled: 'Cancelled sessions will show up here.',
};

export default function SessionsPage() {
  const { user: me } = useAuth();
  const { sessions, loading, completeSession, cancelSession } = useSessions();
  const { users } = useUsers();
  const { showToast } = useToast();

  const [tab, setTab] = useState('scheduled');

  const byStatus = (status) => sessions.filter((s) => s.status === status);
  const time = (s) => sessionDateTime(s.date, s.time).getTime();

  // Upcoming: shobcheye kachher ta age. Baki duita: shobcheye notun ta age.
  const lists = {
    scheduled: byStatus('scheduled').sort((a, b) => time(a) - time(b)),
    completed: byStatus('completed').sort((a, b) => time(b) - time(a)),
    cancelled: byStatus('cancelled').sort((a, b) => time(b) - time(a)),
  };

  const handleAction = async (action, id, successMessage) => {
    try {
      await action(id);
      showToast(successMessage);
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const partnerOf = (session) => {
    const partnerId = session.teacherId === me.id ? session.learnerId : session.teacherId;
    return users.find((u) => u.id === partnerId);
  };

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Sessions</h1>
          <p className="mt-1 text-slate-600">Your learning and teaching sessions.</p>
        </div>
        <ScheduleSessionButton />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              tab === key ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            {label} ({lists[key].length})
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {loading ? (
          <p className="text-slate-500">Loading...</p>
        ) : lists[tab].length === 0 ? (
          <EmptyState icon={CalendarDays} title="Nothing here yet" text={EMPTY_TEXT[tab]} />
        ) : (
          lists[tab].map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              partner={partnerOf(session)}
              myId={me.id}
              onComplete={(id) => handleAction(completeSession, id, 'Session marked as completed.')}
              onCancel={(id) => handleAction(cancelSession, id, 'Session cancelled.')}
            />
          ))
        )}
      </div>
    </div>
  );
}