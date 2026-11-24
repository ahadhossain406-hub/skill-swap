import { body } from 'express-validator';

export const createRequestRules = [
  body('toUserId').isInt({ min: 1 }).withMessage('toUserId must be a valid user id.'),
  body('offeredSkillId').isInt({ min: 1 }).withMessage('offeredSkillId must be a valid skill id.'),
  body('requestedSkillId')
    .isInt({ min: 1 })
    .withMessage('requestedSkillId must be a valid skill id.'),
  body('message')
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage('Message must be 300 characters or less.'),
];

export const respondRequestRules = [
  body('action')
    .isIn(['accept', 'decline', 'cancel'])
    .withMessage('action must be accept, decline or cancel.'),
];