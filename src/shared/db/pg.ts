/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema.js'; // Import schema để có autocomplete tốt hơn

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 2_000,
});
export const db = drizzle(pool, { schema });
