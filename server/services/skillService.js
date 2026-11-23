import { pool } from '../config/db.js';

// Skill-er list category-r nam shoho. Join = duita table jora.
export async function getAllSkills() {
  const [rows] = await pool.query(
    `SELECT s.id, s.name, c.name AS category
     FROM skills s
     JOIN categories c ON c.id = s.category_id
     ORDER BY s.id`
  );
  return rows;
}

export async function getCategories() {
  const [rows] = await pool.query('SELECT name FROM categories ORDER BY id');
  return rows.map((row) => row.name);
}