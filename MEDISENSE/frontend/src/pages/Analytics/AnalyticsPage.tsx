import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { BarChart3 } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAnalytics } from '../../hooks/useSkinAnalysis';

const COLORS = ['#B85C6D', '#1F6F6B', '#8B85C1', '#E3A69D', '#6FADA8'];

const AnalyticsPage: React.FC = () => {
  const { data: analytics, isLoading } = useAnalytics();

  if (isLoading) {
    return (
      <DashboardLayout title="Analytics">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-64 w-full" />)}
        </div>
      </DashboardLayout>
    );
  }

  const hasData = analytics?.timeline?.length > 0;

  if (!hasData) {
    return (
      <DashboardLayout title="Analytics">
        <div className="glass-card p-12 text-center">
          <BarChart3 size={40} className="mx-auto text-ink/30" />
          <p className="mt-3 text-sm text-ink/60 dark:text-canvas/60">
            Run a few skin analyses to start seeing your trends here.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  const hydrationTrend = analytics.hydrationTrend.map((h: any, i: number) => ({
    name: `#${i + 1}`,
    hydration: h.hydrationAnalysis?.hydrationLevel || 0,
    oiliness: h.hydrationAnalysis?.oiliness || 0,
  }));

  return (
    <DashboardLayout title="Analytics">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="glass-card p-6">
          <h3 className="mb-4 font-display text-lg font-semibold text-ink dark:text-canvas">Condition frequency</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={analytics.conditionFrequency} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={90} label>
                {analytics.conditionFrequency.map((_: any, i: number) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-6">
          <h3 className="mb-4 font-display text-lg font-semibold text-ink dark:text-canvas">Severity breakdown</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={analytics.severityBreakdown}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="_id" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#B85C6D" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-6 lg:col-span-2">
          <h3 className="mb-4 font-display text-lg font-semibold text-ink dark:text-canvas">Hydration & oiliness trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={hydrationTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="hydration" stroke="#1F6F6B" strokeWidth={2} />
              <Line type="monotone" dataKey="oiliness" stroke="#B85C6D" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;
