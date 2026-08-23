const mongoose = require('mongoose')

const alertSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: {
    type: String,
    enum: ['Port Scan', 'Brute Force', 'DoS', 'Suspicious Connection', 'Abnormal Traffic', 'Unauthorized Access', 'Malware-like Activity'],
    required: true,
  },
  severity: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], required: true },
  sourceIP: { type: String, required: true },
  destinationIP: { type: String, required: true },
  port: { type: Number },
  protocol: { type: String },
  confidence: { type: Number },
  description: { type: String },
  recommendation: { type: String },
  status: { type: String, enum: ['Unresolved', 'Investigating', 'Resolved', 'Ignored'], default: 'Unresolved' },
  timestamp: { type: Date, default: Date.now },
  isSimulated: { type: Boolean, default: true },
}, { timestamps: true })

module.exports = mongoose.model('Alert', alertSchema)
