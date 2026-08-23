const mongoose = require('mongoose')

const networkEventSchema = new mongoose.Schema({
  sourceIP: { type: String, required: true },
  destinationIP: { type: String, required: true },
  sourcePort: { type: Number },
  destinationPort: { type: Number },
  protocol: { type: String, enum: ['TCP', 'UDP', 'ICMP', 'HTTP', 'HTTPS', 'DNS', 'SSH'], required: true },
  packetSize: { type: Number },
  duration: { type: Number },
  connectionCount: { type: Number, default: 1 },
  status: { type: String, enum: ['Normal', 'Suspicious', 'Attack'], default: 'Normal' },
  attackType: { type: String, default: null },
  confidence: { type: Number, default: null },
  timestamp: { type: Date, default: Date.now },
  isSimulated: { type: Boolean, default: true },
}, { timestamps: true })

module.exports = mongoose.model('NetworkEvent', networkEventSchema)
