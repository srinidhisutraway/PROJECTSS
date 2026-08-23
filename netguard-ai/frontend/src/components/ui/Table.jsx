import React from 'react'
import { SkeletonTable } from './Skeleton'
import EmptyState from './EmptyState'

// Generic reusable table.
// columns: [{ key, header, render? }]
export default function Table({ columns, rows, loading = false, emptyTitle = 'No records found', emptyDescription = '', onRowClick }) {
  if (loading) return <SkeletonTable rows={6} cols={columns.length} />
  if (!rows || rows.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />
  }

  return (
    <div className="overflow-x-auto -mx-2">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-ink-400 text-xs uppercase tracking-wide">
            {columns.map((c) => (
              <th key={c.key} className="px-3 py-2 font-medium">{c.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.id || i}
              onClick={() => onRowClick?.(row)}
              className={`border-t border-ink-100 ${onRowClick ? 'cursor-pointer hover:bg-brand-50/40' : ''} transition-colors`}
            >
              {columns.map((c) => (
                <td key={c.key} className="px-3 py-3 text-ink-700 whitespace-nowrap">
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
