const Alert = require('../models/Alert')

async function list(req, res) {
  const { severity, status, q } = req.query
  const filter = {}
  if (severity && severity !== 'All') filter.severity = severity
  if (status && status !== 'All') filter.status = status
  if (q) filter.$or = [{ title: new RegExp(q, 'i') }, { sourceIP: new RegExp(q, 'i') }]

  try {
    const alerts = await Alert.find(filter).sort({ timestamp: -1 }).limit(200)
    res.json(alerts)
  } catch {
    res.json([])
  }
}

async function getOne(req, res) {
  try {
    const alert = await Alert.findById(req.params.id)
    if (!alert) return res.status(404).json({ message: 'Alert not found.' })
    res.json(alert)
  } catch {
    res.status(404).json({ message: 'Alert not found.' })
  }
}

async function updateStatus(req, res) {
  const { status } = req.body
  try {
    const alert = await Alert.findByIdAndUpdate(req.params.id, { status }, { new: true })
    if (!alert) return res.status(404).json({ message: 'Alert not found.' })
    res.json(alert)
  } catch {
    res.status(404).json({ message: 'Alert not found.' })
  }
}

module.exports = { list, getOne, updateStatus }
