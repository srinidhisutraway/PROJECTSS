// Central API service layer.
// All backend calls (real Node/Express + MongoDB) go through this axios instance.
// In demo mode (no backend reachable) contexts fall back to mockData/demoEngine instead.
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('netguard_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem('netguard_token')
      localStorage.removeItem('netguard_user')
    }
    return Promise.reject(err)
  }
)

// ---- Auth ----
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  signup: (data) => api.post('/auth/signup', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  me: () => api.get('/auth/me'),
}

// ---- Dashboard ----
export const dashboardAPI = {
  overview: () => api.get('/dashboard/overview'),
  securityScore: () => api.get('/dashboard/security-score'),
}

// ---- Alerts ----
export const alertsAPI = {
  list: (params) => api.get('/alerts', { params }),
  get: (id) => api.get(`/alerts/${id}`),
  updateStatus: (id, status) => api.patch(`/alerts/${id}`, { status }),
}

// ---- Devices ----
export const devicesAPI = {
  list: (params) => api.get('/devices', { params }),
  get: (id) => api.get(`/devices/${id}`),
}

// ---- Network Events ----
export const eventsAPI = {
  list: (params) => api.get('/events', { params }),
  simulate: (type) => api.post('/events/simulate', { type }),
}

// ---- Logs ----
export const logsAPI = {
  list: (params) => api.get('/logs', { params }),
  exportCsv: (params) => api.get('/logs/export', { params, responseType: 'blob' }),
}

// ---- Reports ----
export const reportsAPI = {
  list: () => api.get('/reports'),
  generate: (params) => api.post('/reports/generate', params),
}

// ---- IP Intelligence ----
export const ipAPI = {
  lookup: (ip) => api.get(`/events/ip-lookup/${ip}`),
}

// ---- ML Prediction (proxied through backend -> ml-service) ----
export const mlAPI = {
  predict: (features) => api.post('/events/predict', features),
  metrics: () => api.get('/events/model-metrics'),
}

export default api
