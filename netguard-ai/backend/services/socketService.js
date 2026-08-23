// socketService.js
// Wires up Socket.IO connection handling + starts the demo generator.
// Real packet-capture integrations should call detectionEngine.processFlow()
// directly (bypassing demoGenerator) and this file's `io` instance can stay
// exactly the same for broadcasting to the dashboard.
const DemoGenerator = require('./demoGenerator')

function initSocket(io) {
  const demoGenerator = new DemoGenerator(io)
  demoGenerator.start()

  io.on('connection', (socket) => {
    console.log(`[socket] client connected: ${socket.id}`)
    socket.emit('stats', demoGenerator.stats)

    socket.on('simulate-threat', ({ type } = {}) => {
      demoGenerator.simulateThreat(type)
    })

    socket.on('disconnect', () => {
      console.log(`[socket] client disconnected: ${socket.id}`)
    })
  })

  return demoGenerator
}

module.exports = initSocket
