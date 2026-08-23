const Device = require('../models/Device')

async function list(req, res) {
  const { status, q } = req.query
  const filter = {}
  if (status && status !== 'All') filter.status = status
  if (q) filter.$or = [{ name: new RegExp(q, 'i') }, { ip: new RegExp(q, 'i') }]
  try {
    const devices = await Device.find(filter).sort({ lastActive: -1 })
    res.json(devices)
  } catch {
    res.json([])
  }
}

async function getOne(req, res) {
  try {
    const device = await Device.findById(req.params.id)
    if (!device) return res.status(404).json({ message: 'Device not found.' })
    res.json(device)
  } catch {
    res.status(404).json({ message: 'Device not found.' })
  }
}

module.exports = { list, getOne }
