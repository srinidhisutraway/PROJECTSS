import React, { useState } from 'react'
import { FileBarChart2, Download, Sparkles, Calendar } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import EmptyState from '../components/ui/EmptyState'
import { generateTopList, randInt } from '../services/mockData'

export default function Reports() {
  const [reports, setReports] = useState([
    { id: 1, title: 'Weekly Security Report', date: '2026-08-17', score: 91 },
    { id: 2, title: 'Weekly Security Report', date: '2026-08-10', score: 87 },
  ])
  const [generating, setGenerating] = useState(false)
  const [latest, setLatest] = useState(null)

  function generateReport() {
    setGenerating(true)
    setTimeout(() => {
      const report = {
        id: Date.now(),
        title: 'On-Demand Security Report',
        date: new Date().toISOString().slice(0, 10),
        score: randInt(78, 96),
        totalTraffic: `${randInt(200, 900)} GB`,
        threats: randInt(40, 180),
        criticalAlerts: randInt(1, 9),
        topAttacks: generateTopList('ip', 3).map((t, i) => ({ name: ['Port Scan', 'Brute Force', 'DoS'][i], count: t.count })),
        topIPs: generateTopList('ip', 4),
      }
      setReports((r) => [{ id: report.id, title: report.title, date: report.date, score: report.score }, ...r])
      setLatest(report)
      setGenerating(false)
    }, 1200)
  }

  function downloadReport() {
    if (!latest) return
    const text = `NetGuard AI Security Report\nGenerated: ${latest.date}\n\nSecurity Score: ${latest.score}/100\nTotal Traffic: ${latest.totalTraffic}\nThreats Detected: ${latest.threats}\nCritical Alerts: ${latest.criticalAlerts}\n\nTop Attack Types:\n${latest.topAttacks.map((a) => `- ${a.name}: ${a.count}`).join('\n')}\n\nMost Suspicious IPs:\n${latest.topIPs.map((i) => `- ${i.label}: ${i.count} events`).join('\n')}\n\nRecommendations:\n- Review and rotate credentials for accounts with repeated failed logins.\n- Restrict unused open ports on internet-facing devices.\n- Investigate top suspicious IPs and consider blocking at the firewall.\n`
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `netguard-report-${latest.date}.txt`; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <DashboardLayout title="Reports" subtitle="Generate and download security reports.">
      <Card className="mb-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-50 to-violet-50 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-brand-600" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-ink-900">Generate a new report</h3>
            <p className="text-xs text-ink-500">Summarizes security score, traffic, threats, and recommendations.</p>
          </div>
        </div>
        <Button loading={generating} onClick={generateReport}>Generate Report</Button>
      </Card>

      {latest && (
        <Card className="mb-5 animate-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-ink-900">{latest.title}</h3>
            <Button size="sm" variant="secondary" icon={Download} onClick={downloadReport}>Download</Button>
          </div>
          <div className="grid sm:grid-cols-4 gap-4 mb-5">
            <div className="bg-ink-50 rounded-xl p-3"><p className="text-xs text-ink-400">Security Score</p><p className="text-xl font-display font-bold text-ink-900">{latest.score}/100</p></div>
            <div className="bg-ink-50 rounded-xl p-3"><p className="text-xs text-ink-400">Total Traffic</p><p className="text-xl font-display font-bold text-ink-900">{latest.totalTraffic}</p></div>
            <div className="bg-ink-50 rounded-xl p-3"><p className="text-xs text-ink-400">Threats Detected</p><p className="text-xl font-display font-bold text-ink-900">{latest.threats}</p></div>
            <div className="bg-crit-50 rounded-xl p-3"><p className="text-xs text-crit-500">Critical Alerts</p><p className="text-xl font-display font-bold text-crit-600">{latest.criticalAlerts}</p></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <p className="text-sm font-semibold text-ink-800 mb-2">Top Attack Types</p>
              <ul className="space-y-2">
                {latest.topAttacks.map((a) => (
                  <li key={a.name} className="flex justify-between text-sm"><span className="text-ink-600">{a.name}</span><span className="font-medium">{a.count}</span></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-ink-800 mb-2">Most Suspicious IPs</p>
              <ul className="space-y-2">
                {latest.topIPs.map((i) => (
                  <li key={i.label} className="flex justify-between text-sm"><span className="font-mono text-ink-600">{i.label}</span><span className="font-medium">{i.count}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <h3 className="font-display font-semibold text-ink-900 mb-4">Past Reports</h3>
        {reports.length === 0 ? <EmptyState icon={FileBarChart2} title="No reports yet" description="Generate your first report above." /> : (
          <ul className="divide-y divide-ink-100">
            {reports.map((r) => (
              <li key={r.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <FileBarChart2 className="w-4 h-4 text-brand-500" />
                  <div>
                    <p className="text-sm font-medium text-ink-800">{r.title}</p>
                    <p className="text-xs text-ink-400 flex items-center gap-1"><Calendar className="w-3 h-3" /> {r.date}</p>
                  </div>
                </div>
                <Badge label={r.score > 85 ? 'Low' : r.score > 70 ? 'Medium' : 'High'} />
              </li>
            ))}
          </ul>
        )}
      </Card>
    </DashboardLayout>
  )
}
