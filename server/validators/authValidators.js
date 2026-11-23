import { body } from 'express-validator';

// Validator = request-er data thik kina check korar niyom.
export const registerRules = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters.'),
  body('email')
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage('Enter a valid email address.')
    .isLength({ max: 150 })
    .withMessage('Email is too long.'),
  // bcrypt shudhu prothom 72 byte dhore, tai max 72.
  body('password')
    .isLength({ min: 6, max: 72 })
    .withMessage('Password must be between 6 and 72 characters.'),
];

export const loginRules = [
  body('email').trim().toLowerCase().isEmail().withMessage('Enter a valid email address.'),
  body('password').notEmpty().withMessage('Password is required.'),
];