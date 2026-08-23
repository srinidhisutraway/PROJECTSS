import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, ScanFace, MessageCircle, FileText, MapPin,
  Brain, Newspaper, BarChart3, User, Sparkles, ShieldCheck, Stethoscope,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/analysis', label: 'Skin Analysis', icon: ScanFace },
  { to: '/conditions', label: 'Skin Encyclopedia', icon: Stethoscope },
  { to: '/chat', label: 'AI Assistant', icon: MessageCircle },
  { to: '/reports', label: 'Reports', icon: FileText },
  { to: '/clinics', label: 'Nearby Clinics', icon: MapPin },
  { to: '/quiz', label: 'Skin Quiz', icon: Brain },
  { to: '/articles', label: 'Articles', icon: Newspaper },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/profile', label: 'Profile', icon: User },
];

const Sidebar: React.FC = () => {
  const { user } = useAuth();

  return (
    <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 flex-col border-r border-ink/10 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-canvas-dark/70 lg:flex">
      <div className="flex items-center gap-2 px-6 py-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-clay-500 text-white shadow-soft">
          <Sparkles size={18} />
        </span>
        <span className="font-display text-lg font-semibold text-ink dark:text-canvas">MediSense</span>
      </div>

      <nav className="flex-1 space-y-1 px-4">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-clay-500 text-white shadow-soft'
                  : 'text-ink/60 hover:bg-ink/5 dark:text-canvas/60 dark:hover:bg-white/5'
              }`
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}

        {user?.role === 'admin' && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `mt-4 flex items-center gap-3 rounded-xl border border-teal-500/30 px-4 py-2.5 text-sm font-medium transition-colors ${
                isActive ? 'bg-teal-500 text-white' : 'text-teal-700 hover:bg-teal-50 dark:text-teal-300 dark:hover:bg-teal-500/10'
              }`
            }
          >
            <ShieldCheck size={18} />
            Admin Panel
          </NavLink>
        )}
      </nav>

      <div className="border-t border-ink/10 px-6 py-4 text-[11px] text-ink/40 dark:border-white/10 dark:text-canvas/40">
        AI-assisted, not a diagnosis. Always consult a dermatologist for concerning symptoms.
      </div>
    </aside>
  );
};

export default Sidebar;
