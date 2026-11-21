import { useCallback, useEffect, useRef, useState } from 'react';

function describeError(err) {
  if (err?.name === 'NotAllowedError') {
    return 'Camera or microphone permission was blocked. Allow access in your browser settings and try again.';
  }
  if (err?.name === 'NotFoundError') return 'No camera or microphone was found on this device.';
  if (err?.name === 'NotReadableError') {
    return 'Your camera or microphone is being used by another app.';
  }
  return err?.message || 'Could not access your camera and microphone.';
}

// Camera, mic ar screen share niye kaj kore.
// MediaStream = video/audio-er "nodir moto" data. Tar bhitore track thake
// (ekta video track, ekta audio track). Track-er enabled = false korle mute hoy.
export default function useLocalMedia() {
  const [cameraStream, setCameraStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  const [status, setStatus] = useState('requesting'); // 'requesting' | 'ready' | 'error'
  const [error, setError] = useState('');
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  // useRef: stream gulo eikhane-o rakhi, jate cleanup-e shohoje bondho kora jay.
  const cameraRef = useRef(null);
  const screenRef = useRef(null);
  const mountedRef = useRef(false);

  const start = useCallback(async () => {
    setStatus('requesting');
    setError('');
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('This browser does not support camera access.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

      // Page chere chole gele camera bondho kore dai.
      if (!mountedRef.current) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      // Ager stream thakle bondho kori (camera-r light jeno jole na thake).
      cameraRef.current?.getTracks().forEach((t) => t.stop());
      cameraRef.current = stream;
      setCameraStream(stream);
      setMicOn(true);
      setCamOn(true);
      setStatus('ready');
    } catch (err) {
      if (!mountedRef.current) return;
      setError(describeError(err));
      setStatus('error');
    }
  }, []);

  const stopShare = useCallback(() => {
    screenRef.current?.getTracks().forEach((t) => t.stop());
    screenRef.current = null;
    setScreenStream(null);
  }, []);

  const stopAll = useCallback(() => {
    cameraRef.current?.getTracks().forEach((t) => t.stop());
    cameraRef.current = null;
    stopShare();
    setCameraStream(null);
  }, [stopShare]);

  useEffect(() => {
    mountedRef.current = true;
    start();
    return () => {
      mountedRef.current = false;
      stopAll();
    };
  }, [start, stopAll]);

  const toggleMic = () => {
    const next = !micOn;
    cameraRef.current?.getAudioTracks().forEach((t) => {
      t.enabled = next;
    });
    setMicOn(next);
  };

  const toggleCam = () => {
    const next = !camOn;
    cameraRef.current?.getVideoTracks().forEach((t) => {
      t.enabled = next;
    });
    setCamOn(next);
  };

  // Error message return kore (string), shob thik thakle ba user cancel korle null.
  const startShare = useCallback(async () => {
    try {
      if (!navigator.mediaDevices?.getDisplayMedia) {
        return 'Screen sharing is not supported in this browser.';
      }
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      // Browser-er "Stop sharing" bar chaple-o amader state update hobe.
      stream.getVideoTracks()[0].addEventListener('ended', stopShare);
      screenRef.current = stream;
      setScreenStream(stream);
      return null;
    } catch (err) {
      // User picker-e "Cancel" chaple NotAllowedError ashe. Eta error na.
      if (err?.name === 'NotAllowedError') return null;
      return err?.message || 'Could not start screen sharing.';
    }
  }, [stopShare]);

  return {
    cameraStream,
    screenStream,
    sharing: screenStream !== null,
    status,
    error,
    micOn,
    camOn,
    start,
    toggleMic,
    toggleCam,
    startShare,
    stopShare,
    stopAll,
  };
}