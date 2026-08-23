import React from 'react';
import { motion } from 'framer-motion';
import { ScanFace, Droplets, MessageCircle, MapPin, FileText, BrainCircuit } from 'lucide-react';

const FEATURES = [
  {
    icon: ScanFace,
    title: 'AI Skin Analysis',
    description: 'Upload or snap a photo and get a confidence-scored preliminary read on possible skin conditions.',
    color: 'text-clay-600 bg-clay-50 dark:bg-clay-500/15 dark:text-clay-300',
  },
  {
    icon: Droplets,
    title: 'Hydration & Texture Insight',
    description: 'Understand your hydration level, oiliness, redness, and texture — with tailored routine suggestions.',
    color: 'text-teal-600 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300',
  },
  {
    icon: MessageCircle,
    title: 'AI Skincare Assistant',
    description: 'Ask questions about symptoms, routines, and prevention — always pointed toward professional care when needed.',
    color: 'text-lavender-700 bg-lavender-100 dark:bg-lavender-500/15 dark:text-lavender-300',
  },
  {
    icon: MapPin,
    title: 'Nearby Dermatologists',
    description: 'Find and navigate to nearby clinics, hospitals, and dermatologists with ratings and hours.',
    color: 'text-clay-600 bg-clay-50 dark:bg-clay-500/15 dark:text-clay-300',
  },
  {
    icon: FileText,
    title: 'Medical Report Vault',
    description: 'Securely store prescriptions and lab reports and revisit them anytime.',
    color: 'text-teal-600 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300',
  },
  {
    icon: BrainCircuit,
    title: 'Skin Health Analytics',
    description: 'Track trends over time — condition frequency, hydration history, and routine consistency.',
    color: 'text-lavender-700 bg-lavender-100 dark:bg-lavender-500/15 dark:text-lavender-300',
  },
];

const Features: React.FC = () => (
  <section id="features" className="mx-auto max-w-7xl px-6 py-24">
    <div className="mx-auto max-w-2xl text-center">
      <span className="badge bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300">Everything in one place</span>
      <h2 className="mt-4 font-display text-4xl font-semibold text-ink dark:text-canvas">
        A complete skin health companion
      </h2>
      <p className="mt-4 text-ink/60 dark:text-canvas/60">
        From your first upload to your next dermatologist visit, MediSense supports every step.
      </p>
    </div>

    <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {FEATURES.map((feature, i) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08 }}
          className="glass-card group p-6 transition-transform hover:-translate-y-1"
        >
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${feature.color}`}>
            <feature.icon size={22} />
          </div>
          <h3 className="mt-5 font-display text-lg font-semibold text-ink dark:text-canvas">{feature.title}</h3>
          <p className="mt-2 text-sm text-ink/60 dark:text-canvas/60">{feature.description}</p>
        </motion.div>
      ))}
    </div>
  </section>
);

export default Features;
