import CONDITIONS from '../data/skinConditionsKB.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';

// @desc    List/search all known skin conditions (public reference data)
// @route   GET /api/conditions?search=&category=
export const getConditions = catchAsync(async (req, res) => {
  const { search, category } = req.query;
  let results = CONDITIONS;

  if (category) {
    results = results.filter((c) => c.category === category);
  }

  if (search) {
    const q = search.toLowerCase().trim();
    results = results.filter((c) => {
      const haystack = [
        c.label,
        c.explanation,
        c.category,
        ...(c.symptoms || []),
        ...(c.possibleCauses || []),
        ...(c.keywords || []),
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }

  // Lightweight list view — full detail fetched via getConditionBySlug
  const summaries = results.map(({ slug, label, category: cat, explanation, keywords }) => ({
    slug,
    label,
    category: cat,
    explanation,
    keywords,
  }));

  res.status(200).json({ success: true, results: summaries, total: summaries.length });
});

// @desc    Get full detail for one condition
// @route   GET /api/conditions/:slug
export const getConditionBySlug = catchAsync(async (req, res, next) => {
  const condition = CONDITIONS.find((c) => c.slug === req.params.slug);
  if (!condition) return next(new AppError('Condition not found.', 404));
  res.status(200).json({ success: true, condition });
});

// @desc    List distinct categories with counts (for filter chips)
// @route   GET /api/conditions/meta/categories
export const getConditionCategories = catchAsync(async (req, res) => {
  const counts = {};
  CONDITIONS.forEach((c) => {
    counts[c.category] = (counts[c.category] || 0) + 1;
  });
  const categories = Object.entries(counts).map(([_id, count]) => ({ _id, count }));
  res.status(200).json({ success: true, categories });
});
