import express from 'express';
import * as controller from '../controllers/quizController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', controller.getQuizzes);
router.get('/history/me', controller.getMyHistory);
router.get('/leaderboard', controller.getLeaderboard);
router.get('/:id', controller.getQuizById);
router.post('/:id/attempt', controller.submitAttempt);

export default router;
