import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Bookmark, BookmarkCheck, Clock, ArrowLeft } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useArticle, useToggleBookmark, useBookmarks } from '../../hooks/useArticles';

/**
 * Minimal markdown-to-JSX renderer for article content (## headers and
 * paragraphs). Kept dependency-free since articles use a simple, known
 * content format written by admins via the CMS.
 */
const renderMarkdown = (content: string) =>
  content.split('\n').map((line, i) => {
    if (line.startsWith('## ')) {
      return <h2 key={i} className="mt-6 mb-2 font-display text-xl font-semibold text-ink dark:text-canvas">{line.slice(3)}</h2>;
    }
    if (line.trim() === '') return null;
    return <p key={i} className="mb-3 text-sm leading-relaxed text-ink/70 dark:text-canvas/70">{line}</p>;
  });

const ArticleDetailPage: React.FC = () => {
  const { slug } = useParams();
  const { data: article, isLoading } = useArticle(slug);
  const { data: bookmarks } = useBookmarks();
  const toggleBookmark = useToggleBookmark();
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    if (article && bookmarks) {
      setBookmarked(bookmarks.some((b) => b._id === article._id));
    }
  }, [article, bookmarks]);

  if (isLoading) {
    return (
      <DashboardLayout title="Article">
        <div className="skeleton h-96 w-full" />
      </DashboardLayout>
    );
  }

  if (!article) return null;

  return (
    <DashboardLayout title="Article">
      <Link to="/articles" className="mb-4 flex items-center gap-1 text-sm text-ink/60 dark:text-canvas/60">
        <ArrowLeft size={14} /> Back to articles
      </Link>

      <div className="glass-card p-6 sm:p-10">
        <span className="badge bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300 capitalize">{article.category}</span>
        <h1 className="mt-4 font-display text-3xl font-semibold text-ink dark:text-canvas">{article.title}</h1>
        <div className="mt-3 flex items-center gap-4 text-xs text-ink/50 dark:text-canvas/50">
          <span>{article.author}</span>
          <span className="flex items-center gap-1"><Clock size={12} /> {article.readTimeMinutes} min read</span>
          <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
          <button
            onClick={() => toggleBookmark.mutate(article._id, { onSuccess: setBookmarked })}
            className="ml-auto flex items-center gap-1 font-medium text-clay-600 dark:text-clay-300"
          >
            {bookmarked ? <BookmarkCheck size={15} /> : <Bookmark size={15} />} {bookmarked ? 'Saved' : 'Save'}
          </button>
        </div>

        <div className="mt-8">{renderMarkdown(article.content)}</div>
      </div>
    </DashboardLayout>
  );
};

export default ArticleDetailPage;
