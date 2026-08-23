import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Stethoscope, Newspaper, ArrowRight } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useConditions } from '../../hooks/useConditions';
import { useArticles } from '../../hooks/useArticles';

const SearchResultsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [activeQuery, setActiveQuery] = useState(initialQuery);

  const { data: conditions, isLoading: conditionsLoading } = useConditions(activeQuery || undefined);
  const { data: articles, isLoading: articlesLoading } = useArticles({ search: activeQuery || undefined, page: 1 });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveQuery(query);
    setSearchParams(query ? { q: query } : {});
  };

  return (
    <DashboardLayout title="Search">
      <form onSubmit={handleSearch} className="mb-8 flex gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search skin conditions, symptoms, or articles…"
            className="input-field pl-9"
            autoFocus
          />
        </div>
        <button type="submit" className="btn-primary">Search</button>
      </form>

      {!activeQuery && (
        <div className="glass-card p-10 text-center text-sm text-ink/60 dark:text-canvas/60">
          Try searching a condition (e.g. "acne", "eczema", "mole"), a symptom (e.g. "itchy patch", "white spots"), or a topic from our articles.
        </div>
      )}

      {activeQuery && (
        <>
          {/* Conditions results */}
          <div className="mb-8">
            <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-ink dark:text-canvas">
              <Stethoscope size={18} className="text-teal-600" /> Skin conditions
              {conditions && <span className="text-sm font-normal text-ink/40">({conditions.length})</span>}
            </h3>
            {conditionsLoading && <div className="skeleton h-24 w-full" />}
            {!conditionsLoading && conditions?.length === 0 && (
              <p className="text-sm text-ink/50 dark:text-canvas/50">No matching conditions found.</p>
            )}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {conditions?.map((c) => (
                <Link key={c.slug} to={`/conditions/${c.slug}`} className="glass-card p-4 transition-transform hover:-translate-y-0.5">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-ink dark:text-canvas">{c.label}</p>
                    <ArrowRight size={14} className="text-ink/30" />
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-ink/60 dark:text-canvas/60">{c.explanation}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Articles results */}
          <div>
            <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-ink dark:text-canvas">
              <Newspaper size={18} className="text-clay-600" /> Articles
              {articles && <span className="text-sm font-normal text-ink/40">({articles.results.length})</span>}
            </h3>
            {articlesLoading && <div className="skeleton h-24 w-full" />}
            {!articlesLoading && articles?.results.length === 0 && (
              <p className="text-sm text-ink/50 dark:text-canvas/50">No matching articles found.</p>
            )}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {articles?.results.map((a) => (
                <Link key={a._id} to={`/articles/${a.slug}`} className="glass-card p-4 transition-transform hover:-translate-y-0.5">
                  <p className="font-medium text-ink dark:text-canvas">{a.title}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-ink/60 dark:text-canvas/60">{a.summary}</p>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default SearchResultsPage;
