# FILE: migrate.sh
#!/usr/bin/env bash
set -e

echo "Running migrations..."

node - <<'EOF'
const { Client } = require('pg')
const fs = require('fs')
const path = require('path')

const url = process.env.DATABASE_URL
if (!url) {
  console.error('DATABASE_URL is not set')
  process.exit(1)
}

async function run() {
  const client = new Client({ connectionString: url })
  await client.connect()

  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id TEXT PRIMARY KEY,
      executed_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `)

  const dir = path.join(process.cwd(), 'src/db/migrations')
  if (!fs.existsSync(dir)) {
    console.log('No migrations directory, skipping.')
    await client.end()
    return
  }

  const files = fs
    .readdirSync(dir)
    .filter(f => f.endsWith('.sql'))
    .sort()

  for (const file of files) {
    const id = file
    const { rowCount } = await client.query(
      'SELECT 1 FROM schema_migrations WHERE id = $1',
      [id]
    )
    if (rowCount) {
      console.log(`- ${id} already applied`)
      continue
    }

    console.log(`- applying ${id}`)
    const sql = fs.readFileSync(path.join(dir, file), 'utf8')
    await client.query('BEGIN')
    try {
      await client.query(sql)
      await client.query(
        'INSERT INTO schema_migrations (id) VALUES ($1)',
        [id]
      )
      await client.query('COMMIT')
    } catch (e) {
      await client.query('ROLLBACK')
      throw e
    }
  }

  await client.end()
  console.log('Migrations complete.')
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
EOF
