import React, { useState } from 'react'
import { Bell, Shield, Palette, User as UserIcon, Sun, Moon, Smartphone, LogOut } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'

function Toggle({ checked, onChange, label, desc }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-ink-800">{label}</p>
        {desc && <p className="text-xs text-ink-400">{desc}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`w-11 h-6 rounded-full relative transition-colors ${checked ? 'bg-brand-600' : 'bg-ink-200'}`}
        aria-pressed={checked}
        aria-label={label}
      >
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  )
}

const TABS = [
  { key: 'account', label: 'Account', icon: UserIcon },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'security', label: 'Security', icon: Shield },
  { key: 'appearance', label: 'Appearance', icon: Palette },
]

export default function Settings() {
  const { user, logout } = useAuth()
  const [tab, setTab] = useState('account')
  const [notifs, setNotifs] = useState({ securityAlerts: true, criticalAlerts: true, weeklyReports: true, emailNotifs: false })
  const [twoFA, setTwoFA] = useState(false)
  const [theme, setTheme] = useState('light')

  return (
    <DashboardLayout title="Settings" subtitle="Manage your account preferences.">
      <div className="grid lg:grid-cols-4 gap-5">
        <Card className="lg:col-span-1 !p-3 h-fit">
          <nav className="space-y-1">
            {TABS.map((t) => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium ${tab === t.key ? 'bg-brand-50 text-brand-700' : 'text-ink-500 hover:bg-ink-50'}`}>
                <t.icon className="w-4 h-4" /> {t.label}
              </button>
            ))}
          </nav>
        </Card>

        <div className="lg:col-span-3 space-y-5">
          {tab === 'account' && (
            <Card>
              <h3 className="font-display font-semibold text-ink-900 mb-4">Account</h3>
              <div className="space-y-4">
                <div><label className="block text-sm font-medium text-ink-700 mb-1.5">Name</label><input defaultValue={user?.name} className="w-full px-4 py-2.5 rounded-xl border border-ink-200 text-sm" /></div>
                <div><label className="block text-sm font-medium text-ink-700 mb-1.5">Email</label><input defaultValue={user?.email} className="w-full px-4 py-2.5 rounded-xl border border-ink-200 text-sm" /></div>
                <div><label className="block text-sm font-medium text-ink-700 mb-1.5">Password</label><input type="password" defaultValue="Demo@1234" className="w-full px-4 py-2.5 rounded-xl border border-ink-200 text-sm" /></div>
                <Button>Save Account</Button>
              </div>
            </Card>
          )}

          {tab === 'notifications' && (
            <Card>
              <h3 className="font-display font-semibold text-ink-900 mb-2">Notifications</h3>
              <div className="divide-y divide-ink-100">
                <Toggle label="Security alerts" desc="Get notified about new detections" checked={notifs.securityAlerts} onChange={(v) => setNotifs({ ...notifs, securityAlerts: v })} />
                <Toggle label="Critical alerts" desc="Immediate notification for critical severity" checked={notifs.criticalAlerts} onChange={(v) => setNotifs({ ...notifs, criticalAlerts: v })} />
                <Toggle label="Weekly reports" desc="Receive a summary every week" checked={notifs.weeklyReports} onChange={(v) => setNotifs({ ...notifs, weeklyReports: v })} />
                <Toggle label="Email notifications" desc="Send notifications to your email" checked={notifs.emailNotifs} onChange={(v) => setNotifs({ ...notifs, emailNotifs: v })} />
              </div>
            </Card>
          )}

          {tab === 'security' && (
            <Card>
              <h3 className="font-display font-semibold text-ink-900 mb-2">Security</h3>
              <div className="divide-y divide-ink-100">
                <Toggle label="Two-factor authentication" desc="Add an extra layer of security to your account" checked={twoFA} onChange={setTwoFA} />
              </div>
              <div className="mt-4 pt-4 border-t border-ink-100">
                <p className="text-sm font-medium text-ink-800 mb-2">Active Sessions</p>
                <div className="flex items-center justify-between bg-ink-50 rounded-xl p-3 text-sm">
                  <div className="flex items-center gap-2"><Smartphone className="w-4 h-4 text-ink-400" /> This device — Chrome on Windows</div>
                  <span className="text-xs text-safe-600 font-medium">Active now</span>
                </div>
              </div>
              <Button variant="danger" icon={LogOut} className="mt-4" onClick={logout}>Logout From All Devices</Button>
            </Card>
          )}

          {tab === 'appearance' && (
            <Card>
              <h3 className="font-display font-semibold text-ink-900 mb-4">Appearance</h3>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setTheme('light')} className={`rounded-xl border-2 p-4 text-left ${theme === 'light' ? 'border-brand-500' : 'border-ink-200'}`}>
                  <Sun className="w-5 h-5 text-warn-500 mb-2" />
                  <p className="text-sm font-medium">Light Mode</p>
                  <p className="text-xs text-ink-400">Default</p>
                </button>
                <button onClick={() => setTheme('dark')} className={`rounded-xl border-2 p-4 text-left ${theme === 'dark' ? 'border-brand-500' : 'border-ink-200'}`}>
                  <Moon className="w-5 h-5 text-violet-500 mb-2" />
                  <p className="text-sm font-medium">Dark Mode</p>
                  <p className="text-xs text-ink-400">Coming soon in this demo build</p>
                </button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
