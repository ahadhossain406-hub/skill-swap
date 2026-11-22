import 'dotenv/config';

// Dorkari setting na thakle shuruteii bondho kore dai, jate pore ajana error na ashe.
const required = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'JWT_SECRET'];
const missing = required.filter((name) => !process.env[name]);

if (missing.length > 0) {
  console.error(`Missing environment variables: ${missing.join(', ')}. Check your .env file.`);
  process.exit(1);
}

export const env = {
  port: Number(process.env.PORT) || 4000,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  db: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
};