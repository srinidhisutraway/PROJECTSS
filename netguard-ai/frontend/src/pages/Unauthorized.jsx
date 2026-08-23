import React from 'react'
import { Link } from 'react-router-dom'
import { Lock, ArrowLeft } from 'lucide-react'
import Button from '../components/ui/Button'
import Logo from '../components/Logo'

export default function Unauthorized() {
  return (
    <div className="min-h-screen bg-ink-50 flex flex-col items-center justify-center p-6 text-center">
      <Logo />
      <div className="w-20 h-20 rounded-2xl bg-crit-50 flex items-center justify-center my-6">
        <Lock className="w-10 h-10 text-crit-500" />
      </div>
      <h1 className="font-display text-3xl font-bold text-ink-900">Access restricted</h1>
      <p className="text-ink-500 mt-2 max-w-sm">You need to sign in to view this page.</p>
      <Link to="/login" className="mt-6"><Button icon={ArrowLeft}>Go to Login</Button></Link>
    </div>
  )
}
