import React from 'react'
import { ShieldCheck } from 'lucide-react'

export default function Logo({ size = 'md', withText = true, dark = false }) {
  const sizes = { sm: 'w-7 h-7', md: 'w-9 h-9', lg: 'w-12 h-12' }
  const textSizes = { sm: 'text-base', md: 'text-lg', lg: 'text-2xl' }
  return (
    <div className="flex items-center gap-2.5 select-none">
      <div className={`relative ${sizes[size]} rounded-xl bg-gradient-to-br from-brand-600 via-brand-500 to-cyan-400 flex items-center justify-center shadow-glow shrink-0`}>
        <ShieldCheck className="w-[58%] h-[58%] text-white" strokeWidth={2.4} />
        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-safe-500 ring-2 ring-white" />
      </div>
      {withText && (
        <span className={`font-display font-bold ${textSizes[size]} ${dark ? 'text-white' : 'text-ink-900'}`}>
          NetGuard <span className="gradient-text">AI</span>
        </span>
      )}
    </div>
  )
}
