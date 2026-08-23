import express from 'express';
import * as controller from '../controllers/conditionController.js';

const router = express.Router();

router.get('/', controller.getConditions);
router.get('/meta/categories', controller.getConditionCategories);
router.get('/:slug', controller.getConditionBySlug);

export default router;
