const { query } = require('../../db/client')

async function health(req, res, next) {
    try {
        // simple DB check
        await query('SELECT 1')
        res.json({
            status: 'ok',
            uptime: process.uptime(),
            timestamp: Date.now(),
        })
    } catch (err) {
        next(err)
    }
}

module.exports = {
    health,
}