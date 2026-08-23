import React, { useState } from 'react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Users, ScanFace, FileText, Newspaper, ShieldCheck, Search, Trash2 } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAdminDashboard, useAdminUsers, useUpdateAdminUser, useDeleteAdminUser, useAdminLogs } from '../../hooks/useAdmin';

const COLORS = ['#B85C6D', '#1F6F6B', '#8B85C1', '#E3A69D', '#6FADA8'];
const TABS = ['Overview', 'Users', 'System Logs'] as const;

const AdminDashboardPage: React.FC = () => {
  const [tab, setTab] = useState<(typeof TABS)[number]>('Overview');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data: stats, isLoading: statsLoading } = useAdminDashboard();
  const { data: usersData } = useAdminUsers(search, page);
  const updateUser = useUpdateAdminUser();
  const deleteUser = useDeleteAdminUser();
  const { data: logsData } = useAdminLogs(1);

  return (
    <DashboardLayout title="Admin Panel">
      <div className="mb-6 flex items-center gap-2">
        <ShieldCheck size={20} className="text-teal-600" />
        <p className="text-sm text-ink/60 dark:text-canvas/60">Full system oversight - visible only to admin accounts.</p>
      </div>

      <div className="mb-6 flex gap-2 border-b border-ink/10 dark:border-white/10">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium ${tab === t ? 'border-b-2 border-clay-500 text-clay-600 dark:text-clay-300' : 'text-ink/50 dark:text-canvas/50'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Overview' && (
        <>
          {statsLoading ? (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-24 w-full" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {[
                { label: 'Total users', value: stats?.totalUsers, icon: Users },
                { label: 'Analyses run', value: stats?.totalAnalyses, icon: ScanFace },
                { label: 'Reports stored', value: stats?.totalReports, icon: FileText },
                { label: 'Articles published', value: stats?.totalArticles, icon: Newspaper },
              ].map((s) => (
                <div key={s.label} className="glass-card p-5">
                  <s.icon size={18} className="text-teal-600" />
                  <p className="mt-2 font-display text-2xl font-semibold text-ink dark:text-canvas">{s.value ?? 0}</p>
                  <p className="text-xs text-ink/50 dark:text-canvas/50">{s.label}</p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="glass-card p-6">
              <h3 className="mb-4 font-display text-lg font-semibold">Condition frequency (platform-wide)</h3>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={stats?.conditionFrequency || []} dataKey="count" nameKey="_id" outerRadius={85} label>
                    {(stats?.conditionFrequency || []).map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="glass-card p-6">
              <h3 className="mb-4 font-display text-lg font-semibold">Signups (last 30 days)</h3>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={stats?.signupTrend || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="_id" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#1F6F6B" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {tab === 'Users' && (
        <div>
          <div className="relative mb-4 w-72">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
            <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search users..." className="input-field pl-9" />
          </div>
          <div className="glass-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink/10 text-left text-xs text-ink/50 dark:border-white/10">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersData?.users?.map((u: any) => (
                  <tr key={u._id} className="border-b border-ink/5 dark:border-white/5">
                    <td className="px-4 py-3">{u.name}</td>
                    <td className="px-4 py-3 text-ink/60 dark:text-canvas/60">{u.email}</td>
                    <td className="px-4 py-3 capitalize">{u.role}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${u.isActive ? 'badge-mild' : 'badge-severe'}`}>{u.isActive ? 'Active' : 'Disabled'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateUser.mutate({ id: u._id, updates: { isActive: !u.isActive } })}
                          className="text-xs font-medium text-teal-600 dark:text-teal-300"
                        >
                          {u.isActive ? 'Disable' : 'Enable'}
                        </button>
                        <button onClick={() => deleteUser.mutate(u._id)} aria-label="Delete user">
                          <Trash2 size={14} className="text-clay-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {usersData?.pagination?.pages > 1 && (
            <div className="mt-4 flex justify-center gap-3 text-sm">
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="btn-secondary !px-3 !py-1.5 disabled:opacity-40">Prev</button>
              <span>Page {page} of {usersData.pagination.pages}</span>
              <button disabled={page >= usersData.pagination.pages} onClick={() => setPage((p) => p + 1)} className="btn-secondary !px-3 !py-1.5 disabled:opacity-40">Next</button>
            </div>
          )}
        </div>
      )}

      {tab === 'System Logs' && (
        <div className="glass-card divide-y divide-ink/5 dark:divide-white/5">
          {logsData?.logs?.map((log: any) => (
            <div key={log._id} className="flex items-center justify-between px-5 py-3 text-sm">
              <div>
                <span className="font-medium text-ink dark:text-canvas">{log.action}</span>
                {log.targetType && <span className="ml-2 text-xs text-ink/40">{log.targetType}</span>}
              </div>
              <div className="text-xs text-ink/40">
                {log.actor?.name || 'System'} - {new Date(log.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
          {!logsData?.logs?.length && <p className="p-6 text-center text-sm text-ink/40">No log entries yet.</p>}
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboardPage;
