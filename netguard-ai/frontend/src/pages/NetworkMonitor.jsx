import React, { useEffect, useState } from 'react'
import { Download, Upload, Activity, Wifi, ShieldAlert, Gauge } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import LineAreaChart from '../components/charts/LineAreaChart'
import EmptyState from '../components/ui/EmptyState'
import { useRealtime } from '../context/SocketContext'
import { generateTrafficSeries } from '../services/mockData'

export default function NetworkMonitor() {
  const { stats, liveEvents, mode } = useRealtime()
  const [series, setSeries] = useState(generateTrafficSeries(16))

  useEffect(() => {
    setSeries((prev) => {
      const next = [...prev.slice(1), {
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        incoming: stats.incoming || prev.at(-1)?.incoming || 200,
        outgoing: stats.outgoing || prev.at(-1)?.outgoing || 150,
        suspicious: stats.suspicious || 0,
      }]
      return next
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stats])

  const metrics = [
    { icon: Download, label: 'Incoming Traffic', value: `${stats.incoming || 0} KB/s`, color: 'from-brand-500 to-brand-600' },
    { icon: Upload, label: 'Outgoing Traffic', value: `${stats.outgoing || 0} KB/s`, color: 'from-cyan-500 to-cyan-600' },
    { icon: Activity, label: 'Active Connections', value: stats.activeConnections || 0, color: 'from-violet-500 to-violet-600' },
    { icon: Wifi, label: 'Packets / sec', value: stats.packetsPerSec || 0, color: 'from-safe-500 to-safe-600' },
    { icon: Gauge, label: 'Bandwidth Usage', value: `${stats.bandwidthMbps || 0} Mbps`, color: 'from-warn-500 to-warn-600' },
    { icon: ShieldAlert, label: 'Suspicious Traffic', value: stats.suspicious || 0, color: 'from-crit-500 to-crit-600' },
  ]

  return (
    <DashboardLayout title="Network Monitor" subtitle="Live view of traffic flowing across your network.">
      <div className="flex items-center justify-between mb-5">
        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${mode === 'live' ? 'bg-safe-50 text-safe-600' : 'bg-violet-50 text-violet-600'}`}>
          <span className="w-2 h-2 rounded-full bg-current animate-pulse-slow" />
          {mode === 'live' ? 'LIVE — connected to backend' : 'DEMO SIMULATION — no backend connected'}
        </span>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
        {metrics.map((m) => (
          <Card key={m.label} hover>
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center mb-3`}>
              <m.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-display font-bold text-ink-900">{m.value}</p>
            <p className="text-xs text-ink-500 mt-1">{m.label}</p>
          </Card>
        ))}
      </div>

      <Card className="mb-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-ink-900">Traffic Flow</h3>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-crit-500">
            <span className="w-2 h-2 rounded-full bg-crit-500 animate-pulse-slow" /> LIVE
          </span>
        </div>
        <LineAreaChart
          data={series}
          series={[
            { key: 'incoming', name: 'Incoming', color: '#3184ff' },
            { key: 'outgoing', name: 'Outgoing', color: '#06b6d4' },
            { key: 'suspicious', name: 'Suspicious', color: '#ef4444' },
          ]}
          height={280}
        />
      </Card>

      <Card>
        <h3 className="font-display font-semibold text-ink-900 mb-4">Recent Network Events</h3>
        {liveEvents.length === 0 ? (
          <EmptyState title="No recent events" description="Live and simulated events will appear here as they occur." />
        ) : (
          <ul className="divide-y divide-ink-100">
            {liveEvents.slice(0, 12).map((e) => (
              <li key={e.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${e.type === 'Normal Traffic' ? 'bg-safe-500' : 'bg-crit-500'}`} />
                  <div>
                    <p className="text-sm font-medium text-ink-800">{e.type}{e.sourceIP ? ` — ${e.sourceIP}` : ''}</p>
                    <p className="text-xs text-ink-400">{new Date(e.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
                {e.type !== 'Normal Traffic' && <Badge label={e.detected ? 'Investigating' : 'Unresolved'} />}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </DashboardLayout>
  )
}
