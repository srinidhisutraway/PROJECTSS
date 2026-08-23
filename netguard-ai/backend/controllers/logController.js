const Log = require('../models/Log')

async function list(req, res) {
  const { q, severity, page = 1, limit = 20 } = req.query
  const filter = {}
  if (severity && severity !== 'All') filter.severity = severity
  if (q) filter.$or = [{ event: new RegExp(q, 'i') }, { sourceIP: new RegExp(q, 'i') }]

  try {
    const total = await Log.countDocuments(filter)
    const logs = await Log.find(filter)
      .sort({ timestamp: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
    res.json({ logs, total, page: Number(page), totalPages: Math.ceil(total / limit) })
  } catch {
    res.json({ logs: [], total: 0, page: 1, totalPages: 1 })
  }
}

async function exportCsv(req, res) {
  try {
    const logs = await Log.find().sort({ timestamp: -1 }).limit(1000)
    const header = 'Timestamp,Event,SourceIP,DestinationIP,Protocol,Port,Status,Severity\n'
    const rows = logs.map((l) => [l.timestamp.toISOString(), l.event, l.sourceIP, l.destinationIP, l.protocol, l.port, l.status, l.severity].join(',')).join('\n')
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename=netguard-security-logs.csv')
    res.send(header + rows)
  } catch {
    res.status(500).json({ message: 'Failed to export logs.' })
  }
}

module.exports = { list, exportCsv }
