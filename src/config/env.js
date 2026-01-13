const dotenv = require('dotenv')

dotenv.config()

function required(name) {
    const v = process.env[name]
    if (!v) {
        throw new Error(`Missing required env: ${name}`)
    }
    return v
}

const env = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: Number(process.env.PORT || 3000),

    DATABASE_URL: required('DATABASE_URL'),
    REDIS_URL: required('REDIS_URL'),

    JWT_SECRET: required('JWT_SECRET'),
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',

    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
}

module.exports = env
