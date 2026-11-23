import { Router } from 'express';
import { listMatches } from '../controllers/matchController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, listMatches);

export default router;