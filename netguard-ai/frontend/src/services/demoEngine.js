// demoEngine.js
// -----------------------------------------------------------------------------
// A tiny in-browser pub/sub "network event bus" used to simulate real-time
// traffic + detections when a live backend/Socket.IO connection isn't
// available (e.g. running the frontend standalone for a demo/viva).
//
// SocketContext prefers a REAL socket.io connection to the backend. If that
// connection fails or isn't configured, it transparently falls back to this
// engine so the dashboard still feels alive. The UI always shows a badge
// telling the user which mode is active ("LIVE" vs "DEMO SIMULATION").
// -----------------------------------------------------------------------------
import { generateOneAlert, randInt, ATTACK_TYPES } from './mockData'

class DemoEngine {
  constructor() {
    this.listeners = {}
    this.interval = null
    this.stats = {
      incoming: 420,
      outgoing: 310,
      activeConnections: 128,
      packetsPerSec: 940,
      bandwidthMbps: 62,
      suspicious: 3,
    }
  }

  on(event, cb) {
    if (!this.listeners[event]) this.listeners[event] = []
    this.listeners[event].push(cb)
    return () => {
      this.listeners[event] = this.listeners[event].filter((f) => f !== cb)
    }
  }

  emit(event, payload) {
    ;(this.listeners[event] || []).forEach((cb) => cb(payload))
  }

  start() {
    if (this.interval) return
    this.interval = setInterval(() => {
      this.stats = {
        incoming: Math.max(50, this.stats.incoming + randInt(-60, 80)),
        outgoing: Math.max(30, this.stats.outgoing + randInt(-50, 70)),
        activeConnections: Math.max(10, this.stats.activeConnections + randInt(-8, 10)),
        packetsPerSec: Math.max(100, this.stats.packetsPerSec + randInt(-120, 160)),
        bandwidthMbps: Math.max(5, this.stats.bandwidthMbps + randInt(-6, 8)),
        suspicious: Math.max(0, this.stats.suspicious + randInt(-1, 2)),
      }
      this.emit('stats', this.stats)

      // Occasionally emit a low-key benign network event
      if (Math.random() < 0.35) {
        this.emit('event', {
          id: `evt-${Date.now()}`,
          type: 'Normal Traffic',
          timestamp: new Date().toISOString(),
        })
      }
    }, 2200)
  }

  stop() {
    clearInterval(this.interval)
    this.interval = null
  }

  // Manually trigger a simulated threat scenario (used by "Simulate Threat" button)
  simulateThreat(type) {
    const attackType = type || ATTACK_TYPES[randInt(0, ATTACK_TYPES.length - 1)]
    const alert = generateOneAlert(attackType)

    // 1. network event
    this.emit('event', { id: `evt-${Date.now()}`, type: attackType, timestamp: new Date().toISOString(), sourceIP: alert.sourceIP })
    // 2. detection
    setTimeout(() => this.emit('detection', { ...alert, stage: 'detected' }), 400)
    // 3. alert created
    setTimeout(() => this.emit('alert', alert), 900)
    // 4. dashboard/stat bump
    setTimeout(() => {
      this.stats.suspicious += randInt(2, 6)
      this.emit('stats', this.stats)
    }, 1000)
    // 5. notification
    setTimeout(() => this.emit('notification', {
      id: Date.now(),
      title: `${alert.severity} severity: ${attackType} detected`,
      body: `Source ${alert.sourceIP} \u2192 ${alert.destinationIP}:${alert.port}`,
      time: 'just now',
      read: false,
      severity: alert.severity,
    }), 1300)

    return alert
  }
}

const demoEngine = new DemoEngine()
export default demoEngine
