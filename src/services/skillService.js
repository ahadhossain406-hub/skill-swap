import { skills, categories } from '../data/skills';

// Part 3-e ei duita function backend theke data anbe.
// Baki app-er code change korte hobe na.
export async function getAllSkills() {
  return skills;
}

export async function getCategories() {
  return categories;
}