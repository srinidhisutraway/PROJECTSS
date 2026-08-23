import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Home } from 'lucide-react';

const NotFoundPage: React.FC = () => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-dawn-gradient px-6 text-center dark:bg-dawn-gradient-dark">
    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-clay-500 text-white shadow-soft">
      <Sparkles size={24} />
    </span>
    <h1 className="font-display text-6xl font-semibold text-ink dark:text-canvas">404</h1>
    <p className="max-w-sm text-ink/60 dark:text-canvas/60">
      This page wandered off. Let's get you back to somewhere useful.
    </p>
    <Link to="/" className="btn-primary">
      <Home size={16} /> Back to home
    </Link>
  </div>
);

export default NotFoundPage;
