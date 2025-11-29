import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Create a connection pool
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });

// Create the adapter
const adapter = new PrismaPg(pool);

// Create the Prisma client with the adapter
const prisma = new PrismaClient({ adapter });

// Legacy pool for existing WordPress tables
export const legacyPool = new Pool({
  user: process.env.DB_USER || 'qaisu',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'iCoachie',
  password: process.env.DB_PASS || '',
  port: Number(process.env.DB_PORT || 5432),
});

export default prisma;
