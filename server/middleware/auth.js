import AppError from '../utils/AppError.js';
import { verifyToken } from '../utils/token.js';

// Je route-e login lage, tar age ei middleware boshe.
// Frontend protita request-e header-e token pathabe:
//   Authorization: Bearer <token>
export function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(new AppError('Please log in to continue.', 401));
  }

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.id, role: payload.role }; // porer function-gulo req.user pabe
    next();
  } catch {
    next(new AppError('Your session has expired. Please log in again.', 401));
  }
}