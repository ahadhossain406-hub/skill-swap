import { body } from 'express-validator';

export const createReviewRules = [
  body('sessionId').isInt({ min: 1 }).withMessage('sessionId must be a valid session id.'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be a whole number from 1 to 5.'),
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage('Comment must be 300 characters or less.'),
];