import React, { useEffect, useMemo, useState } from 'react'
import {
  Laptop2, Activity, ShieldAlert, AlertOctagon, ArrowUpRight, ArrowDownRight,
  Wifi, Download, Upload, Gauge,
} from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import ProgressRing from '../components/ui/ProgressRing'
import LineAreaChart from '../components/charts/LineAreaChart'
import { SkeletonCard, SkeletonChart } from '../components/ui/Skeleton'
import { useAuth } from '../context/AuthContext'
import { useRealtime } from '../context/SocketContext'
import { generateTrafficSeries, generateDevices, randInt } from '../services/mockData'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good Morning'
  if (h < 18) return 'Good Afternoon'
  return 'Good Evening'
}

function StatCard({ icon: Icon, label, value, delta, positiveIsGood = false, loading }) {
  if (loading) return <SkeletonCard />
  const positive = delta >= 0
  const good = positiveIsGood ? positive : !positive
  return (
    <Card hover className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-50 to-cyan-50 flex items-center justify-center">
          <Icon className="w-5 h-5 text-brand-600" />
        </div>
        <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${good ? 'text-safe-600' : 'text-crit-500'}`}>
          {positive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
          {Math.abs(delta).toFixed(1)}%
        </span>
      </div>
      <p className="text-3xl font-display font-bold text-ink-900 mt-4">{value}</p>
      <p className="text-sm text-ink-500 mt-1">{label}</p>
    </Card>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const { stats, mode } = useRealtime()
  const [loading, setLoading] = useState(true)
  const [series, setSeries] = useState([])
  const [devices, setDevices] = useState([])

  useEffect(() => {
    const t = setTimeout(() => {
      setSeries(generateTrafficSeries(12))
      setDevices(generateDevices(14))
      setLoading(false)
    }, 700)
    return () => clearTimeout(t)
  }, [])

  const securityScore = useMemo(() => {
    const base = 92 - Math.min(stats.suspicious || 0, 20)
    return Math.max(40, Math.min(99, base))
  }, [stats.suspicious])

  const scoreStatus = securityScore >= 80 ? 'Secure' : securityScore >= 60 ? 'Warning' : 'Critical'
  const onlineDevices = devices.filter((d) => d.status === 'Online').length

  return (
    <DashboardLayout title={`${greeting()}, ${user?.name?.split(' ')[0] || 'there'} 👋`} subtitle="Here's your network security overview.">
      {/* Overview cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard loading={loading} icon={Laptop2} label="Total Devices" value={devices.length || '—'} delta={4.2} positiveIsGood />
        <StatCard loading={loading} icon={Activity} label="Active Connections" value={stats.activeConnections || 0} delta={2.8} positiveIsGood />
        <StatCard loading={loading} icon={ShieldAlert} label="Threats Detected" value={127} delta={12.4} positiveIsGood={false} />
        <StatCard loading={loading} icon={AlertOctagon} label="Critical Alerts" value={6} delta={-8.1} positiveIsGood={false} />
      </div>

      <div className="grid lg:grid-cols-3 gap-5 mt-5">
        {/* Security score */}
        <Card className="lg:col-span-1 flex flex-col items-center text-center justify-center">
          <h3 className="font-display font-semibold text-ink-900 mb-1 self-start">Network Security Score</h3>
          <p className="text-xs text-ink-400 self-start mb-4">Calculated from live traffic & alert signals</p>
          <ProgressRing value={securityScore} status={scoreStatus} label={scoreStatus} />
          <p className="text-sm text-ink-500 mt-4">
            {scoreStatus === 'Secure' && 'Your network is currently well protected.'}
            {scoreStatus === 'Warning' && 'Some anomalies detected — review your alerts.'}
            {scoreStatus === 'Critical' && 'Multiple threats active — immediate attention recommended.'}
          </p>
        </Card>

        {/* Real time monitoring */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-display font-semibold text-ink-900">Real-Time Network Monitoring</h3>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-crit-500">
              <span className="w-2 h-2 rounded-full bg-crit-500 animate-pulse-slow" /> LIVE
            </span>
          </div>
          <p className="text-xs text-ink-400 mb-4">{mode === 'demo' ? 'Simulated demo feed — connect the backend for live packet data.' : 'Live feed from backend'}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            {[
              { icon: Download, label: 'Incoming', value: `${stats.incoming || 0} KB/s`, color: 'text-brand-600' },
              { icon: Upload, label: 'Outgoing', value: `${stats.outgoing || 0} KB/s`, color: 'text-cyan-600' },
              { icon: Wifi, label: 'Packets/sec', value: stats.packetsPerSec || 0, color: 'text-violet-600' },
              { icon: Gauge, label: 'Bandwidth', value: `${stats.bandwidthMbps || 0} Mbps`, color: 'text-safe-600' },
            ].map((m) => (
              <div key={m.label} className="bg-ink-50 rounded-xl p-3">
                <m.icon className={`w-4 h-4 mb-1.5 ${m.color}`} />
                <p className="text-lg font-display font-bold text-ink-900">{m.value}</p>
                <p className="text-[11px] text-ink-400">{m.label}</p>
              </div>
            ))}
          </div>
          {loading ? <SkeletonChart /> : (
            <LineAreaChart
              data={series}
              series={[
                { key: 'incoming', name: 'Incoming', color: '#3184ff' },
                { key: 'outgoing', name: 'Outgoing', color: '#06b6d4' },
                { key: 'suspicious', name: 'Suspicious', color: '#ef4444' },
              ]}
              height={190}
            />
          )}
        </Card>
      </div>

      {/* Devices + suspicious summary */}
      <div className="grid lg:grid-cols-3 gap-5 mt-5">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-ink-900">Device Status</h3>
            <Badge label="Online" />
          </div>
          <div className="grid sm:grid-cols-3 gap-4 text-center">
            <div className="bg-safe-50 rounded-xl p-4">
              <p className="text-2xl font-display font-bold text-safe-600">{onlineDevices}</p>
              <p className="text-xs text-ink-500 mt-1">Online</p>
            </div>
            <div className="bg-ink-100 rounded-xl p-4">
              <p className="text-2xl font-display font-bold text-ink-600">{devices.filter((d) => d.status === 'Offline').length}</p>
              <p className="text-xs text-ink-500 mt-1">Offline</p>
            </div>
            <div className="bg-crit-50 rounded-xl p-4">
              <p className="text-2xl font-display font-bold text-crit-600">{devices.filter((d) => d.status === 'Suspicious').length}</p>
              <p className="text-xs text-ink-500 mt-1">Suspicious</p>
            </div>
          </div>
        </Card>
        <Card>
          <h3 className="font-display font-semibold text-ink-900 mb-4">This Week</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex justify-between"><span className="text-ink-500">New alerts</span><span className="font-semibold text-ink-800">{randInt(10,30)}</span></li>
            <li className="flex justify-between"><span className="text-ink-500">Resolved</span><span className="font-semibold text-safe-600">{randInt(8,22)}</span></li>
            <li className="flex justify-between"><span className="text-ink-500">Blocked IPs</span><span className="font-semibold text-ink-800">{randInt(3,12)}</span></li>
            <li className="flex justify-between"><span className="text-ink-500">Reports generated</span><span className="font-semibold text-ink-800">{randInt(1,5)}</span></li>
          </ul>
        </Card>
      </div>
    </DashboardLayout>
  )
}
