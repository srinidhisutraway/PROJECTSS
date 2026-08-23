// mockData.js
// -----------------------------------------------------------------------------
// DEMO / SIMULATED DATA GENERATORS
// Everything in this file is clearly synthetic. It is used only when:
//   (a) the app is running in Demo Mode (no live backend/socket connection), or
//   (b) as seed data the backend's own demoGenerator.js mirrors server-side.
// This is NOT real captured network traffic. See README "Demo Mode vs Real Data".
// -----------------------------------------------------------------------------

export const ATTACK_TYPES = [
  'Port Scan',
  'Brute Force',
  'DoS',
  'Suspicious Connection',
  'Abnormal Traffic',
  'Unauthorized Access',
  'Malware-like Activity',
]

export const PROTOCOLS = ['TCP', 'UDP', 'ICMP', 'HTTP', 'HTTPS', 'DNS', 'SSH']

export const SEVERITIES = ['Low', 'Medium', 'High', 'Critical']

export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function randChoice(arr) {
  return arr[randInt(0, arr.length - 1)]
}

export function randomLocalIP() {
  return `192.168.${randInt(0, 5)}.${randInt(2, 254)}`
}

export function randomExternalIP() {
  return `${randInt(20, 220)}.${randInt(0, 255)}.${randInt(0, 255)}.${randInt(1, 254)}`
}

export function randomPort() {
  return randChoice([21, 22, 23, 25, 53, 80, 135, 139, 443, 445, 3306, 3389, 8080, 8443])
}

const DEVICE_NAMES = [
  'Front-Desk-PC', 'HR-Laptop-03', 'DB-Server-01', 'Web-Server-Prod', 'CCTV-Gate-02',
  'IoT-Thermostat', 'Dev-Workstation-7', 'Finance-Laptop', 'Router-Core', 'Printer-2F',
  'Guest-Wifi-AP', 'Backup-NAS', 'Admin-MacBook', 'Mail-Server', 'VPN-Gateway',
]

export function generateDevices(n = 14) {
  return Array.from({ length: n }).map((_, i) => {
    const risk = randChoice(['Low', 'Low', 'Low', 'Medium', 'High'])
    const status = randChoice(['Online', 'Online', 'Online', 'Offline', 'Suspicious'])
    return {
      id: `dev-${i + 1}`,
      name: DEVICE_NAMES[i % DEVICE_NAMES.length],
      ip: randomLocalIP(),
      mac: Array.from({ length: 6 }).map(() => randInt(16, 255).toString(16).padStart(2, '0')).join(':'),
      status,
      riskLevel: risk,
      lastActive: new Date(Date.now() - randInt(0, 1000 * 60 * 60 * 24)).toISOString(),
    }
  })
}

function buildAlert(i, overrideType) {
  const type = overrideType || randChoice(ATTACK_TYPES)
  const severity = randChoice(SEVERITIES)
  const status = randChoice(['Unresolved', 'Unresolved', 'Investigating', 'Resolved'])
  const src = randomExternalIP()
  const dst = randomLocalIP()
  const port = randomPort()
  const protocol = randChoice(PROTOCOLS)
  const confidence = randInt(72, 99)
  return {
    id: `alert-${Date.now()}-${i}`,
    title: `${type} detected from ${src}`,
    type,
    severity,
    status,
    sourceIP: src,
    destinationIP: dst,
    port,
    protocol,
    confidence,
    timestamp: new Date(Date.now() - randInt(0, 1000 * 60 * 60 * 72)).toISOString(),
    description: explain(type),
    recommendation: recommend(type),
  }
}

export function explain(type) {
  const map = {
    'Port Scan': 'Multiple connection attempts were detected against several ports within a short period. This behavior is consistent with port scanning.',
    'Brute Force': 'A high number of failed authentication attempts were observed from a single source in a short window, consistent with a brute-force login attempt.',
    'DoS': 'An abnormally high volume of requests/packets from one or few sources was observed, consistent with a denial-of-service pattern.',
    'Suspicious Connection': 'A connection was established using an uncommon port/protocol combination that deviates from this device\u2019s historical baseline.',
    'Abnormal Traffic': 'Traffic volume or packet timing deviates significantly from the learned baseline for this network segment.',
    'Unauthorized Access': 'A successful connection occurred from a source or at a time that falls outside normal access patterns for this asset.',
    'Malware-like Activity': 'Outbound connection patterns resemble known command-and-control beaconing signatures (periodic small packets to a single external host).',
  }
  return map[type] || 'Traffic pattern deviated from the expected baseline for this network.'
}

