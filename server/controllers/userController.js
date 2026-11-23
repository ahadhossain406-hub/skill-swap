import * as userService from '../services/userService.js';
import AppError from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listUsers = asyncHandler(async (req, res) => {
  res.json({ users: await userService.getAllUsers() });
});

export const getUser = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const user = Number.isInteger(id) ? await userService.getUserById(id) : null;

  // Admin-er profile onner kache lukano.
  if (!user || (user.role === 'admin' && user.id !== req.user.id)) {
    throw new AppError('User not found.', 404);
  }
  res.json({ user });
});

export const updateMe = asyncHandler(async (req, res) => {
  // Shudhu ei field gulo bodlano jabe. email, password, role na.
  const { name, bio, location, teaches, learns } = req.body;
  const user = await userService.updateProfile(req.user.id, {
    name,
    bio,
    location,
    teaches,
    learns,
  });
  res.json({ user });
});