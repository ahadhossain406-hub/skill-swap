import * as authService from '../services/authService.js';
import * as userService from '../services/userService.js';
import AppError from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Controller: request theke data ne, service-ke kaj dey, response pathay.
export const register = asyncHandler(async (req, res) => {
  // Shudhu ei 3-ta field nei. role ityadi keu pathaleo grohon korbo na.
  const { name, email, password } = req.body;
  const result = await authService.register({ name, email, password });
  res.status(201).json(result);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  res.json(await authService.login({ email, password }));
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.user.id, { includeEmail: true });
  if (!user) throw new AppError('User not found.', 404);
  res.json({ user });
});