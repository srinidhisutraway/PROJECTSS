import express from 'express';
import * as controller from '../controllers/adminController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, restrictTo('admin'));

router.get('/dashboard', controller.getDashboardStats);

router.get('/users', controller.getUsers);
router.patch('/users/:id', controller.updateUser);
router.delete('/users/:id', controller.deleteUser);

router.get('/analyses', controller.getAllAnalyses);
router.get('/reports', controller.getAllReports);

router.post('/articles', controller.createArticle);
router.patch('/articles/:id', controller.updateArticle);
router.delete('/articles/:id', controller.deleteArticle);

router.get('/quizzes', controller.getAllQuizzes);
router.post('/quizzes', controller.createQuiz);
router.patch('/quizzes/:id', controller.updateQuiz);
router.delete('/quizzes/:id', controller.deleteQuiz);

router.get('/logs', controller.getSystemLogs);

export default router;
