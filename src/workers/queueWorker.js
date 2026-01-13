const { Worker } = require('bullmq')
const logger = require('../utils/logger')
const { connection } = require('./queue')

const worker = new Worker(
  'order-events',
  async (job) => {
    if (job.name === 'order.created') {
      const { orderId, orderNumber, email } = job.data

      // Giả lập gửi email
      logger.info(
        {
          orderId,
          orderNumber,
          email,
        },
        'Sending order confirmation email'
      )

      // simulate async work
      // eslint-disable-next-line promise/param-names
      await new Promise((r) => setTimeout(r, 500))

      logger.info(
        {
          orderId,
        },
        'Order confirmation email sent'
      )
    }
  },
  { connection }
)

worker.on('completed', (job) => {
  logger.info({ jobId: job.id }, 'Job completed')
})

worker.on('failed', (job, err) => {
  logger.error({ jobId: job?.id, err }, 'Job failed')
})

logger.info('Queue worker started')
