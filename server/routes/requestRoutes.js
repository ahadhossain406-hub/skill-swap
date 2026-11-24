import { Router } from 'express';
import {
  createRequest,
  listRequests,
  respondToRequest,
} from '../controllers/requestController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createRequestRules, respondRequestRules } from '../validators/requestValidators.js';

const router = Router();

router.use(authenticate);

router.get('/', listRequests);
router.post('/', createRequestRules, validate, createRequest);
router.patch('/:id', respondRequestRules, validate, respondToRequest);

export default router;