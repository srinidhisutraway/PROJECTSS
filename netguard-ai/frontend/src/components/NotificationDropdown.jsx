import React, { useState, useRef, useEffect } from 'react'
import { Bell, AlertTriangle, Info, ShieldAlert } from 'lucide-react'
import { useRealtime } from '../context/SocketContext'

const iconFor = (sev) => {
  if (sev === 'Critical' || sev === 'High') return <ShieldAlert className="w-4 h-4 text-crit-500" />
  if (sev === 'Medium') return <AlertTriangle className="w-4 h-4 text-warn-500" />
  return <Info className="w-4 h-4 text-brand-500" />
}

export default function NotificationDropdown() {
  const { notifications, markNotificationsRead } = useRealtime()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const unread = notifications.filter((n) => !n.read).length

  useEffect(() => {
    function onClick(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => { setOpen((o) => !o); if (!open) markNotificationsRead() }}
        aria-label="Notifications"
        className="relative p-2.5 rounded-xl hover:bg-ink-100 transition-colors"
      >
        <Bell className="w-5 h-5 text-ink-600" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-crit-500 text-white text-[10px] font-bold flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-ink-100 z-50 animate-in overflow-hidden">
          <div className="px-4 py-3 border-b border-ink-100 font-display font-semibold text-ink-800">Notifications</div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-ink-400">You're all caught up.</div>
            ) : notifications.slice(0, 8).map((n) => (
              <div key={n.id} className="px-4 py-3 border-b border-ink-50 hover:bg-ink-50/60 flex gap-3">
                <div className="mt-0.5">{iconFor(n.severity)}</div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink-800 truncate">{n.title}</p>
                  <p className="text-xs text-ink-500 truncate">{n.body}</p>
                  <p className="text-[11px] text-ink-400 mt-0.5">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
