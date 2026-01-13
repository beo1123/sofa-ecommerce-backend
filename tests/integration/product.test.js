const request = require('supertest')
const createApp = require('../../src/app')

let app

beforeAll(() => {
  app = createApp()
})

describe('GET /api/products/:slug', () => {
  it('returns product by slug', async () => {
    const res = await request(app).get('/api/products/modern-sofa')

    expect(res.statusCode).toBe(200)
    expect(res.body.slug).toBe('modern-sofa')
    expect(Array.isArray(res.body.variants)).toBe(true)
  })

  it('returns 404 for unknown slug', async () => {
    const res = await request(app).get('/api/products/not-exist')
    expect(res.statusCode).toBe(404)
  })
})
