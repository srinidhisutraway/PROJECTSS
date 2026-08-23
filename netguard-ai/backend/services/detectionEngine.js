// detectionEngine.js
// -----------------------------------------------------------------------------
// Core detection pipeline stage. Combines simple rule-based signatures with
// the ML client to classify a network flow, persist the result, compute a
// risk-scored Alert when needed, and broadcast everything over Socket.IO.
//
// Pipeline position:
//   Network Monitor -> Packet/Flow Collector -> Feature Extractor
//     -> [ DETECTION ENGINE ] -> Risk Scoring -> Alert Service
//        -> Database -> WebSocket -> Dashboard
// -----------------------------------------------------------------------------
const NetworkEvent = require('../models/NetworkEvent')
const Alert = require('../models/Alert')
const mlClient = require('./mlClient')

const EXPLAIN = {
  'Port Scan': 'Multiple connection attempts were detected against several ports within a short period. This behavior is consistent with port scanning.',
  'Brute Force': 'A high number of failed authentication attempts were observed from a single source in a short window, consistent with a brute-force login attempt.',
  'DoS': 'An abnormally high volume of requests/packets from one or few sources was observed, consistent with a denial-of-service pattern.',
  'Suspicious Connection': 'A connection was established using an uncommon port/protocol combination that deviates from this device\u2019s historical baseline.',
  'Abnormal Traffic': 'Traffic volume or packet timing deviates significantly from the learned baseline for this network segment.',
  'Unauthorized Access': 'A successful connection occurred from a source or at a time that falls outside normal access patterns for this asset.',
  'Malware-like Activity': 'Outbound connection patterns resemble known command-and-control beaconing signatures.',
}
const RECOMMEND = {
  'Port Scan': 'Investigate the source IP and review associated connection logs. Consider a temporary firewall rule to block the source.',
  'Brute Force': 'Lock or rate-limit the targeted account, enforce MFA, and block the source IP after repeated failures.',
  'DoS': 'Enable rate limiting / upstream filtering for the affected service and monitor resource utilization.',
  'Suspicious Connection': 'Verify whether the destination service should be exposed on this port. Restrict access if not required.',
  'Abnormal Traffic': 'Correlate with recent deployments or scheduled jobs; if unexplained, isolate the host for inspection.',
  'Unauthorized Access': 'Confirm with the asset owner whether access was authorized. Rotate credentials if not.',
  'Malware-like Activity': 'Isolate the host from the network and run an endpoint scan. Block the external destination at the firewall.',
}

function severityFor(type, confidence) {
  if (type === 'DoS' || type === 'Malware-like Activity') return confidence > 0.9 ? 'Critical' : 'High'
  if (type === 'Brute Force' || type === 'Unauthorized Access') return confidence > 0.9 ? 'High' : 'Medium'
  if (confidence > 0.9) return 'High'
  if (confidence > 0.8) return 'Medium'
  return 'Low'
}

async function processFlow(flow, io, forceAttack = false) {
  const features = {
    protocol: flow.protocol,
    packetSize: flow.packetSize,
    duration: flow.duration,
    sourceBytes: flow.packetSize * randRange(1, 4),
    destinationBytes: flow.packetSize * randRange(1, 3),
    connectionCount: flow.connectionCount,
    port: flow.destinationPort,
  }

  const mlResult = await mlClient.predict(features)
  const attackType = flow.forcedAttackType || mlResult.attack_type
  const isAttack = forceAttack || mlResult.prediction === 'ATTACK' || mlResult.prediction === 'SUSPICIOUS'
  const status = forceAttack ? 'Attack' : mlResult.prediction === 'ATTACK' ? 'Attack' : mlResult.prediction === 'SUSPICIOUS' ? 'Suspicious' : 'Normal'

  const eventDoc = {
    sourceIP: flow.sourceIP,
    destinationIP: flow.destinationIP,
    sourcePort: flow.sourcePort,
    destinationPort: flow.destinationPort,
    protocol: flow.protocol,
    packetSize: flow.packetSize,
    duration: flow.duration,
    connectionCount: flow.connectionCount,
    status,
    attackType: isAttack ? attackType : null,
    confidence: isAttack ? mlResult.confidence : null,
    timestamp: new Date(),
    isSimulated: true,
  }

  let savedEvent = eventDoc
  try {
    savedEvent = await NetworkEvent.create(eventDoc)
  } catch (e) { /* DB may be unavailable in demo mode; continue with in-memory doc */ }

  io.emit('event', {
    id: savedEvent._id || `evt-${Date.now()}`,
    type: isAttack ? attackType : 'Normal Traffic',
    sourceIP: flow.sourceIP,
    timestamp: eventDoc.timestamp,
  })

  if (!isAttack) return { event: savedEvent }

  const severity = severityFor(attackType, mlResult.confidence)
  const alertDoc = {
    title: `${attackType} detected from ${flow.sourceIP}`,
    type: attackType,
    severity,
    sourceIP: flow.sourceIP,
    destinationIP: flow.destinationIP,
    port: flow.destinationPort,
    protocol: flow.protocol,
    confidence: Math.round(mlResult.confidence * 100),
    description: EXPLAIN[attackType] || 'Traffic pattern deviated from the expected baseline.',
    recommendation: RECOMMEND[attackType] || 'Investigate the associated source and destination.',
    status: 'Unresolved',
    timestamp: new Date(),
    isSimulated: true,
  }

  let savedAlert = alertDoc
  try {
    savedAlert = await Alert.create(alertDoc)
  } catch (e) { /* DB may be unavailable; continue with in-memory doc */ }

  io.emit('detection', { ...alertDoc, id: savedAlert._id, stage: 'detected' })
  io.emit('alert', { ...alertDoc, id: savedAlert._id || `alert-${Date.now()}` })
  io.emit('notification', {
    id: Date.now(),
    title: `${severity} severity: ${attackType} detected`,
    body: `Source ${flow.sourceIP} \u2192 ${flow.destinationIP}:${flow.destinationPort}`,
    time: 'just now',
    read: false,
    severity,
  })

  return { event: savedEvent, alert: savedAlert }
}

function randRange(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }

module.exports = { processFlow }
