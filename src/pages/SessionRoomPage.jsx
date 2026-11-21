import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Circle,
  Info,
  Mic,
  MicOff,
  PhoneOff,
  ScreenShare,
  ScreenShareOff,
  Square,
  Video,
  VideoOff,
} from 'lucide-react';
import Avatar from '../components/common/Avatar';
import VideoTile from '../components/sessions/VideoTile';
import useLocalMedia from '../hooks/useLocalMedia';
import useRecorder from '../hooks/useRecorder';
import useUsers from '../hooks/useUsers';
import * as recordingService from '../services/recordingService';
import { useAuth } from '../context/AuthContext';
import { useSessions } from '../context/SessionsContext';
import { useSkills } from '../context/SkillsContext';
import { useToast } from '../context/ToastContext';
import { formatSessionDate, formatTime } from '../utils/dateTime';
import { formatDuration } from '../utils/formatters';

// Nich-er control button (mic, camera, share, record, leave).
function ControlButton({ icon: Icon, label, onClick, variant = 'default', disabled = false }) {
  const styles = {
    default: 'bg-slate-700 hover:bg-slate-600',
    off: 'bg-red-500/90 hover:bg-red-500',
    active: 'bg-brand-600 hover:bg-brand-500',
    danger: 'bg-red-600 hover:bg-red-500',
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
        className={`flex h-12 w-12 items-center justify-center rounded-full text-white transition disabled:cursor-not-allowed disabled:opacity-40 ${styles[variant]}`}
      >
        <Icon className="h-5 w-5" />
      </button>
      <span className="text-xs text-slate-400">{label}</span>
    </div>
  );
}

function RoomMessage({ title, text }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 px-4 text-center text-white">
      <h1 className="text-2xl font-bold">{title}</h1>
      {text && <p className="mt-2 max-w-md text-slate-400">{text}</p>}
      <Link
        to="/sessions"
        className="mt-6 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold hover:bg-brand-500"
      >
        Back to Sessions
      </Link>
    </div>
  );
}

