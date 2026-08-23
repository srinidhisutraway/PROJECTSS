import React from 'react'

export function SkeletonLine({ className = 'h-4 w-full' }) {
  return <div className={`skeleton rounded-md ${className}`} />
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-ink-100 shadow-soft p-5 space-y-3">
      <SkeletonLine className="h-3 w-24" />
      <SkeletonLine className="h-7 w-16" />
      <SkeletonLine className="h-3 w-32" />
    </div>
  )
}

export function SkeletonTable({ rows = 5, cols = 5 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4">
          {Array.from({ length: cols }).map((__, c) => (
            <SkeletonLine key={c} className="h-8 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function SkeletonChart() {
  return <div className="skeleton rounded-xl w-full h-64" />
}
