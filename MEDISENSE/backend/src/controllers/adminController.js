import User from '../models/User.js';
import SkinAnalysis from '../models/SkinAnalysis.js';
import MedicalReport from '../models/MedicalReport.js';
import Article from '../models/Article.js';
import { Quiz, QuizAttempt } from '../models/Quiz.js';
import SystemLog from '../models/SystemLog.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';
import { logAdminAction } from '../utils/auditLog.js';

// @desc    High-level admin dashboard stats
// @route   GET /api/admin/dashboard
export const getDashboardStats = catchAsync(async (req, res) => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    newUsers30d,
    totalAnalyses,
    analyses30d,
    totalReports,
    totalArticles,
    totalQuizzes,
    conditionFrequency,
    signupTrend,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    SkinAnalysis.countDocuments(),
    SkinAnalysis.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    MedicalReport.countDocuments(),
    Article.countDocuments(),
    Quiz.countDocuments(),
    SkinAnalysis.aggregate([
      { $group: { _id: '$topCondition', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
    User.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
  ]);

  res.status(200).json({
    success: true,
    stats: {
      totalUsers,
      newUsers30d,
      totalAnalyses,
      analyses30d,
      totalReports,
      totalArticles,
      totalQuizzes,
      conditionFrequency,
      signupTrend,
    },
  });
});

// @desc    List/search users (paginated)
// @route   GET /api/admin/users
export const getUsers = catchAsync(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
  const filter = {};
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } },
    ];
  }
  if (req.query.role) filter.role = req.query.role;

  const [users, total] = await Promise.all([
    User.find(filter).sort('-createdAt').skip((page - 1) * limit).limit(limit),
    User.countDocuments(filter),
  ]);

  res.status(200).json({ success: true, users, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});

// @desc    Activate/deactivate a user or change role
// @route   PATCH /api/admin/users/:id
export const updateUser = catchAsync(async (req, res, next) => {
  const allowed = ['isActive', 'role'];
  const updates = {};
  allowed.forEach((f) => {
    if (req.body[f] !== undefined) updates[f] = req.body[f];
  });

  const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  if (!user) return next(new AppError('User not found.', 404));

  await logAdminAction({
    actor: req.user._id,
    action: 'USER_UPDATED',
    targetType: 'User',
    targetId: user._id,
    metadata: updates,
    ip: req.ip,
  });

  res.status(200).json({ success: true, user });
});

// @desc    Delete a user (admin override)
// @route   DELETE /api/admin/users/:id
export const deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return next(new AppError('User not found.', 404));

  await Promise.all([
    SkinAnalysis.deleteMany({ user: user._id }),
    MedicalReport.deleteMany({ user: user._id }),
  ]);

  await logAdminAction({
    actor: req.user._id,
    action: 'USER_DELETED',
    targetType: 'User',
    targetId: user._id,
    ip: req.ip,
  });

  res.status(200).json({ success: true, message: 'User deleted.' });
});

// @desc    List all uploaded images/analyses across users (moderation view)
// @route   GET /api/admin/analyses
export const getAllAnalyses = catchAsync(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);

  const [items, total] = await Promise.all([
    SkinAnalysis.find()
      .populate('user', 'name email')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(limit),
    SkinAnalysis.countDocuments(),
  ]);

  res.status(200).json({ success: true, results: items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});

// @desc    List all uploaded medical reports (moderation view)
// @route   GET /api/admin/reports
export const getAllReports = catchAsync(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);

  const [items, total] = await Promise.all([
    MedicalReport.find()
      .populate('user', 'name email')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(limit),
    MedicalReport.countDocuments(),
  ]);

  res.status(200).json({ success: true, results: items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});

// ---------- Article management ----------

// @desc    Create an article
// @route   POST /api/admin/articles
export const createArticle = catchAsync(async (req, res) => {
  const article = await Article.create({ ...req.body, createdBy: req.user._id });
  await logAdminAction({ actor: req.user._id, action: 'ARTICLE_CREATED', targetType: 'Article', targetId: article._id, ip: req.ip });
  res.status(201).json({ success: true, article });
});

// @desc    Update an article
// @route   PATCH /api/admin/articles/:id
export const updateArticle = catchAsync(async (req, res, next) => {
  const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!article) return next(new AppError('Article not found.', 404));
  await logAdminAction({ actor: req.user._id, action: 'ARTICLE_UPDATED', targetType: 'Article', targetId: article._id, ip: req.ip });
  res.status(200).json({ success: true, article });
});

// @desc    Delete an article
// @route   DELETE /api/admin/articles/:id
export const deleteArticle = catchAsync(async (req, res, next) => {
  const article = await Article.findByIdAndDelete(req.params.id);
  if (!article) return next(new AppError('Article not found.', 404));
  await logAdminAction({ actor: req.user._id, action: 'ARTICLE_DELETED', targetType: 'Article', targetId: article._id, ip: req.ip });
  res.status(200).json({ success: true, message: 'Article deleted.' });
});

// ---------- Quiz management ----------

// @desc    Create a quiz
// @route   POST /api/admin/quizzes
export const createQuiz = catchAsync(async (req, res) => {
  const quiz = await Quiz.create({ ...req.body, createdBy: req.user._id });
  await logAdminAction({ actor: req.user._id, action: 'QUIZ_CREATED', targetType: 'Quiz', targetId: quiz._id, ip: req.ip });
  res.status(201).json({ success: true, quiz });
});

// @desc    Update a quiz
// @route   PATCH /api/admin/quizzes/:id
export const updateQuiz = catchAsync(async (req, res, next) => {
  const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!quiz) return next(new AppError('Quiz not found.', 404));
  await logAdminAction({ actor: req.user._id, action: 'QUIZ_UPDATED', targetType: 'Quiz', targetId: quiz._id, ip: req.ip });
  res.status(200).json({ success: true, quiz });
});

// @desc    Delete a quiz
// @route   DELETE /api/admin/quizzes/:id
export const deleteQuiz = catchAsync(async (req, res, next) => {
  const quiz = await Quiz.findByIdAndDelete(req.params.id);
  if (!quiz) return next(new AppError('Quiz not found.', 404));
  await QuizAttempt.deleteMany({ quiz: quiz._id });
  await logAdminAction({ actor: req.user._id, action: 'QUIZ_DELETED', targetType: 'Quiz', targetId: quiz._id, ip: req.ip });
  res.status(200).json({ success: true, message: 'Quiz deleted.' });
});

// @desc    List quizzes (including inactive) for the admin panel
// @route   GET /api/admin/quizzes
export const getAllQuizzes = catchAsync(async (req, res) => {
  const quizzes = await Quiz.find().sort('-createdAt');
  res.status(200).json({ success: true, quizzes });
});

// ---------- System logs ----------

// @desc    Paginated audit log
// @route   GET /api/admin/logs
export const getSystemLogs = catchAsync(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit, 10) || 30, 100);

  const [logs, total] = await Promise.all([
    SystemLog.find()
      .populate('actor', 'name email')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(limit),
    SystemLog.countDocuments(),
  ]);

  res.status(200).json({ success: true, logs, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});