// Asol room. Camera shuru hoy ei component dekhano holei.
function RoomView({ session, partner, me }) {
  const navigate = useNavigate();
  const { completeSession } = useSessions();
  const { getSkillName } = useSkills();
  const { showToast } = useToast();
  const media = useLocalMedia();
  const recorder = useRecorder();
  const [leaving, setLeaving] = useState(false);

  const isTeacher = session.teacherId === me.id;
  const ready = media.status === 'ready';

  const startRecording = () => {
    // Jeta dekhacho (screen ba camera) ar tomar mic, seta record hobe.
    const videoTrack =
      media.screenStream?.getVideoTracks()[0] ?? media.cameraStream?.getVideoTracks()[0];
    const audioTracks = media.cameraStream?.getAudioTracks() ?? [];

    if (!videoTrack) {
      showToast('Nothing to record yet.', 'error');
      return;
    }

    try {
      recorder.start(new MediaStream([videoTrack, ...audioTracks]));
      showToast('Recording started.');
    } catch {
      showToast('Recording is not supported in this browser.', 'error');
    }
  };

  const stopAndSaveRecording = async () => {
    const result = await recorder.stop();
    if (!result) return;

    try {
      await recordingService.saveRecording({
        blob: result.blob,
        session,
        recordedBy: me.id,
        title: `${getSkillName(session.skillId)} · ${formatSessionDate(session.date)}`,
        durationSec: result.durationSec,
      });
      showToast('Recording saved. Find it on the Recordings page.');
    } catch (err) {
      showToast(err.message || 'Could not save the recording.', 'error');
    }
  };

  const toggleRecording = () => (recorder.recording ? stopAndSaveRecording() : startRecording());

  const toggleShare = async () => {
    if (media.sharing) {
      media.stopShare();
      return;
    }
    const message = await media.startShare();
    if (message) showToast(message, 'error');
  };

  const handleLeave = async () => {
    setLeaving(true);
    if (recorder.recording) await stopAndSaveRecording();
    media.stopAll();

    const shouldComplete = window.confirm('Mark this session as completed?');
    navigate('/sessions');

    if (shouldComplete) {
      try {
        await completeSession(session.id);
        showToast('Session marked as completed.');
      } catch (err) {
        showToast(err.message, 'error');
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-900 text-white">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700 px-4 py-3">
        <div>
          <h1 className="font-semibold">{getSkillName(session.skillId)}</h1>
          <p className="text-sm text-slate-400">
            {isTeacher ? 'You are teaching ' : 'You are learning from '}
            {partner.name} · {formatSessionDate(session.date)} · {formatTime(session.time)} ·{' '}
            {session.durationMins} min
          </p>
        </div>
        {recorder.recording && (
          <span className="flex items-center gap-2 rounded-full bg-red-600/20 px-3 py-1 text-sm font-medium text-red-300">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
            REC {formatDuration(recorder.seconds)}
          </span>
        )}
      </header>

      <main className="flex-1 p-4">
        {media.status === 'requesting' && (
          <p className="mt-20 text-center text-slate-300">
            Asking for camera and microphone permission... Click &quot;Allow&quot; in your browser.
          </p>
        )}

        {media.status === 'error' && (
          <div className="mx-auto mt-16 max-w-md rounded-2xl bg-slate-800 p-6 text-center">
            <p className="font-semibold">Could not start your camera</p>
            <p className="mt-2 text-sm text-slate-400">{media.error}</p>
            <button
              type="button"
              onClick={media.start}
              className="mt-4 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold hover:bg-brand-500"
            >
              Try again
            </button>
          </div>
        )}

        {ready && (
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-4 md:grid-cols-2">
              <VideoTile
                className="aspect-video"
                stream={media.sharing ? media.screenStream : media.cameraStream}
                label={media.sharing ? 'You (sharing screen)' : 'You'}
                muted
                mirror={!media.sharing}
                fit={media.sharing ? 'contain' : 'cover'}
              >
                {!media.camOn && !media.sharing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                    <Avatar name={me.name} color={me.avatarColor} size="lg" />
                  </div>
                )}
                {media.sharing && (
                  <div className="absolute right-3 top-3 w-32 sm:w-40">
                    <VideoTile
                      className="aspect-video border border-slate-600"
                      stream={media.cameraStream}
                      muted
                      mirror
                    />
                  </div>
                )}
              </VideoTile>

              <div className="flex aspect-video flex-col items-center justify-center rounded-2xl bg-slate-800 px-4 text-center">
                <Avatar name={partner.name} color={partner.avatarColor} size="lg" />
                <p className="mt-3 font-semibold">{partner.name}</p>
                <p className="mt-1 text-sm text-slate-400">Waiting to join...</p>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200">
              <Info className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                Prototype mode: your camera, microphone, screen sharing and recording work for real.
                The other person&apos;s live video will connect in the final version.
              </p>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-700 px-4 py-4">
        <div className="flex flex-wrap items-start justify-center gap-4">
          <ControlButton
            icon={media.micOn ? Mic : MicOff}
            label={media.micOn ? 'Mute' : 'Unmute'}
            variant={media.micOn ? 'default' : 'off'}
            onClick={media.toggleMic}
            disabled={!ready}
          />
          <ControlButton
            icon={media.camOn ? Video : VideoOff}
            label={media.camOn ? 'Camera off' : 'Camera on'}
            variant={media.camOn ? 'default' : 'off'}
            onClick={media.toggleCam}
            disabled={!ready}
          />
          <ControlButton
            icon={media.sharing ? ScreenShareOff : ScreenShare}
            label={media.sharing ? 'Stop share' : 'Share screen'}
            variant={media.sharing ? 'active' : 'default'}
            onClick={toggleShare}
            disabled={!ready || recorder.recording}
          />
          <ControlButton
            icon={recorder.recording ? Square : Circle}
            label={recorder.recording ? 'Stop & save' : 'Record'}
            variant={recorder.recording ? 'off' : 'default'}
            onClick={toggleRecording}
            disabled={!ready}
          />
          <ControlButton
            icon={PhoneOff}
            label="Leave"
            variant="danger"
            onClick={handleLeave}
            disabled={leaving}
          />
        </div>
        {recorder.recording && (
          <p className="mt-3 text-center text-xs text-slate-500">
            Screen sharing is locked while recording. Stop recording to change it.
          </p>
        )}
      </footer>
    </div>
  );
}

// Guard page: session thik achhe kina dekhe, tarpor RoomView dekhay.
export default function SessionRoomPage() {
  const { sessionId } = useParams();
  const id = Number(sessionId);

  const { user: me } = useAuth();
  const { sessions, loading } = useSessions();
  const { users, loading: usersLoading } = useUsers();

  if (loading || usersLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 text-slate-300">
        Loading...
      </div>
    );
  }

  const session = sessions.find((s) => s.id === id);

  if (!session) {
    return <RoomMessage title="Session not found" text="This session does not exist or is not yours." />;
  }
  if (session.mode !== 'online') {
    return (
      <RoomMessage
        title="This is an in-person session"
        text={`Meet at: ${session.location}. There is no video room for in-person sessions.`}
      />
    );
  }
  if (session.status !== 'scheduled') {
    return (
      <RoomMessage
        title={`This session is ${session.status}`}
        text="You can only join sessions that are still scheduled."
      />
    );
  }

  const partnerId = session.teacherId === me.id ? session.learnerId : session.teacherId;
  const partner = users.find((u) => u.id === partnerId) ?? { name: 'Your partner' };

  return <RoomView session={session} partner={partner} me={me} />;
}