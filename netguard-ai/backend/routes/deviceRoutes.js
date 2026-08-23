const express = require('express')
const router = express.Router()
const { list, getOne } = require('../controllers/deviceController')
const { protect } = require('../middleware/authMiddleware')

router.get('/', protect, list)
router.get('/:id', protect, getOne)

module.exports = router
