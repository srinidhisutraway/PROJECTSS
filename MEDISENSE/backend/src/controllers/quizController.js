import { Quiz, QuizAttempt } from '../models/Quiz.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';

// @desc    List active quizzes (without correct answers exposed)
// @route   GET /api/quiz
export const getQuizzes = catchAsync(async (req, res) => {
  const filter = { isActive: true };
  if (req.query.category) filter.category = req.query.category;

  const quizzes = await Quiz.find(filter).select('title description category difficulty badgeAwarded questions');
  const sanitized = quizzes.map((q) => ({
    _id: q._id,
    title: q.title,
    description: q.description,
    category: q.category,
    difficulty: q.difficulty,
    badgeAwarded: q.badgeAwarded,
    questionCount: q.questions.length,
  }));

  res.status(200).json({ success: true, quizzes: sanitized });
});

// @desc    Get a single quiz with questions (answers hidden)
// @route   GET /api/quiz/:id
export const getQuizById = catchAsync(async (req, res, next) => {
  const quiz = await Quiz.findOne({ _id: req.params.id, isActive: true });
  if (!quiz) return next(new AppError('Quiz not found.', 404));

  const sanitizedQuestions = quiz.questions.map((q) => ({
    _id: q._id,
    question: q.question,
    options: q.options,
    points: q.points,
  }));

  res.status(200).json({
    success: true,
    quiz: { _id: quiz._id, title: quiz.title, description: quiz.description, questions: sanitizedQuestions },
  });
});

// @desc    Submit answers for a quiz attempt (scored server-side)
// @route   POST /api/quiz/:id/attempt
export const submitAttempt = catchAsync(async (req, res, next) => {
  const { answers } = req.body; // [{ questionId, selectedOptionIndex }]
  const quiz = await Quiz.findOne({ _id: req.params.id, isActive: true });
  if (!quiz) return next(new AppError('Quiz not found.', 404));
  if (!Array.isArray(answers) || answers.length === 0) {
    return next(new AppError('Answers are required.', 400));
  }

  let score = 0;
  let correctCount = 0;
  const totalPossibleScore = quiz.questions.reduce((sum, q) => sum + q.points, 0);

  const gradedQuestions = quiz.questions.map((q) => {
    const submitted = answers.find((a) => a.questionId === String(q._id));
    const isCorrect = submitted && submitted.selectedOptionIndex === q.correctOptionIndex;
    if (isCorrect) {
      score += q.points;
      correctCount += 1;
    }
    return {
      questionId: q._id,
      question: q.question,
      correctOptionIndex: q.correctOptionIndex,
      selectedOptionIndex: submitted?.selectedOptionIndex ?? null,
      isCorrect: !!isCorrect,
      explanation: q.explanation,
    };
  });

  const passed = score / totalPossibleScore >= 0.7;
  const badgeEarned = passed ? quiz.badgeAwarded : undefined;

  const attempt = await QuizAttempt.create({
    user: req.user._id,
    quiz: quiz._id,
    answers,
    score,
    totalPossibleScore,
    correctCount,
    totalQuestions: quiz.questions.length,
    badgeEarned,
  });

  res.status(201).json({
    success: true,
    attempt: {
      _id: attempt._id,
      score,
      totalPossibleScore,
      correctCount,
      totalQuestions: quiz.questions.length,
      badgeEarned,
      passed,
      gradedQuestions,
    },
  });
});

// @desc    Get the logged-in user's quiz history + total badges
// @route   GET /api/quiz/history/me
export const getMyHistory = catchAsync(async (req, res) => {
  const attempts = await QuizAttempt.find({ user: req.user._id })
    .populate('quiz', 'title category difficulty')
    .sort('-createdAt');

  const badges = [...new Set(attempts.map((a) => a.badgeEarned).filter(Boolean))];
  const totalScore = attempts.reduce((sum, a) => sum + a.score, 0);

  res.status(200).json({ success: true, attempts, badges, totalScore });
});

// @desc    Global leaderboard (top scorers by cumulative points)
// @route   GET /api/quiz/leaderboard
export const getLeaderboard = catchAsync(async (req, res) => {
  const leaderboard = await QuizAttempt.aggregate([
    { $group: { _id: '$user', totalScore: { $sum: '$score' }, attemptsCount: { $sum: 1 } } },
    { $sort: { totalScore: -1 } },
    { $limit: 20 },
    {
      $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' },
    },
    { $unwind: '$user' },
    {
      $project: {
        totalScore: 1,
        attemptsCount: 1,
        name: '$user.name',
        avatar: '$user.avatar.url',
      },
    },
  ]);

  res.status(200).json({ success: true, leaderboard });
});
