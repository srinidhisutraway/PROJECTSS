import React, { useMemo, useState } from 'react'
import { FileText, Search, Download, ChevronLeft, ChevronRight } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Table from '../components/ui/Table'
import { generateLogs } from '../services/mockData'

const PAGE_SIZE = 10

export default function Logs() {
  const [logs] = useState(() => generateLogs(64))
  const [query, setQuery] = useState('')
  const [severity, setSeverity] = useState('All')
  const [sortDesc, setSortDesc] = useState(true)
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    let rows = logs.filter((l) =>
      (severity === 'All' || l.severity === severity) &&
      (!query || l.event.toLowerCase().includes(query.toLowerCase()) || l.sourceIP.includes(query))
    )
    rows = rows.sort((a, b) => sortDesc ? new Date(b.timestamp) - new Date(a.timestamp) : new Date(a.timestamp) - new Date(b.timestamp))
    return rows
  }, [logs, query, severity, sortDesc])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function exportCsv() {
    const header = ['Timestamp', 'Event', 'Source IP', 'Destination IP', 'Protocol', 'Port', 'Status', 'Severity']
    const rows = filtered.map((l) => [l.timestamp, l.event, l.sourceIP, l.destinationIP, l.protocol, l.port, l.status, l.severity])
    const csv = [header, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'netguard-security-logs.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  const columns = [
    { key: 'timestamp', header: 'Timestamp', render: (r) => new Date(r.timestamp).toLocaleString() },
    { key: 'event', header: 'Event' },
    { key: 'sourceIP', header: 'Source IP', render: (r) => <span className="font-mono text-xs">{r.sourceIP}</span> },
    { key: 'destinationIP', header: 'Destination IP', render: (r) => <span className="font-mono text-xs">{r.destinationIP}</span> },
    { key: 'protocol', header: 'Protocol' },
    { key: 'port', header: 'Port' },
    { key: 'status', header: 'Status', render: (r) => <Badge label={r.status} /> },
    { key: 'severity', header: 'Severity', render: (r) => <Badge label={r.severity} /> },
  ]

  return (
    <DashboardLayout title="Security Logs" subtitle="Detailed history of network and security events.">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
            <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1) }} placeholder="Search logs…"
              className="pl-10 pr-4 py-2.5 rounded-xl border border-ink-200 text-sm bg-white w-56" />
          </div>
          {['All', 'Low', 'Medium', 'High', 'Critical'].map((s) => (
            <button key={s} onClick={() => { setSeverity(s); setPage(1) }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold ${severity === s ? 'bg-brand-600 text-white' : 'bg-white border border-ink-200 text-ink-500'}`}>
              {s}
            </button>
          ))}
          <button onClick={() => setSortDesc((s) => !s)} className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white border border-ink-200 text-ink-500">
            {sortDesc ? 'Newest first' : 'Oldest first'}
          </button>
        </div>
        <Button size="sm" variant="secondary" icon={Download} onClick={exportCsv}>Export CSV</Button>
      </div>

      <Card>
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-brand-600" />
          <h3 className="font-display font-semibold text-ink-900">{filtered.length} Log Entries</h3>
        </div>
        <Table columns={columns} rows={paged} emptyTitle="No log entries found" />

        {filtered.length > 0 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-ink-100 text-sm">
            <p className="text-ink-400">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" icon={ChevronLeft} disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Prev</Button>
              <Button size="sm" variant="secondary" onClick={() => setPage((p) => p + 1)} disabled={page === totalPages}>
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </DashboardLayout>
  )
}
