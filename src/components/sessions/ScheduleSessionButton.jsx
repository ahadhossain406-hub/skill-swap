import { useState } from 'react';
import { CalendarPlus } from 'lucide-react';
import Button from '../common/Button';
import ScheduleSessionModal from './ScheduleSessionModal';

// Button + modal ekshathe. Requests page ar Sessions page, duita jaygay use hobe.
export default function ScheduleSessionButton({ requestId = null, variant = 'primary', className = '' }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant={variant} className={className} onClick={() => setOpen(true)}>
        <CalendarPlus className="h-4 w-4" />
        Schedule session
      </Button>
      {open && <ScheduleSessionModal requestId={requestId} onClose={() => setOpen(false)} />}
    </>
  );
}