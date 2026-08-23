import React from 'react'
import { Link } from 'react-router-dom'
import {
  ShieldCheck, Activity, BrainCircuit, Bell, ArrowRight, Radar, Network,
  Lock, Gauge, CheckCircle2, Eye, Cpu,
} from 'lucide-react'
import PublicLayout from '../components/layout/PublicLayout'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const features = [
  { icon: Activity, title: 'Real-Time Monitoring', desc: 'Watch traffic, connections, and bandwidth update live across your network, second by second.' },
  { icon: Radar, title: 'Intrusion Detection', desc: 'Detect port scans, brute force, DoS, and abnormal traffic patterns as they happen.' },
  { icon: BrainCircuit, title: 'AI/ML Detection Engine', desc: 'A trained classification model scores traffic as Normal, Suspicious, or Attack with confidence.' },
  { icon: Bell, title: 'Smart Alerting', desc: 'Actionable alerts with severity, root cause, and recommended response — not just noise.' },
  { icon: Network, title: 'Device & IP Intelligence', desc: 'Know every device on your network and investigate any IP address in one click.' },
  { icon: Gauge, title: 'Security Scoring', desc: 'A single, dynamic score that reflects the real-time health of your network posture.' },
]

const steps = [
  { n: '01', icon: Eye, title: 'Monitor', desc: 'Continuously observe network activity across devices, ports, and protocols.' },
  { n: '02', icon: Cpu, title: 'Analyze', desc: 'Extract meaningful features from traffic flows — packet size, duration, frequency.' },
  { n: '03', icon: Radar, title: 'Detect', desc: 'Combine rule-based signatures with machine learning to flag suspicious behavior.' },
  { n: '04', icon: Bell, title: 'Alert', desc: 'Notify your team instantly with severity, confidence, and full context.' },
  { n: '05', icon: ShieldCheck, title: 'Respond', desc: 'Follow clear, recommended actions to investigate and contain the threat.' },
]

const stats = [
  { value: '24/7', label: 'Continuous monitoring' },
  { value: '7', label: 'Attack types detected' },
  { value: '96.8%', label: 'Model accuracy (demo)' },
  { value: '<1s', label: 'Simulated alert latency' },
]

function NetworkHero() {
  return (
    <div className="relative w-full aspect-square max-w-md mx-auto">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-100 via-cyan-50 to-violet-100 blur-2xl opacity-70" />
      <svg viewBox="0 0 400 400" className="relative w-full h-full">
        {[[80,80],[320,90],[60,320],[330,310],[200,60],[200,340]].map(([x,y], i) => (
          <line key={i} x1={x} y1={y} x2={200} y2={200} stroke="#c7d7fb" strokeWidth="2" strokeDasharray="4 4" />
        ))}
        {[[80,80],[320,90],[60,320],[330,310],[200,60],[200,340]].map(([x,y], i) => (
          <g key={i} className="animate-float" style={{ animationDelay: `${i * 0.4}s` }}>
            <circle cx={x} cy={y} r="16" fill="white" stroke="#3184ff" strokeWidth="2" />
            <circle cx={x} cy={y} r="5" fill="#3184ff" />
          </g>
        ))}
        <circle cx="200" cy="200" r="46" fill="url(#centerGrad)" />
        <defs>
          <linearGradient id="centerGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1c63f5" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        <foreignObject x="170" y="170" width="60" height="60">
          <div className="w-full h-full flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
        </foreignObject>
      </svg>
      <div className="absolute top-2 right-6 bg-white rounded-xl shadow-soft px-3 py-2 flex items-center gap-2 animate-float">
        <span className="w-2 h-2 rounded-full bg-safe-500 animate-pulse-slow" />
        <span className="text-xs font-semibold text-ink-700">Network Secure</span>
      </div>
      <div className="absolute bottom-6 left-2 bg-white rounded-xl shadow-soft px-3 py-2 animate-float" style={{ animationDelay: '1s' }}>
        <span className="text-xs font-semibold text-brand-600">AI Confidence 94%</span>
      </div>
    </div>
  )
}

