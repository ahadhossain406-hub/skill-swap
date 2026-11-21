import { useEffect, useRef } from 'react';

// Ekta video box. stream dile video chalu hoy.
export default function VideoTile({
  stream,
  label,
  muted = false,
  mirror = false,
  fit = 'cover',
  className = '',
  children,
}) {
  const videoRef = useRef(null);

  // <video> element-e stream dite hole srcObject set korte hoy.
  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = stream ?? null;
  }, [stream]);

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-slate-800 ${className}`}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={muted}
        className={`h-full w-full ${fit === 'contain' ? 'object-contain' : 'object-cover'} ${
          mirror ? '-scale-x-100' : ''
        }`}
      />
      {children}
      {label && (
        <span className="absolute bottom-3 left-3 rounded-md bg-black/60 px-2 py-1 text-xs font-medium text-white">
          {label}
        </span>
      )}
    </div>
  );
}