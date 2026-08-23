import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Aditi R.',
    role: 'College student',
    quote: 'The routine suggestions after my analysis were genuinely useful, and I liked that it kept telling me to see a dermatologist for anything serious instead of pretending to know everything.',
  },
  {
    name: 'Marcus T.',
    role: 'Software engineer',
    quote: 'I use the hydration tracker weekly. Seeing the trend over a month helped me realize my new moisturizer was actually working.',
  },
  {
    name: 'Priya K.',
    role: 'Nurse',
    quote: 'As someone in healthcare, I appreciated how clearly it labels this as preliminary and educational rather than diagnostic.',
  },
];

const Testimonials: React.FC = () => (
  <section id="testimonials" className="mx-auto max-w-6xl px-6 py-24">
    <div className="mx-auto max-w-2xl text-center">
      <h2 className="font-display text-4xl font-semibold text-ink dark:text-canvas">What early users say</h2>
      <p className="mt-4 text-ink/60 dark:text-canvas/60">Sample feedback from our pilot testing group.</p>
    </div>

    <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
      {TESTIMONIALS.map((t, i) => (
        <motion.div
          key={t.name}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="glass-card p-6"
        >
          <Quote size={22} className="text-clay-400" />
          <p className="mt-4 text-sm text-ink/70 dark:text-canvas/70">"{t.quote}"</p>
          <div className="mt-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 font-display text-sm font-semibold text-teal-700 dark:bg-teal-500/20 dark:text-teal-300">
              {t.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold text-ink dark:text-canvas">{t.name}</p>
              <p className="text-xs text-ink/50 dark:text-canvas/50">{t.role}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);

export default Testimonials;
