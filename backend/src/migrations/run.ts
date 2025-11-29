import { pool } from '../db';
import fs from 'fs';
import path from 'path';

async function run() {
  const migrationsDir = path.join(__dirname);
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    console.log('Running', file);
    await pool.query(sql);
  }
  console.log('Migrations complete');
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
