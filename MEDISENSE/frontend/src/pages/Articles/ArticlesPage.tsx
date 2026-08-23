import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Bookmark, TrendingUp, Clock, Newspaper, AlertCircle } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useArticles, useArticleCategories } from '../../hooks/useArticles';

const ArticlesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState<string | undefined>(searchParams.get('category') || undefined);
  const { data, isLoading, isError } = useArticles({ page: 1, category, search: search || undefined });
  const { data: categories } = useArticleCategories();

  useEffect(() => {
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (category) params.category = category;
    setSearchParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category]);

  return (
    <DashboardLayout title="Articles">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles…"
            className="input-field pl-9"
          />
        </div>
        <Link to="#" className="hidden text-sm font-medium text-teal-600 dark:text-teal-300 sm:block">
          <Bookmark size={14} className="mr-1 inline" /> Saved articles
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setCategory(undefined)}
          className={`rounded-full border px-4 py-1.5 text-xs font-medium ${!category ? 'border-clay-500 bg-clay-500 text-white' : 'border-ink/15 dark:border-white/15'}`}
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
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-52 w-full" />)}
        </div>
      )}

      {isError && (
        <div className="glass-card p-12 text-center">
          <AlertCircle size={36} className="mx-auto text-clay-500" />
          <p className="mt-3 text-sm text-ink/60 dark:text-canvas/60">
            Couldn't load articles right now. Make sure the backend server is running, then refresh the page.
          </p>
        </div>
      )}

      {!isLoading && !isError && data?.results.length === 0 && (
        <div className="glass-card p-12 text-center">
          <Newspaper size={36} className="mx-auto text-ink/30" />
          <p className="mt-3 text-sm text-ink/60 dark:text-canvas/60">
            {search ? `No articles matched "${search}".` : 'No articles published yet. Run the backend seed script (npm run seed) to add sample articles.'}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {data?.results.map((article) => (
          <Link key={article._id} to={`/articles/${article.slug}`} className="glass-card overflow-hidden transition-transform hover:-translate-y-1">
            <div className="flex h-32 w-full items-center justify-center bg-dawn-gradient dark:bg-dawn-gradient-dark">
              <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-medium capitalize dark:bg-white/10">{article.category}</span>
            </div>
            <div className="p-5">
              {article.isTrending && (
                <span className="mb-2 flex items-center gap-1 text-xs font-medium text-clay-600 dark:text-clay-300">
                  <TrendingUp size={12} /> Trending
                </span>
              )}
              <h3 className="font-display text-base font-semibold leading-snug text-ink dark:text-canvas">{article.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-ink/60 dark:text-canvas/60">{article.summary}</p>
              <div className="mt-3 flex items-center gap-1 text-xs text-ink/40">
                <Clock size={12} /> {article.readTimeMinutes} min read
              </div>
            </div>
          </Link>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default ArticlesPage;
