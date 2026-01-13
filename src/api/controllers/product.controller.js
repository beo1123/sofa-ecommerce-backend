const { z } = require('zod')
const productService = require('../../services/productService')
const redis = require('../../cache/redis')

const slugSchema = z.object({
  slug: z.string().min(1),
})

async function getBySlug(req, res, next) {
  try {
    const { slug } = slugSchema.parse(req.params)
    const cacheKey = `product:${slug}`

    const cached = await redis.get(cacheKey)
    if (cached) {
      return res.json(JSON.parse(cached))
    }

    const product = await productService.getBySlug(slug)
    if (!product) {
      return res.status(404).json({ error: { message: 'Product not found' } })
    }

    await redis.set(cacheKey, JSON.stringify(product), 'EX', 60)

    res.json(product)
  } catch (err) {
    next(err)
  }
}

async function list(req, res, next) {
  try {
    const page = Number(req.query.page || 1)
    const limit = Number(req.query.limit || 20)

    const items = await productService.list({ page, limit })

    res.json({
      page,
      limit,
      items,
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getBySlug,
  list,
}
