// scripts/seed.js
// Seeds MongoDB with a demo user, devices, alerts, and logs.
// Run with: npm run seed  (after setting MONGO_URI in .env)
require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const connectDB = require('../config/db')

const User = require('../models/User')
const Device = require('../models/Device')
const Alert = require('../models/Alert')
const Log = require('../models/Log')

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }
function randChoice(arr) { return arr[randInt(0, arr.length - 1)] }
function randomLocalIP() { return `192.168.${randInt(0, 5)}.${randInt(2, 254)}` }
function randomExternalIP() { return `${randInt(20, 220)}.${randInt(0, 255)}.${randInt(0, 255)}.${randInt(1, 254)}` }

const ATTACK_TYPES = ['Port Scan', 'Brute Force', 'DoS', 'Suspicious Connection', 'Abnormal Traffic', 'Unauthorized Access', 'Malware-like Activity']
const SEVERITIES = ['Low', 'Medium', 'High', 'Critical']
const PROTOCOLS = ['TCP', 'UDP', 'ICMP', 'HTTP', 'HTTPS', 'DNS', 'SSH']
const DEVICE_NAMES = ['Front-Desk-PC', 'HR-Laptop-03', 'DB-Server-01', 'Web-Server-Prod', 'CCTV-Gate-02', 'IoT-Thermostat', 'Dev-Workstation-7', 'Admin-MacBook']

async function seed() {
  await connectDB()

  await Promise.all([User.deleteMany({}), Device.deleteMany({}), Alert.deleteMany({}), Log.deleteMany({})])

  const passwordHash = await bcrypt.hash('Demo@1234', 10)
  await User.create({ name: 'Alex Morgan', email: 'demo@netguard.ai', username: 'alex.morgan', passwordHash, role: 'Security Administrator' })

  await Device.insertMany(DEVICE_NAMES.map((name) => ({
    name, ip: randomLocalIP(),
    mac: Array.from({ length: 6 }).map(() => randInt(16, 255).toString(16).padStart(2, '0')).join(':'),
    status: randChoice(['Online', 'Online', 'Offline', 'Suspicious']),
    riskLevel: randChoice(['Low', 'Low', 'Medium', 'High']),
    lastActive: new Date(Date.now() - randInt(0, 1000 * 60 * 60 * 24)),
  })))

  await Alert.insertMany(Array.from({ length: 20 }).map(() => {
    const type = randChoice(ATTACK_TYPES)
    return {
      title: `${type} detected`,
      type, severity: randChoice(SEVERITIES),
      sourceIP: randomExternalIP(), destinationIP: randomLocalIP(),
      port: randChoice([21, 22, 80, 443, 3389]), protocol: randChoice(PROTOCOLS),
      confidence: randInt(72, 99),
      description: 'Seeded demo alert for local development.',
      recommendation: 'Investigate the source IP and review connection logs.',
      status: randChoice(['Unresolved', 'Investigating', 'Resolved']),
      timestamp: new Date(Date.now() - randInt(0, 1000 * 60 * 60 * 72)),
    }
  }))

  await Log.insertMany(Array.from({ length: 40 }).map(() => ({
    event: randChoice(['Connection Established', 'Login Failed', 'Port Scan Detected', 'Packet Dropped']),
    sourceIP: randomExternalIP(), destinationIP: randomLocalIP(),
    protocol: randChoice(PROTOCOLS), port: randChoice([22, 80, 443, 3306]),
    status: randChoice(['Allowed', 'Blocked', 'Flagged']), severity: randChoice(SEVERITIES),
    timestamp: new Date(Date.now() - randInt(0, 1000 * 60 * 60 * 96)),
  })))

  console.log('✅ Seed complete. Login with demo@netguard.ai / Demo@1234')
  await mongoose.disconnect()
  process.exit(0)
}

seed().catch((err) => { console.error(err); process.exit(1) })
