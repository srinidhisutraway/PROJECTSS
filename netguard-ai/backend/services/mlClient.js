// mlClient.js
// -----------------------------------------------------------------------------
// Thin client for the Python ML microservice (see /ml-service).
// If the ML service is unreachable, falls back to a simple, clearly-labeled
// rule-based mock so the rest of the app keeps working during a demo.
// -----------------------------------------------------------------------------
const axios = require('axios')

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000'

async function predict(features) {
  try {
    const res = await axios.post(`${ML_SERVICE_URL}/predict`, features, { timeout: 3000 })
    return { ...res.data, demo: false }
  } catch (err) {
    return mockPredict(features)
  }
}

function mockPredict(features) {
  const connectionCount = Number(features.connectionCount || 1)
  const packetSize = Number(features.packetSize || 500)
  const port = Number(features.port || features.destinationPort || 443)

  let prediction = 'NORMAL'
  let attack_type = null

  if (connectionCount > 30) { prediction = 'ATTACK'; attack_type = 'Brute Force' }
  else if (connectionCount > 15 || packetSize > 1400 || [21, 23, 3389].includes(port)) { prediction = 'SUSPICIOUS'; attack_type = 'Port Scan' }

  const confidence = prediction === 'NORMAL' ? 0.7 + Math.random() * 0.25 : 0.75 + Math.random() * 0.23

  return { prediction, attack_type, confidence: +confidence.toFixed(2), demo: true }
}

async function getModelMetrics() {
  try {
    const res = await axios.get(`${ML_SERVICE_URL}/metrics`, { timeout: 3000 })
    return { ...res.data, demo: false }
  } catch {
    return {
      model: 'Random Forest Classifier',
      accuracy: 0.968,
      precision: 0.954,
      recall: 0.949,
      f1Score: 0.951,
      demo: true,
      note: 'Demo/offline evaluation metrics. Connect ml-service for live metrics.',
    }
  }
}

module.exports = { predict, getModelMetrics }
