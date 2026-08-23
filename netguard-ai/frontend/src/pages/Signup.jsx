import React, { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, AtSign, Chrome, ShieldCheck, Check, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'
import Logo from '../components/Logo'

function scorePassword(pw) {
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return score
}

const strengthLabels = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong']
const strengthColors = ['bg-crit-500', 'bg-crit-500', 'bg-warn-500', 'bg-brand-500', 'bg-safe-500']

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [showPw, setShowPw] = useState(false)
  const [showPw2, setShowPw2] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ fullName: '', email: '', username: '', password: '', confirm: '', terms: false })

  const strength = useMemo(() => scorePassword(form.password), [form.password])

  const errors = useMemo(() => {
    const e = {}
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address.'
    if (form.username && form.username.length < 3) e.username = 'Username must be at least 3 characters.'
    if (form.confirm && form.confirm !== form.password) e.confirm = 'Passwords do not match.'
    return e
  }, [form])

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.fullName || !form.email || !form.username || !form.password || !form.confirm) {
      setError('Please fill in all fields.'); return
    }
    if (Object.keys(errors).length) { setError('Please fix the highlighted fields.'); return }
    if (strength < 2) { setError('Please choose a stronger password.'); return }
    if (!form.terms) { setError('You must accept the Terms & Conditions.'); return }

    setLoading(true)
    const res = await signup({ name: form.fullName, email: form.email, username: form.username, password: form.password })
    setLoading(false)
    if (res.ok) navigate('/dashboard')
    else setError(res.error)
  }

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-ink-50">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-block mb-8"><Logo /></Link>
          <h1 className="font-display text-2xl font-bold text-ink-900">Create your account</h1>
          <p className="text-ink-500 text-sm mt-1 mb-8">Start monitoring your network in minutes.</p>

          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 border border-ink-200 rounded-xl py-2.5 text-sm font-medium text-ink-700 bg-white hover:bg-ink-50 mb-5"
            onClick={() => setError('Google sign-in is a UI placeholder in this demo build.')}
          >
            <Chrome className="w-4 h-4" /> Sign up with Google
          </button>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px bg-ink-200 flex-1" /><span className="text-xs text-ink-400">or</span><div className="h-px bg-ink-200 flex-1" />
          </div>

          {error && <div className="mb-4 text-sm bg-crit-50 text-crit-600 px-3 py-2.5 rounded-xl">{error}</div>}

          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-ink-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                <input id="fullName" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ink-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none text-sm"
                  value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Alex Morgan" />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ink-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                <input id="email" type="email" className={`w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none text-sm ${errors.email ? 'border-crit-400' : 'border-ink-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100'}`}
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@company.com" />
              </div>
              {errors.email && <p className="text-xs text-crit-500 mt-1">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-ink-700 mb-1.5">Username</label>
              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                <input id="username" className={`w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none text-sm ${errors.username ? 'border-crit-400' : 'border-ink-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100'}`}
                  value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="alex.morgan" />
              </div>
              {errors.username && <p className="text-xs text-crit-500 mt-1">{errors.username}</p>}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-ink-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                <input id="password" type={showPw ? 'text' : 'password'} className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-ink-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none text-sm"
                  value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
                <button type="button" onClick={() => setShowPw((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400" aria-label="Toggle password visibility">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className={`h-1.5 flex-1 rounded-full ${i < strength ? strengthColors[strength] : 'bg-ink-100'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-ink-400 mt-1">{strengthLabels[strength]}</p>
                </div>
              )}
            </div>
            <div>
              <label htmlFor="confirm" className="block text-sm font-medium text-ink-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                <input id="confirm" type={showPw2 ? 'text' : 'password'} className={`w-full pl-10 pr-10 py-2.5 rounded-xl border outline-none text-sm ${errors.confirm ? 'border-crit-400' : 'border-ink-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100'}`}
                  value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} placeholder="••••••••" />
                <button type="button" onClick={() => setShowPw2((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400" aria-label="Toggle password visibility">
                  {showPw2 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.confirm && (
                <p className={`text-xs mt-1 flex items-center gap-1 ${errors.confirm ? 'text-crit-500' : 'text-safe-600'}`}>
                  {errors.confirm ? <X className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                  {errors.confirm || 'Passwords match'}
                </p>
              )}
            </div>
            <label className="flex items-start gap-2 text-sm text-ink-600">
              <input type="checkbox" checked={form.terms} onChange={(e) => setForm({ ...form, terms: e.target.checked })} className="mt-0.5 rounded border-ink-300 text-brand-600 focus:ring-brand-500" />
              <span>I agree to the <span className="text-brand-600 font-medium">Terms & Conditions</span> and <span className="text-brand-600 font-medium">Privacy Policy</span>.</span>
            </label>
            <Button type="submit" className="w-full" loading={loading}>Create Account</Button>
          </form>

          <p className="text-center text-sm text-ink-500 mt-8">
            Already have an account? <Link to="/login" className="text-brand-600 font-medium hover:underline">Login</Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-violet-600 via-brand-600 to-cyan-500 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 80% 30%, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="relative text-white max-w-md">
          <ShieldCheck className="w-14 h-14 mb-6 animate-float" />
          <h2 className="font-display text-3xl font-bold mb-4">Join teams protecting their networks with NetGuard AI</h2>
          <ul className="space-y-3 text-sm text-brand-50">
            {['Real-time traffic monitoring', 'AI-assisted intrusion detection', 'One-click threat simulation for demos'].map((t) => (
              <li key={t} className="flex items-center gap-2"><Check className="w-4 h-4" /> {t}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
