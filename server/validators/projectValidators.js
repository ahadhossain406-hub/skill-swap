import { body } from 'express-validator';

// Link khali ba http(s) diye shuru hote hobe.
const isEmptyOrUrl = (value) => {
  if (value !== '' && !/^https?:\/\/\S+$/i.test(value)) {
    throw new Error('Links must start with http:// or https://');
  }
  return true;
};

// Create ar edit, duitor-i ekoi niyom.
export const projectRules = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 80 })
    .withMessage('Title must be between 3 and 80 characters.'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 600 })
    .withMessage('Description must be between 10 and 600 characters.'),
  body('skillIds').isArray({ min: 1, max: 5 }).withMessage('Choose between 1 and 5 skills.'),
  body('skillIds.*').isInt({ min: 1 }).withMessage('Each skill must be a valid skill id.'),
  body('githubUrl').optional().trim().custom(isEmptyOrUrl),
  body('demoUrl').optional().trim().custom(isEmptyOrUrl),
];