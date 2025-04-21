// lib/db.ts
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  user: 'karan',
  host: 'localhost',
  database: 'karan',
  password: 'thakur',
  port: 5432,
});

export const db = pool;