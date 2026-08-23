import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ScanFace, ChevronLeft, ChevronRight } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import SeverityBadge from '../../components/analysis/SeverityBadge';
import { useAnalysisHistory } from '../../hooks/useSkinAnalysis';

const AnalysisHistoryPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAnalysisHistory(page);

  return (
    <DashboardLayout title="Skin Analysis History">
      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-40 w-full" />)}
        </div>
      )}

      {!isLoading && data?.results.length === 0 && (
        <div className="glass-card p-12 text-center">
          <ScanFace size={40} className="mx-auto text-ink/30" />
          <h3 className="mt-4 font-display text-lg font-semibold text-ink dark:text-canvas">No analyses yet</h3>
          <p className="mt-1 text-sm text-ink/60 dark:text-canvas/60">
            Tap the floating camera button to run your first AI skin analysis.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data?.results.map((a) => (
          <Link key={a._id} to={`/analysis/${a._id}`} className="glass-card overflow-hidden transition-transform hover:-translate-y-1">
            <img src={a.image.url} alt="" className="h-40 w-full object-cover" />
            <div className="p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium capitalize text-ink dark:text-canvas">
                  {a.predictions[0]?.label || a.topCondition.replace('_', ' ')}
                </p>
                <SeverityBadge severity={a.severity} />
              </div>
              <p className="mt-1 font-mono text-xs text-ink/50 dark:text-canvas/50">
                {(a.topConfidence * 100).toFixed(0)}% confidence · {new Date(a.createdAt).toLocaleDateString()}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {data && data.pagination.pages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="btn-secondary !px-3 !py-2 disabled:opacity-40"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm text-ink/60 dark:text-canvas/60">
            Page {data.pagination.page} of {data.pagination.pages}
          </span>
          <button
            disabled={page >= data.pagination.pages}
            onClick={() => setPage((p) => p + 1)}
            className="btn-secondary !px-3 !py-2 disabled:opacity-40"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AnalysisHistoryPage;
