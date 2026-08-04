const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required. Apply db/schema.sql before starting the API.');
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : undefined });
module.exports = { query: (text, params) => pool.query(text, params), connect: () => pool.connect() };
