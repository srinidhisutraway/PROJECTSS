const mongoose = require('mongoose')

const logSchema = new mongoose.Schema({
  event: { type: String, required: true },
  sourceIP: { type: String, required: true },
  destinationIP: { type: String, required: true },
  protocol: { type: String },
  port: { type: Number },
  status: { type: String, enum: ['Allowed', 'Blocked', 'Flagged'], default: 'Allowed' },
  severity: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Low' },
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true })

module.exports = mongoose.model('Log', logSchema)
