import { body } from 'express-validator';

const DURATIONS = [30, 45, 60, 90, 120];

export const createSessionRules = [
  body('requestId').isInt({ min: 1 }).withMessage('requestId must be a valid request id.'),
  body('skillId').isInt({ min: 1 }).withMessage('skillId must be a valid skill id.'),
  body('date')
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('date must be in YYYY-MM-DD format.'),
  body('time')
    .matches(/^([01]\d|2[0-3]):[0-5]\d$/)
    .withMessage('time must be in HH:MM format (24 hour).'),
  body('durationMins')
    .isIn(DURATIONS)
    .withMessage(`durationMins must be one of: ${DURATIONS.join(', ')}.`),
  body('mode').isIn(['online', 'in-person']).withMessage('mode must be online or in-person.'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage('Location must be 150 characters or less.'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Notes must be 200 characters or less.'),
];

export const updateSessionRules = [
  body('action').isIn(['complete', 'cancel']).withMessage('action must be complete or cancel.'),
];