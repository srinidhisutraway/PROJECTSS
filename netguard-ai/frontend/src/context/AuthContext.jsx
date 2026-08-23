import React, { createContext, useContext, useEffect, useState } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

const DEMO_USER = {
  id: 'demo-user-1',
  name: 'Alex Morgan',
  email: 'demo@netguard.ai',
  username: 'alex.morgan',
  role: 'Security Administrator',
  createdAt: '2025-02-11T00:00:00.000Z',
  avatar: null,
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isDemoAccount, setIsDemoAccount] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('netguard_token')
    const storedUser = localStorage.getItem('netguard_user')
    if (token && storedUser) {
      setUser(JSON.parse(storedUser))
      setIsDemoAccount(token === 'demo-token')
    }
    setLoading(false)
  }, [])

  async function login({ identifier, password, remember }) {
    // Convenience: local demo login works even with no backend running.
    if (identifier === 'demo@netguard.ai' && password === 'Demo@1234') {
      localStorage.setItem('netguard_token', 'demo-token')
      localStorage.setItem('netguard_user', JSON.stringify(DEMO_USER))
      setUser(DEMO_USER)
      setIsDemoAccount(true)
      return { ok: true }
    }
    try {
      const res = await authAPI.login({ identifier, password })
      const { token, user: apiUser } = res.data
      localStorage.setItem('netguard_token', token)
      localStorage.setItem('netguard_user', JSON.stringify(apiUser))
      setUser(apiUser)
      setIsDemoAccount(false)
      return { ok: true }
    } catch (err) {
      return { ok: false, error: err?.response?.data?.message || 'Unable to reach the server. Try the demo account (demo@netguard.ai / Demo@1234).' }
    }
  }

  async function signup(payload) {
    try {
      const res = await authAPI.signup(payload)
      const { token, user: apiUser } = res.data
      localStorage.setItem('netguard_token', token)
      localStorage.setItem('netguard_user', JSON.stringify(apiUser))
      setUser(apiUser)
      setIsDemoAccount(false)
      return { ok: true }
    } catch (err) {
      return { ok: false, error: err?.response?.data?.message || 'Sign up failed. Backend not reachable — you can still explore with the demo account on the login page.' }
    }
  }

  function logout() {
    localStorage.removeItem('netguard_token')
    localStorage.removeItem('netguard_user')
    setUser(null)
    setIsDemoAccount(false)
  }

  function updateProfile(patch) {
    const next = { ...user, ...patch }
    setUser(next)
    localStorage.setItem('netguard_user', JSON.stringify(next))
  }

  return (
    <AuthContext.Provider value={{ user, loading, isDemoAccount, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
