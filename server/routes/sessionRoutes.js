import { Router } from 'express';
import {
  createSession,
  listSessions,
  updateSession,
} from '../controllers/sessionController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createSessionRules, updateSessionRules } from '../validators/sessionValidators.js';

const router = Router();

router.use(authenticate);

router.get('/', listSessions);
router.post('/', createSessionRules, validate, createSession);
router.patch('/:id', updateSessionRules, validate, updateSession);

export default router;