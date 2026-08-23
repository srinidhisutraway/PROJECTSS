import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';

const METRICS = [
  { label: 'Hydration', value: 78, color: '#6FADA8' },
  { label: 'Texture', value: 64, color: '#8B85C1' },
  { label: 'Redness', value: 22, color: '#E3A69D' },
];

/** Stylized, abstract "AI face scan" illustration — geometric line art
 * rather than photography, styled to evoke the face-detection / scanning
 * motifs from the reference designs without needing licensed imagery. */
const FaceScanIllustration: React.FC = () => (
  <svg viewBox="0 0 320 380" className="h-full w-full" fill="none">
    <defs>
      <linearGradient id="faceGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#8B85C1" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#1F6F6B" stopOpacity="0.35" />
      </linearGradient>
      <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#B85C6D" />
        <stop offset="100%" stopColor="#8B85C1" />
      </linearGradient>
    </defs>

    {/* Face silhouette */}
    <path
      d="M160 40C110 40 78 82 78 138c0 40 10 66 22 88 10 18 8 30 8 44 0 26 24 46 52 46s52-20 52-46c0-14-2-26 8-44 12-22 22-48 22-88 0-56-32-98-82-98z"
      fill="url(#faceGrad)"
      stroke="#1F6F6B"
      strokeOpacity="0.4"
      strokeWidth="1.5"
    />

    {/* Facial guide lines (abstract, not literal features) */}
    <line x1="110" y1="150" x2="140" y2="150" stroke="#16213A" strokeOpacity="0.35" strokeWidth="2" strokeLinecap="round" />
    <line x1="180" y1="150" x2="210" y2="150" stroke="#16213A" strokeOpacity="0.35" strokeWidth="2" strokeLinecap="round" />
    <path d="M150 175 Q160 195 170 175" stroke="#16213A" strokeOpacity="0.3" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M130 225 Q160 245 190 225" stroke="#16213A" strokeOpacity="0.3" strokeWidth="2" fill="none" strokeLinecap="round" />

    {/* Scanning corner brackets (face-detection UI motif) */}
    {[
      [55, 60, 'M55 80 L55 60 L75 60'],
      [265, 60, 'M245 60 L265 60 L265 80'],
      [55, 320, 'M55 300 L55 320 L75 320'],
      [265, 320, 'M245 320 L265 320 L265 300'],
    ].map(([, , d], i) => (
      <path key={i} d={d as string} stroke="url(#lineGrad)" strokeWidth="3" strokeLinecap="round" fill="none" />
    ))}

    {/* Scan grid lines */}
    <line x1="40" y1="140" x2="280" y2="140" stroke="#6FADA8" strokeOpacity="0.25" strokeWidth="1" strokeDasharray="4 6" />
    <line x1="40" y1="230" x2="280" y2="230" stroke="#6FADA8" strokeOpacity="0.25" strokeWidth="1" strokeDasharray="4 6" />
  </svg>
);

const Hero: React.FC = () => (
  <section className="relative overflow-hidden bg-dawn-gradient pt-32 dark:bg-dawn-gradient-dark">
    <div className="pointer-events-none absolute inset-0 bg-hero-radial opacity-70" />
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-lavender-300/30 blur-3xl animate-floatY" />
      <div className="absolute -right-10 top-52 h-80 w-80 rounded-full bg-teal-300/30 blur-3xl animate-floatY" style={{ animationDelay: '1.5s' }} />
      <div className="absolute left-1/3 bottom-0 h-64 w-64 rounded-full bg-clay-300/30 blur-3xl animate-floatY" style={{ animationDelay: '3s' }} />
    </div>

    <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 pb-28 md:grid-cols-2">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <span className="badge bg-white/70 text-teal-700 shadow-soft dark:bg-white/10 dark:text-teal-300">
          <ShieldCheck size={14} /> AI-assisted, not a diagnosis
        </span>
        <h1 className="mt-6 font-display text-6xl font-semibold leading-[1.02] tracking-tight text-ink dark:text-canvas md:text-7xl">
          Science.
          <br />
          <span className="text-gradient-clay">Skin health.</span>
          <br />
          Clarity.
        </h1>
        <p className="mt-7 max-w-lg text-lg text-ink/70 dark:text-canvas/70">
          Snap a photo, get preliminary AI insight on your skin, understand possible severity, and know exactly
          when it's time to see a dermatologist — all backed by evidence-based guidance.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-4">
          <Link to="/signup" className="btn-primary">
            Start your free analysis <ArrowRight size={16} />
          </Link>
          <a href="#how-it-works" className="btn-secondary">
            See how it works
          </a>
        </div>
        <p className="mt-6 text-xs text-ink/50 dark:text-canvas/50">
          Not a substitute for professional medical diagnosis. Always consult a dermatologist for concerning symptoms.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.15 }}
        className="relative mx-auto w-full max-w-sm"
      >
        {/* Main illustrated panel */}
        <div className="float-panel relative aspect-[4/5] w-full overflow-hidden p-6">
          <div className="scan-sweep-container absolute inset-0">
            <div className="scan-sweep-line" />
          </div>
          <FaceScanIllustration />
        </div>

        {/* Floating "Analysis Overview" metric card — modeled directly on
            the hydration/texture/sensitivity meter pattern, tying the
            marketing visual to the app's real feature. */}
        <motion.div
          className="float-panel-dark absolute -bottom-10 -left-8 w-64 p-5"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-canvas/60">Analysis Overview</p>
          <div className="space-y-3">
            {METRICS.map((m) => (
              <div key={m.label}>
                <div className="mb-1 flex items-center justify-between text-[11px] text-canvas/70">
                  <span>{m.label}</span>
                  <span className="font-mono">{m.value}%</span>
                </div>
                <div className="metric-bar-track">
                  <div
                    className="metric-bar-fill"
                    style={{ backgroundColor: m.color, ['--bar-width' as string]: `${m.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Floating confidence badge */}
        <motion.div
          className="glass-card absolute -top-5 -right-5 flex items-center gap-2 px-4 py-3"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
        >
          <span className="badge-mild badge">Mild</span>
          <span className="font-mono text-xs text-ink/60 dark:text-canvas/60">92% confidence</span>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

export default Hero;
