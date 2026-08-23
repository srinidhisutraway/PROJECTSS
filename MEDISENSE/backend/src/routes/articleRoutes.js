import express from 'express';
import * as controller from '../controllers/articleController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public reads (articles are educational content, no auth required to browse)
router.get('/', controller.getArticles);
router.get('/meta/categories', controller.getCategories);

// Auth required below
router.get('/me/bookmarks', protect, controller.getBookmarks);
router.post('/:id/bookmark', protect, controller.toggleBookmark);

// Slug route last so it doesn't swallow the routes above
router.get('/:slug', controller.getArticleBySlug);

export default router;
