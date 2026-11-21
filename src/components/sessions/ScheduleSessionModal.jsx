import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Video } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import useUsers from '../../hooks/useUsers';
import { useAuth } from '../../context/AuthContext';
import { useRequests } from '../../context/RequestsContext';
import { useSessions } from '../../context/SessionsContext';
import { useSkills } from '../../context/SkillsContext';
import { useToast } from '../../context/ToastContext';
import { DURATION_OPTIONS } from '../../utils/constants';
import { todayString } from '../../utils/dateTime';

const fieldClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500';
const labelClass = 'mb-1 block text-sm font-medium text-slate-700';

const MODES = [
  { value: 'online', label: 'Online', icon: Video },
  { value: 'in-person', label: 'In person', icon: MapPin },
];

// requestId dile oi swap-ta fixed thake. Na dile dropdown theke swap bachte hoy.
export default function ScheduleSessionModal({ requestId = null, onClose }) {
  const { user: me } = useAuth();
  const { requests } = useRequests();
  const { scheduleSession } = useSessions();
  const { users } = useUsers();
  const { getSkillName } = useSkills();
  const { showToast } = useToast();

  const acceptedSwaps = requests.filter((r) => r.status === 'accepted');

  const [swapId, setSwapId] = useState(requestId ?? acceptedSwaps[0]?.id ?? null);
  const [skillChoice, setSkillChoice] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [durationMins, setDurationMins] = useState(60);
  const [mode, setMode] = useState('online');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const swap = acceptedSwaps.find((r) => r.id === swapId);

  // Accepted swap-i nai, tai session banano jabe na.
  if (!swap) {
    return (
      <Modal open onClose={onClose} title="Schedule a session">
        <p className="text-sm text-slate-600">
          You need an accepted swap request before you can schedule a session. Send a request to a
          match, or accept one you received.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Link
            to="/requests"
            onClick={onClose}
            className="inline-flex items-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Go to Requests
          </Link>
        </div>
      </Modal>
    );
  }

  const partnerIdOf = (r) => (r.fromUserId === me.id ? r.toUserId : r.fromUserId);
  const nameOf = (id) => {
    if (id === me.id) return 'you';
    return users.find((u) => u.id === id)?.name ?? 'your partner';
  };

  // Ei swap-e duita skill: dujon-i dujon-ke shekhay.
  const skillOptions = [swap.offeredSkillId, swap.requestedSkillId];
  const skillId = skillOptions.includes(skillChoice) ? skillChoice : swap.offeredSkillId;
  const teacherOfSkill = (id) => (id === swap.offeredSkillId ? swap.fromUserId : swap.toUserId);

  const swapLabel = (r) =>
    `${nameOf(partnerIdOf(r))}: ${getSkillName(r.offeredSkillId)} ↔ ${getSkillName(r.requestedSkillId)}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await scheduleSession({
        requestId: swap.id,
        skillId,
        date,
        time,
        durationMins,
        mode,
        location,
        notes,
      });
      showToast('Session scheduled!');
      onClose();
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <Modal open onClose={onClose} title="Schedule a session">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="swap" className={labelClass}>
            Swap
          </label>
          {requestId ? (
            <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">
              {swapLabel(swap)}
            </p>
          ) : (
            <select
              id="swap"
              value={swapId}
              onChange={(e) => setSwapId(Number(e.target.value))}
              className={fieldClass}
            >
              {acceptedSwaps.map((r) => (
                <option key={r.id} value={r.id}>
                  {swapLabel(r)}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label htmlFor="skill" className={labelClass}>
            What will be taught?
          </label>
          <select
            id="skill"
            value={skillId}
            onChange={(e) => setSkillChoice(Number(e.target.value))}
            className={fieldClass}
          >
            {skillOptions.map((id) => (
              <option key={id} value={id}>
                {getSkillName(id)} (taught by {nameOf(teacherOfSkill(id))})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="date" className={labelClass}>
              Date
            </label>
            <input
              id="date"
              type="date"
              min={todayString()}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="time" className={labelClass}>
              Time
            </label>
            <input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={fieldClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="duration" className={labelClass}>
            Duration
          </label>
          <select
            id="duration"
            value={durationMins}
            onChange={(e) => setDurationMins(Number(e.target.value))}
            className={fieldClass}
          >
            {DURATION_OPTIONS.map((d) => (
              <option key={d} value={d}>
                {d} minutes
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className={labelClass}>Session type</p>
          <div className="grid grid-cols-2 gap-2">
            {MODES.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setMode(value)}
                className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                  mode === value
                    ? 'border-brand-600 bg-brand-50 text-brand-700'
                    : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {mode === 'in-person' && (
          <div>
            <label htmlFor="location" className={labelClass}>
              Meeting place
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. University Library"
              className={fieldClass}
            />
          </div>
        )}

        <div>
          <label htmlFor="notes" className={labelClass}>
            Notes (optional)
          </label>
          <textarea
            id="notes"
            rows={2}
            maxLength={200}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What will you cover? What should your partner bring?"
            className={fieldClass}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            Schedule
          </Button>
        </div>
      </form>
    </Modal>
  );
}