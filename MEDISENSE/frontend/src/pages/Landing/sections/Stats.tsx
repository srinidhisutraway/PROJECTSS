import React from 'react';
import { motion } from 'framer-motion';

const STATS = [
  { value: '5', label: 'Skin conditions screened, and growing' },
  { value: '<3s', label: 'Average AI analysis time' },
  { value: '100%', label: 'Private — your images stay yours' },
  { value: '24/7', label: 'AI skincare assistant availability' },
];

const Stats: React.FC = () => (
  <section className="border-y border-ink/5 bg-white/60 py-14 dark:border-white/5 dark:bg-white/[0.02]">
    <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 md:grid-cols-4">
      {STATS.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="text-center"
        >
          <p className="font-display text-4xl font-semibold text-clay-600 dark:text-clay-300">{stat.value}</p>
          <p className="mt-2 text-sm text-ink/60 dark:text-canvas/60">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  </section>
);

export default Stats;
