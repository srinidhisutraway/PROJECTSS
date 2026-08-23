import express from 'express';
import * as controller from '../controllers/reportController.js';
import { protect } from '../middleware/auth.js';
import { uploadReport } from '../middleware/upload.js';

const router = express.Router();

router.use(protect);

router.post('/', uploadReport.single('file'), controller.uploadReport);
router.get('/', controller.getReports);
router.get('/:id', controller.getReportById);
router.delete('/:id', controller.deleteReport);

export default router;
