import { v2 as cloudinary } from 'cloudinary';
import MedicalReport from '../models/MedicalReport.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';

// @desc    Upload a medical report (PDF or image)
// @route   POST /api/reports
export const uploadReport = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new AppError('Please upload a file.', 400));
  const { title, type, notes, reportDate, relatedAnalysis } = req.body;

  const report = await MedicalReport.create({
    user: req.user._id,
    title: title || req.file.originalname,
    type: type || 'other',
    file: {
      url: req.file.path,
      publicId: req.file.filename,
      format: req.file.format || req.file.mimetype,
      resourceType: req.file.resource_type || 'auto',
    },
    notes,
    reportDate: reportDate ? new Date(reportDate) : undefined,
    relatedAnalysis: relatedAnalysis || undefined,
  });

  res.status(201).json({ success: true, report });
});

// @desc    List the user's reports (paginated, filterable by type)
// @route   GET /api/reports
export const getReports = catchAsync(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit, 10) || 12, 50);
  const filter = { user: req.user._id };
  if (req.query.type) filter.type = req.query.type;

  const [items, total] = await Promise.all([
    MedicalReport.find(filter).sort('-createdAt').skip((page - 1) * limit).limit(limit),
    MedicalReport.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    results: items,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

// @desc    Get a single report
// @route   GET /api/reports/:id
export const getReportById = catchAsync(async (req, res, next) => {
  const report = await MedicalReport.findOne({ _id: req.params.id, user: req.user._id });
  if (!report) return next(new AppError('Report not found.', 404));
  res.status(200).json({ success: true, report });
});

// @desc    Delete a report
// @route   DELETE /api/reports/:id
export const deleteReport = catchAsync(async (req, res, next) => {
  const report = await MedicalReport.findOne({ _id: req.params.id, user: req.user._id });
  if (!report) return next(new AppError('Report not found.', 404));

  await cloudinary.uploader
    .destroy(report.file.publicId, { resource_type: report.file.resourceType || 'auto' })
    .catch(() => {});
  await report.deleteOne();

  res.status(200).json({ success: true, message: 'Report deleted.' });
});
