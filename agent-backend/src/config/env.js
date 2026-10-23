import dotenv from 'dotenv';
dotenv.config();

const required = ['MONGODB_URI', 'JWT_SECRET'];
export function validateEnv() {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  if (process.env.JWT_SECRET.length < 32 || /replace|example|change-me/i.test(process.env.JWT_SECRET)) throw new Error('Set JWT_SECRET to a random secret of at least 32 characters; do not use the example value.');
}
