const { SQL, query } = require('../db/client')

async function getBySlug(slug) {
  const { rows } = await query(SQL`
    SELECT p.*,
      json_agg(
        json_build_object(
          'id', v.id,
          'name', v.name,
          'price', v.price,
          'skuPrefix', v."skuPrefix",
          'colorName', v."colorName",
          'material', v.material
        )
      ) FILTER (WHERE v.id IS NOT NULL) AS variants
    FROM "Product" p
    LEFT JOIN "ProductVariant" v ON v."productId" = p.id
    WHERE p.slug = ${slug}
      AND p.status = 'PUBLISHED'
    GROUP BY p.id
    LIMIT 1
  `)

  return rows[0] || null
}

async function list({ page = 1, limit = 20 }) {
  const offset = (page - 1) * limit

  const { rows } = await query(SQL`
    SELECT id, title, slug, "shortDescription", "createdAt"
    FROM "Product"
    WHERE status = 'PUBLISHED'
    ORDER BY "createdAt" DESC
    LIMIT ${limit} OFFSET ${offset}
  `)

  return rows
}

module.exports = {
  getBySlug,
  list,
}
