import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Film, Info } from 'lucide-react';
import RecordingCard from '../components/sessions/RecordingCard';
import EmptyState from '../components/common/EmptyState';
import useUsers from '../hooks/useUsers';
import * as recordingService from '../services/recordingService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatFileSize } from '../utils/formatters';

export default function RecordingsPage() {
  const { user: me } = useAuth();
  const { users } = useUsers();
  const { showToast } = useToast();

  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    recordingService
      .getRecordingsForUser(me.id)
      .then(setRecordings)
      .finally(() => setLoading(false));
  }, [me.id]);

  const handleDelete = async (recordingId) => {
    try {
      await recordingService.deleteRecording(recordingId, me.id);
      setRecordings((prev) => prev.filter((r) => r.id !== recordingId));
      showToast('Recording deleted.');
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const partnerOf = (recording) => {
    const partnerId = recording.teacherId === me.id ? recording.learnerId : recording.teacherId;
    return users.find((u) => u.id === partnerId);
  };

  const totalSize = recordings.reduce((sum, r) => sum + r.sizeBytes, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Recordings</h1>
      <p className="mt-1 text-slate-600">
        Recorded sessions you can watch again.
        {recordings.length > 0 && ` ${recordings.length} saved · ${formatFileSize(totalSize)}`}
      </p>

      <div className="mt-4 flex gap-3 rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-800">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          For now, recordings are saved in this browser on your computer. In the final version they
          will be uploaded to the server so both people can watch them from anywhere.
        </p>
      </div>

      <div className="mt-6 space-y-4">
        {loading ? (
          <p className="text-slate-500">Loading...</p>
        ) : recordings.length === 0 ? (
          <EmptyState
            icon={Film}
            title="No recordings yet"
            text="Join an online session room and press Record to save your first recording."
          >
            <Link
              to="/sessions"
              className="inline-flex rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Go to Sessions
            </Link>
          </EmptyState>
        ) : (
          recordings.map((recording) => (
            <RecordingCard
              key={recording.id}
              recording={recording}
              partner={partnerOf(recording)}
              myId={me.id}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}