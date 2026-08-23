import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Award, ArrowRight } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useQuizById, useSubmitQuizAttempt } from '../../hooks/useQuiz';

const QuizAttemptPage: React.FC = () => {
  const { id } = useParams();
  const { data: quiz, isLoading } = useQuizById(id);
  const submitAttempt = useSubmitQuizAttempt(id || '');
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<any>(null);

  const handleSelect = (questionId: string, optionIndex: number) => {
    if (result) return;
    setAnswers((a) => ({ ...a, [questionId]: optionIndex }));
  };

  const handleSubmit = () => {
    if (!quiz) return;
    const payload = quiz.questions.map((q) => ({ questionId: q._id, selectedOptionIndex: answers[q._id] ?? -1 }));
    submitAttempt.mutate(payload, { onSuccess: (data) => setResult(data) });
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Quiz">
        <div className="skeleton h-96 w-full" />
      </DashboardLayout>
    );
  }

  if (!quiz) return null;

  const allAnswered = quiz.questions.every((q) => answers[q._id] !== undefined);

  return (
    <DashboardLayout title={quiz.title}>
      {!result && (
        <div className="mx-auto max-w-2xl space-y-6">
          {quiz.questions.map((q, qi) => (
            <motion.div key={q._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: qi * 0.05 }} className="glass-card p-5">
              <p className="font-medium text-ink dark:text-canvas">{qi + 1}. {q.question}</p>
              <div className="mt-3 space-y-2">
                {q.options.map((opt, oi) => (
                  <button
                    key={opt}
                    onClick={() => handleSelect(q._id, oi)}
                    className={`w-full rounded-xl border px-4 py-2.5 text-left text-sm transition-colors ${
                      answers[q._id] === oi
                        ? 'border-teal-500 bg-teal-50 dark:bg-teal-500/10'
                        : 'border-ink/10 hover:border-teal-300 dark:border-white/10'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
          <button onClick={handleSubmit} disabled={!allAnswered || submitAttempt.isPending} className="btn-primary w-full">
            {submitAttempt.isPending ? 'Grading…' : 'Submit answers'}
          </button>
        </div>
      )}

      {result && (
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="glass-card p-8 text-center">
            {result.passed ? <Award size={40} className="mx-auto text-amber-500" /> : <CheckCircle2 size={40} className="mx-auto text-teal-600" />}
            <h2 className="mt-4 font-display text-2xl font-semibold text-ink dark:text-canvas">
              {result.correctCount} / {result.totalQuestions} correct
            </h2>
            <p className="mt-1 text-ink/60 dark:text-canvas/60">Score: {result.score} / {result.totalPossibleScore}</p>
            {result.badgeEarned && (
              <p className="mt-3 badge bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300 inline-flex">
                <Award size={14} /> Earned: {result.badgeEarned}
              </p>
            )}
          </div>

          <div className="space-y-3">
            {result.gradedQuestions.map((gq: any) => (
              <div key={gq.questionId} className="glass-card p-5">
                <div className="flex items-start gap-2">
                  {gq.isCorrect ? <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-teal-600" /> : <XCircle size={18} className="mt-0.5 shrink-0 text-clay-500" />}
                  <div>
                    <p className="font-medium text-ink dark:text-canvas">{gq.question}</p>
                    <p className="mt-1 text-sm text-ink/60 dark:text-canvas/60">{gq.explanation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Link to="/quiz" className="btn-primary w-full">
            Back to quizzes <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </DashboardLayout>
  );
};

export default QuizAttemptPage;
