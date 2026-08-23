import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Stethoscope, ArrowRight } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useConditions, useConditionCategories } from '../../hooks/useConditions';

const ConditionsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string | undefined>(undefined);
  const { data: conditions, isLoading } = useConditions(search || undefined, category);
  const { data: categories } = useConditionCategories();

  return (
    <DashboardLayout title="Skin Conditions Encyclopedia">
      <p className="mb-6 text-sm text-ink/60 dark:text-canvas/60">
        A reference guide covering the conditions MediSense screens for - symptoms, causes, and general dos/don'ts.
        This is educational information, not a diagnosis.
      </p>

      <div className="mb-4 relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by condition, symptom, or keyword..."
          className="input-field pl-9"
        />
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setCategory(undefined)}
          className={`rounded-full border px-4 py-1.5 text-xs font-medium capitalize ${!category ? 'border-clay-500 bg-clay-500 text-white' : 'border-ink/15 dark:border-white/15'}`}
        >
          All
        </button>
        {categories?.map((c) => (
          <button
            key={c._id}
            onClick={() => setCategory(c._id)}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium capitalize ${category === c._id ? 'border-clay-500 bg-clay-500 text-white' : 'border-ink/15 dark:border-white/15'}`}
          >
            {c._id} ({c.count})
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-32 w-full" />)}
        </div>
      )}

      {!isLoading && conditions?.length === 0 && (
        <div className="glass-card p-12 text-center">
          <Stethoscope size={36} className="mx-auto text-ink/30" />
          <p className="mt-3 text-sm text-ink/60 dark:text-canvas/60">No conditions matched your search.</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {conditions?.map((c) => (
          <Link key={c.slug} to={`/conditions/${c.slug}`} className="glass-card p-5 transition-transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <span className="badge bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300 capitalize">{c.category}</span>
              <ArrowRight size={14} className="text-ink/30" />
            </div>
            <h3 className="mt-3 font-display text-lg font-semibold text-ink dark:text-canvas">{c.label}</h3>
            <p className="mt-1 line-clamp-3 text-sm text-ink/60 dark:text-canvas/60">{c.explanation}</p>
          </Link>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default ConditionsPage;
