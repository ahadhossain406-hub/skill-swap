import mysql from 'mysql2/promise';
import { env } from './env.js';

// Pool = kichu database connection ager theke khola rakha.
// Protita request-e notun connection na khule pool theke ekta nei, kaj shesh hole fire dei.
export const pool = mysql.createPool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
  waitForConnections: true,
  connectionLimit: 10,
  timezone: 'Z', // shob shomoy UTC rakhi
  dateStrings: ['DATE'], // DATE column "2026-11-25" string hishebe ashbe
});