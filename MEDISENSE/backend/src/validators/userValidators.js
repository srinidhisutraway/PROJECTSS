import { body } from 'express-validator';

export const onboardingRules = [
  body('ageGroup').optional().isIn(['13-17', '18-24', '25-34', '35-44', '45-54', '55+']),
  body('gender').optional().isIn(['male', 'female', 'non-binary', 'prefer-not-to-say']),
  body('skinType').optional().isIn(['dry', 'oily', 'combination', 'normal', 'sensitive']),
  body('mainConcerns').optional().isArray(),
  body('waterIntakeLiters').optional().isFloat({ min: 0, max: 10 }),
  body('sleepHours').optional().isFloat({ min: 0, max: 14 }),
  body('dailySunExposureHours').optional().isFloat({ min: 0, max: 24 }),
  body('wantsReminders').optional().isBoolean(),
];

export const changePasswordRules = [
  body('currentPassword').notEmpty().withMessage('Current password is required.'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters.')
    .matches(/\d/)
    .withMessage('New password must contain at least one number.'),
];
