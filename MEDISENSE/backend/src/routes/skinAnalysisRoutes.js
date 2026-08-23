import express from 'express';
import * as controller from '../controllers/skinAnalysisController.js';
import { protect } from '../middleware/auth.js';
import { uploadSkinImage } from '../middleware/upload.js';

const router = express.Router();

router.use(protect);

router.post('/', uploadSkinImage.single('image'), controller.analyzeImage);
router.get('/', controller.getHistory);
router.get('/analytics/summary', controller.getAnalytics);
router.get('/:id', controller.getAnalysisById);
router.patch('/:id', controller.updateAnalysisNotes);
router.delete('/:id', controller.deleteAnalysis);

export default router;
