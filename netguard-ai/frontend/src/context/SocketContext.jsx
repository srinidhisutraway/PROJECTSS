import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import { io } from 'socket.io-client'
import demoEngine from '../services/demoEngine'
import {
  generateAlerts, generateDevices, generateNotifications, generateOneAlert,
} from '../services/mockData'
import { useAuth } from './AuthContext'

const SocketContext = createContext(null)
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'

// This provider is the single real-time data source for the whole app.
// mode: 'live'  -> connected to the real backend Socket.IO server (real or lab network data)
// mode: 'demo'  -> backend unreachable; falling back to the local simulated engine
export function SocketProvider({ children }) {
  const { user } = useAuth()
  const [mode, setMode] = useState('connecting') // connecting | live | demo
  const [stats, setStats] = useState({ incoming: 0, outgoing: 0, activeConnections: 0, packetsPerSec: 0, bandwidthMbps: 0, suspicious: 0 })
  const [liveEvents, setLiveEvents] = useState([])
  const [alerts, setAlerts] = useState([])
  const [notifications, setNotifications] = useState([])
  const socketRef = useRef(null)

  useEffect(() => {
    if (!user) return

    setAlerts(generateAlerts(18))
    setNotifications(generateNotifications())

    let socket
    let fallbackTimer = setTimeout(() => activateDemoMode(), 1800)

    try {
      socket = io(SOCKET_URL, { reconnectionAttempts: 1, timeout: 1500 })
      socketRef.current = socket

      socket.on('connect', () => {
        clearTimeout(fallbackTimer)
        setMode('live')
        demoEngine.stop()
      })
      socket.on('stats', (payload) => setStats(payload))
      socket.on('event', (payload) => setLiveEvents((p) => [payload, ...p].slice(0, 40)))
      socket.on('alert', (payload) => setAlerts((p) => [payload, ...p]))
      socket.on('notification', (payload) => setNotifications((p) => [payload, ...p]))
      socket.on('connect_error', () => {
        if (mode !== 'live') activateDemoMode()
      })
    } catch (e) {
      activateDemoMode()
    }

    function activateDemoMode() {
      setMode('demo')
      demoEngine.start()
    }

    const offStats = demoEngine.on('stats', (s) => { if (demoEngine.interval) setStats(s) })
    const offEvent = demoEngine.on('event', (e) => setLiveEvents((p) => [e, ...p].slice(0, 40)))
    const offDetection = demoEngine.on('detection', (e) => setLiveEvents((p) => [{ ...e, detected: true }, ...p].slice(0, 40)))
    const offAlert = demoEngine.on('alert', (a) => setAlerts((p) => [a, ...p]))
    const offNotif = demoEngine.on('notification', (n) => setNotifications((p) => [n, ...p]))

    return () => {
      clearTimeout(fallbackTimer)
      socket && socket.disconnect()
      demoEngine.stop()
      offStats(); offEvent(); offDetection(); offAlert(); offNotif()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const simulateThreat = useCallback((type) => {
    if (mode === 'live' && socketRef.current?.connected) {
      socketRef.current.emit('simulate-threat', { type })
      return null
    }
    return demoEngine.simulateThreat(type)
  }, [mode])

  const markNotificationsRead = useCallback(() => {
    setNotifications((p) => p.map((n) => ({ ...n, read: true })))
  }, [])

  const updateAlertStatus = useCallback((id, status) => {
    setAlerts((p) => p.map((a) => (a.id === id ? { ...a, status } : a)))
  }, [])

  return (
    <SocketContext.Provider value={{
      mode, stats, liveEvents, alerts, notifications,
      simulateThreat, markNotificationsRead, updateAlertStatus, setAlerts,
    }}>
      {children}
    </SocketContext.Provider>
  )
}

export function useRealtime() {
  const ctx = useContext(SocketContext)
  if (!ctx) throw new Error('useRealtime must be used within SocketProvider')
  return ctx
}
