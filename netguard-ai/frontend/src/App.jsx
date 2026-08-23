import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import Dashboard from './pages/Dashboard'
import NetworkMonitor from './pages/NetworkMonitor'
import TrafficAnalytics from './pages/TrafficAnalytics'
import IntrusionDetection from './pages/IntrusionDetection'
import AIDetection from './pages/AIDetection'
import Alerts from './pages/Alerts'
import Devices from './pages/Devices'
import IPAnalysis from './pages/IPAnalysis'
import Logs from './pages/Logs'
import Reports from './pages/Reports'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'
import Unauthorized from './pages/Unauthorized'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/network-monitor" element={<ProtectedRoute><NetworkMonitor /></ProtectedRoute>} />
      <Route path="/traffic-analytics" element={<ProtectedRoute><TrafficAnalytics /></ProtectedRoute>} />
      <Route path="/intrusion-detection" element={<ProtectedRoute><IntrusionDetection /></ProtectedRoute>} />
      <Route path="/ai-detection" element={<ProtectedRoute><AIDetection /></ProtectedRoute>} />
      <Route path="/alerts" element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
      <Route path="/alerts/:id" element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
      <Route path="/devices" element={<ProtectedRoute><Devices /></ProtectedRoute>} />
      <Route path="/ip-analysis" element={<ProtectedRoute><IPAnalysis /></ProtectedRoute>} />
      <Route path="/logs" element={<ProtectedRoute><Logs /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
