import React from 'react'
import { Link } from 'react-router-dom'
import { ShieldOff, Home } from 'lucide-react'
import Button from '../components/ui/Button'
import Logo from '../components/Logo'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ink-50 flex flex-col items-center justify-center p-6 text-center">
      <Logo />
      <div className="w-20 h-20 rounded-2xl bg-brand-50 flex items-center justify-center my-6">
        <ShieldOff className="w-10 h-10 text-brand-500" />
      </div>
      <h1 className="font-display text-4xl font-bold text-ink-900">404</h1>
      <p className="text-ink-500 mt-2 max-w-sm">This page went dark. It might have moved, or never existed on this network.</p>
      <Link to="/" className="mt-6"><Button icon={Home}>Back to Home</Button></Link>
    </div>
  )
}
