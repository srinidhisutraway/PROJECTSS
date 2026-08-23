const mongoose = require('mongoose')

const reportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  securityScore: { type: Number },
  totalTraffic: { type: String },
  threatsDetected: { type: Number },
  criticalAlerts: { type: Number },
  topAttackTypes: [{ name: String, count: Number }],
  topSuspiciousIPs: [{ label: String, count: Number }],
  recommendations: [{ type: String }],
  date: { type: Date, default: Date.now },
}, { timestamps: true })

module.exports = mongoose.model('Report', reportSchema)
