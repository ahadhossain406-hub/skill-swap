import { Router } from 'express';
import {
  listNotifications,
  markAllRead,
  markRead,
} from '../controllers/notificationController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', listNotifications);
// "read-all" age rakhte hobe, na hole "/:id/read" er shathe gulie jay.
router.patch('/read-all', markAllRead);
router.patch('/:id/read', markRead);

export default router;