import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

// Create the Prisma client
const prisma = new PrismaClient();

export default prisma;
