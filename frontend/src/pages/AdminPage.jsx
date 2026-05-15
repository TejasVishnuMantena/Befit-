// ============================================================
// pages/AdminPage.jsx - Admin Dashboard
// ============================================================
import React, { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import API from '../utils/api';
import Layout from '../components/common/Layout';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [activeTab, setActiveTab] = useState('overview');

  const fetchAnalytics = async () => {
    try {
      const { data } = await API.get('/admin/analytics');
      setAnalytics(data.analytics);
    } catch { toast.error('Failed to load analytics.'); }
  };

  const fetchUsers = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (search) params.append('search', search);
      const { data } = await API.get(`/admin/users?${params}`);
      setUsers(data.users);
      setPagination(data.pagination);
    } catch { toast.error('Failed to load users.'); }
    finally { setLoading(false); }
  }, [search]);

  useEffect(() => { fetchAnalytics(); }, []);
  useEffect(() => { if (activeTab === 'users') fetchUsers(1); }, [fetchUsers, activeTab]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This will also delete all their data.`)) return;
    try {
      await API.delete(`/admin/user/${id}`);
      toast.success(`User ${name} deleted.`);
      fetchUsers(pagination.page);
      fetchAnalytics();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  const handleToggle = async (id) => {
    try {
      const { data } = await API.put(`/admin/user/${id}/toggle`);
      toast.success(data.message);
      fetchUsers(pagination.page);
    } catch { toast.error('Failed to update user.'); }
  };

  const statCards = analytics ? [
    { icon: '👥', label: 'Total Users',    value: analytics.totalUsers,    color: 'text-blue-400' },
    { icon: '✅', label: 'Active Users',   value: analytics.activeUsers,   color: 'text-green-400' },
    { icon: '🏋️', label: 'Total Workouts', value: analytics.totalWorkouts, color: 'text-orange-400' },
    { icon: '🥗', label: 'Total Meals',    value: analytics.totalMeals,    color: 'text-purple-400' },
    { icon: '🆕', label: 'New This Week',  value: analytics.newUsers,      color: 'text-yellow-400' },
  ] : [];

  return (
    <Layout>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-3xl font-black text-white">Admin Dashboard ⚙️</h1>
          <span className="bg-purple-500/20 text-purple-400 text-xs px-2 py-0.5 rounded-full font-semibold">ADMIN</span>
        </div>
        <p className="text-slate-400">Monitor users, activity, and platform analytics</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[{ id: 'overview', label: '📊 Overview' }, { id: 'users', label: '👥 Users' }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeTab === tab.id ? 'bg-green-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="animate-fade-in">
          {/* Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {statCards.map(s => (
              <div key={s.label} className="glass-card p-4 text-center">
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className={`text-2xl font-bold ${s.color}`}>{s.value?.toLocaleString()}</div>
                <div className="text-slate-500 text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* User Growth Chart */}
          {analytics?.userGrowth?.length > 0 && (
            <div className="glass-card p-6">
              <h2 className="text-white font-bold text-lg mb-6">New User Registrations (Last 7 Days)</h2>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={analytics.userGrowth.map(d => ({ date: d._id?.slice(5), Users: d.count }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff' }} />
                  <Bar dataKey="Users" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="animate-fade-in">
          <div className="flex gap-3 mb-6">
            <input type="text" placeholder="🔍 Search by name or email..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field max-w-sm" />
          </div>

          {loading ? (
            <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-16 rounded-2xl" />)}</div>
          ) : users.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <div className="text-4xl mb-3">👥</div>
              <p className="text-slate-400">No users found.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {users.map(u => (
                <div key={u._id} className="glass-card p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {u.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-semibold text-sm truncate">{u.name}</p>
                      <p className="text-slate-500 text-xs truncate">{u.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`hidden sm:block text-xs px-2 py-0.5 rounded-full font-medium ${
                      u.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-500/20 text-slate-400'
                    }`}>{u.role}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      u.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>{u.isActive ? 'Active' : 'Inactive'}</span>
                    <span className="text-slate-600 text-xs hidden md:block">
                      {new Date(u.createdAt).toLocaleDateString('en-IN')}
                    </span>

                    {u.role !== 'admin' && (
                      <>
                        <button onClick={() => handleToggle(u._id)}
                          className="text-xs px-3 py-1.5 rounded-lg bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 transition-colors font-medium">
                          {u.isActive ? 'Disable' : 'Enable'}
                        </button>
                        <button onClick={() => handleDelete(u._id, u.name)}
                          className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors font-medium">
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {[...Array(pagination.pages)].map((_, i) => (
                <button key={i} onClick={() => fetchUsers(i + 1)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                    pagination.page === i + 1 ? 'bg-green-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'
                  }`}>{i + 1}</button>
              ))}
            </div>
          )}
          <p className="text-center text-slate-500 text-sm mt-4">{pagination.total} total users</p>
        </div>
      )}
    </Layout>
  );
}
