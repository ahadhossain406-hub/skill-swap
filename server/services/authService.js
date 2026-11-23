import bcrypt from 'bcrypt';
import { pool } from '../config/db.js';
import AppError from '../utils/AppError.js';
import { signToken } from '../utils/token.js';
import { getUserById } from './userService.js';

const SALT_ROUNDS = 10;
const AVATAR_COLORS = [
  '#6366f1', '#0ea5e9', '#10b981', '#f59e0b',
  '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6',
];

export async function register({ name, email, password }) {
  const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
  if (existing.length > 0) {
    throw new AppError('An account with this email already exists.', 409);
  }

  // Password kokhono plain text-e save hoy na. Hash kore save kori.
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const avatarColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];

  const [result] = await pool.query(
    'INSERT INTO users (name, email, password_hash, avatar_color) VALUES (?, ?, ?, ?)',
    [name, email, passwordHash, avatarColor]
  );

  const user = await getUserById(result.insertId, { includeEmail: true });
  return { token: signToken(user), user };
}

export async function login({ email, password }) {
  const [rows] = await pool.query('SELECT id, password_hash FROM users WHERE email = ?', [email]);
  const found = rows[0];

  // Email na thakle ba password vul hole eki message,
  // jate keu bujhte na pare kon email registered.
  const passwordOk = found ? await bcrypt.compare(password, found.password_hash) : false;
  if (!passwordOk) {
    throw new AppError('Invalid email or password.', 401);
  }

  const user = await getUserById(found.id, { includeEmail: true });
  return { token: signToken(user), user };
}