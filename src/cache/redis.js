const Redis = require('ioredis')
const env = require('../config/env')
const logger = require('../utils/logger')

const redis = new Redis(env.REDIS_URL)

redis.on('connect', () => {
  logger.info('Redis connected')
})

redis.on('error', err => {
  logger.error({ err }, 'Redis error')
})

module.exports = redis
