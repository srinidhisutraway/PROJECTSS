const express = require('express')
const router = express.Router()
const { list, generate } = require('../controllers/reportController')
const { protect } = require('../middleware/authMiddleware')

router.get('/', protect, list)
router.post('/generate', protect, generate)

module.exports = router
