import { Router } from 'express';
import {
  createReview,
  getSessionReview,
  listUserReviews,
} from '../controllers/reviewController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createReviewRules } from '../validators/reviewValidators.js';

const router = Router();

router.use(authenticate);

router.get('/user/:userId', listUserReviews);
router.get('/session/:sessionId', getSessionReview);
router.post('/', createReviewRules, validate, createReview);

export default router;