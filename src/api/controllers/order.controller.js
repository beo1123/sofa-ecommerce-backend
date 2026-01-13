const { z } = require('zod')
const orderService = require('../../services/orderService')

const schema = z.object({
  items: z
    .array(
      z.object({
        variantId: z.string().uuid(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1),
  recipient: z.object({
    name: z.string().min(1),
    phone: z.string().min(6),
    email: z.string().email().optional(),
    line1: z.string().min(1),
    city: z.string().min(1),
    province: z.string().min(1),
  }),
  paymentMethod: z.string().min(1),
})

async function create(req, res, next) {
  try {
    const data = schema.parse(req.body)
    const order = await orderService.createOrder(data)
    res.status(201).json(order)
  } catch (err) {
    next(err)
  }
}

module.exports = { create }
