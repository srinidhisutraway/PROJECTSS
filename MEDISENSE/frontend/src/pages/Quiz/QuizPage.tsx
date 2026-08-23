import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Award, Trophy } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useQuizzes, useQuizHistory, useLeaderboard } from '../../hooks/useQuiz';

const QuizPage: React.FC = () => {
  const { data: quizzes, isLoading } = useQuizzes();
  const { data: history } = useQuizHistory();
  const { data: leaderboard } = useLeaderboard();

  return (
    <DashboardLayout title="Skin Health Quiz">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          {history && history.badges.length > 0 && (
            <div className="glass-card mb-6 flex flex-wrap items-center gap-3 p-4">
              <span className="text-sm font-semibold text-ink dark:text-canvas">Your badges:</span>
              {history.badges.map((b) => (
                <span key={b} className="badge bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                  <Award size={13} /> {b}
                </span>
              ))}
              <span className="ml-auto font-mono text-sm text-ink/60 dark:text-canvas/60">
                Total score: {history.totalScore}
              </span>
            </div>
          )}

          {isLoading && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-36 w-full" />)}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {quizzes?.map((q) => (
              <Link key={q._id} to={`/quiz/${q._id}`} className="glass-card p-5 transition-transform hover:-translate-y-1">
                <div className="flex items-center gap-2">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-lavender-100 text-lavender-700 dark:bg-lavender-500/15 dark:text-lavender-300">
                    <Brain size={18} />
                  </span>
                  <span className="rounded-full bg-ink/5 px-2.5 py-1 text-[11px] font-medium capitalize dark:bg-white/10">{q.difficulty}</span>
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold text-ink dark:text-canvas">{q.title}</h3>
                <p className="mt-1 text-sm text-ink/60 dark:text-canvas/60">{q.description}</p>
                <p className="mt-3 text-xs text-ink/40">{q.questionCount} questions {q.badgeAwarded && `· Earn "${q.badgeAwarded}"`}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="glass-card h-fit p-5">
          <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-ink dark:text-canvas">
            <Trophy size={18} className="text-amber-500" /> Leaderboard
          </h3>
          <div className="mt-4 space-y-3">
            {leaderboard?.map((entry, i) => (
              <div key={entry._id} className="flex items-center gap-3">
                <span className="w-5 text-center font-mono text-sm text-ink/40">{i + 1}</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-xs font-semibold text-teal-700 dark:bg-teal-500/20 dark:text-teal-300">
                  {entry.name?.charAt(0)}
                </div>
                <span className="flex-1 truncate text-sm">{entry.name}</span>
                <span className="font-mono text-xs text-ink/50">{entry.totalScore}</span>
              </div>
            ))}
            {!leaderboard?.length && <p className="text-xs text-ink/40">No attempts yet — be the first!</p>}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default QuizPage;
