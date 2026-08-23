import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Logo from '../Logo'
import Button from '../ui/Button'

const navItems = [
  { to: '/#features', label: 'Features' },
  { to: '/#how-it-works', label: 'How It Works' },
  { to: '/#about', label: 'About' },
]

export function PublicNavbar() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-ink-100">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 flex items-center justify-between py-4">
        <Link to="/"><Logo /></Link>
        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/" className="text-sm font-medium text-ink-600 hover:text-brand-600">Home</NavLink>
          {navItems.map((n) => (
            <a key={n.to} href={n.to} className="text-sm font-medium text-ink-600 hover:text-brand-600">{n.label}</a>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-3">
          <Link to="/login"><Button variant="ghost" size="sm">Login</Button></Link>
          <Link to="/signup"><Button size="sm">Get Started</Button></Link>
        </div>
        <button className="md:hidden p-2" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden px-5 pb-4 space-y-3 animate-in">
          <NavLink to="/" className="block text-sm font-medium text-ink-600">Home</NavLink>
          {navItems.map((n) => <a key={n.to} href={n.to} className="block text-sm font-medium text-ink-600">{n.label}</a>)}
          <div className="flex gap-3 pt-2">
            <Link to="/login" className="flex-1"><Button variant="secondary" size="sm" className="w-full">Login</Button></Link>
            <Link to="/signup" className="flex-1"><Button size="sm" className="w-full">Get Started</Button></Link>
          </div>
        </div>
      )}
    </header>
  )
}

export function PublicFooter() {
  return (
    <footer id="about" className="bg-ink-900 text-ink-300 mt-24">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <Logo dark />
          <p className="mt-4 text-sm text-ink-400 max-w-sm">
            NetGuard AI is a college capstone project demonstrating a modern intrusion-detection and
            network-monitoring platform. Built for authorized lab / simulated environments only.
          </p>
        </div>
        <div>
          <h5 className="text-white font-semibold text-sm mb-3">Product</h5>
          <ul className="space-y-2 text-sm">
            <li><a href="/#features" className="hover:text-white">Features</a></li>
            <li><a href="/#how-it-works" className="hover:text-white">How it works</a></li>
            <li><Link to="/login" className="hover:text-white">Login</Link></li>
            <li><Link to="/signup" className="hover:text-white">Get Started</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="text-white font-semibold text-sm mb-3">Project</h5>
          <ul className="space-y-2 text-sm">
            <li>Computer Science Capstone</li>
            <li>Defensive security demo</li>
            <li>Simulated / lab data only</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-800 py-5 text-center text-xs text-ink-500">
        © {new Date().getFullYear()} NetGuard AI — Intelligent protection. Real-time visibility.
      </div>
    </footer>
  )
}

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />
      {children}
      <PublicFooter />
    </div>
  )
}
