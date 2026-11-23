import { validationResult } from 'express-validator';
import AppError from '../utils/AppError.js';

// Validation rule gulo cholar por ei middleware dekhe kono bhul ache kina.
// Bhul thakle 400 diye prothom error-ta pathay.
export function validate(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  next(new AppError(result.array()[0].msg, 400));
}