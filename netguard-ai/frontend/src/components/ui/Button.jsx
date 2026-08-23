import React from 'react'
import { Loader2 } from 'lucide-react'

const variants = {
  primary: 'bg-gradient-to-r from-brand-600 to-cyan-500 text-white hover:shadow-glow hover:brightness-105',
  secondary: 'bg-white text-ink-700 border border-ink-200 hover:bg-ink-50',
  ghost: 'bg-transparent text-ink-600 hover:bg-ink-100',
  danger: 'bg-crit-500 text-white hover:bg-crit-600',
  success: 'bg-safe-500 text-white hover:bg-safe-600',
}

const sizes = {
  sm: 'text-xs px-3 py-1.5',
  md: 'text-sm px-4 py-2.5',
  lg: 'text-base px-6 py-3',
}

export default function Button({
  children, variant = 'primary', size = 'md', loading = false, icon: Icon,
  className = '', disabled, ...rest
}) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : Icon ? <Icon className="w-4 h-4" /> : null}
      {children}
    </button>
  )
}
