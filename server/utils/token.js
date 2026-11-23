import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

// Login-er por user-ke ekta token dei. Token-e user-er id ar role lekha thake,
// ar server-er secret diye "shil" (signature) kora thake, jate keu jal korte na pare.
export function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
}

// Token asol kina dekhe. Jal ba expired hole error throw kore.
export function verifyToken(token) {
  return jwt.verify(token, env.jwtSecret);
}