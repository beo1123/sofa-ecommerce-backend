const express = require('express')
const controller = require('../controllers/order.controller')

const router = express.Router()

router.post('/orders', controller.create)

module.exports = router
