import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema/index.js';
import pino from 'pino';

const logger = pino();

let pool: Pool | null = null;
let db: any = null;

export async function setupPostgres() {
  const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/vyoma';

  try {
    pool = new Pool({
      connectionString,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    // Test connection
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();

    db = drizzle(pool, { schema });
    
    logger.info('PostgreSQL connection established');
    return db;
  } catch (error) {
    logger.error('Failed to connect to PostgreSQL:', error);
    throw error;
  }
}

export function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call setupPostgres() first.');
  }
  return db;
}

export function getPool() {
  if (!pool) {
    throw new Error('Database pool not initialized. Call setupPostgres() first.');
  }
  return pool;
}

export { sql, eq, and, or, desc, asc, like, ilike, inArray, between } from 'drizzle-orm';
export * from './schema/index.js';
