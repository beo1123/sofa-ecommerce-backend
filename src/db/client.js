// FILE: src/db/client.js
const { Pool } = require('pg')
const SQL = require('sql-template-strings')
const env = require('../config/env')
const logger = require('../utils/logger')

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
})

async function query(sql, params = []) {
  const start = Date.now()
  try {
    const res = await pool.query(sql, params)
    const ms = Date.now() - start

    if (ms > 200) {
      logger.warn(
        {
          duration_ms: ms,
          rowCount: res.rowCount,
          sql: sql.toString?.() || sql,
        },
        'Slow query'
      )
    } else {
      logger.debug(
        {
          duration_ms: ms,
          rowCount: res.rowCount,
        },
        'Query executed'
      )
    }

    return res
  } catch (err) {
    logger.error(
      {
        err,
        sql: sql.toString?.() || sql,
      },
      'Query failed'
    )
    throw err
  }
}

/**
 * Run a function inside a DB transaction.
 *
 * Usage:
 *   return transaction(async (tx) => {
 *     await tx.query(...)
 *     await tx.query(...)
 *   })
 */
async function transaction(fn) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const tx = {
      query: async (sql, params = []) => {
        const start = Date.now()
        try {
          const res = await client.query(sql, params)
          const ms = Date.now() - start

          if (ms > 200) {
            logger.warn(
              {
                duration_ms: ms,
                rowCount: res.rowCount,
                sql: sql.toString?.() || sql,
              },
              'Slow tx query'
            )
          }

          return res
        } catch (err) {
          logger.error(
            {
              err,
              sql: sql.toString?.() || sql,
            },
            'Tx query failed'
          )
          throw err
        }
      },
    }

    const result = await fn(tx)
    await client.query('COMMIT')
    return result
  } catch (err) {
    try {
      await client.query('ROLLBACK')
    } catch (rollbackErr) {
      logger.error({ err: rollbackErr }, 'Rollback failed')
    }
    throw err
  } finally {
    client.release()
  }
}

module.exports = {
  SQL,
  query,
  transaction,
  pool,
}
