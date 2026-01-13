const env = require('./config/env')
const createApp = require('./app')
const logger = require('./utils/logger')
const { pool } = require('./db/client')

async function start() {
    const app = createApp()

    const server = app.listen(env.PORT, () => {
        logger.info(
            {
                port: env.PORT,
                env: env.NODE_ENV,
            },
            'Server started'
        )
    })

    const shutdown = async signal => {
        logger.info({ signal }, 'Shutting down...')
        server.close(async () => {
            await pool.end()
            process.exit(0)
        })
    }

    process.on('SIGTERM', shutdown)
    process.on('SIGINT', shutdown)
}

start().catch(err => {
    logger.fatal({ err }, 'Failed to start server')
    process.exit(1)
})