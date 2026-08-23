import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, Upload, Camera as CameraIcon, Loader2, AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAnalyzeImage } from '../../hooks/useSkinAnalysis';
import AnalysisResultCard from './AnalysisResultCard';
import WebcamCaptureModal from './WebcamCaptureModal';

const UploadAnalysisModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [showWebcam, setShowWebcam] = useState(false);
  const { mutate, data, isPending, isSuccess, reset } = useAnalyzeImage();
  const navigate = useNavigate();

  const onDrop = useCallback((accepted: File[]) => {
    const selected = accepted[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const handleWebcamCapture = (captured: File) => {
    setFile(captured);
    setPreview(URL.createObjectURL(captured));
    setShowWebcam(false);
  };

  const handleAnalyze = () => {
    if (!file) return;
    mutate(file, {
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || 'Analysis failed. Is the ML service running?');
      },
    });
  };

  const handleClose = () => {
    reset();
    setFile(null);
    setPreview(null);
    onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 backdrop-blur-sm sm:items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleClose}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        className="glass-card max-h-[90vh] w-full max-w-lg overflow-y-auto p-6 sm:max-w-xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-ink dark:text-canvas">
            {isSuccess ? 'Your analysis' : 'New skin analysis'}
          </h2>
          <button onClick={handleClose} aria-label="Close" className="rounded-full p-1 hover:bg-ink/5 dark:hover:bg-white/10">
            <X size={20} />
          </button>
        </div>

        {!isSuccess && (
          <>
            {preview ? (
              <div className="relative mb-4 overflow-hidden rounded-xl2">
                <img src={preview} alt="Preview" className="max-h-72 w-full object-cover" />
                <button
                  onClick={() => { setFile(null); setPreview(null); }}
                  className="absolute right-2 top-2 rounded-full bg-black/50 p-1.5 text-white"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div
                {...getRootProps()}
                className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl2 border-2 border-dashed p-10 text-center transition-colors ${
                  isDragActive ? 'border-teal-500 bg-teal-50 dark:bg-teal-500/10' : 'border-ink/15 dark:border-white/15'
                }`}
              >
                <input {...getInputProps()} />
                <Upload size={32} className="text-teal-600" />
                <p className="text-sm font-medium text-ink dark:text-canvas">
                  Drag & drop an image, or click to upload
                </p>
                <p className="text-xs text-ink/50 dark:text-canvas/50">JPG, PNG, or WEBP — up to 10MB</p>
              </div>
            )}

            <button type="button" onClick={() => setShowWebcam(true)} className="btn-secondary mt-3 w-full">
              <CameraIcon size={16} /> Take a photo
            </button>

            <div className="mt-4 flex items-start gap-2 rounded-xl bg-clay-50 p-3 text-xs text-clay-700 dark:bg-clay-500/10 dark:text-clay-300">
              <AlertTriangle size={14} className="mt-0.5 shrink-0" />
              This provides preliminary, AI-assisted information only and is not a medical diagnosis.
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!file || isPending}
              className="btn-primary mt-4 w-full"
            >
              {isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Analyzing…
                </>
              ) : (
                'Analyze image'
              )}
            </button>
          </>
        )}

        {isSuccess && data && (
          <div>
            {data.mockMode && (
              <div className="mb-4 rounded-xl bg-lavender-100 p-3 text-xs text-lavender-700 dark:bg-lavender-500/10 dark:text-lavender-300">
                Demo model active — the ML service is running in mock mode until a trained model is added.
              </div>
            )}
            <AnalysisResultCard analysis={data.analysis} />
            <div className="mt-4 flex gap-3">
              <button onClick={handleClose} className="btn-secondary flex-1">Close</button>
              <button
                onClick={() => { handleClose(); navigate(`/analysis/${data.analysis._id}`); }}
                className="btn-primary flex-1"
              >
                View full details
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {showWebcam && <WebcamCaptureModal onCapture={handleWebcamCapture} onClose={() => setShowWebcam(false)} />}
    </motion.div>
  );
};

export default UploadAnalysisModal;
