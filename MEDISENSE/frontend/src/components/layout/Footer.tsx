import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Github, Twitter, Mail } from 'lucide-react';

const Footer: React.FC = () => (
  <footer className="border-t border-ink/10 bg-canvas dark:bg-canvas-dark dark:border-white/10">
    <div className="mx-auto max-w-7xl px-6 py-14">
      <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
        <div className="col-span-2">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-clay-500 text-white">
              <Sparkles size={18} />
            </span>
            <span className="font-display text-lg font-semibold">MediSense</span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-ink/60 dark:text-canvas/60">
            Your AI-powered Skin Health Companion — preliminary insight today, professional care when it matters.
          </p>
          <div className="mt-5 flex gap-3">
            <a href="#" aria-label="Twitter" className="flex h-9 w-9 items-center justify-center rounded-full bg-ink/5 dark:bg-white/5 hover:bg-ink/10"><Twitter size={16} /></a>
            <a href="#" aria-label="GitHub" className="flex h-9 w-9 items-center justify-center rounded-full bg-ink/5 dark:bg-white/5 hover:bg-ink/10"><Github size={16} /></a>
            <a href="#contact" aria-label="Email" className="flex h-9 w-9 items-center justify-center rounded-full bg-ink/5 dark:bg-white/5 hover:bg-ink/10"><Mail size={16} /></a>
          </div>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold">Product</h4>
          <ul className="mt-4 space-y-3 text-sm text-ink/60 dark:text-canvas/60">
            <li><a href="#features">Features</a></li>
            <li><a href="#how-it-works">How it works</a></li>
            <li><Link to="/signup">Get started</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold">Company</h4>
          <ul className="mt-4 space-y-3 text-sm text-ink/60 dark:text-canvas/60">
            <li><a href="#faq">FAQ</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold">Legal</h4>
          <ul className="mt-4 space-y-3 text-sm text-ink/60 dark:text-canvas/60">
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
          </ul>
        </div>
      </div>

      <div className="mt-12 rounded-xl2 border border-clay-300/30 bg-clay-50/60 p-4 text-xs text-ink/70 dark:bg-clay-500/10 dark:text-canvas/70">
        MediSense provides AI-assisted, preliminary information for educational purposes only. It is not a
        substitute for professional medical diagnosis or treatment. Always consult a licensed dermatologist or
        physician for medical concerns, especially urgent or severe symptoms.
      </div>

      <p className="mt-8 text-center text-xs text-ink/40 dark:text-canvas/40">
        © {new Date().getFullYear()} MediSense. Built as a final year project.
      </p>
    </div>
  </footer>
);

export default Footer;
