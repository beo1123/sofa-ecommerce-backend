import { pool } from './pg.js';
import { drizzle } from 'drizzle-orm/node-postgres';

export async function withTransaction<T>(
  fn: (tx: ReturnType<typeof drizzle>) => Promise<T>,
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const tx = drizzle(client);
    const result = await fn(tx);
    await client.query('COMMIT');
    return result;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}
