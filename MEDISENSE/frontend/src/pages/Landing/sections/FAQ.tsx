import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'Is MediSense a replacement for seeing a dermatologist?',
    a: 'No. MediSense provides AI-assisted, preliminary, educational information only. It is not a diagnostic medical device and should never replace professional medical evaluation, especially for anything urgent or severe.',
  },
  {
    q: 'How accurate is the AI analysis?',
    a: 'The model reports a confidence percentage for each possible condition rather than a certain answer. Accuracy depends on image quality, lighting, and the conditions the model has been trained on — always treat results as a starting point, not a verdict.',
  },
  {
    q: 'Is my data private?',
    a: 'Yes. Your images and reports are stored securely and tied to your account only. You can delete any analysis, report, or your entire account at any time from your profile settings.',
  },
  {
    q: 'What conditions can it screen for?',
    a: 'The current model screens for a set of common conditions including acne, eczema, psoriasis, and common moles, with a "no significant concern" category. The system is built to support adding more conditions over time.',
  },
  {
    q: 'Can I use this if I don\'t have a dermatologist nearby?',
    a: 'Yes — MediSense includes a clinic finder to help locate nearby dermatologists, hospitals, and clinics, along with an AI assistant for general skincare education in the meantime.',
  },
];

const FAQ: React.FC = () => {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-white/60 py-24 dark:bg-white/[0.02]">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <h2 className="font-display text-4xl font-semibold text-ink dark:text-canvas">Frequently asked questions</h2>
        </div>

        <div className="mt-12 space-y-3">
          {FAQS.map((item, i) => (
            <div key={item.q} className="glass-card overflow-hidden">
              <button
                className="flex w-full items-center justify-between px-6 py-4 text-left"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span className="font-medium text-ink dark:text-canvas">{item.q}</span>
                <ChevronDown
                  size={18}
                  className={`shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`}
                />
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <p className="px-6 pb-5 text-sm text-ink/60 dark:text-canvas/60">{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
