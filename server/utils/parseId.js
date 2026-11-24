import AppError from './AppError.js';

// URL theke ashe "5" (string). Eta thik number kina dekhe number-e bodlay.
// Number na hole 404 dey (database-e "NaN" pathano jabe na).
export function parseId(value, label = 'Item') {
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1) {
    throw new AppError(`${label} not found.`, 404);
  }
  return id;
}