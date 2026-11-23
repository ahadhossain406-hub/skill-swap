import { body } from 'express-validator';

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

// Profile update-er shob field optional: jeta pathabe shudhu seta check hobe.
export const updateProfileRules = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters.'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Bio must be 200 characters or less.'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location must be 100 characters or less.'),
  body('teaches').optional().isArray({ max: 30 }).withMessage('teaches must be a list.'),
  body('teaches.*.skillId').isInt({ min: 1 }).withMessage('Each skill to teach needs a valid skillId.'),
  body('teaches.*.level')
    .isIn(LEVELS)
    .withMessage('Level must be Beginner, Intermediate or Advanced.'),
  body('learns').optional().isArray({ max: 30 }).withMessage('learns must be a list.'),
  body('learns.*').isInt({ min: 1 }).withMessage('Each skill to learn must be a valid skill id.'),
];