const NetworkEvent = require('../models/NetworkEvent')
const mlClient = require('../services/mlClient')

async function list(req, res) {
  try {
    const events = await NetworkEvent.find().sort({ timestamp: -1 }).limit(200)
    res.json(events)
  } catch {
    res.json([])
  }
}

// Trigger the demo generator to simulate a threat scenario end-to-end.
async function simulate(req, res) {
  const { type } = req.body
  const io = req.app.get('io')
  const demoGenerator = req.app.get('demoGenerator')
  if (!io || !demoGenerator) return res.status(503).json({ message: 'Realtime service unavailable.' })
  const result = await demoGenerator.simulateThreat(type)
  res.json({ message: 'Simulated threat triggered.', result })
}

async function predict(req, res) {
  const result = await mlClient.predict(req.body)
  res.json(result)
}

async function modelMetrics(req, res) {
  const metrics = await mlClient.getModelMetrics()
  res.json(metrics)
}

// Simple demo IP intelligence lookup (would call a real threat-intel API in production)
async function ipLookup(req, res) {
  const { ip } = req.params
  const events = await NetworkEvent.find({ $or: [{ sourceIP: ip }, { destinationIP: ip }] }).limit(50).catch(() => [])
  const riskScore = Math.min(96, 10 + events.length * 6)
  res.json({
    ip,
    riskScore,
    connections: events.length,
    detectedEvents: events.filter((e) => e.status !== 'Normal').length,
    threatLevel: riskScore > 70 ? 'Critical' : riskScore > 40 ? 'High' : riskScore > 20 ? 'Medium' : 'Low',
    demo: true,
  })
}

module.exports = { list, simulate, predict, modelMetrics, ipLookup }
