const { z } = require('zod')
const bcrypt = require('bcrypt')
const authService = require('../../services/authService')
const { signToken } = require('../../auth/auth')

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  displayName: z.string().min(1),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

async function register(req, res, next) {
  try {
    const data = registerSchema.parse(req.body)
    const user = await authService.register(data)
    const token = signToken({ id: user.id, email: user.email })
    res.status(201).json({ token, user })
  } catch (err) {
    next(err)
  }
}

async function login(req, res, next) {
  try {
    const data = loginSchema.parse(req.body)
    const user = await authService.findByEmail(data.email)
    if (!user) {
      return res.status(401).json({ error: { message: 'Invalid credentials' } })
    }

    const ok = await bcrypt.compare(data.password, user.password)
    if (!ok) {
      return res.status(401).json({ error: { message: 'Invalid credentials' } })
    }

    const token = signToken({ id: user.id, email: user.email })
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
      },
    })
  } catch (err) {
    next(err)
  }
}

module.exports = { register, login }
