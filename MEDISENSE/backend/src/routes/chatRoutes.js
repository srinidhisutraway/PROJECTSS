import express from 'express';
import * as controller from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', controller.getConversations);
router.post('/', controller.createConversation);
router.get('/:id', controller.getConversation);
router.post('/:id/messages', controller.sendMessage);
router.delete('/:id', controller.deleteConversation);

export default router;
