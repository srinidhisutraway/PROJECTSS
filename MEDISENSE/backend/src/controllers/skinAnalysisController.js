import { v2 as cloudinary } from 'cloudinary';
import SkinAnalysis from '../models/SkinAnalysis.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';
import { getSkinPrediction } from '../services/mlService.js';

// @desc    Upload a skin image and run AI analysis
// @route   POST /api/skin-analysis
export const analyzeImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new AppError('Please upload an image.', 400));

  const prediction = await getSkinPrediction(req.file.path);

  const analysis = await SkinAnalysis.create({
    user: req.user._id,
    image: { url: req.file.path, publicId: req.file.filename },
    predictions: prediction.predictions.map((p) => ({ condition: p.condition, confidence: p.confidence })),
    topCondition: prediction.topCondition,
    topConfidence: prediction.topConfidence,
    severity: prediction.severity,
    explanation: prediction.explanation,
    possibleCauses: prediction.possibleCauses,
    symptoms: prediction.symptoms,
    precautions: prediction.precautions,
    recommendedRoutine: prediction.recommendedRoutine,
    dos: prediction.dos,
    donts: prediction.donts,
    consultationUrgency: prediction.consultationUrgency,
    faqs: prediction.faqs,
    hydrationAnalysis: prediction.hydrationAnalysis,
    grayscaleImage: prediction.grayscaleImage,
    highlightedImage: prediction.highlightedImage,
    keyIndicators: prediction.keyIndicators,
    modelVersion: prediction.modelVersion,
    inferenceTimeMs: prediction.inferenceTimeMs,
  });

  res.status(201).json({
    success: true,
    analysis,
    mockMode: prediction.mockMode, // lets the frontend show a "demo model" note if true
  });
});

// @desc    Get paginated analysis history for the logged-in user
// @route   GET /api/skin-analysis
export const getHistory = catchAsync(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    SkinAnalysis.find({ user: req.user._id }).sort('-createdAt').skip(skip).limit(limit),
    SkinAnalysis.countDocuments({ user: req.user._id }),
  ]);

  res.status(200).json({
    success: true,
    results: items,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

// @desc    Get a single analysis by ID
// @route   GET /api/skin-analysis/:id
export const getAnalysisById = catchAsync(async (req, res, next) => {
  const analysis = await SkinAnalysis.findOne({ _id: req.params.id, user: req.user._id });
  if (!analysis) return next(new AppError('Analysis not found.', 404));
  res.status(200).json({ success: true, analysis });
});

// @desc    Add/update personal notes on an analysis
// @route   PATCH /api/skin-analysis/:id
export const updateAnalysisNotes = catchAsync(async (req, res, next) => {
  const analysis = await SkinAnalysis.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { notes: req.body.notes },
    { new: true }
  );
  if (!analysis) return next(new AppError('Analysis not found.', 404));
  res.status(200).json({ success: true, analysis });
});

// @desc    Delete an analysis (and its Cloudinary image)
// @route   DELETE /api/skin-analysis/:id
export const deleteAnalysis = catchAsync(async (req, res, next) => {
  const analysis = await SkinAnalysis.findOne({ _id: req.params.id, user: req.user._id });
  if (!analysis) return next(new AppError('Analysis not found.', 404));

  await cloudinary.uploader.destroy(analysis.image.publicId).catch(() => {});
  await analysis.deleteOne();

  res.status(200).json({ success: true, message: 'Analysis deleted.' });
});

// @desc    Aggregated analytics for charts (disease frequency, trends over time)
// @route   GET /api/skin-analysis/analytics/summary
export const getAnalytics = catchAsync(async (req, res) => {
  const userId = req.user._id;

  const [conditionFrequency, severityBreakdown, hydrationTrend, timeline] = await Promise.all([
    SkinAnalysis.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$topCondition', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    SkinAnalysis.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$severity', count: { $sum: 1 } } },
    ]),
    SkinAnalysis.find({ user: userId }, 'hydrationAnalysis createdAt').sort('createdAt').limit(30),
    SkinAnalysis.find({ user: userId }, 'topCondition severity createdAt').sort('createdAt').limit(30),
  ]);

  res.status(200).json({
    success: true,
    analytics: { conditionFrequency, severityBreakdown, hydrationTrend, timeline },
  });
});
