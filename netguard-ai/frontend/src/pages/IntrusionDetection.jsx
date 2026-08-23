import React, { useMemo, useState } from 'react'
import { ShieldAlert, Search } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Table from '../components/ui/Table'
import Modal from '../components/ui/Modal'
import Button from '../components/ui/Button'
import { useRealtime } from '../context/SocketContext'
import { generateAlerts } from '../services/mockData'

export default function IntrusionDetection() {
  const { alerts: liveAlerts } = useRealtime()
  const [seed] = useState(() => generateAlerts(20))
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)

  const events = useMemo(() => [...liveAlerts, ...seed], [liveAlerts, seed])

  const filtered = events.filter((e) =>
    !query || e.type.toLowerCase().includes(query.toLowerCase()) || e.sourceIP.includes(query)
  )

  const columns = [
    { key: 'type', header: 'Attack Type', render: (r) => <span className="font-medium text-ink-800">{r.type}</span> },
    { key: 'sourceIP', header: 'Source IP' },
    { key: 'destinationIP', header: 'Destination IP' },
    { key: 'port', header: 'Port' },
    { key: 'protocol', header: 'Protocol' },
    { key: 'severity', header: 'Severity', render: (r) => <Badge label={r.severity} /> },
    { key: 'confidence', header: 'Confidence', render: (r) => `${r.confidence}%` },
    { key: 'status', header: 'Status', render: (r) => <Badge label={r.status} /> },
    { key: 'timestamp', header: 'Time', render: (r) => new Date(r.timestamp).toLocaleString() },
  ]

  return (
    <DashboardLayout title="Intrusion Detection" subtitle="Rule-based and AI-assisted detection of network attacks.">
      <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
          <input
            value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by attack type or IP…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ink-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none text-sm bg-white"
          />
        </div>
        <div className="flex gap-2 flex-wrap text-xs">
          {['Port Scan', 'Brute Force', 'DoS', 'Suspicious Connection', 'Abnormal Traffic', 'Unauthorized Access', 'Malware-like Activity'].map((t) => (
            <button key={t} onClick={() => setQuery(t)} className="px-2.5 py-1 rounded-full bg-white border border-ink-200 text-ink-500 hover:border-brand-400 hover:text-brand-600">{t}</button>
          ))}
        </div>
      </div>

      <Card>
        <div className="flex items-center gap-2 mb-4">
          <ShieldAlert className="w-5 h-5 text-brand-600" />
          <h3 className="font-display font-semibold text-ink-900">Detected Events ({filtered.length})</h3>
        </div>
        <Table columns={columns} rows={filtered} onRowClick={setSelected} emptyTitle="No intrusion events found" emptyDescription="Try adjusting your search or trigger a simulated threat from the top bar." />
      </Card>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.type} size="md"
        footer={<><Button variant="secondary" onClick={() => setSelected(null)}>Close</Button><Button>Investigate</Button></>}>
        {selected && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-ink-400 text-xs">Source IP</p><p className="font-medium">{selected.sourceIP}</p></div>
              <div><p className="text-ink-400 text-xs">Destination IP</p><p className="font-medium">{selected.destinationIP}</p></div>
              <div><p className="text-ink-400 text-xs">Port</p><p className="font-medium">{selected.port}</p></div>
              <div><p className="text-ink-400 text-xs">Protocol</p><p className="font-medium">{selected.protocol}</p></div>
              <div><p className="text-ink-400 text-xs">Confidence</p><p className="font-medium">{selected.confidence}%</p></div>
              <div><p className="text-ink-400 text-xs">Severity</p><Badge label={selected.severity} /></div>
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