export default function Landing() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-5 lg:px-8 pt-16 pb-20 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <Radar className="w-3.5 h-3.5" /> AI-Powered Network Defense
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-ink-900 leading-tight">
            See threats <span className="gradient-text">before</span> they become breaches.
          </h1>
          <p className="mt-5 text-lg text-ink-500 max-w-lg">
            NetGuard AI continuously monitors network activity, detects suspicious behavior,
            and gives your security team real-time visibility — in one bright, easy-to-read dashboard.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/signup"><Button size="lg" icon={ArrowRight}>Get Started Free</Button></Link>
            <Link to="/login"><Button size="lg" variant="secondary">Login to Dashboard</Button></Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
            {['No credit card required', 'Demo mode included', 'Built for lab & training use'].map((t) => (
              <div key={t} className="flex items-center gap-2 text-sm text-ink-500">
                <CheckCircle2 className="w-4 h-4 text-safe-500" /> {t}
              </div>
            ))}
          </div>
        </div>
        <NetworkHero />
      </section>

      {/* Stats */}
      <section className="bg-ink-900 py-10">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-display text-3xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-ink-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-5 lg:px-8 py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="font-display text-3xl font-bold text-ink-900">Everything a modern SOC needs</h2>
          <p className="mt-3 text-ink-500">A complete, friendly toolkit for monitoring, detecting, and responding to network threats.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <Card key={f.title} hover className="group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-50 to-cyan-50 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <f.icon className="w-5 h-5 text-brand-600" />
              </div>
              <h3 className="font-display font-semibold text-ink-900 mb-1.5">{f.title}</h3>
              <p className="text-sm text-ink-500">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-gradient-to-b from-brand-50/60 to-white py-24">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-display text-3xl font-bold text-ink-900">How NetGuard AI works</h2>
            <p className="mt-3 text-ink-500">From raw traffic to a confident response — five clear stages.</p>
          </div>
          <div className="grid md:grid-cols-5 gap-6">
            {steps.map((s, i) => (
              <div key={s.n} className="relative">
                <Card className="h-full">
                  <span className="text-xs font-bold text-brand-400">{s.n}</span>
                  <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center my-3">
                    <s.icon className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-display font-semibold text-ink-900 mb-1">{s.title}</h4>
                  <p className="text-xs text-ink-500">{s.desc}</p>
                </Card>
                {i < steps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute top-1/2 -right-4 w-5 h-5 text-brand-300 -translate-y-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security / Tech */}
      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-24 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="font-display text-3xl font-bold text-ink-900 mb-4">Built with a modern, modular stack</h2>
          <p className="text-ink-500 mb-6">
            React and Tailwind on the frontend, Node.js/Express + MongoDB on the backend, real-time
            updates over Socket.IO, and a dedicated Python ML service for traffic classification.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {['React + Vite', 'Node.js + Express', 'MongoDB', 'Socket.IO', 'Python ML Service', 'JWT Auth'].map((t) => (
              <div key={t} className="flex items-center gap-2 bg-white border border-ink-100 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-700 shadow-soft">
                <Lock className="w-4 h-4 text-brand-500" /> {t}
              </div>
            ))}
          </div>
        </div>
        <Card className="bg-gradient-to-br from-ink-900 to-ink-800 text-white">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-crit-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-warn-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-safe-500" />
          </div>
          <pre className="text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed">
{`Network Monitor
   -> Packet/Flow Collector
      -> Feature Extractor
         -> Detection Engine (rules + ML)
            -> Risk Scoring
               -> Alert Service
                  -> MongoDB
                     -> WebSocket
                        -> Dashboard`}
          </pre>
        </Card>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-5 lg:px-8 pb-24">
        <Card className="bg-gradient-to-r from-brand-600 via-brand-500 to-cyan-500 text-white text-center py-14 px-8">
          <h2 className="font-display text-3xl font-bold mb-3">Ready to see your network clearly?</h2>
          <p className="text-brand-50 mb-8 max-w-xl mx-auto">Create a free account and explore the full dashboard in demo mode — no real infrastructure required.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/signup"><Button size="lg" variant="secondary" icon={ArrowRight}>Create Free Account</Button></Link>
            <Link to="/login"><Button size="lg" className="!bg-white/10 !text-white border !border-white/30 hover:!bg-white/20" variant="secondary">Try the Demo</Button></Link>
          </div>
        </Card>
      </section>
    </PublicLayout>
  )
}
