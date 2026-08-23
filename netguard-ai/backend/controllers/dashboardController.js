const Alert = require('../models/Alert')
const Device = require('../models/Device')
const NetworkEvent = require('../models/NetworkEvent')

async function overview(req, res) {
  try {
    const [totalDevices, activeAlerts, criticalAlerts, threatEvents] = await Promise.all([
      Device.countDocuments(),
      Alert.countDocuments({ status: { $ne: 'Resolved' } }),
      Alert.countDocuments({ severity: 'Critical', status: { $ne: 'Resolved' } }),
      NetworkEvent.countDocuments({ status: { $in: ['Suspicious', 'Attack'] } }),
    ])
    res.json({ totalDevices, activeAlerts, criticalAlerts, threatEvents })
  } catch (err) {
    res.status(200).json({ totalDevices: 0, activeAlerts: 0, criticalAlerts: 0, threatEvents: 0, demo: true })
  }
}

async function securityScore(req, res) {
  try {
    const criticalAlerts = await Alert.countDocuments({ severity: 'Critical', status: { $ne: 'Resolved' } })
    const highAlerts = await Alert.countDocuments({ severity: 'High', status: { $ne: 'Resolved' } })
    const score = Math.max(30, 100 - criticalAlerts * 8 - highAlerts * 4)
    const status = score >= 80 ? 'Secure' : score >= 60 ? 'Warning' : 'Critical'
    res.json({ score, status })
  } catch {
    res.json({ score: 92, status: 'Secure', demo: true })
  }
}

module.exports = { overview, securityScore }
