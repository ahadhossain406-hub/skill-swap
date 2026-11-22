import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import mysql from 'mysql2/promise';

// Ei script database-er naksha (schema.sql) chalay.
// Mac ar Windows duitei kaj kore, "mysql" command-er dorkar nai.
// Root user diye connect kore, karon database ar user banate root lage.
const host = process.env.DB_HOST || 'localhost';
const port = Number(process.env.DB_PORT) || 3306;
const user = process.env.DB_ROOT_USER || 'root';
const password = process.env.DB_ROOT_PASSWORD || '';

async function setup() {
  const sql = await readFile(new URL('./schema.sql', import.meta.url), 'utf8');

  const connection = await mysql.createConnection({
    host,
    port,
    user,
    password,
    multipleStatements: true, // ekshathe onek SQL statement chalate dey
  });

  try {
    await connection.query(sql);
    console.log('✅ Database schema created (skillswap database + 15 tables).');
  } finally {
    await connection.end();
  }
}

setup().catch((error) => {
  console.error('❌ Could not create the database:', error.message);
  if (error.code === 'ER_ACCESS_DENIED_ERROR') {
    console.error('Hint: MySQL root password thik na. .env file-e DB_ROOT_PASSWORD set koro.');
  }
  if (error.code === 'ECONNREFUSED') {
    console.error('Hint: MySQL server chalu nai.');
  }
  process.exit(1);
});