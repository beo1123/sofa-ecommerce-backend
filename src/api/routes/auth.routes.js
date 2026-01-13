const express = require('express')
const controller = require('../controllers/auth.controller')

const router = express.Router()

router.post('/auth/register', controller.register)
router.post('/auth/login', controller.login)

module.exports = router
