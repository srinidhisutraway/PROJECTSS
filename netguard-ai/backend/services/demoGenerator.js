// demoGenerator.js
// -----------------------------------------------------------------------------
// DEMO / SIMULATED NETWORK TRAFFIC GENERATOR
// This module generates realistic-looking synthetic network events. It exists
// so the whole pipeline (Collector -> Feature Extractor -> Detection Engine ->
// Risk Scoring -> Alert Service -> DB -> WebSocket -> Dashboard) can be
// demonstrated end-to-end without a real packet-capture library.
//
// To connect REAL traffic later: replace the setInterval loop below with a
// real collector (e.g. a Node binding to libpcap, or forwarding NetFlow/
// sFlow records from a switch/router) that calls `ingestEvent()` with the
// same shape this generator produces.
// -----------------------------------------------------------------------------
const detectionEngine = require('./detectionEngine')

const ATTACK_TYPES = ['Port Scan', 'Brute Force', 'DoS', 'Suspicious Connection', 'Abnormal Traffic', 'Unauthorized Access', 'Malware-like Activity']
const PROTOCOLS = ['TCP', 'UDP', 'ICMP', 'HTTP', 'HTTPS', 'DNS', 'SSH']

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }
function randChoice(arr) { return arr[randInt(0, arr.length - 1)] }
function randomLocalIP() { return `192.168.${randInt(0, 5)}.${randInt(2, 254)}` }
function randomExternalIP() { return `${randInt(20, 220)}.${randInt(0, 255)}.${randInt(0, 255)}.${randInt(1, 254)}` }
function randomPort() { return randChoice([21, 22, 23, 25, 53, 80, 135, 139, 443, 445, 3306, 3389, 8080, 8443]) }

function buildRawFlow() {
  return {
    sourceIP: randomExternalIP(),
    destinationIP: randomLocalIP(),
    sourcePort: randInt(1024, 65535),
    destinationPort: randomPort(),
    protocol: randChoice(PROTOCOLS),
    packetSize: randInt(64, 1500),
    duration: +(Math.random() * 5).toFixed(2),
    connectionCount: randInt(1, 8),
  }
}

function buildAttackFlow(type) {
  const flow = buildRawFlow()
  if (type === 'Port Scan') flow.connectionCount = randInt(20, 60)
  if (type === 'Brute Force') { flow.destinationPort = 22; flow.connectionCount = randInt(15, 40) }
  if (type === 'DoS') { flow.packetSize = randInt(1200, 1500); flow.connectionCount = randInt(80, 250) }
  return { ...flow, forcedAttackType: type }
}

class DemoGenerator {
  constructor(io) {
    this.io = io
    this.interval = null
    this.stats = { incoming: 420, outgoing: 310, activeConnections: 128, packetsPerSec: 940, bandwidthMbps: 62, suspicious: 3 }
  }

  start(intervalMs = 2500) {
    if (this.interval) return
    console.log('[demoGenerator] started — emitting simulated network traffic')
    this.interval = setInterval(() => {
      this.stats = {
        incoming: Math.max(50, this.stats.incoming + randInt(-60, 80)),
        outgoing: Math.max(30, this.stats.outgoing + randInt(-50, 70)),
        activeConnections: Math.max(10, this.stats.activeConnections + randInt(-8, 10)),
        packetsPerSec: Math.max(100, this.stats.packetsPerSec + randInt(-120, 160)),
        bandwidthMbps: Math.max(5, this.stats.bandwidthMbps + randInt(-6, 8)),
        suspicious: Math.max(0, this.stats.suspicious + randInt(-1, 2)),
      }
      this.io.emit('stats', this.stats)

      // Occasionally produce a benign flow through the full pipeline
      if (Math.random() < 0.4) {
        detectionEngine.processFlow(buildRawFlow(), this.io)
      }
    }, intervalMs)
  }

  stop() {
    clearInterval(this.interval)
    this.interval = null
  }

  // Used by "Simulate Threat" button (POST /api/events/simulate or socket 'simulate-threat')
  simulateThreat(type) {
    const attackType = type || randChoice(ATTACK_TYPES)
    const flow = buildAttackFlow(attackType)
    return detectionEngine.processFlow(flow, this.io, true)
  }
}

module.exports = DemoGenerator
