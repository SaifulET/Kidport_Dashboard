import React, { useEffect, useState } from 'react';
import { Target, Brain, CheckCircle, AlertCircle, Zap, PieChart as PieChartIcon, LayoutGrid, Loader2 } from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar
} from 'recharts';
import { apiGet } from '../../lib/api';

const emptyAnalytics = {
  stats: {
    totalMilestones: 0,
    aiProcessed: 0,
    accuracyRate: 0,
    flaggedForReview: 0
  },
  lineData: [],
  pieData: [],
  barData: [],
  domains: []
};

const formatNumber = (value) => Number(value || 0).toLocaleString();

const DaycareAIMonitoring = () => {
  const [data, setData] = useState(emptyAnalytics);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadAnalytics = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await apiGet('/admin/milestones-ai');
        if (active) setData(response.data || emptyAnalytics);
      } catch (error) {
        if (active) setError(error.message || 'Failed to load milestones and AI analytics');
      } finally {
        if (active) setLoading(false);
      }
    };

    loadAnalytics();
    return () => {
      active = false;
    };
  }, []);

  const { stats, lineData, pieData, barData, domains } = data;

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-gray-400">
          <Loader2 className="animate-spin" size={32} />
          <p className="text-[10px] font-bold tracking-widest uppercase">Loading Milestones & AI...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfdfd] p-6 lg:p-10 font-sans text-[#1e293b]">
      <div className="max-w-[1400px] mx-auto animate-in fade-in duration-500">
        
        {/* Header Title */}
        <div className="mb-8">
          <h1 className="text-[26px] font-bold text-[#0f172a] mb-1 leading-tight">Milestones & AI Analytics</h1>
          <p className="text-[13px] text-[#64748b]">Monitor milestone tracking and AI processing performance</p>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-[14px] border border-gray-100 p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
            <div className="w-[42px] h-[42px] rounded-full bg-[#06b6d4] flex items-center justify-center text-white mb-4">
              <Target size={20} strokeWidth={2.5} />
            </div>
            <p className="text-[12px] font-medium text-[#64748b] mb-1">Total Milestones</p>
            <h3 className="text-[28px] font-bold text-[#0f172a] leading-none">{formatNumber(stats.totalMilestones)}</h3>
          </div>

          <div className="bg-white rounded-[14px] border border-gray-100 p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
            <div className="w-[42px] h-[42px] rounded-full bg-[#a855f7] flex items-center justify-center text-white mb-4">
              <Brain size={20} strokeWidth={2.5} />
            </div>
            <p className="text-[12px] font-medium text-[#64748b] mb-1">AI Processed</p>
            <h3 className="text-[28px] font-bold text-[#0f172a] leading-none">{formatNumber(stats.aiProcessed)}</h3>
          </div>

          <div className="bg-white rounded-[14px] border border-gray-100 p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
            <div className="w-[42px] h-[42px] rounded-full bg-[#10b981] flex items-center justify-center text-white mb-4">
              <CheckCircle size={20} strokeWidth={2.5} />
            </div>
            <p className="text-[12px] font-medium text-[#64748b] mb-1">Accuracy Rate</p>
            <h3 className="text-[28px] font-bold text-[#0f172a] leading-none">{stats.accuracyRate}%</h3>
          </div>

          <div className="bg-white rounded-[14px] border border-gray-100 p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
            <div className="w-[42px] h-[42px] rounded-full bg-[#ef4444] flex items-center justify-center text-white mb-4">
              <AlertCircle size={20} strokeWidth={2.5} />
            </div>
            <p className="text-[12px] font-medium text-[#64748b] mb-1">Flagged for Review</p>
            <h3 className="text-[28px] font-bold text-[#0f172a] leading-none">{formatNumber(stats.flaggedForReview)}</h3>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-[14px] border border-red-100 bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-600">
            {error}
          </div>
        )}

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          
          {/* Line Chart */}
          <div className="bg-white rounded-[14px] border border-gray-100 p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <Zap size={18} className="text-[#a855f7]" />
              <h3 className="text-[14px] font-bold text-[#1e293b]">AI Processing Activity</h3>
            </div>
            <div className="flex-1 min-h-[250px] -ml-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} dx={-10} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                    labelStyle={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}
                  />
                  <Line type="monotone" dataKey="processed" stroke="#a855f7" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="milestones" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Donut Chart */}
          <div className="bg-white rounded-[14px] border border-gray-100 p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <PieChartIcon size={18} className="text-[#10b981]" />
              <h3 className="text-[14px] font-bold text-[#1e293b]">AI Accuracy Distribution</h3>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center min-h-[250px]">
              <div className="h-[200px] w-full relative mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="w-full space-y-2.5 px-4">
                {pieData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-[13px] text-[#64748b]">{item.name}</span>
                    </div>
                    <span className="text-[13px] font-bold text-[#1e293b]">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
        </div>

        {/* Charts Row 2 - Bar Chart */}
        <div className="bg-white rounded-[14px] border border-gray-100 p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] mb-6">
          <div className="flex items-center gap-2 mb-6">
            <LayoutGrid size={18} className="text-[#06b6d4]" />
            <h3 className="text-[14px] font-bold text-[#1e293b]">Milestones by Development Domain</h3>
          </div>
          <div className="w-full h-[250px] -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barGap={0}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} dx={-10} />
                <RechartsTooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Bar dataKey="achieved" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={45} />
                <Bar dataKey="pending" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Domain Detail Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {domains.length > 0 ? (
            domains.map((domain, index) => {
              const colors = ['#06b6d4', '#fbbf24', '#fca5a5', '#a855f7', '#10b981', '#ec4899'];
              const color = colors[index % colors.length];
              return (
                <div key={domain.id} className="bg-white rounded-[14px] border border-gray-100 p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                  <h4 className="text-[14px] font-bold text-[#0f172a] mb-5">{domain.name}</h4>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center text-[12px]">
                      <span className="text-[#64748b]">Achieved</span>
                      <span className="font-bold text-[#1e293b]">{formatNumber(domain.achieved)}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${domain.completionRate}%`, backgroundColor: color }}></div>
                    </div>

                    <div className="flex justify-between items-center text-[12px]">
                      <span className="text-[#64748b]">Pending</span>
                      <span className="font-bold text-[#1e293b]">{formatNumber(domain.pending)}</span>
                    </div>
                    <div className="flex justify-between items-center text-[12px]">
                      <span className="text-[#64748b]">Total</span>
                      <span className="font-bold text-[#1e293b]">{formatNumber(domain.total)}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[20px] font-bold mb-0.5" style={{ color }}>{domain.completionRate}%</p>
                    <p className="text-[11px] text-[#94a3b8]">Completion Rate</p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-12 text-center text-[14px] font-medium text-[#64748b] bg-white rounded-[14px] border border-gray-100">
              No milestone domain data available yet.
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default DaycareAIMonitoring;

