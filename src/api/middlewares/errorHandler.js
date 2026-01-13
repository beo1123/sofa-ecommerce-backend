const logger = require('../../utils/logger')

function errorHandler(err, req, res, _next) {
    const status = err.status || 500

    logger.error(
        {
            err,
            path: req.path,
            method: req.method,
        },
        'Request failed'
    )

    res.status(status).json({
        error: {
            message:
                status === 500 ? 'Internal Server Error' : err.message || 'Error',
        },
    })
}

module.exports = errorHandler