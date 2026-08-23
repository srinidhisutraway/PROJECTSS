import React from 'react'
import { Inbox } from 'lucide-react'

export default function EmptyState({ icon: Icon = Inbox, title = 'Nothing here yet', description = '', action = null }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-50 to-violet-50 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-brand-500" />
      </div>
      <h4 className="font-display font-semibold text-ink-800 mb-1">{title}</h4>
      {description && <p className="text-sm text-ink-500 max-w-sm mb-4">{description}</p>}
      {action}
    </div>
  )
}
