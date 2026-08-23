import express from 'express';
import rateLimit from 'express-rate-limit';
import * as authController from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import {
  validate,
  signupRules,
  loginRules,
  forgotPasswordRules,
  resetPasswordRules,
} from '../validators/authValidators.js';

const router = express.Router();

// Stricter limiter for auth endpoints to slow down brute-force / spam
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/signup', authLimiter, signupRules, validate, authController.signup);
router.post('/login', authLimiter, loginRules, validate, authController.login);
router.post('/google', authLimiter, authController.googleAuth);
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/resend-verification', authLimiter, authController.resendVerification);
router.post('/forgot-password', authLimiter, forgotPasswordRules, validate, authController.forgotPassword);
router.post('/reset-password/:token', authLimiter, resetPasswordRules, validate, authController.resetPassword);
router.post('/refresh', authController.refreshAccessToken);
router.post('/logout', authController.logout);
router.get('/me', protect, authController.getMe);

export default router;
