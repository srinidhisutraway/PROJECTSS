const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  username: { type: String, required: true, unique: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: 'Security Administrator' },
  avatar: { type: String, default: null },
  resetCode: { type: String, default: null },
  resetCodeExpires: { type: Date, default: null },
  preferences: {
    securityAlerts: { type: Boolean, default: true },
    criticalAlerts: { type: Boolean, default: true },
    weeklyReports: { type: Boolean, default: true },
    emailNotifications: { type: Boolean, default: false },
    twoFactorEnabled: { type: Boolean, default: false },
    theme: { type: String, default: 'light' },
  },
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)
