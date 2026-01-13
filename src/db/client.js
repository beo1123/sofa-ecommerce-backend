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

async function query(sql) {
  const start = Date.now()
  try {
    const res = await pool.query(sql)
    const ms = Date.now() - start

    if (ms > 200) {
      logger.warn(
        {
          duration_ms: ms,
          rowCount: res.rowCount,
          sql: sql.toString?.() || String(sql),
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
        sql: sql.toString?.() || String(sql),
      },
      'Query failed'
    )
    throw err
  }
}

async function transaction(fn) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const tx = {
      query: async (sql) => {
        const start = Date.now()
        try {
          const res = await client.query(sql)
          const ms = Date.now() - start

          if (ms > 200) {
            logger.warn(
              {
                duration_ms: ms,
                rowCount: res.rowCount,
                sql: sql.toString?.() || String(sql),
              },
              'Slow tx query'
            )
          }

          return res
        } catch (err) {
          logger.error(
            {
              err,
              sql: sql.toString?.() || String(sql),
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
