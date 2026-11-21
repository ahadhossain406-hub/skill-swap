import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send } from 'lucide-react';
import Button from '../common/Button';
import SendRequestModal from './SendRequestModal';
import { useRequests } from '../../context/RequestsContext';

// Button + modal ekshathe. Card ar profile page, duita jaygay-i eta use hobe.
export default function SendRequestButton({ targetUser, className = '' }) {
  const { hasPendingWith } = useRequests();
  const [open, setOpen] = useState(false);

  // Already pending request thakle button-er jaygay link dekhabo.
  if (hasPendingWith(targetUser.id)) {
    return (
      <Link
        to="/requests"
        className={`inline-flex items-center justify-center rounded-lg bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-100 ${className}`}
      >
        Request pending
      </Link>
    );
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} className={className}>
        <Send className="h-4 w-4" />
        Send request
      </Button>
      {open && <SendRequestModal targetUser={targetUser} onClose={() => setOpen(false)} />}
    </>
  );
}