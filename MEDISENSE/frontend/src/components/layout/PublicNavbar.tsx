import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sparkles } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'FAQ', href: '#faq' },
];

const PublicNavbar: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/20 bg-white/70 backdrop-blur-xl dark:bg-canvas-dark/70 dark:border-white/10">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-clay-500 text-white shadow-soft">
            <Sparkles size={18} />
          </span>
          <span className="font-display text-xl font-semibold text-ink dark:text-canvas">MediSense</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink/70 transition-colors hover:text-clay-600 dark:text-canvas/70 dark:hover:text-clay-300"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Link to="/login" className="btn-secondary !px-5 !py-2.5">
            Log in
          </Link>
          <Link to="/signup" className="btn-primary !px-5 !py-2.5">
            Get started free
          </Link>
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/20 bg-white/95 px-6 py-4 dark:bg-canvas-dark/95 md:hidden">
          <div className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="text-sm font-medium" onClick={() => setOpen(false)}>
                {link.label}
              </a>
            ))}
            <div className="flex items-center gap-3 pt-2">
              <Link to="/login" className="btn-secondary flex-1 !px-4">Log in</Link>
              <Link to="/signup" className="btn-primary flex-1 !px-4">Get started</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default PublicNavbar;
