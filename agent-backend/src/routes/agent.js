import { Router } from 'express';
import { optionalAuth } from '../middleware/authMiddleware.js';
import { chat } from '../controllers/aiController.js';
const router = Router();
router.post('/chat', optionalAuth, chat);
export default router;
