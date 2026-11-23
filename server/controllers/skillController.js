import * as skillService from '../services/skillService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listSkills = asyncHandler(async (req, res) => {
  res.json({ skills: await skillService.getAllSkills() });
});

export const listCategories = asyncHandler(async (req, res) => {
  res.json({ categories: await skillService.getCategories() });
});