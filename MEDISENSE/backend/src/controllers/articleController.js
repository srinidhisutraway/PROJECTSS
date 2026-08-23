import Article from '../models/Article.js';
import ArticleBookmark from '../models/ArticleBookmark.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';

// @desc    List/search published articles (paginated, filterable)
// @route   GET /api/articles
export const getArticles = catchAsync(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit, 10) || 9, 50);
  const filter = { isPublished: true };

  if (req.query.category) filter.category = req.query.category;
  if (req.query.trending === 'true') filter.isTrending = true;
  if (req.query.search) filter.$text = { $search: req.query.search };

  const [items, total] = await Promise.all([
    Article.find(filter)
      .sort(req.query.search ? { score: { $meta: 'textScore' } } : '-publishedAt')
      .skip((page - 1) * limit)
      .limit(limit),
    Article.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    results: items,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

// @desc    Get a single article by slug (increments view count)
// @route   GET /api/articles/:slug
export const getArticleBySlug = catchAsync(async (req, res, next) => {
  const article = await Article.findOneAndUpdate(
    { slug: req.params.slug, isPublished: true },
    { $inc: { viewCount: 1 } },
    { new: true }
  );
  if (!article) return next(new AppError('Article not found.', 404));
  res.status(200).json({ success: true, article });
});

// @desc    List distinct categories with counts
// @route   GET /api/articles/meta/categories
export const getCategories = catchAsync(async (req, res) => {
  const categories = await Article.aggregate([
    { $match: { isPublished: true } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
  res.status(200).json({ success: true, categories });
});

// @desc    Toggle bookmark on an article
// @route   POST /api/articles/:id/bookmark
export const toggleBookmark = catchAsync(async (req, res, next) => {
  const article = await Article.findById(req.params.id);
  if (!article) return next(new AppError('Article not found.', 404));

  const existing = await ArticleBookmark.findOne({ user: req.user._id, article: article._id });

  if (existing) {
    await existing.deleteOne();
    return res.status(200).json({ success: true, bookmarked: false });
  }

  await ArticleBookmark.create({ user: req.user._id, article: article._id });
  res.status(201).json({ success: true, bookmarked: true });
});

// @desc    List the user's bookmarked articles
// @route   GET /api/articles/me/bookmarks
export const getBookmarks = catchAsync(async (req, res) => {
  const bookmarks = await ArticleBookmark.find({ user: req.user._id })
    .populate('article')
    .sort('-createdAt');

  res.status(200).json({ success: true, articles: bookmarks.map((b) => b.article).filter(Boolean) });
});
