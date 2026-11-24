import { pool } from '../config/db.js';

// Transaction: ekta kaj-er onek-gulo database step, shob hoy ba kichui hoy na.
// Majhkhane error hole ager shob step phire jay (rollback).
export async function withTransaction(callback) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}