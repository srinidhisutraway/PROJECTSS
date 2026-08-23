const express = require('express')
const router = express.Router()
const { list, getOne, updateStatus } = require('../controllers/alertController')
const { protect } = require('../middleware/authMiddleware')

router.get('/', protect, list)
router.get('/:id', protect, getOne)
router.patch('/:id', protect, updateStatus)

module.exports = router
