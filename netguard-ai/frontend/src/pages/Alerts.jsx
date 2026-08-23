import React, { useMemo, useState } from 'react'
import { Bell, Eye, CheckCircle2, EyeOff, Search as SearchIcon } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import EmptyState from '../components/ui/EmptyState'
import { useRealtime } from '../context/SocketContext'

const FILTERS = ['All', 'Critical', 'High', 'Medium', 'Low', 'Resolved', 'Unresolved']

export default function Alerts() {
  const { alerts, updateAlertStatus } = useRealtime()
  const [filter, setFilter] = useState('All')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)

  const filtered = useMemo(() => alerts.filter((a) => {
    const matchesFilter = filter === 'All' || a.severity === filter || a.status === filter
    const matchesQuery = !query || a.title.toLowerCase().includes(query.toLowerCase()) || a.sourceIP.includes(query)
    return matchesFilter && matchesQuery
  }), [alerts, filter, query])

  const criticalCount = alerts.filter((a) => a.severity === 'Critical' && a.status !== 'Resolved').length

  return (
    <DashboardLayout title="Security Alerts" subtitle="Every detected threat, in one place.">
      {criticalCount > 0 && (
        <div className="mb-5 flex items-center gap-3 bg-crit-50 border border-crit-100 text-crit-700 rounded-xl px-4 py-3 text-sm">
          <Bell className="w-4 h-4 shrink-0" />
          {criticalCount} critical alert{criticalCount > 1 ? 's' : ''} need{criticalCount === 1 ? 's' : ''} your attention.
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${filter === f ? 'bg-brand-600 text-white' : 'bg-white border border-ink-200 text-ink-500 hover:border-brand-400'}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search alerts…"
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-ink-200 text-sm bg-white" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card><EmptyState icon={Bell} title="No security events found" description="Nothing matches your current filters. Try clearing them or simulate a threat from the top bar." /></Card>
      ) : (
        <div className="grid gap-3">
          {filtered.map((a) => (
            <Card key={a.id} hover className="!p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
              <div className={`w-1.5 self-stretch rounded-full ${a.severity === 'Critical' ? 'bg-crit-500' : a.severity === 'High' ? 'bg-orange-500' : a.severity === 'Medium' ? 'bg-warn-500' : 'bg-safe-500'}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-ink-800 truncate">{a.title}</p>
                  <Badge label={a.severity} />
                  <Badge label={a.status} />
                </div>
                <p className="text-xs text-ink-400 mt-1">{a.type} • {new Date(a.timestamp).toLocaleString()}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button size="sm" variant="secondary" icon={Eye} onClick={() => setSelected(a)}>View</Button>
                {a.status !== 'Resolved' && (
                  <Button size="sm" variant="success" icon={CheckCircle2} onClick={() => updateAlertStatus(a.id, 'Resolved')}>Resolve</Button>
                )}
                <Button size="sm" variant="ghost" icon={EyeOff} onClick={() => updateAlertStatus(a.id, 'Investigating')}>Investigate</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Threat Information" size="md"
        footer={<>
          <Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>
          <Button variant="success" icon={CheckCircle2} onClick={() => { updateAlertStatus(selected.id, 'Resolved'); setSelected(null) }}>Mark Resolved</Button>
        </>}>
        {selected && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-ink-400 text-xs">Attack Type</p><p className="font-medium">{selected.type}</p></div>
              <div><p className="text-ink-400 text-xs">Severity</p><Badge label={selected.severity} /></div>
              <div><p className="text-ink-400 text-xs">Source IP</p><p className="font-medium">{selected.sourceIP}</p></div>
              <div><p className="text-ink-400 text-xs">Destination</p><p className="font-medium">{selected.destinationIP}</p></div>
              <div><p className="text-ink-400 text-xs">Port</p><p className="font-medium">{selected.port}</p></div>
              <div><p className="text-ink-400 text-xs">Protocol</p><p className="font-medium">{selected.protocol}</p></div>
              <div><p className="text-ink-400 text-xs">Confidence</p><p className="font-medium">{selected.confidence}%</p></div>
              <div><p className="text-ink-400 text-xs">Timestamp</p><p className="font-medium">{new Date(selected.timestamp).toLocaleString()}</p></div>
            </div>
            <div className="bg-ink-50 rounded-xl p-4">
              <p className="font-semibold text-ink-800 mb-1">Why was this detected?</p>
              <p className="text-ink-600">{selected.description}</p>
            </div>
            <div className="bg-brand-50 rounded-xl p-4">
              <p className="font-semibold text-brand-800 mb-1">Recommended Action</p>
              <p className="text-brand-700">{selected.recommendation}</p>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  )
}
