const express = require('express')
const router = express.Router()
const { list, simulate, predict, modelMetrics, ipLookup } = require('../controllers/eventController')
const { protect } = require('../middleware/authMiddleware')

router.get('/', protect, list)
router.post('/simulate', protect, simulate)
router.post('/predict', protect, predict)
router.get('/model-metrics', protect, modelMetrics)
router.get('/ip-lookup/:ip', protect, ipLookup)

module.exports = router
