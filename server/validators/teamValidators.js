import { body } from 'express-validator';

export const commentRules = [
  body('text')
    .trim()
    .isLength({ min: 1, max: 300 })
    .withMessage('Comment must be between 1 and 300 characters.'),
];

export const memberRules = [
  body('userId').isInt({ min: 1 }).withMessage('userId must be a valid user id.'),
  body('role')
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage('Role must be 30 characters or less.'),
];

export const contributionRules = [
  body('description')
    .trim()
    .isLength({ min: 3, max: 150 })
    .withMessage('Description must be between 3 and 150 characters.'),
  body('hours').isFloat({ min: 0.5, max: 24 }).withMessage('Hours must be between 0.5 and 24.'),
];