import React, { useMemo, useState } from 'react'
import { Laptop2, Search, Filter } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Table from '../components/ui/Table'
import Modal from '../components/ui/Modal'
import { generateDevices } from '../services/mockData'

export default function Devices() {
  const [devices] = useState(() => generateDevices(16))
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All')
  const [selected, setSelected] = useState(null)

  const filtered = useMemo(() => devices.filter((d) =>
    (status === 'All' || d.status === status) &&
    (!query || d.name.toLowerCase().includes(query.toLowerCase()) || d.ip.includes(query))
  ), [devices, query, status])

  const columns = [
    { key: 'name', header: 'Device', render: (r) => <span className="font-medium text-ink-800">{r.name}</span> },
    { key: 'ip', header: 'IP Address', render: (r) => <span className="font-mono text-xs">{r.ip}</span> },
    { key: 'mac', header: 'MAC Address', render: (r) => <span className="font-mono text-xs">{r.mac}</span> },
    { key: 'status', header: 'Status', render: (r) => <Badge label={r.status} /> },
    { key: 'riskLevel', header: 'Risk Level', render: (r) => <Badge label={r.riskLevel} /> },
    { key: 'lastActive', header: 'Last Active', render: (r) => new Date(r.lastActive).toLocaleString() },
  ]

  return (
    <DashboardLayout title="Network Devices" subtitle="Every device seen on your network.">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or IP…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ink-200 text-sm bg-white" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-ink-400" />
          {['All', 'Online', 'Offline', 'Suspicious'].map((s) => (
            <button key={s} onClick={() => setStatus(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold ${status === s ? 'bg-brand-600 text-white' : 'bg-white border border-ink-200 text-ink-500'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Laptop2 className="w-5 h-5 text-brand-600" />
          <h3 className="font-display font-semibold text-ink-900">{filtered.length} Devices</h3>
        </div>
        <Table columns={columns} rows={filtered} onRowClick={setSelected} emptyTitle="No devices match your filters" />
      </Card>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name} size="sm">
        {selected && (
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-ink-400">IP Address</span><span className="font-mono">{selected.ip}</span></div>
            <div className="flex justify-between"><span className="text-ink-400">MAC Address</span><span className="font-mono">{selected.mac}</span></div>
            <div className="flex justify-between items-center"><span className="text-ink-400">Status</span><Badge label={selected.status} /></div>
            <div className="flex justify-between items-center"><span className="text-ink-400">Risk Level</span><Badge label={selected.riskLevel} /></div>
            <div className="flex justify-between"><span className="text-ink-400">Last Active</span><span>{new Date(selected.lastActive).toLocaleString()}</span></div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  )
}
