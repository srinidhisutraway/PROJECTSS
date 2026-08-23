import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera } from 'lucide-react';
import UploadAnalysisModal from './UploadAnalysisModal';

const FloatingCameraButton: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        className="fixed bottom-8 left-1/2 z-40 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full bg-clay-500 text-white shadow-softLg lg:left-[calc(50%+8rem)]"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        animate={{ y: [0, -6, 0] }}
        transition={{ y: { duration: 3, repeat: Infinity, ease: 'easeInOut' } }}
        aria-label="Start a new skin analysis"
      >
        <Camera size={26} />
      </motion.button>

      <AnimatePresence>
        {open && <UploadAnalysisModal onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
};

export default FloatingCameraButton;
