require('dotenv').config()
const express = require('express')
const http = require('http')
const cors = require('cors')
const { Server } = require('socket.io')

const connectDB = require('./config/db')
const initSocket = require('./services/socketService')
const { notFound, errorHandler } = require('./middleware/errorMiddleware')

const authRoutes = require('./routes/authRoutes')
const dashboardRoutes = require('./routes/dashboardRoutes')
const alertRoutes = require('./routes/alertRoutes')
const deviceRoutes = require('./routes/deviceRoutes')
const eventRoutes = require('./routes/eventRoutes')
const logRoutes = require('./routes/logRoutes')
const reportRoutes = require('./routes/reportRoutes')

const app = express()
const server = http.createServer(app)

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173'

app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }))
app.use(express.json())

const io = new Server(server, { cors: { origin: CLIENT_ORIGIN, credentials: true } })
app.set('io', io)

app.get('/', (req, res) => res.json({ name: 'NetGuard AI API', status: 'running' }))
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }))

app.use('/api/auth', authRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/alerts', alertRoutes)
app.use('/api/devices', deviceRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/logs', logRoutes)
app.use('/api/reports', reportRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

async function start() {
  await connectDB()
  const demoGenerator = initSocket(io)
  app.set('demoGenerator', demoGenerator)
  server.listen(PORT, () => {
    console.log(`\n🛡️  NetGuard AI backend running on http://localhost:${PORT}`)
    console.log(`   Socket.IO ready — demo traffic generator active.`)
    console.log(`   CORS origin: ${CLIENT_ORIGIN}\n`)
  })
}

start()