export function recommend(type) {
  const map = {
    'Port Scan': 'Investigate the source IP and review associated connection logs. Consider a temporary firewall rule to block the source.',
    'Brute Force': 'Lock or rate-limit the targeted account, enforce MFA, and block the source IP after repeated failures.',
    'DoS': 'Enable rate limiting / upstream filtering for the affected service and monitor resource utilization.',
    'Suspicious Connection': 'Verify whether the destination service should be exposed on this port. Restrict access if not required.',
    'Abnormal Traffic': 'Correlate with recent deployments or scheduled jobs; if unexplained, isolate the host for inspection.',
    'Unauthorized Access': 'Confirm with the asset owner whether access was authorized. Rotate credentials if not.',
    'Malware-like Activity': 'Isolate the host from the network and run an endpoint scan. Block the external destination at the firewall.',
  }
  return map[type] || 'Investigate the associated source and destination for further context.'
}

export function generateAlerts(n = 24) {
  return Array.from({ length: n }).map((_, i) => buildAlert(i))
}

export function generateOneAlert(type) {
  return buildAlert(randInt(1000, 9999), type)
}

export function generateLogs(n = 60) {
  return Array.from({ length: n }).map((_, i) => ({
    id: `log-${i + 1}`,
    timestamp: new Date(Date.now() - randInt(0, 1000 * 60 * 60 * 96)).toISOString(),
    event: randChoice(['Connection Established', 'Connection Blocked', 'Login Success', 'Login Failed', 'Port Scan Detected', 'Packet Dropped', 'Firewall Rule Triggered', 'DNS Query']),
    sourceIP: randomExternalIP(),
    destinationIP: randomLocalIP(),
    protocol: randChoice(PROTOCOLS),
    port: randomPort(),
    status: randChoice(['Allowed', 'Blocked', 'Flagged']),
    severity: randChoice(SEVERITIES),
  }))
}

export function generateTrafficSeries(points = 24) {
  return Array.from({ length: points }).map((_, i) => ({
    time: `${i}:00`,
    incoming: randInt(120, 900),
    outgoing: randInt(80, 700),
    suspicious: randInt(0, 60),
  }))
}

export function generateProtocolDistribution() {
  return [
    { name: 'HTTPS', value: randInt(30, 45) },
    { name: 'TCP', value: randInt(15, 25) },
    { name: 'DNS', value: randInt(8, 15) },
    { name: 'UDP', value: randInt(6, 12) },
    { name: 'SSH', value: randInt(3, 8) },
    { name: 'Other', value: randInt(3, 8) },
  ]
}

export function generateTopList(kind = 'ip', n = 5) {
  return Array.from({ length: n }).map(() => ({
    label: kind === 'ip' ? randomExternalIP() : randomPort().toString(),
    count: randInt(20, 400),
  })).sort((a, b) => b.count - a.count)
}

export function generateNotifications() {
  return [
    { id: 1, title: 'Critical threat detected', body: 'Brute force attempt blocked on SSH.', time: '2m ago', read: false, severity: 'Critical' },
    { id: 2, title: 'New suspicious connection', body: 'Unusual outbound traffic from Dev-Workstation-7.', time: '18m ago', read: false, severity: 'Medium' },
    { id: 3, title: 'Weekly security report is ready', body: 'Your report for this week has been generated.', time: '1h ago', read: false, severity: 'Info' },
    { id: 4, title: 'Network security score improved', body: 'Score increased from 87 to 92.', time: '3h ago', read: true, severity: 'Info' },
  ]
}

export function generateIPIntel(ip) {
  return {
    ip,
    riskScore: randInt(5, 96),
    connections: randInt(1, 340),
    detectedEvents: randInt(0, 12),
    ports: Array.from({ length: randInt(2, 6) }).map(() => randomPort()),
    threatLevel: randChoice(['Low', 'Medium', 'High', 'Critical']),
    country: randChoice(['United States', 'Germany', 'Netherlands', 'Russia', 'China', 'Brazil', 'India', 'Unknown']),
    history: generateTrafficSeries(12),
  }
}
