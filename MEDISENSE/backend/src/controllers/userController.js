import { v2 as cloudinary } from 'cloudinary';
import User from '../models/User.js';
import SkinAnalysis from '../models/SkinAnalysis.js';
import MedicalReport from '../models/MedicalReport.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';

// @desc    Get own profile
// @route   GET /api/users/me
export const getProfile = catchAsync(async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

// @desc    Update basic profile fields
// @route   PATCH /api/users/me
export const updateProfile = catchAsync(async (req, res, next) => {
  const allowedFields = ['name'];
  const updates = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  if (Object.keys(updates).length === 0) {
    return next(new AppError('No valid fields provided to update.', 400));
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, user });
});

// @desc    Upload / replace avatar
// @route   POST /api/users/me/avatar
export const updateAvatar = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new AppError('No image file uploaded.', 400));

  const user = await User.findById(req.user._id);

  // Clean up the previous avatar in Cloudinary, if any
  if (user.avatar?.publicId) {
    await cloudinary.uploader.destroy(user.avatar.publicId).catch(() => {});
  }

  user.avatar = { url: req.file.path, publicId: req.file.filename };
  await user.save({ validateBeforeSave: false });

  res.status(200).json({ success: true, user });
});

// @desc    Submit or update the onboarding questionnaire
// @route   PUT /api/users/me/onboarding
export const updateOnboarding = catchAsync(async (req, res) => {
  const onboardingData = { ...req.body, completed: true, completedAt: new Date() };

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { onboarding: onboardingData, hasCompletedOnboarding: true },
    { new: true, runValidators: true }
  );

  res.status(200).json({ success: true, user });
});

// @desc    Get onboarding answers (for the "edit later" flow)
// @route   GET /api/users/me/onboarding
export const getOnboarding = catchAsync(async (req, res) => {
  res.status(200).json({ success: true, onboarding: req.user.onboarding });
});

// @desc    Change password (local accounts only)
// @route   PUT /api/users/me/password
export const changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');
  if (user.authProvider !== 'local') {
    return next(new AppError('Password changes are not available for Google-linked accounts.', 400));
  }
  if (!(await user.comparePassword(currentPassword))) {
    return next(new AppError('Current password is incorrect.', 401));
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({ success: true, message: 'Password updated successfully.' });
});

// @desc    Get a snapshot of the user's activity for the profile page
// @route   GET /api/users/me/summary
export const getProfileSummary = catchAsync(async (req, res) => {
  const [analysisCount, reportCount, latestAnalyses] = await Promise.all([
    SkinAnalysis.countDocuments({ user: req.user._id }),
    MedicalReport.countDocuments({ user: req.user._id }),
    SkinAnalysis.find({ user: req.user._id }).sort('-createdAt').limit(5),
  ]);

  res.status(200).json({
    success: true,
    summary: {
      analysisCount,
      reportCount,
      memberSince: req.user.createdAt,
      latestAnalyses,
    },
  });
});

// @desc    Permanently delete the account and owned data
// @route   DELETE /api/users/me
export const deleteAccount = catchAsync(async (req, res) => {
  const userId = req.user._id;

  await Promise.all([
    SkinAnalysis.deleteMany({ user: userId }),
    MedicalReport.deleteMany({ user: userId }),
    User.findByIdAndDelete(userId),
  ]);

  res.clearCookie('refreshToken', { path: '/api/auth' });
  res.status(200).json({ success: true, message: 'Account and associated data deleted.' });
});
