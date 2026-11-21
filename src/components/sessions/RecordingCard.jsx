import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Play, Trash2, X } from 'lucide-react';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import * as recordingService from '../../services/recordingService';
import { useSkills } from '../../context/SkillsContext';
import { formatDate } from '../../utils/formatDate';
import { formatDuration, formatFileSize } from '../../utils/formatters';

export default function RecordingCard({ recording, partner, myId, onDelete }) {
  const { getSkillName } = useSkills();
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isTeacher = recording.teacherId === myId;
  const canDelete = recording.recordedBy === myId;
  const partnerName = partner?.name ?? 'Unknown user';

  // Video URL banale memory-te thake. Bondho/chere gele muche dei.
  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
  }, [videoUrl]);

  const loadBlob = async () => {
    const blob = await recordingService.getRecordingBlob(recording.id);
    if (!blob) throw new Error('The video file was not found on this device.');
    return blob;
  };

  const handlePlay = async () => {
    setLoading(true);
    setError('');
    try {
      const blob = await loadBlob();
      setVideoUrl(URL.createObjectURL(blob));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setError('');
    try {
      const blob = await loadBlob();
      const url = URL.createObjectURL(blob);
      const extension = recording.mimeType.includes('mp4') ? 'mp4' : 'webm';
      const fileName = `skillswap-${getSkillName(recording.skillId)}-${recording.id}`
        .replace(/\s+/g, '-')
        .toLowerCase();

      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}.${extension}`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Delete this recording? This cannot be undone.')) {
      onDelete(recording.id);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">{recording.title}</h3>

      <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
        <Avatar name={partnerName} color={partner?.avatarColor} size="sm" />
        <span>
          {isTeacher ? 'You taught ' : 'You learned from '}
          {partner ? (
            <Link to={`/users/${partner.id}`} className="font-semibold text-slate-900 hover:text-brand-600">
              {partnerName}
            </Link>
          ) : (
            <span className="font-semibold text-slate-900">{partnerName}</span>
          )}
        </span>
      </div>

      <p className="mt-2 text-xs text-slate-500">
        {formatDate(recording.createdAt)} · {formatDuration(recording.durationSec)} ·{' '}
        {formatFileSize(recording.sizeBytes)}
      </p>

      {videoUrl && (
        <video src={videoUrl} controls autoPlay className="mt-4 w-full rounded-xl bg-black" />
      )}

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <div className="mt-4 flex flex-wrap gap-2">
        {videoUrl ? (
          <Button variant="outline" onClick={() => setVideoUrl(null)}>
            <X className="h-4 w-4" />
            Close player
          </Button>
        ) : (
          <Button loading={loading} onClick={handlePlay}>
            <Play className="h-4 w-4" />
            Play
          </Button>
        )}
        <Button variant="outline" onClick={handleDownload}>
          <Download className="h-4 w-4" />
          Download
        </Button>
        {canDelete && (
          <Button variant="outline" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        )}
      </div>
    </div>
  );
}