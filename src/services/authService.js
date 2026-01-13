const bcrypt = require('bcrypt')
const { SQL, query } = require('../db/client')

async function register({ email, password, displayName }) {
  const hash = await bcrypt.hash(password, 10)

  const { rows } = await query(SQL`
    INSERT INTO "User"(email, password, "displayName")
    VALUES (${email}, ${hash}, ${displayName})
    RETURNING id, email, "displayName"
  `)

  return rows[0]
}

async function findByEmail(email) {
  const { rows } = await query(SQL`
    SELECT id, email, password, "displayName"
    FROM "User"
    WHERE email = ${email}
    LIMIT 1
  `)
  return rows[0] || null
}

module.exports = { register, findByEmail }
