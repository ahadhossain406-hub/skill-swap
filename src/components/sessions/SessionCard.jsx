import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Clock, MapPin, Video } from 'lucide-react';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import SessionReview from '../reviews/SessionReview';
import { useSkills } from '../../context/SkillsContext';
import { formatSessionDate, formatTime, sessionDateTime } from '../../utils/dateTime';

const statusStyles = {
  scheduled: 'bg-brand-50 text-brand-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-slate-100 text-slate-600',
};

export default function SessionCard({ session, partner, myId, onComplete, onCancel }) {
  const { getSkillName } = useSkills();
  const [busy, setBusy] = useState(false);

  const isTeacher = session.teacherId === myId;
  const isScheduled = session.status === 'scheduled';
  const isOverdue = isScheduled && sessionDateTime(session.date, session.time) < new Date();
  const partnerName = partner?.name ?? 'Unknown user';

  const run = async (action, confirmText) => {
    if (confirmText && !window.confirm(confirmText)) return;
    setBusy(true);
    try {
      await action(session.id);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{getSkillName(session.skillId)}</h3>
          <span
            className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              isTeacher ? 'bg-amber-100 text-amber-700' : 'bg-sky-100 text-sky-700'
            }`}
          >
            {isTeacher ? 'You teach' : 'You learn'}
          </span>
        </div>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
            statusStyles[session.status]
          }`}
        >
          {session.status}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <Avatar name={partnerName} color={partner?.avatarColor} size="sm" />
        <p className="text-sm text-slate-600">
          {isTeacher ? 'Learner: ' : 'Teacher: '}
          {partner ? (
            <Link to={`/users/${partner.id}`} className="font-semibold text-slate-900 hover:text-brand-600">
              {partnerName}
            </Link>
          ) : (
            <span className="font-semibold text-slate-900">{partnerName}</span>
          )}
        </p>
      </div>

      <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
        <p className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-slate-400" />
          {formatSessionDate(session.date)}
        </p>
        <p className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-slate-400" />
          {formatTime(session.time)} · {session.durationMins} min
        </p>
        <p className="flex items-center gap-2 sm:col-span-2">
          {session.mode === 'online' ? (
            <>
              <Video className="h-4 w-4 text-slate-400" />
              Online session
            </>
          ) : (
            <>
              <MapPin className="h-4 w-4 text-slate-400" />
              {session.location}
            </>
          )}
        </p>
      </div>

      {session.notes && (
        <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">{session.notes}</p>
      )}

      {isOverdue && (
        <p className="mt-3 text-sm text-amber-600">
          The scheduled time has passed. Mark it as completed or cancel it.
        </p>
      )}

      {isScheduled && (
        <div className="mt-4 flex flex-wrap gap-2">
          {session.mode === 'online' && (
            <Link
              to={`/sessions/${session.id}/room`}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
            >
              <Video className="h-4 w-4" />
              Join room
            </Link>
          )}
          <Button disabled={busy} onClick={() => run(onComplete, 'Mark this session as completed?')}>
            Mark completed
          </Button>
          <Button
            variant="outline"
            disabled={busy}
            onClick={() => run(onCancel, 'Cancel this session?')}
          >
            Cancel session
          </Button>
        </div>
      )}

      <SessionReview session={session} partner={partner} myId={myId} />
    </div>
  );
}