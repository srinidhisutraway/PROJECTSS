import React from 'react';
import { motion } from 'framer-motion';

const STEPS = [
  { n: '01', title: 'Capture or upload', description: 'Take a photo or upload an existing image of the area of concern.' },
  { n: '02', title: 'AI analyzes', description: 'Our CNN model screens the image and estimates confidence per possible condition.' },
  { n: '03', title: 'Get guidance', description: 'Receive severity estimate, causes, routine suggestions, and dos/don\'ts.' },
  { n: '04', title: 'Take action', description: 'Chat with the AI assistant, track it in your history, or find a nearby dermatologist.' },
];

const HowItWorks: React.FC = () => (
  <section id="how-it-works" className="bg-white/60 py-24 dark:bg-white/[0.02]">
    <div className="mx-auto max-w-6xl px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-4xl font-semibold text-ink dark:text-canvas">How MediSense works</h2>
        <p className="mt-4 text-ink/60 dark:text-canvas/60">Four steps from photo to peace of mind.</p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-4">
        {STEPS.map((step, i) => (
          <motion.div
            key={step.n}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12 }}
            className="relative"
          >
            <span className="font-display text-5xl font-semibold text-clay-300/60 dark:text-clay-500/40">{step.n}</span>
            <h3 className="mt-3 font-display text-lg font-semibold text-ink dark:text-canvas">{step.title}</h3>
            <p className="mt-2 text-sm text-ink/60 dark:text-canvas/60">{step.description}</p>
            {i < STEPS.length - 1 && (
              <div className="absolute -right-5 top-6 hidden h-px w-10 bg-ink/10 dark:bg-white/10 md:block" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
