import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Camera, RotateCcw } from 'lucide-react';

interface WebcamCaptureModalProps {
  onCapture: (file: File) => void;
  onClose: () => void;
}

/**
 * Opens the device's actual camera via getUserMedia and lets the user snap
 * a still frame to a canvas, which is then converted to a File. This is
 * what makes "take a photo" work on desktop browsers with a webcam — the
 * HTML `capture` attribute on file inputs is mobile-only and does nothing
 * on desktop Chrome/Edge/Firefox.
 */
const WebcamCaptureModal: React.FC<WebcamCaptureModalProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState('');
  const [captured, setCaptured] = useState<string | null>(null);
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);

  useEffect(() => {
    let active = true;
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 960 } } })
      .then((stream) => {
        if (!active) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(() => {
        setError('Could not access your camera. Check browser permissions, or upload a photo instead.');
      });

    return () => {
      active = false;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const handleShoot = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (blob) {
          setCapturedBlob(blob);
          setCaptured(URL.createObjectURL(blob));
        }
      },
      'image/jpeg',
      0.92
    );
  };

  const handleRetake = () => {
    setCaptured(null);
    setCapturedBlob(null);
  };

  const handleUse = () => {
    if (!capturedBlob) return;
    const file = new File([capturedBlob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
    onCapture(file);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="glass-card w-full max-w-md p-4" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-ink dark:text-canvas">Take a photo</h3>
          <button onClick={onClose} aria-label="Close camera"><X size={20} /></button>
        </div>

        {error ? (
          <p className="p-6 text-center text-sm text-clay-600">{error}</p>
        ) : (
          <div className="relative overflow-hidden rounded-xl2 bg-black">
            {!captured && <video ref={videoRef} autoPlay playsInline muted className="w-full -scale-x-100 rounded-xl2" />}
            {captured && <img src={captured} alt="Captured" className="w-full rounded-xl2" />}
          </div>
        )}

        {!error && (
          <div className="mt-4 flex justify-center gap-3">
            {!captured ? (
              <button onClick={handleShoot} className="btn-primary">
                <Camera size={16} /> Capture
              </button>
            ) : (
              <>
                <button onClick={handleRetake} className="btn-secondary">
                  <RotateCcw size={16} /> Retake
                </button>
                <button onClick={handleUse} className="btn-primary">
                  Use this photo
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default WebcamCaptureModal;
