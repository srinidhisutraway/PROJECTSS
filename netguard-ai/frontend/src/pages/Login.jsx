import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, ShieldCheck, Chrome } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'
import Logo from '../components/Logo'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ identifier: '', password: '', remember: true })

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.identifier || !form.password) {
      setError('Please fill in both fields.')
      return
    }
    setLoading(true)
    const res = await login(form)
    setLoading(false)
    if (res.ok) {
      navigate(location.state?.from?.pathname || '/dashboard')
    } else {
      setError(res.error)
    }
  }

  function fillDemo() {
    setForm({ identifier: 'demo@netguard.ai', password: 'Demo@1234', remember: true })
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-brand-700 via-brand-600 to-cyan-500 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="relative text-white max-w-md">
          <ShieldCheck className="w-14 h-14 mb-6 animate-float" />
          <h2 className="font-display text-3xl font-bold mb-4">Welcome back to NetGuard AI</h2>
          <p className="text-brand-50">Sign in to review live alerts, monitor your network in real time, and keep your infrastructure protected.</p>
          <div className="mt-8 bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/20">
            <p className="text-sm font-semibold mb-1">Try the demo instantly</p>
            <p className="text-xs text-brand-50">demo@netguard.ai / Demo@1234</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-ink-50">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-block mb-8"><Logo /></Link>
          <h1 className="font-display text-2xl font-bold text-ink-900">Sign in to your account</h1>
          <p className="text-ink-500 text-sm mt-1 mb-8">Enter your credentials to access your dashboard.</p>

          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 border border-ink-200 rounded-xl py-2.5 text-sm font-medium text-ink-700 bg-white hover:bg-ink-50 mb-5"
            onClick={() => setError('Google sign-in is a UI placeholder in this demo build.')}
          >
            <Chrome className="w-4 h-4" /> Sign in with Google
          </button>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px bg-ink-200 flex-1" /><span className="text-xs text-ink-400">or</span><div className="h-px bg-ink-200 flex-1" />
          </div>

          {error && <div className="mb-4 text-sm bg-crit-50 text-crit-600 px-3 py-2.5 rounded-xl">{error}</div>}

          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-ink-700 mb-1.5">Email or Username</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                <input
                  id="identifier" type="text" autoComplete="username"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ink-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none text-sm"
                  value={form.identifier} onChange={(e) => setForm({ ...form, identifier: e.target.value })}
                  placeholder="you@company.com"
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-ink-700">Password</label>
                <Link to="/forgot-password" className="text-xs font-medium text-brand-600 hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                <input
                  id="password" type={showPw ? 'text' : 'password'} autoComplete="current-password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-ink-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none text-sm"
                  value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPw((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400" aria-label="Toggle password visibility">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-ink-600">
              <input type="checkbox" checked={form.remember} onChange={(e) => setForm({ ...form, remember: e.target.checked })} className="rounded border-ink-300 text-brand-600 focus:ring-brand-500" />
              Remember me
            </label>
            <Button type="submit" className="w-full" loading={loading}>Login</Button>
          </form>

          <button onClick={fillDemo} className="w-full mt-4 text-xs text-center text-brand-600 hover:underline">
            Use demo credentials
          </button>

          <p className="text-center text-sm text-ink-500 mt-8">
            Don't have an account? <Link to="/signup" className="text-brand-600 font-medium hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
