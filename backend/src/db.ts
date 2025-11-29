import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  user: process.env.DB_USER || 'qaisu',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'iCoachie',
  password: process.env.DB_PASS || '',
  port: Number(process.env.DB_PORT || 5432),
});

export default pool;
