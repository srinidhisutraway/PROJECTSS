import React from 'react'

const styles = {
  Low: 'bg-safe-50 text-safe-600 ring-1 ring-safe-500/20',
  Medium: 'bg-warn-50 text-warn-600 ring-1 ring-warn-500/20',
  High: 'bg-orange-50 text-orange-600 ring-1 ring-orange-500/20',
  Critical: 'bg-crit-50 text-crit-600 ring-1 ring-crit-500/20',
  Online: 'bg-safe-50 text-safe-600 ring-1 ring-safe-500/20',
  Offline: 'bg-ink-100 text-ink-500 ring-1 ring-ink-300/40',
  Suspicious: 'bg-crit-50 text-crit-600 ring-1 ring-crit-500/20',
  Resolved: 'bg-safe-50 text-safe-600 ring-1 ring-safe-500/20',
  Unresolved: 'bg-warn-50 text-warn-600 ring-1 ring-warn-500/20',
  Investigating: 'bg-brand-50 text-brand-700 ring-1 ring-brand-500/20',
  Allowed: 'bg-safe-50 text-safe-600 ring-1 ring-safe-500/20',
  Blocked: 'bg-crit-50 text-crit-600 ring-1 ring-crit-500/20',
  Flagged: 'bg-warn-50 text-warn-600 ring-1 ring-warn-500/20',
  Info: 'bg-brand-50 text-brand-700 ring-1 ring-brand-500/20',
}

const dot = {
  Low: 'bg-safe-500', Medium: 'bg-warn-500', High: 'bg-orange-500', Critical: 'bg-crit-500',
  Online: 'bg-safe-500', Offline: 'bg-ink-400', Suspicious: 'bg-crit-500',
  Resolved: 'bg-safe-500', Unresolved: 'bg-warn-500', Investigating: 'bg-brand-500',
  Allowed: 'bg-safe-500', Blocked: 'bg-crit-500', Flagged: 'bg-warn-500', Info: 'bg-brand-500',
}

export default function Badge({ label, withDot = true, className = '' }) {
  const style = styles[label] || 'bg-ink-100 text-ink-600 ring-1 ring-ink-300/40'
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${style} ${className}`}>
      {withDot && <span className={`w-1.5 h-1.5 rounded-full ${dot[label] || 'bg-ink-400'}`} />}
      {label}
    </span>
  )
}
