import express from 'express';
import * as userController from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { uploadAvatar } from '../middleware/upload.js';
import { validate } from '../validators/authValidators.js';
import { onboardingRules, changePasswordRules } from '../validators/userValidators.js';

const router = express.Router();

router.use(protect); // every route below requires auth

router.get('/me', userController.getProfile);
router.patch('/me', userController.updateProfile);
router.delete('/me', userController.deleteAccount);
router.get('/me/summary', userController.getProfileSummary);

router.post('/me/avatar', uploadAvatar.single('avatar'), userController.updateAvatar);

router.get('/me/onboarding', userController.getOnboarding);
router.put('/me/onboarding', onboardingRules, validate, userController.updateOnboarding);

router.put('/me/password', changePasswordRules, validate, userController.changePassword);

export default router;
