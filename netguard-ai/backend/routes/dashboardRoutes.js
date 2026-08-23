const express = require('express')
const router = express.Router()
const { overview, securityScore } = require('../controllers/dashboardController')
const { protect } = require('../middleware/authMiddleware')

router.get('/overview', protect, overview)
router.get('/security-score', protect, securityScore)

module.exports = router
