const { Queue } = require('bullmq')
const env = require('../config/env')

const connection = {
  url: env.REDIS_URL,
}

const orderQueue = new Queue('order-events', { connection })

module.exports = { orderQueue, connection }
