const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const User = require('../models/User')
const generateToken = require('../utils/generateToken')

function sanitize(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    username: user.username,
    role: user.role,
    avatar: user.avatar,
    createdAt: user.createdAt,
  }
}

async function signup(req, res) {
  const { name, email, username, password } = req.body
  if (!name || !email || !username || !password) {
    return res.status(400).json({ message: 'All fields are required.' })
  }
  const exists = await User.findOne({ $or: [{ email }, { username }] })
  if (exists) return res.status(409).json({ message: 'An account with this email or username already exists.' })

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({ name, email, username, passwordHash })
  const token = generateToken(user._id)
  res.status(201).json({ token, user: sanitize(user) })
}

async function login(req, res) {
  const { identifier, password } = req.body
  if (!identifier || !password) return res.status(400).json({ message: 'Email/username and password are required.' })

  const user = await User.findOne({ $or: [{ email: identifier.toLowerCase() }, { username: identifier }] })
  if (!user) return res.status(401).json({ message: 'Invalid credentials.' })

  const match = await bcrypt.compare(password, user.passwordHash)
  if (!match) return res.status(401).json({ message: 'Invalid credentials.' })

  const token = generateToken(user._id)
  res.json({ token, user: sanitize(user) })
}

async function me(req, res) {
  res.json({ user: sanitize(req.user) })
}

// Forgot password flow. If no real mail transport is configured (this demo
// build doesn't ship one), we return the dev code directly in the response
// so the frontend can still demonstrate the full flow safely.
async function forgotPassword(req, res) {
  const { email } = req.body
  const user = await User.findOne({ email: email?.toLowerCase() })
  const devCode = String(Math.floor(100000 + Math.random() * 900000))

  if (user) {
    user.resetCode = devCode
    user.resetCodeExpires = new Date(Date.now() + 15 * 60 * 1000)
    await user.save()
  }
  // Always respond 200 (don't leak whether the email exists)
  res.json({ message: 'If that account exists, a verification code has been sent.', devCode })
}

async function resetPassword(req, res) {
  const { email, code, password } = req.body
  const user = await User.findOne({ email: email?.toLowerCase() })
  if (!user || user.resetCode !== code || !user.resetCodeExpires || user.resetCodeExpires < new Date()) {
    return res.status(400).json({ message: 'Invalid or expired verification code.' })
  }
  user.passwordHash = await bcrypt.hash(password, 10)
  user.resetCode = null
  user.resetCodeExpires = null
  await user.save()
  res.json({ message: 'Password reset successfully.' })
}

module.exports = { signup, login, me, forgotPassword, resetPassword }
