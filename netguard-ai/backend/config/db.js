const mongoose = require('mongoose')

async function connectDB() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/netguard_ai'
  try {
    await mongoose.connect(uri)
    console.log(`[db] MongoDB connected: ${mongoose.connection.host}`)
  } catch (err) {
    console.error('[db] MongoDB connection failed:', err.message)
    console.error('[db] The API will still boot, but DB-backed routes will fail until MongoDB is reachable.')
  }
}

module.exports = connectDB
