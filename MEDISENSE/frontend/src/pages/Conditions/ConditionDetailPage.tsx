import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useCondition } from '../../hooks/useConditions';

const ConditionDetailPage: React.FC = () => {
  const { slug } = useParams();
  const { data: condition, isLoading } = useCondition(slug);

  if (isLoading) {
    return (
      <DashboardLayout title="Condition">
        <div className="skeleton h-96 w-full" />
      </DashboardLayout>
    );
  }

  if (!condition) return null;

  return (
    <DashboardLayout title="Condition">
      <Link to="/conditions" className="mb-4 flex items-center gap-1 text-sm text-ink/60 dark:text-canvas/60">
        <ArrowLeft size={14} /> Back to encyclopedia
      </Link>

      <div className="glass-card p-6 sm:p-10">
        <span className="badge bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300 capitalize">{condition.category}</span>
        <h1 className="mt-4 font-display text-3xl font-semibold text-ink dark:text-canvas">{condition.label}</h1>
        <p className="mt-4 text-sm leading-relaxed text-ink/70 dark:text-canvas/70">{condition.explanation}</p>

        {condition.symptoms?.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-2 font-display text-base font-semibold text-ink dark:text-canvas">Common symptoms</h3>
            <ul className="flex flex-wrap gap-2">
              {condition.symptoms.map((s) => (
                <li key={s} className="rounded-full bg-ink/5 px-3 py-1 text-xs dark:bg-white/5">{s}</li>
              ))}
            </ul>
          </div>
        )}

        {condition.possibleCauses?.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-2 font-display text-base font-semibold text-ink dark:text-canvas">Possible causes</h3>
            <ul className="list-inside list-disc space-y-1 text-sm text-ink/70 dark:text-canvas/70">
              {condition.possibleCauses.map((c) => <li key={c}>{c}</li>)}
            </ul>
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <h3 className="mb-2 flex items-center gap-1.5 font-display text-base font-semibold text-teal-700 dark:text-teal-300">
              <CheckCircle2 size={16} /> Do's
            </h3>
            <ul className="space-y-1.5 text-sm text-ink/70 dark:text-canvas/70">
              {condition.dos?.map((d) => <li key={d}>• {d}</li>)}
            </ul>
          </div>
          <div>
            <h3 className="mb-2 flex items-center gap-1.5 font-display text-base font-semibold text-clay-700 dark:text-clay-300">
              <XCircle size={16} /> Don'ts
            </h3>
            <ul className="space-y-1.5 text-sm text-ink/70 dark:text-canvas/70">
              {condition.donts?.map((d) => <li key={d}>• {d}</li>)}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex items-start gap-2 rounded-xl bg-clay-50 p-4 text-xs text-clay-700 dark:bg-clay-500/10 dark:text-clay-300">
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          This is general educational information, not a diagnosis. If you have concerning or persistent symptoms,
          please consult a licensed dermatologist. You can also run an AI photo analysis or find nearby clinics
          from your dashboard.
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ConditionDetailPage;
