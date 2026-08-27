import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Loader2, Users, Smile, Eye, Brain, AlertTriangle, CheckCircle, Clock, Plus, Pencil, Trash2, Save, X, RefreshCw, Layers } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { apiDelete, apiGet, apiPatch, apiPost, formatDateOnly } from '../../lib/api';

const formatNumber = (value) => Number(value || 0).toLocaleString();

function DomainManagementSection() {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState(null);
  const [newDomainName, setNewDomainName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const loadDomains = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiGet('/admin/domains?limit=100');
      setDomains(response.data || []);
    } catch (err) {
      setError(err.message || 'Unable to load domains');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDomains();
  }, [loadDomains]);

  const totalObservations = domains.reduce((sum, domain) => sum + Number(domain.observationCount || 0), 0);

  const handleCreate = async (event) => {
    event.preventDefault();
    const name = newDomainName.trim();
    if (!name) return;

    setSaving(true);
    setError('');
    setNotice('');
    try {
      const response = await apiPost('/admin/domains', { name });
      setDomains((current) => [...current, response.data].sort((a, b) => a.name.localeCompare(b.name)));
      setNewDomainName('');
      setNotice('Domain created successfully.');
    } catch (err) {
      setError(err.message || 'Unable to create domain');
    } finally {
      setSaving(false);
    }
  };

  const startEditing = (domain) => {
    setEditingId(domain.id);
    setEditingName(domain.name);
    setError('');
    setNotice('');
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleUpdate = async (domainId) => {
    const name = editingName.trim();
    if (!name) return;

    setActionId(domainId);
    setError('');
    setNotice('');
    try {
      const response = await apiPatch(`/admin/domains/${domainId}`, { name });
      setDomains((current) => current.map((domain) => (domain.id === domainId ? response.data : domain)));
      setEditingId(null);
      setEditingName('');
      setNotice('Domain updated successfully.');
    } catch (err) {
      setError(err.message || 'Unable to update domain');
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (domain) => {
    const confirmed = window.confirm(`Delete "${domain.name}"? Existing observations will keep their historical domain reference.`);
    if (!confirmed) return;

    setActionId(domain.id);
    setError('');
    setNotice('');
    try {
      await apiDelete(`/admin/domains/${domain.id}`);
      setDomains((current) => current.filter((item) => item.id !== domain.id));
      setNotice('Domain deleted successfully.');
    } catch (err) {
      setError(err.message || 'Unable to delete domain');
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers size={18} className="text-[#06b6d4]" />
            <h3 className="text-[14px] font-bold text-[#1e293b]">Development Domains</h3>
          </div>
          <p className="text-[12px] text-[#64748b]">
            {formatNumber(domains.length)} domains | {formatNumber(totalObservations)} observations
          </p>
        </div>

        <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <input
            value={newDomainName}
            onChange={(event) => setNewDomainName(event.target.value)}
            placeholder="New domain name"
            className="h-10 min-w-0 sm:w-64 rounded-lg border border-gray-200 px-3 text-[13px] outline-none focus:border-[#06b6d4] focus:ring-2 focus:ring-[#cffafe]"
          />
          <button
            type="submit"
            disabled={saving || !newDomainName.trim()}
            className="h-10 inline-flex items-center justify-center gap-2 rounded-lg bg-[#06b6d4] px-4 text-[12px] font-bold text-white transition-colors hover:bg-[#0891b2] disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            Create
          </button>
        </form>
      </div>

      {(notice || error) && (
        <div className={`mb-4 rounded-lg border px-4 py-3 text-[12px] font-semibold ${error ? 'border-[#fecaca] bg-[#fef2f2] text-[#be123c]' : 'border-[#bbf7d0] bg-[#f0fdf4] text-[#166534]'}`}>
          {error || notice}
        </div>
      )}

      {loading ? (
        <div className="h-44 flex items-center justify-center text-[#94a3b8]">
          <Loader2 className="animate-spin" size={24} />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="py-3 pr-4 text-[11px] font-bold uppercase tracking-wider text-[#64748b]">Domain Name</th>
                <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-[#64748b]">Slug</th>
                <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-[#64748b]">Observations</th>
                <th className="py-3 pl-4 text-right text-[11px] font-bold uppercase tracking-wider text-[#64748b]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {domains.map((domain) => {
                const isEditing = editingId === domain.id;
                const isBusy = actionId === domain.id;

                return (
                  <tr key={domain.id} className="border-b border-gray-50 last:border-0">
                    <td className="py-4 pr-4">
                      {isEditing ? (
                        <input
                          value={editingName}
                          onChange={(event) => setEditingName(event.target.value)}
                          className="h-9 w-full rounded-lg border border-gray-200 px-3 text-[13px] outline-none focus:border-[#06b6d4] focus:ring-2 focus:ring-[#cffafe]"
                          autoFocus
                        />
                      ) : (
                        <span className="text-[13px] font-bold text-[#1e293b]">{domain.name}</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-[12px] text-[#64748b]">{domain.slug}</td>
                    <td className="py-4 px-4">
                      <span className="inline-flex min-w-12 items-center justify-center rounded-full bg-[#f1f5f9] px-3 py-1 text-[12px] font-bold text-[#334155]">
                        {formatNumber(domain.observationCount)}
                      </span>
                    </td>
                    <td className="py-4 pl-4">
                      <div className="flex items-center justify-end gap-2">
                        {isEditing ? (
                          <>
                            <button
                              type="button"
                              title="Save domain"
                              onClick={() => handleUpdate(domain.id)}
                              disabled={isBusy || !editingName.trim()}
                              className="h-9 w-9 inline-flex items-center justify-center rounded-lg bg-[#ecfdf5] text-[#059669] transition-colors hover:bg-[#d1fae5] disabled:cursor-not-allowed disabled:text-gray-300"
                            >
                              {isBusy ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            </button>
                            <button
                              type="button"
                              title="Cancel edit"
                              onClick={cancelEditing}
                              disabled={isBusy}
                              className="h-9 w-9 inline-flex items-center justify-center rounded-lg bg-[#f8fafc] text-[#64748b] transition-colors hover:bg-[#e2e8f0]"
                            >
                              <X size={16} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              title="Edit domain"
                              onClick={() => startEditing(domain)}
                              className="h-9 w-9 inline-flex items-center justify-center rounded-lg bg-[#eff6ff] text-[#2563eb] transition-colors hover:bg-[#dbeafe]"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              type="button"
                              title="Delete domain"
                              onClick={() => handleDelete(domain)}
                              disabled={isBusy}
                              className="h-9 w-9 inline-flex items-center justify-center rounded-lg bg-[#fef2f2] text-[#e11d48] transition-colors hover:bg-[#fee2e2] disabled:cursor-not-allowed disabled:text-gray-300"
                            >
                              {isBusy ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {!domains.length && (
                <tr>
                  <td colSpan="4" className="py-12 text-center text-[13px] text-[#94a3b8]">
                    No active domains found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <button
        type="button"
        onClick={loadDomains}
        className="mt-4 inline-flex items-center gap-2 text-[12px] font-bold text-[#06b6d4] hover:text-[#0891b2]"
      >
        <RefreshCw size={14} />
        Refresh domains
      </button>
    </div>
  );
}

export default function DaycareDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const response = await apiGet('/admin/dashboard');
        setData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setData({
          stats: { totalDaycares: 0, totalChildren: 0, dailyObservations: 0, activeCareCircle: 0 },
          userActivityData: [],
          rolesData: [],
          observationsData: [],
          alerts: [{ id: 'error', type: 'danger', title: error.message || 'Unable to load admin dashboard', time: 'Now' }]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-gray-400">
          <Loader2 className="animate-spin" size={32} />
          <p className="text-[10px] font-bold tracking-widest uppercase">Loading System Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10 font-sans text-[#1e293b]">
      <div className="max-w-[1400px] mx-auto animate-in fade-in duration-500">
        
        {/* Header Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#0f172a] mb-1">Dashboard Overview</h1>
          <p className="text-[13px] text-[#64748b]">Monitor and manage your KIDport platform</p>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card 1 */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 flex flex-col justify-between shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-full bg-[#e0f2fe] flex items-center justify-center text-[#0284c7]">
                <Users size={20} strokeWidth={2} />
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-[#10b981] bg-[#ecfdf5] px-2 py-1 rounded-md">
                <TrendingUp size={12} strokeWidth={3} />
                +12.5%
              </div>
            </div>
            <div>
              <p className="text-[12px] font-medium text-[#64748b] mb-1">Total Daycare</p>
              <h3 className="text-2xl font-bold text-[#0f172a]">{formatNumber(data.stats?.totalDaycares)}</h3>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 flex flex-col justify-between shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-full bg-[#fef3c7] flex items-center justify-center text-[#d97706]">
                <Smile size={20} strokeWidth={2} />
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-[#10b981] bg-[#ecfdf5] px-2 py-1 rounded-md">
                <TrendingUp size={12} strokeWidth={3} />
                +8.2%
              </div>
            </div>
            <div>
              <p className="text-[12px] font-medium text-[#64748b] mb-1">Total Children</p>
              <h3 className="text-2xl font-bold text-[#0f172a]">{formatNumber(data.stats?.totalChildren)}</h3>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 flex flex-col justify-between shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-full bg-[#fee2e2] flex items-center justify-center text-[#e11d48]">
                <Eye size={20} strokeWidth={2} />
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-[#ef4444] bg-[#fef2f2] px-2 py-1 rounded-md">
                <TrendingDown size={12} strokeWidth={3} />
                -2.1%
              </div>
            </div>
            <div>
              <p className="text-[12px] font-medium text-[#64748b] mb-1">Daily Observations</p>
              <h3 className="text-2xl font-bold text-[#0f172a]">{formatNumber(data.stats?.dailyObservations)}</h3>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 flex flex-col justify-between shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-full bg-[#d1fae5] flex items-center justify-center text-[#059669]">
                <Brain size={20} strokeWidth={2} />
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-[#10b981] bg-[#ecfdf5] px-2 py-1 rounded-md">
                <TrendingUp size={12} strokeWidth={3} />
                +15.2%
              </div>
            </div>
            <div>
              <p className="text-[12px] font-medium text-[#64748b] mb-1">Active Care Circle</p>
              <h3 className="text-2xl font-bold text-[#0f172a]">{formatNumber(data.stats?.activeCareCircle)}</h3>
            </div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Line Chart */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm lg:col-span-2">
            <h3 className="text-[14px] font-bold text-[#1e293b] mb-6">User Activity</h3>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.userActivityData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 11 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 11 }} 
                    ticks={[0, 60, 120, 180, 240]}
                  />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#06b6d4" 
                    strokeWidth={3} 
                    dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4, stroke: 'white' }} 
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Donut Chart */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex flex-col">
            <h3 className="text-[14px] font-bold text-[#1e293b] mb-2">Total Daycare Analytics</h3>
            <div className="flex-1 flex flex-col justify-center">
              <div className="h-[200px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.rolesData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {data.rolesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Legend */}
              <div className="mt-4 space-y-3">
                {data.rolesData.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[12px]">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-[#4a5568]">{item.name}</span>
                    </div>
                    <span className="font-bold text-[#1e293b]">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 2 - Bar Chart */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-8">
          <h3 className="text-[14px] font-bold text-[#1e293b] mb-6">Observations Per Day</h3>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.observationsData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }} barSize={50}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 11 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 11 }} 
                  ticks={[0, 20, 40, 60, 80]}
                />
                <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" fill="#fcd34d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <DomainManagementSection />

        {/* Bottom Row Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Recent Activity List */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[14px] font-bold text-[#1e293b]">Recent Activity</h3>
              <button onClick={() => navigate('/daycare-notifications')} className="text-[12px] font-bold text-[#06b6d4] hover:text-[#0891b2] transition-colors">View All</button>
            </div>
            <div className="space-y-6">
              {(data.recentActivity || []).map((act, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[12px] ${act.color || 'bg-[#bbf7d0] text-[#166534]'}`}>
                      {act.initial}
                    </div>
                    <div>
                      <h4 className="text-[13px] font-bold text-[#1e293b]">{act.name}</h4>
                      <p className="text-[12px] text-[#64748b]">{act.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {act.flag && (
                      <span className="text-[10px] font-bold text-[#ef4444] bg-[#fef2f2] px-2 py-1 rounded">Flagged</span>
                    )}
                    <div className="flex items-center gap-1.5 text-[#94a3b8]">
                      <Clock size={12} />
                      <span className="text-[11px]">{formatDateOnly(act.time)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Alerts */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-[14px] font-bold text-[#1e293b] mb-6">System Alerts</h3>
            <div className="space-y-4">
              
              {(data.alerts || []).map((alert) => {
                const isDanger = alert.type === 'danger';
                const isInfo = alert.type === 'info';
                return (
                  <div key={alert.id} className={`p-4 rounded-xl border flex items-start gap-3 ${isDanger ? 'border-[#fecaca] bg-[#fef2f2]' : isInfo ? 'border-[#bfdbfe] bg-[#eff6ff]' : 'border-[#fde68a] bg-[#fffbeb]'}`}>
                    {isInfo ? <CheckCircle size={18} className="text-[#2563eb] mt-0.5" /> : <AlertTriangle size={18} className={`${isDanger ? 'text-[#e11d48]' : 'text-[#d97706]'} mt-0.5`} />}
                    <div>
                      <h4 className={`text-[13px] font-bold ${isDanger ? 'text-[#9f1239]' : isInfo ? 'text-[#1e40af]' : 'text-[#92400e]'}`}>{alert.title}</h4>
                      <p className={`text-[11px] mt-0.5 ${isDanger ? 'text-[#be123c]' : isInfo ? 'text-[#1d4ed8]' : 'text-[#b45309]'}`}>{alert.time}</p>
                    </div>
                  </div>
                );
              })}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

