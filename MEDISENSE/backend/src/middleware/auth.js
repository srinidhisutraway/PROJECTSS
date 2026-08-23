import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';
import { verifyAccessToken } from '../utils/generateTokens.js';

/**
 * Protects a route: requires a valid Bearer access token.
 * Attaches the authenticated user to req.user.
 */
export const protect = catchAsync(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in. Please log in to continue.', 401));
  }

  const decoded = verifyAccessToken(token);

  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new AppError('The user belonging to this token no longer exists.', 401));
  }
  if (!user.isActive) {
    return next(new AppError('This account has been deactivated.', 403));
  }

  req.user = user;
  next();
});

/**
 * Restricts a route to specific roles, e.g. restrictTo('admin').
 * Must be used after `protect`.
 */
export const restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action.', 403));
    }
    next();
  };
