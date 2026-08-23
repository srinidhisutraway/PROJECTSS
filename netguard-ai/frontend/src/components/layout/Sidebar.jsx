import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Activity, BarChart3, ShieldAlert, BrainCircuit, Bell,
  Laptop2, Search, FileText, FileBarChart2, User, Settings, LogOut, Menu, X,
} from 'lucide-react'
import Logo from '../Logo'
import { useAuth } from '../../context/AuthContext'

const items = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/network-monitor', label: 'Network Monitor', icon: Activity },
  { to: '/traffic-analytics', label: 'Traffic Analytics', icon: BarChart3 },
  { to: '/intrusion-detection', label: 'Intrusion Detection', icon: ShieldAlert },
  { to: '/ai-detection', label: 'AI Detection', icon: BrainCircuit },
  { to: '/alerts', label: 'Alerts', icon: Bell },
  { to: '/devices', label: 'Devices', icon: Laptop2 },
  { to: '/ip-analysis', label: 'IP Analysis', icon: Search },
  { to: '/logs', label: 'Security Logs', icon: FileText },
  { to: '/reports', label: 'Reports', icon: FileBarChart2 },
]

const bottomItems = [
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { logout, user } = useAuth()

  const linkClass = ({ isActive }) =>
    `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
      isActive ? 'bg-gradient-to-r from-brand-600 to-cyan-500 text-white shadow-glow' : 'text-ink-500 hover:bg-ink-100 hover:text-ink-800'
    }`

  const SidebarInner = (
    <div className="flex flex-col h-full">
      <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-4 py-5`}>
        {!collapsed && <Logo size="sm" />}
        {collapsed && <Logo size="sm" withText={false} />}
        <button
          className="hidden lg:flex p-1.5 rounded-lg hover:bg-ink-100 text-ink-400"
          onClick={() => setCollapsed((c) => !c)}
          aria-label="Toggle sidebar"
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {items.map((it) => (
          <NavLink key={it.to} to={it.to} className={linkClass} onClick={() => setMobileOpen(false)}>
            <it.icon className="w-[18px] h-[18px] shrink-0" />
            {!collapsed && <span className="truncate">{it.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-3 border-t border-ink-100 space-y-1">
        {bottomItems.map((it) => (
          <NavLink key={it.to} to={it.to} className={linkClass} onClick={() => setMobileOpen(false)}>
            <it.icon className="w-[18px] h-[18px] shrink-0" />
            {!collapsed && <span className="truncate">{it.label}</span>}
          </NavLink>
        ))}
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-crit-500 hover:bg-crit-50 transition-colors"
        >
          <LogOut className="w-[18px] h-[18px]" />
          {!collapsed && <span>Logout</span>}
        </button>
        {!collapsed && (
          <div className="flex items-center gap-2.5 px-3 pt-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-brand-500 flex items-center justify-center text-white text-xs font-bold">
              {user?.name?.[0] || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-ink-800 truncate">{user?.name}</p>
              <p className="text-[11px] text-ink-400 truncate">{user?.role}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop */}
      <aside className={`hidden lg:flex flex-col shrink-0 bg-white border-r border-ink-100 transition-all duration-200 ${collapsed ? 'w-[76px]' : 'w-64'}`}>
        {SidebarInner}
      </aside>

      {/* Mobile trigger */}
      <button
        className="lg:hidden fixed top-4 left-4 z-40 p-2.5 rounded-xl bg-white shadow-soft border border-ink-100"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5 text-ink-700" />
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-ink-900/40" onClick={() => setMobileOpen(false)} />
          <div className="relative w-72 bg-white h-full animate-in shadow-2xl">
            <button
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-ink-100"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
            {SidebarInner}
          </div>
        </div>
      )}
    </>
  )
}
