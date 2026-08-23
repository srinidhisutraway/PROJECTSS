import React, { useState } from 'react'
import { User, Mail, AtSign, Shield, Calendar, Camera, Eye, EyeOff } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user, updateProfile } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [saved, setSaved] = useState(false)
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [pwSaved, setPwSaved] = useState(false)

  function saveProfile(e) {
    e.preventDefault()
    updateProfile({ name })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  function changePassword(e) {
    e.preventDefault()
    if (!pw.next || pw.next !== pw.confirm) return
    setPwSaved(true)
    setPw({ current: '', next: '', confirm: '' })
    setTimeout(() => setPwSaved(false), 2500)
  }

  return (
    <DashboardLayout title="Profile" subtitle="Manage your personal account details.">
      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-1 text-center">
          <div className="relative inline-block mx-auto">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-400 to-brand-500 flex items-center justify-center text-white text-3xl font-bold mx-auto">
              {user?.name?.[0] || 'U'}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white border border-ink-200 flex items-center justify-center shadow-soft" aria-label="Change photo">
              <Camera className="w-4 h-4 text-ink-600" />
            </button>
          </div>
          <h3 className="font-display font-semibold text-ink-900 mt-4">{user?.name}</h3>
          <p className="text-sm text-ink-500">{user?.role}</p>
          <div className="mt-6 space-y-3 text-left">
            <div className="flex items-center gap-2 text-sm text-ink-600"><Mail className="w-4 h-4 text-ink-400" /> {user?.email}</div>
            <div className="flex items-center gap-2 text-sm text-ink-600"><AtSign className="w-4 h-4 text-ink-400" /> {user?.username}</div>
            <div className="flex items-center gap-2 text-sm text-ink-600"><Shield className="w-4 h-4 text-ink-400" /> {user?.role}</div>
            <div className="flex items-center gap-2 text-sm text-ink-600"><Calendar className="w-4 h-4 text-ink-400" /> Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</div>
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-5">
          <Card>
            <h3 className="font-display font-semibold text-ink-900 mb-4">Edit Profile</h3>
            <form onSubmit={saveProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                  <input value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ink-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none text-sm" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button type="submit">Save Changes</Button>
                {saved && <span className="text-sm text-safe-600">Saved!</span>}
              </div>
            </form>
          </Card>

          <Card>
            <h3 className="font-display font-semibold text-ink-900 mb-4">Change Password</h3>
            <form onSubmit={changePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">Current Password</label>
                <input type={showPw ? 'text' : 'password'} value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-ink-200 text-sm" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ink-700 mb-1.5">New Password</label>
                  <input type={showPw ? 'text' : 'password'} value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-ink-200 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-700 mb-1.5">Confirm Password</label>
                  <input type={showPw ? 'text' : 'password'} value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-ink-200 text-sm" />
                </div>
              </div>
              <button type="button" onClick={() => setShowPw((s) => !s)} className="text-xs text-ink-500 flex items-center gap-1.5">
                {showPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />} {showPw ? 'Hide' : 'Show'} passwords
              </button>
              <div className="flex items-center gap-3">
                <Button type="submit" variant="secondary">Update Password</Button>
                {pwSaved && <span className="text-sm text-safe-600">Password updated!</span>}
              </div>
            </form>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
