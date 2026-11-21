import { useEffect, useRef, useState } from 'react';

// Browser jei format support kore seta bechhe nei (Chrome: webm, Safari: mp4).
function pickMimeType() {
  if (typeof MediaRecorder === 'undefined') return '';
  const types = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm', 'video/mp4'];
  return types.find((t) => MediaRecorder.isTypeSupported(t)) ?? '';
}

// MediaRecorder: stream theke chhoto chhoto tukro (chunk) joma kore.
// Stop korle shob tukro jure ekta Blob (video file) banay.
export default function useRecorder() {
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const startTimeRef = useRef(0);

  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);

  // Recording cholar shomoy timer.
  useEffect(() => {
    if (!recording) return;
    const id = setInterval(() => {
      setSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 500);
    return () => clearInterval(id);
  }, [recording]);

  // Page chere gele recorder bondho kore dei.
  useEffect(() => {
    return () => {
      const recorder = recorderRef.current;
      if (recorder && recorder.state !== 'inactive') recorder.stop();
    };
  }, []);

  const start = (stream) => {
    const mimeType = pickMimeType();
    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);

    chunksRef.current = [];
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunksRef.current.push(event.data);
    };

    recorder.start(1000); // protita 1 second-e ekta tukro
    recorderRef.current = recorder;
    startTimeRef.current = Date.now();
    setSeconds(0);
    setRecording(true);
  };

  // Promise return kore: { blob, durationSec, mimeType } ba null.
  const stop = () =>
    new Promise((resolve) => {
      const recorder = recorderRef.current;
      if (!recorder || recorder.state === 'inactive') {
        resolve(null);
        return;
      }

      recorder.onstop = () => {
        const mimeType = recorder.mimeType || 'video/webm';
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const durationSec = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));

        chunksRef.current = [];
        recorderRef.current = null;
        setRecording(false);
        resolve({ blob, durationSec, mimeType });
      };
      recorder.stop();
    });

  return { recording, seconds, start, stop };
}