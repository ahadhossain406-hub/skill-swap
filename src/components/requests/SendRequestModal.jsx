import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftRight } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { useRequests } from '../../context/RequestsContext';
import { useSkills } from '../../context/SkillsContext';
import { useToast } from '../../context/ToastContext';
import { getMatchInfo } from '../../utils/matchingAlgorithm';

const MESSAGE_LIMIT = 300;
const selectClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500';

export default function SendRequestModal({ targetUser, onClose }) {
  const { user: me } = useAuth();
  const { sendRequest } = useRequests();
  const { getSkillName } = useSkills();
  const { showToast } = useToast();

  // Match thakle shei skill gulo age theke select kora thakbe.
  const match = getMatchInfo(me, targetUser);
  const [offered, setOffered] = useState(match.iCanTeachThem[0] ?? me.teaches[0]?.skillId ?? null);
  const [requested, setRequested] = useState(
    match.theyCanTeachMe[0] ?? targetUser.teaches[0]?.skillId ?? null
  );
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  const firstName = targetUser.name.split(' ')[0];

  // Duijon-er kono ekjon-er shekhanor skill na thakle request pathano jay na.
  if (me.teaches.length === 0 || targetUser.teaches.length === 0) {
    return (
      <Modal open onClose={onClose} title="Send swap request">
        <p className="text-sm text-slate-600">
          {me.teaches.length === 0
            ? 'You need to add at least one skill you can teach before sending a request.'
            : `${targetUser.name} has not added any skill to teach yet, so you cannot send a request.`}
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {me.teaches.length === 0 && (
            <Link
              to="/profile"
              className="inline-flex items-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Go to My Profile
            </Link>
          )}
        </div>
      </Modal>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (message.length > MESSAGE_LIMIT) {
      setError(`Message must be ${MESSAGE_LIMIT} characters or less.`);
      return;
    }

    setSending(true);
    setError('');
    try {
      await sendRequest({
        toUserId: targetUser.id,
        offeredSkillId: offered,
        requestedSkillId: requested,
        message,
      });
      showToast(`Request sent to ${firstName}!`);
      onClose();
    } catch (err) {
      setError(err.message);
      setSending(false);
    }
  };

  return (
    <Modal open onClose={onClose} title={`Send swap request to ${firstName}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="offered" className="mb-1 block text-sm font-medium text-slate-700">
            I will teach {firstName}
          </label>
          <select
            id="offered"
            value={offered}
            onChange={(e) => setOffered(Number(e.target.value))}
            className={selectClass}
          >
            {me.teaches.map((t) => (
              <option key={t.skillId} value={t.skillId}>
                {getSkillName(t.skillId)} ({t.level})
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-center text-brand-600">
          <ArrowLeftRight className="h-5 w-5 rotate-90" />
        </div>

        <div>
          <label htmlFor="requested" className="mb-1 block text-sm font-medium text-slate-700">
            I want to learn from {firstName}
          </label>
          <select
            id="requested"
            value={requested}
            onChange={(e) => setRequested(Number(e.target.value))}
            className={selectClass}
          >
            {targetUser.teaches.map((t) => (
              <option key={t.skillId} value={t.skillId}>
                {getSkillName(t.skillId)} ({t.level})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="message" className="mb-1 block text-sm font-medium text-slate-700">
            Message (optional)
          </label>
          <textarea
            id="message"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Hi ${firstName}, I would love to swap skills with you...`}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500"
          />
          <p className="mt-1 text-right text-xs text-slate-400">
            {message.length}/{MESSAGE_LIMIT}
          </p>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={sending}>
            Send request
          </Button>
        </div>
      </form>
    </Modal>
  );
}