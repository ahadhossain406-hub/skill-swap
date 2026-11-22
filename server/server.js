import app from './app.js';
import { pool } from './config/db.js';
import { env } from './config/env.js';

async function start() {
  // Server chalu korar age database connect hocche kina dekhi.
  try {
    await pool.query('SELECT 1');
    console.log('✅ Connected to MySQL database');
  } catch (error) {
    console.error('❌ Could not connect to MySQL:', error.message);
    process.exit(1);
  }

  app.listen(env.port, () => {
    console.log(`🚀 Server running on http://localhost:${env.port}`);
  });
}

start();