import React from 'react';
import { motion } from 'framer-motion';

const FullScreenLoader: React.FC<{ label?: string }> = ({ label = 'Loading MediSense…' }) => (
  <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-canvas dark:bg-canvas-dark">
    <div className="scan-sweep-container h-16 w-16 rounded-2xl bg-dawn-gradient dark:bg-dawn-gradient-dark shadow-soft">
      <div className="scan-sweep-line" />
      <motion.div
        className="flex h-full w-full items-center justify-center font-display text-2xl font-semibold text-teal-700"
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        M
      </motion.div>
    </div>
    <p className="font-body text-sm text-ink/60 dark:text-canvas/60">{label}</p>
  </div>
);

export default FullScreenLoader;
