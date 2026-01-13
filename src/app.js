const express = require('express')
const healthRoutes = require('./api/routes/health.routes')
const productRoutes = require('./api/routes/product.routes')
const orderRoutes = require('./api/routes/order.routes')
const authRoutes = require('./api/routes/auth.routes')

const errorHandler = require('./api/middlewares/errorHandler')
const logger = require('./utils/logger')

function createApp() {
  const app = express()

  app.use(express.json())

  app.use((req, _res, next) => {
    logger.info(
      {
        method: req.method,
        path: req.path,
      },
      'Incoming request'
    )
    next()
  })

  app.use('/api', healthRoutes)
  app.use('/api', productRoutes)
  app.use('/api', orderRoutes)
  app.use('/api', authRoutes)

  app.use((req, res) => {
    res.status(404).json({
      error: {
        message: 'Not Found',
      },
    })
  })

  app.use(errorHandler)

  return app
}

module.exports = createApp
