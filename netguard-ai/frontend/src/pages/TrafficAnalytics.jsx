import React, { useMemo, useState } from 'react'
import { Calendar, Download } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import LineAreaChart from '../components/charts/LineAreaChart'
import DonutChart from '../components/charts/DonutChart'
import BarChartComp from '../components/charts/BarChartComp'
import { generateTrafficSeries, generateProtocolDistribution, generateTopList } from '../services/mockData'

const RANGES = ['Last 24 hours', 'Last 7 days', 'Last 30 days', 'Custom range']

export default function TrafficAnalytics() {
  const [range, setRange] = useState('Last 24 hours')
  const points = range === 'Last 24 hours' ? 24 : range === 'Last 7 days' ? 7 : 30

  const series = useMemo(() => generateTrafficSeries(points), [range])
  const protocolDist = useMemo(() => generateProtocolDistribution(), [range])
  const topSourceIPs = useMemo(() => generateTopList('ip'), [range])
  const topDestIPs = useMemo(() => generateTopList('ip'), [range])
  const topPorts = useMemo(() => generateTopList('port'), [range])

  const totalVolume = series.reduce((s, p) => s + p.incoming + p.outgoing, 0)

  return (
    <DashboardLayout title="Traffic Analytics" subtitle="Understand traffic patterns across your network.">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex flex-wrap gap-2">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${range === r ? 'bg-brand-600 text-white' : 'bg-white border border-ink-200 text-ink-600 hover:bg-ink-50'}`}
            >
              {r}
            </button>
          ))}
        </div>
        <Button size="sm" variant="secondary" icon={Download}>Export</Button>
      </div>

      <div className="grid sm:grid-cols-3 gap-5 mb-5">
        <Card><p className="text-xs text-ink-400 mb-1">Total Traffic Volume</p><p className="text-2xl font-display font-bold text-ink-900">{(totalVolume / 1000).toFixed(1)} MB</p></Card>
        <Card><p className="text-xs text-ink-400 mb-1">Avg. Connection Frequency</p><p className="text-2xl font-display font-bold text-ink-900">{(totalVolume / points / 10).toFixed(0)} / min</p></Card>
        <Card><p className="text-xs text-ink-400 mb-1">Suspicious Share</p><p className="text-2xl font-display font-bold text-crit-600">{((series.reduce((s,p)=>s+p.suspicious,0) / totalVolume) * 100).toFixed(1)}%</p></Card>
      </div>

      <Card className="mb-5">
        <h3 className="font-display font-semibold text-ink-900 mb-1">Incoming vs Outgoing Traffic</h3>
        <p className="text-xs text-ink-400 mb-4">{range}</p>
        <LineAreaChart
          data={series}
          series={[{ key: 'incoming', name: 'Incoming', color: '#3184ff' }, { key: 'outgoing', name: 'Outgoing', color: '#06b6d4' }]}
          height={300}
        />
      </Card>

      <div className="grid lg:grid-cols-2 gap-5 mb-5">
        <Card>
          <h3 className="font-display font-semibold text-ink-900 mb-4">Protocol Distribution</h3>
          <DonutChart data={protocolDist} />
        </Card>
        <Card>
          <h3 className="font-display font-semibold text-ink-900 mb-4">Top Destination Ports</h3>
          <BarChartComp data={topPorts} labelKey="label" dataKey="count" horizontal />
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <Card>
          <h3 className="font-display font-semibold text-ink-900 mb-4">Top Source IPs</h3>
          <BarChartComp data={topSourceIPs} labelKey="label" dataKey="count" horizontal />
        </Card>
        <Card>
          <h3 className="font-display font-semibold text-ink-900 mb-4">Top Destination IPs</h3>
          <BarChartComp data={topDestIPs} labelKey="label" dataKey="count" horizontal />
        </Card>
      </div>
    </DashboardLayout>
  )
}
