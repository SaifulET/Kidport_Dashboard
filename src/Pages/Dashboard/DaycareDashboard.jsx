import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Loader2, Users, Smile, Eye, Brain, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

export default function DaycareDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        setData({
          userActivityData: [
            { name: 'Apr 1', value: 140 },
            { name: 'Apr 2', value: 180 },
            { name: 'Apr 3', value: 160 },
            { name: 'Apr 4', value: 200 },
            { name: 'Apr 5', value: 190 },
            { name: 'Apr 6', value: 220 },
            { name: 'Apr 7', value: 240 }
          ],
          rolesData: [
            { name: 'Parents', value: 456, color: '#00b4d8' },
            { name: 'Daycare', value: 87, color: '#ff9f1c' }
          ],
          observationsData: [
            { name: 'Mon', value: 45 },
            { name: 'Tue', value: 52 },
            { name: 'Wed', value: 38 },
            { name: 'Thu', value: 61 },
            { name: 'Fri', value: 48 },
            { name: 'Sat', value: 34 },
            { name: 'Sun', value: 28 }
          ]
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
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
              <h3 className="text-2xl font-bold text-[#0f172a]">1,247</h3>
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
              <h3 className="text-2xl font-bold text-[#0f172a]">823</h3>
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
              <h3 className="text-2xl font-bold text-[#0f172a]">3,892</h3>
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
              <h3 className="text-2xl font-bold text-[#0f172a]">1456</h3>
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

        {/* Bottom Row Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Recent Activity List */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[14px] font-bold text-[#1e293b]">Recent Activity</h3>
              <button onClick={() => navigate('/daycare-notifications')} className="text-[12px] font-bold text-[#06b6d4] hover:text-[#0891b2] transition-colors">View All</button>
            </div>
            <div className="space-y-6">
              {[
                { initial: 'SM', color: 'bg-[#bbf7d0] text-[#166534]', name: 'Sarah Martinez', desc: 'Added observation for Emma', time: '2 min ago' },
                { initial: 'JD', color: 'bg-[#bbf7d0] text-[#166534]', name: 'John Davidson', desc: 'Marked milestone achieved', time: '8 min ago' },
                { initial: 'EC', color: 'bg-[#bbf7d0] text-[#166534]', name: 'Emily Chen', desc: 'Uploaded video observation', time: '15 min ago', flag: true },
                { initial: 'MR', color: 'bg-[#bbf7d0] text-[#166534]', name: 'Michael Roberts', desc: 'Joined care circle', time: '23 min ago' },
                { initial: 'JL', color: 'bg-[#bbf7d0] text-[#166534]', name: 'Jennifer Lee', desc: 'Updated child profile', time: '35 min ago' }
              ].map((act, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[12px] ${act.color}`}>
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
                      <span className="text-[11px]">{act.time}</span>
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
              
              <div className="p-4 rounded-xl border border-[#fde68a] bg-[#fffbeb] flex items-start gap-3">
                <AlertTriangle size={18} className="text-[#d97706] mt-0.5" />
                <div>
                  <h4 className="text-[13px] font-bold text-[#92400e]">3 support tickets need attention</h4>
                  <p className="text-[11px] text-[#b45309] mt-0.5">10 min ago</p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-[#fecaca] bg-[#fef2f2] flex items-start gap-3">
                <AlertTriangle size={18} className="text-[#e11d48] mt-0.5" />
                <div>
                  <h4 className="text-[13px] font-bold text-[#9f1239]">AI flagged 2 observations for review</h4>
                  <p className="text-[11px] text-[#be123c] mt-0.5">25 min ago</p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-[#bfdbfe] bg-[#eff6ff] flex items-start gap-3">
                <CheckCircle size={18} className="text-[#2563eb] mt-0.5" />
                <div>
                  <h4 className="text-[13px] font-bold text-[#1e40af]">System backup completed successfully</h4>
                  <p className="text-[11px] text-[#1d4ed8] mt-0.5">1 hour ago</p>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

