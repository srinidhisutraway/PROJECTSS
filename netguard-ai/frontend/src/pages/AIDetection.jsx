import React, { useState } from 'react'
import { BrainCircuit, Sparkles, Info } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { mlAPI } from '../services/api'
import { PROTOCOLS, randInt } from '../services/mockData'

const METRICS = [
  { label: 'Accuracy', value: '96.8%' },
  { label: 'Precision', value: '95.4%' },
  { label: 'Recall', value: '94.9%' },
  { label: 'F1 Score', value: '95.1%' },
]

const initialFeatures = {
  protocol: 'TCP', packetSize: 512, duration: 2.4, sourceBytes: 1200,
  destinationBytes: 400, connectionCount: 5, port: 443,
}

export default function AIDetection() {
  const [features, setFeatures] = useState(initialFeatures)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  function update(k, v) { setFeatures((f) => ({ ...f, [k]: v })) }

  async function predict() {
    setLoading(true)
    setResult(null)
    try {
      const res = await mlAPI.predict(features)
      setResult(res.data)
    } catch {
      // Demo fallback mock prediction (clearly labeled) if ML service/backend unreachable
      await new Promise((r) => setTimeout(r, 900))
      const suspicious = features.connectionCount > 15 || features.packetSize > 1400 || [21, 23, 3389].includes(Number(features.port))
      const attack = features.connectionCount > 30
      setResult({
        prediction: attack ? 'ATTACK' : suspicious ? 'SUSPICIOUS' : 'NORMAL',
        confidence: randInt(78, 98) / 100,
        attack_type: attack ? 'Brute Force' : suspicious ? 'Port Scan' : null,
        demo: true,
      })
    }
    setLoading(false)
  }

  const predColor = result?.prediction === 'ATTACK' ? 'text-crit-600 bg-crit-50' : result?.prediction === 'SUSPICIOUS' ? 'text-warn-600 bg-warn-50' : 'text-safe-600 bg-safe-50'

  return (
    <DashboardLayout title="AI Detection" subtitle="How NetGuard AI's machine learning engine classifies network traffic.">
      <Card className="mb-5 bg-gradient-to-br from-violet-50 to-brand-50 border-violet-100">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-brand-600 flex items-center justify-center shrink-0">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-ink-900">Detection Engine</h3>
            <p className="text-sm text-ink-600 mt-1">Model: <strong>Random Forest Classifier</strong> trained on labeled network-flow features (NSL-KDD-style dataset).</p>
            <p className="text-xs text-ink-500 mt-2 flex items-center gap-1.5"><Info className="w-3.5 h-3.5" /> Metrics below are demo / model-evaluation values from offline testing — not a live production accuracy claim.</p>
          </div>
        </div>
      </Card>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
        {METRICS.map((m) => (
          <Card key={m.label}>
            <p className="text-xs text-ink-400">{m.label}</p>
            <p className="text-2xl font-display font-bold text-ink-900 mt-1">{m.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-brand-600" />
            <h3 className="font-display font-semibold text-ink-900">Try a Prediction</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-xs font-medium text-ink-500 mb-1">Protocol</label>
              <select value={features.protocol} onChange={(e) => update('protocol', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-ink-200 text-sm">
                {PROTOCOLS.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-500 mb-1">Destination Port</label>
              <input type="number" value={features.port} onChange={(e) => update('port', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-ink-200 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-500 mb-1">Packet Size (bytes)</label>
              <input type="number" value={features.packetSize} onChange={(e) => update('packetSize', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-ink-200 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-500 mb-1">Duration (s)</label>
              <input type="number" step="0.1" value={features.duration} onChange={(e) => update('duration', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-ink-200 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-500 mb-1">Source Bytes</label>
              <input type="number" value={features.sourceBytes} onChange={(e) => update('sourceBytes', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-ink-200 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-500 mb-1">Destination Bytes</label>
              <input type="number" value={features.destinationBytes} onChange={(e) => update('destinationBytes', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-ink-200 text-sm" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-ink-500 mb-1">Connection Count (last 60s)</label>
              <input type="number" value={features.connectionCount} onChange={(e) => update('connectionCount', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-ink-200 text-sm" />
            </div>
          </div>
          <Button className="w-full mt-5" loading={loading} onClick={predict}>Run Prediction</Button>
        </Card>

        <Card className="flex flex-col">
          <h3 className="font-display font-semibold text-ink-900 mb-4">Prediction Result</h3>
          {!result && !loading && (
            <div className="flex-1 flex items-center justify-center text-center text-sm text-ink-400 py-10">
              Fill in the traffic features and run a prediction to see the model's output here.
            </div>
          )}
          {loading && (
            <div className="flex-1 flex items-center justify-center py-10">
              <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
            </div>
          )}
          {result && !loading && (
            <div className="space-y-4">
              <div className={`rounded-2xl p-6 text-center ${predColor}`}>
                <p className="text-xs font-semibold uppercase tracking-wide opacity-70">Prediction</p>
                <p className="text-3xl font-display font-bold mt-1">{result.prediction}</p>
                {result.attack_type && <p className="text-sm mt-1">Likely type: {result.attack_type}</p>}
              </div>
              <div>
                <div className="flex justify-between text-xs text-ink-500 mb-1"><span>Confidence</span><span>{Math.round(result.confidence * 100)}%</span></div>
                <div className="h-2 bg-ink-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-brand-500 to-cyan-500" style={{ width: `${result.confidence * 100}%` }} />
                </div>
              </div>
              {result.demo && <Badge label="Demo mock prediction — ML service not connected" />}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  )
}
