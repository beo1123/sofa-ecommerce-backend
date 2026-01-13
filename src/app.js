const express = require('express')
const healthRoutes = require('./api/routes/health.routes')
const errorHandler = require('./api/middlewares/errorHandler')
const logger = require('./utils/logger')

function createApp() {
  const app = express()

  app.use(express.json())

  // basic request logging
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

  // 404
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