import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';
import { sendAuthResponse, generateAccessToken, verifyRefreshToken } from '../utils/generateTokens.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/emailService.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Register a new user
// @route   POST /api/auth/signup
export const signup = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return next(new AppError('An account with this email already exists.', 409));
  }

  const user = await User.create({ name, email, password, authProvider: 'local' });

  const verificationToken = user.generateEmailVerificationToken();
  await user.save({ validateBeforeSave: false });

  await sendVerificationEmail(user.email, user.name, verificationToken).catch((err) =>
    console.error('[Email] Verification email failed:', err.message)
  );

  sendAuthResponse(res, user, 201);
});

// @desc    Log in with email/password
// @route   POST /api/auth/login
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user || user.authProvider !== 'local' || !(await user.comparePassword(password))) {
    return next(new AppError('Incorrect email or password.', 401));
  }
  if (!user.isActive) {
    return next(new AppError('This account has been deactivated.', 403));
  }

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  sendAuthResponse(res, user);
});

// @desc    Log in / sign up with Google ID token
// @route   POST /api/auth/google
export const googleAuth = catchAsync(async (req, res, next) => {
  const { idToken } = req.body;
  if (!idToken) return next(new AppError('Google ID token is required.', 400));

  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  if (!payload?.email) return next(new AppError('Invalid Google token.', 401));

  let user = await User.findOne({ email: payload.email.toLowerCase() });

  if (user && user.authProvider === 'local') {
    // Link Google to an existing local account
    user.googleId = payload.sub;
    user.authProvider = 'local'; // keep local password login available too
    user.isEmailVerified = true;
  } else if (!user) {
    user = await User.create({
      name: payload.name || payload.email.split('@')[0],
      email: payload.email,
      googleId: payload.sub,
      authProvider: 'google',
      isEmailVerified: true,
      avatar: payload.picture ? { url: payload.picture, publicId: '' } : undefined,
    });
  }

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  sendAuthResponse(res, user);
});

// @desc    Verify email using token sent via email
// @route   GET /api/auth/verify-email/:token
export const verifyEmail = catchAsync(async (req, res, next) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() },
  });

  if (!user) return next(new AppError('Verification link is invalid or has expired.', 400));

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({ success: true, message: 'Email verified successfully.' });
});

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
export const resendVerification = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email?.toLowerCase() });
  if (!user) return next(new AppError('No account found with this email.', 404));
  if (user.isEmailVerified) {
    return res.status(200).json({ success: true, message: 'Email is already verified.' });
  }

  const token = user.generateEmailVerificationToken();
  await user.save({ validateBeforeSave: false });
  await sendVerificationEmail(user.email, user.name, token);

  res.status(200).json({ success: true, message: 'Verification email sent.' });
});

// @desc    Request a password reset link
// @route   POST /api/auth/forgot-password
export const forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email?.toLowerCase() });

  // Always respond 200 to avoid leaking which emails are registered
  if (!user || user.authProvider !== 'local') {
    return res.status(200).json({
      success: true,
      message: 'If an account exists for this email, a reset link has been sent.',
    });
  }

  const resetToken = user.generatePasswordResetToken();
  await user.save({ validateBeforeSave: false });

  try {
    await sendPasswordResetEmail(user.email, user.name, resetToken);
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError('Failed to send reset email. Please try again later.', 500));
  }

  res.status(200).json({
    success: true,
    message: 'If an account exists for this email, a reset link has been sent.',
  });
});

// @desc    Reset password using token
// @route   POST /api/auth/reset-password/:token
export const resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  }).select('+password');

  if (!user) return next(new AppError('Reset link is invalid or has expired.', 400));

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  sendAuthResponse(res, user);
});

// @desc    Get a new access token using the refresh token cookie
// @route   POST /api/auth/refresh
export const refreshAccessToken = catchAsync(async (req, res, next) => {
  const token = req.cookies?.refreshToken;
  if (!token) return next(new AppError('No refresh token provided.', 401));

  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch (err) {
    return next(new AppError('Invalid or expired session. Please log in again.', 401));
  }

  const user = await User.findById(decoded.id);
  if (!user || !user.isActive) return next(new AppError('User no longer exists.', 401));

  const accessToken = generateAccessToken(user._id, user.role);
  res.status(200).json({ success: true, accessToken, user });
});

// @desc    Log out (clears refresh cookie)
// @route   POST /api/auth/logout
export const logout = catchAsync(async (req, res) => {
  res.clearCookie('refreshToken', { path: '/api/auth' });
  res.status(200).json({ success: true, message: 'Logged out successfully.' });
});

// @desc    Get currently authenticated user
// @route   GET /api/auth/me
export const getMe = catchAsync(async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});
