import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ScanFace, ShieldCheck, HeartPulse } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';

const AuthLayout: React.FC<{ children: React.ReactNode; title: string; subtitle: string }> = ({
  children,
  title,
  subtitle,
}) => {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      {/* Illustration panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-dawn-gradient p-10 dark:bg-dawn-gradient-dark md:flex">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-16 top-10 h-64 w-64 rounded-full bg-lavender-300/30 blur-3xl animate-floatY" />
          <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-teal-300/30 blur-3xl animate-floatY" style={{ animationDelay: '2s' }} />
        </div>

        <Link to="/" className="relative z-10 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-clay-500 text-white shadow-soft">
            <Sparkles size={18} />
          </span>
          <span className="font-display text-xl font-semibold text-ink">MediSense</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 glass-card mx-auto w-full max-w-sm p-8"
        >
          <ScanFace size={48} className="text-teal-600" strokeWidth={1.2} />
          <h3 className="mt-5 font-display text-2xl font-semibold text-ink">See your skin clearly</h3>
          <p className="mt-2 text-sm text-ink/60">
            Preliminary AI insight, hydration tracking, and dermatologist connections — all in one place.
          </p>
          <div className="mt-6 flex items-center gap-2 text-xs text-ink/50">
            <ShieldCheck size={14} /> Private by default. You control your data.
          </div>
        </motion.div>

        <div className="relative z-10 flex items-center gap-2 text-xs text-ink/50">
          <HeartPulse size={14} /> Not a substitute for professional medical advice.
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-col justify-center bg-canvas px-6 py-12 dark:bg-canvas-dark sm:px-12 lg:px-20">
        <div className="mb-8 flex items-center justify-between md:justify-end">
          <Link to="/" className="flex items-center gap-2 md:hidden">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-clay-500 text-white">
              <Sparkles size={16} />
            </span>
            <span className="font-display text-lg font-semibold">MediSense</span>
          </Link>
          <ThemeToggle />
        </div>

        <div className="mx-auto w-full max-w-sm">
          <h1 className="font-display text-3xl font-semibold text-ink dark:text-canvas">{title}</h1>
          <p className="mt-2 text-sm text-ink/60 dark:text-canvas/60">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
