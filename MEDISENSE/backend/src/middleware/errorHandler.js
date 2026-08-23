/* eslint-disable no-unused-vars */

const handleCastError = (err) => `Invalid ${err.path}: ${err.value}`;

const handleDuplicateFieldError = (err) => {
  const field = Object.keys(err.keyValue || {})[0];
  return `An account with this ${field} already exists.`;
};

const handleValidationError = (err) =>
  Object.values(err.errors)
    .map((el) => el.message)
    .join('. ');

/**
 * Centralized Express error handler. Normalizes Mongoose/JWT errors into
 * clean, user-safe messages and hides stack traces in production.
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err, message: err.message };
  error.statusCode = err.statusCode || 500;

  if (err.name === 'CastError') {
    error.message = handleCastError(err);
    error.statusCode = 400;
  }
  if (err.code === 11000) {
    error.message = handleDuplicateFieldError(err);
    error.statusCode = 409;
  }
  if (err.name === 'ValidationError') {
    error.message = handleValidationError(err);
    error.statusCode = 400;
  }
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid authentication token. Please log in again.';
    error.statusCode = 401;
  }
  if (err.name === 'TokenExpiredError') {
    error.message = 'Your session has expired. Please log in again.';
    error.statusCode = 401;
  }

  if (process.env.NODE_ENV !== 'production') {
    console.error('[ERROR]', err);
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message || 'Something went wrong on the server.',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

export default errorHandler;
