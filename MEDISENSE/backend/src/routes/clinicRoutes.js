import express from 'express';
import * as controller from '../controllers/clinicController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/nearby', controller.getNearbyClinics);

export default router;
