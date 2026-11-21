import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftRight } from 'lucide-react';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import { useSkills } from '../../context/SkillsContext';
import { formatDate } from '../../utils/formatDate';
import ScheduleSessionButton from '../sessions/ScheduleSessionButton';
const statusStyles = {
  pending: 'bg-amber-100 text-amber-700',
  accepted: 'bg-green-100 text-green-700',
  declined: 'bg-red-100 text-red-700',
  cancelled: 'bg-slate-100 text-slate-600',
};

// direction = 'received' (onno keu amake pathiyeche) ba 'sent' (ami pathiyechi)
export default function RequestCard({
  request,
  otherUser,
  direction,
  onAccept,
  onDecline,
  onCancel,
}) {
  const { getSkillName } = useSkills();
  const [busy, setBusy] = useState(false);

  const isReceived = direction === 'received';
  const isPending = request.status === 'pending';
  const name = otherUser?.name ?? 'Unknown user';

  // Ekta action chalay. Chalanor shomoy button gulo disabled thake.
  const run = async (action, confirmText) => {
    if (confirmText && !window.confirm(confirmText)) return;
    setBusy(true);
    try {
      await action(request.id);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar name={name} color={otherUser?.avatarColor} size="md" />
          <div>
            {otherUser ? (
              <Link
                to={`/users/${otherUser.id}`}
                className="font-semibold text-slate-900 hover:text-brand-600"
              >
                {name}
              </Link>
            ) : (
              <span className="font-semibold text-slate-900">{name}</span>
            )}
            <p className="text-xs text-slate-500">
              {isReceived ? 'Sent you a request' : 'You sent a request'} ·{' '}
              {formatDate(request.createdAt)}
            </p>
          </div>
        </div>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
            statusStyles[request.status]
          }`}
        >
          {request.status}
        </span>
      </div>

      <div className="mt-4 grid items-center gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-[1fr_auto_1fr]">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {isReceived ? 'They will teach you' : 'You will teach them'}
          </p>
          <p className="font-semibold text-brand-700">{getSkillName(request.offeredSkillId)}</p>
        </div>
        <ArrowLeftRight className="hidden h-5 w-5 text-slate-400 sm:block" />
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {isReceived ? 'They want to learn from you' : 'You want to learn'}
          </p>
          <p className="font-semibold text-brand-700">{getSkillName(request.requestedSkillId)}</p>
        </div>
      </div>

      {request.message && (
        <p className="mt-3 text-sm italic text-slate-600">&ldquo;{request.message}&rdquo;</p>
      )}
      {request.status === 'accepted' && (
        <div className="mt-4">
          <ScheduleSessionButton requestId={request.id} />
        </div>
      )}

      {!isPending && request.respondedAt && (
        <p className="mt-3 text-xs text-slate-500">
          {request.status === 'cancelled' ? 'Cancelled' : 'Responded'} on{' '}
          {formatDate(request.respondedAt)}
        </p>
      )}

      {isPending && (
        <div className="mt-4 flex flex-wrap gap-2">
          {isReceived ? (
            <>
              <Button disabled={busy} onClick={() => run(onAccept)}>
                Accept
              </Button>
              <Button
                variant="outline"
                disabled={busy}
                onClick={() => run(onDecline, `Decline the request from ${name}?`)}
              >
                Decline
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              disabled={busy}
              onClick={() => run(onCancel, 'Cancel this request?')}
            >
              Cancel request
            </Button>
          )}
        </div>
      )}
    </div>
  );
}