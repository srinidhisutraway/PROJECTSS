import React, { useState } from 'react'
import { Search, Globe, ShieldQuestion } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import EmptyState from '../components/ui/EmptyState'
import LineAreaChart from '../components/charts/LineAreaChart'
import { generateIPIntel, randomExternalIP } from '../services/mockData'

export default function IPAnalysis() {
  const [ip, setIp] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  function isValidIP(value) {
    return /^(\d{1,3}\.){3}\d{1,3}$/.test(value)
  }

  async function analyze(e) {
    e.preventDefault()
    if (!isValidIP(ip)) return
    setLoading(true)
    setTimeout(() => {
      setResult(generateIPIntel(ip))
      setLoading(false)
    }, 700)
  }

  return (
    <DashboardLayout title="IP Analysis" subtitle="Investigate any IP address seen on your network.">
      <Card className="mb-5">
        <form onSubmit={analyze} className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
            <input value={ip} onChange={(e) => setIp(e.target.value)} placeholder="e.g. 185.22.14.90"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ink-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none text-sm font-mono" />
          </div>
          <Button type="submit" loading={loading}>Analyze IP</Button>
          <Button type="button" variant="secondary" onClick={() => setIp(randomExternalIP())}>Use Sample IP</Button>
        </form>
      </Card>

      {!result && !loading && (
        <Card><EmptyState icon={Globe} title="No IP analyzed yet" description="Enter an IP address above to view its risk score, traffic history, and detected events." /></Card>
      )}

      {loading && (
        <Card className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
        </Card>
      )}

      {result && !loading && (
        <div className="space-y-5">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Card>
              <p className="text-xs text-ink-400 mb-1">IP Address</p>
              <p className="font-mono font-semibold text-ink-900">{result.ip}</p>
              <p className="text-xs text-ink-400 mt-2">{result.country}</p>
            </Card>
            <Card>
              <p className="text-xs text-ink-400 mb-1">Risk Score</p>
              <p className={`text-2xl font-display font-bold ${result.riskScore > 70 ? 'text-crit-600' : result.riskScore > 40 ? 'text-warn-600' : 'text-safe-600'}`}>{result.riskScore}/100</p>
            </Card>
            <Card>
              <p className="text-xs text-ink-400 mb-1">Connections</p>
              <p className="text-2xl font-display font-bold text-ink-900">{result.connections}</p>
            </Card>
            <Card>
              <p className="text-xs text-ink-400 mb-1">Threat Level</p>
              <Badge label={result.threatLevel} />
            </Card>
          </div>

          <Card>
            <div className="flex items-center gap-2 mb-4">
              <ShieldQuestion className="w-5 h-5 text-brand-600" />
              <h3 className="font-display font-semibold text-ink-900">Traffic History</h3>
            </div>
            <LineAreaChart data={result.history} series={[{ key: 'incoming', name: 'Incoming', color: '#3184ff' }, { key: 'outgoing', name: 'Outgoing', color: '#06b6d4' }]} height={240} />
          </Card>

          <div className="grid sm:grid-cols-2 gap-5">
            <Card>
              <h3 className="font-display font-semibold text-ink-900 mb-3">Associated Ports</h3>
              <div className="flex flex-wrap gap-2">
                {result.ports.map((p) => (
                  <span key={p} className="px-3 py-1.5 rounded-full bg-ink-100 text-ink-700 text-xs font-mono">{p}</span>
                ))}
              </div>
            </Card>
            <Card>
              <h3 className="font-display font-semibold text-ink-900 mb-3">Detected Events</h3>
              <p className="text-2xl font-display font-bold text-ink-900">{result.detectedEvents}</p>
              <p className="text-xs text-ink-400">events linked to this IP</p>
            </Card>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
