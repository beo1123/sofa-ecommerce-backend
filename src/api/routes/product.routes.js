const express = require('express')
const controller = require('../controllers/product.controller')

const router = express.Router()

router.get('/products', controller.list)
router.get('/products/:slug', controller.getBySlug)

module.exports = router
