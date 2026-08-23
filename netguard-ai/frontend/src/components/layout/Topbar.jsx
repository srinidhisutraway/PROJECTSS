import React from 'react'
import { Zap, Radio } from 'lucide-react'
import NotificationDropdown from '../NotificationDropdown'
import { useRealtime } from '../../context/SocketContext'
import Button from '../ui/Button'

export default function Topbar({ title, subtitle }) {
  const { mode, simulateThreat } = useRealtime()

  return (
    <header className="sticky top-0 z-30 bg-ink-50/80 backdrop-blur-md border-b border-ink-100">
      <div className="flex items-center justify-between px-5 lg:px-8 py-4">
        <div className="pl-10 lg:pl-0">
          {title && <h1 className="font-display font-bold text-xl text-ink-900">{title}</h1>}
          {subtitle && <p className="text-sm text-ink-500">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-3">
          <span className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
            mode === 'live' ? 'bg-safe-50 text-safe-600' : mode === 'demo' ? 'bg-violet-50 text-violet-600' : 'bg-ink-100 text-ink-400'
          }`}>
            <Radio className="w-3 h-3" />
            {mode === 'live' ? 'LIVE' : mode === 'demo' ? 'DEMO SIMULATION' : 'CONNECTING…'}
          </span>
          <Button size="sm" variant="secondary" icon={Zap} onClick={() => simulateThreat()}>
            Simulate Threat
          </Button>
          <NotificationDropdown />
        </div>
      </div>
    </header>
  )
}
