import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ScanFace, MessageCircle, FileText, MapPin, Brain, Newspaper, ArrowRight, Lightbulb } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { useProfileSummary } from '../../hooks/useUser';
import SeverityBadge from '../../components/analysis/SeverityBadge';

const DAILY_TIPS = [
  "Apply sunscreen 15-20 minutes before sun exposure for full protection.",
  "Change your pillowcase weekly to reduce bacteria buildup against your skin.",
  "Layer skincare from thinnest to thickest consistency for best absorption.",
  "Drinking enough water supports your skin's barrier function over time.",
  "Patch-test new products on your inner arm before applying to your face.",
];

const QUICK_ACTIONS = [
  { to: '/analysis', label: 'View Analysis History', icon: ScanFace, color: 'bg-clay-50 text-clay-600 dark:bg-clay-500/15 dark:text-clay-300' },
  { to: '/chat', label: 'Ask AI Assistant', icon: MessageCircle, color: 'bg-lavender-100 text-lavender-700 dark:bg-lavender-500/15 dark:text-lavender-300' },
  { to: '/reports', label: 'Upload a Report', icon: FileText, color: 'bg-teal-50 text-teal-600 dark:bg-teal-500/15 dark:text-teal-300' },
  { to: '/clinics', label: 'Find Nearby Clinics', icon: MapPin, color: 'bg-clay-50 text-clay-600 dark:bg-clay-500/15 dark:text-clay-300' },
  { to: '/quiz', label: 'Take Skin Quiz', icon: Brain, color: 'bg-teal-50 text-teal-600 dark:bg-teal-500/15 dark:text-teal-300' },
  { to: '/articles', label: 'Read Articles', icon: Newspaper, color: 'bg-lavender-100 text-lavender-700 dark:bg-lavender-500/15 dark:text-lavender-300' },
];

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { data: summary, isLoading } = useProfileSummary();
  const tipOfDay = DAILY_TIPS[new Date().getDate() % DAILY_TIPS.length];

  return (
    <DashboardLayout title="Dashboard">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-display text-2xl font-semibold text-ink dark:text-canvas">
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h2>
        <p className="mt-1 text-sm text-ink/60 dark:text-canvas/60">Here's your skin health snapshot for today.</p>
      </motion.div>

      {/* Daily tip */}
      <div className="glass-card mt-6 flex items-start gap-3 p-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300">
          <Lightbulb size={18} />
        </span>
        <div>
          <p className="text-sm font-semibold text-ink dark:text-canvas">Today's skin tip</p>
          <p className="mt-0.5 text-sm text-ink/60 dark:text-canvas/60">{tipOfDay}</p>
        </div>
      </div>

      {/* Quick stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total analyses', value: summary?.analysisCount ?? '—' },
          { label: 'Reports stored', value: summary?.reportCount ?? '—' },
          { label: 'Member since', value: summary?.memberSince ? new Date(summary.memberSince).getFullYear() : '—' },
          { label: 'Skin type', value: user?.onboarding?.skinType || '—' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-4 text-center">
            <p className="font-display text-2xl font-semibold text-ink dark:text-canvas capitalize">{stat.value}</p>
            <p className="mt-1 text-xs text-ink/50 dark:text-canvas/50">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <h3 className="mt-10 font-display text-lg font-semibold text-ink dark:text-canvas">Quick actions</h3>
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {QUICK_ACTIONS.map((action) => (
          <Link key={action.to} to={action.to} className="glass-card flex flex-col items-center gap-2 p-5 text-center transition-transform hover:-translate-y-1">
            <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${action.color}`}>
              <action.icon size={20} />
            </span>
            <span className="text-sm font-medium text-ink dark:text-canvas">{action.label}</span>
          </Link>
        ))}
      </div>

      {/* Recent analyses */}
      <div className="mt-10 flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-ink dark:text-canvas">Recent analyses</h3>
        <Link to="/analysis" className="flex items-center gap-1 text-sm font-medium text-teal-600 dark:text-teal-300">
          View all <ArrowRight size={14} />
        </Link>
      </div>

      <div className="mt-4 space-y-3">
        {isLoading && [...Array(3)].map((_, i) => <div key={i} className="skeleton h-16 w-full" />)}
        {!isLoading && (!summary?.latestAnalyses || summary.latestAnalyses.length === 0) && (
          <div className="glass-card p-8 text-center">
            <ScanFace size={32} className="mx-auto text-ink/30" />
            <p className="mt-3 text-sm text-ink/60 dark:text-canvas/60">
              No analyses yet — tap the camera button below to run your first AI skin analysis.
            </p>
          </div>
        )}
        {summary?.latestAnalyses?.map((a: any) => (
          <Link key={a._id} to={`/analysis/${a._id}`} className="glass-card flex items-center gap-4 p-4 transition-transform hover:-translate-y-0.5">
            <img src={a.image?.url} alt="" className="h-12 w-12 rounded-lg object-cover" />
            <div className="flex-1">
              <p className="text-sm font-medium text-ink dark:text-canvas capitalize">{a.topCondition?.replace('_', ' ')}</p>
              <p className="text-xs text-ink/50 dark:text-canvas/50">{new Date(a.createdAt).toLocaleDateString()}</p>
            </div>
            <SeverityBadge severity={a.severity} />
          </Link>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
