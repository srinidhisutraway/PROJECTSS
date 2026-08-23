const mongoose = require('mongoose')

const deviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ip: { type: String, required: true },
  mac: { type: String, required: true },
  status: { type: String, enum: ['Online', 'Offline', 'Suspicious'], default: 'Online' },
  riskLevel: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Low' },
  lastActive: { type: Date, default: Date.now },
}, { timestamps: true })

module.exports = mongoose.model('Device', deviceSchema)
