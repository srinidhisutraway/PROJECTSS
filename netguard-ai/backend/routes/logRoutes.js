const express = require('express')
const router = express.Router()
const { list, exportCsv } = require('../controllers/logController')
const { protect } = require('../middleware/authMiddleware')

router.get('/', protect, list)
router.get('/export', protect, exportCsv)

module.exports = router
