import React, { useState, useEffect } from 'react';
import { ExternalLink, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ParentDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  // Pagination State (Terminal)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const [isGenerating, setIsGenerating] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const handleGenerateReport = () => {
    if (!data) return;
    setIsGenerating(true);
    setTimeout(async () => {
      try {
        const { default: jsPDF } = await import("jspdf");
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.text("System Overview Report", 20, 20);
        doc.setFontSize(14);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
        doc.setFontSize(12);
        doc.text(`Total Users: ${data.stats[0].value}`, 20, 50);
        doc.text(`Total Children: ${data.stats[1].value}`, 20, 60);
        doc.text(`Active Care Circles: ${data.stats[2].value}`, 20, 70);
        doc.text(`Daily Observations: ${data.stats[3].value}`, 20, 80);
        doc.save("system_overview_report.pdf");
      } catch (err) {
                alert("Failed to generate report.");
      } finally {
        setIsGenerating(false);
      }
    }, 1000);
  };

  const handleSystemScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      alert("System Scan Complete: No anomalies detected. System is running optimally.");
    }, 2000);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setData({
          stats: [
            { title: 'TOTAL USERS', value: '1,284', trend: '+12%', trendLabel: 'FROM LAST MONTH', isPositive: true },
            { title: 'TOTAL CHILDREN', value: '842', trend: '+5.4%', trendLabel: 'FROM LAST MONTH', isPositive: true },
            { title: 'ACTIVE CARE CIRCLES', value: '312', trend: '+3%', trendLabel: 'FROM LAST MONTH', isPositive: true },
            { title: 'DAILY OBSERVATIONS', value: '4,120', trend: '-2.1%', trendLabel: 'FROM YESTERDAY', isPositive: false }
          ],
          activityTrend: {
            peakUsage: '14:00 PM',
            lowUsage: '03:00 AM',
            avgDuration: '14.2 min'
          },
          userGrowthBars: [30, 40, 35, 45, 60, 55, 80, 70, 95, 85, 100],
          recentActivity: [
            { id: 1, timestamp: ['2023-10-27', '14:23:45'], user: ['Sarah', 'Jenkins'], action: 'New Observation: Outdoor play social interaction log.', risk: 'LOW' },
            { id: 2, timestamp: ['2023-10-27', '14:15:12'], user: ['System', 'AI'], action: 'Unusual activity detected in Circle 14: Emotional shift.', risk: 'MEDIUM' },
            { id: 3, timestamp: ['2023-10-27', '13:58:22'], user: ['David', 'Miller'], action: 'Updated emergency contact info for Child ID: #442.', risk: 'LOW' },
            { id: 4, timestamp: ['2023-10-27', '13:42:01'], user: ['Maria', 'Garcia'], action: 'New Observation: Academic achievement milestone (Math).', risk: 'LOW' },
            { id: 5, timestamp: ['2023-10-27', '12:10:05'], user: ['Alex', 'Sterling'], action: 'Approved new care circle request.', risk: 'LOW' },
            { id: 6, timestamp: ['2023-10-27', '11:45:30'], user: ['System', 'Admin'], action: 'Weekly system backup completed.', risk: 'LOW' },
            { id: 7, timestamp: ['2023-10-27', '10:12:11'], user: ['Jane', 'Doe'], action: 'Failed login attempt detected from new IP.', risk: 'MEDIUM' },
            { id: 8, timestamp: ['2023-10-27', '09:05:44'], user: ['System', 'AI'], action: 'Generated monthly user growth report.', risk: 'LOW' }
          ],
          totalEvents: 1284,
        });
      } catch (_error) {} finally {
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

  const totalItems = data.recentActivity.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentActivityList = data.recentActivity.slice(startIndex, endIndex);

  const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };
  const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const handlePageClick = (page) => { setCurrentPage(page); };

  return (
    <div className="min-h-screen p-8 bg-[#f8fafc] font-sans text-[#1e293b]">
      <div className="mx-auto max-w-7xl animate-in fade-in zoom-in duration-500">

        <div className="flex justify-between items-end mb-10">
          <div>
            <p className="text-[9px] font-bold text-[#64748b] tracking-[0.2em] uppercase mb-1.5">
              SYSTEM OVERVIEW
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-[#1e293b]">Dashboard Overview</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleGenerateReport}
              disabled={isGenerating || !data}
              className="bg-white border border-[#e2e8f0] hover:bg-[#f8fafc] text-[#1e293b] text-[10px] font-bold tracking-wider uppercase px-5 py-2.5 rounded-lg shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? <Loader2 size={14} className="animate-spin" /> : null}
              {isGenerating ? "GENERATING..." : "GENERATE REPORT"}
            </button>
            <button
              onClick={handleSystemScan}
              disabled={isScanning || !data}
              className="bg-[#06b6d4] hover:bg-[#0891b2] text-white text-[10px] font-bold tracking-wider uppercase px-5 py-2.5 rounded-lg shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isScanning ? <Loader2 size={14} className="animate-spin" /> : null}
              {isScanning ? "SCANNING..." : "SYSTEM SCAN"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
          {data.stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between h-32 hover:shadow-md transition-all duration-300">
              <h3 className="text-[9px] font-bold text-[#64748b] tracking-widest uppercase">{stat.title}</h3>
              <div className="text-4xl font-light tracking-tight text-[#1e293b]">{stat.value}</div>
              <div className="flex items-center gap-1.5 mt-2">
                {stat.isPositive ? (
                  <TrendingUp size={10} className="text-[#06b6d4]" strokeWidth={3} />
                ) : (
                  <TrendingDown size={10} className="text-[#06b6d4]" strokeWidth={3} />
                )}
                <span className="text-[8px] font-bold text-[#1e293b] tracking-wider uppercase">
                  {stat.trend} {stat.trendLabel}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col xl:flex-row gap-6 mb-8 h-auto xl:h-[360px]">
          <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm p-8 flex flex-col group">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-lg font-bold text-[#1e293b]">User Growth Graph</h2>
                <p className="text-xs text-[#64748b] mt-1">Historical data over the last 30 days</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-[#fcd34d] rounded-sm"></div>
                <span className="text-[9px] font-bold tracking-widest uppercase text-[#1e293b]">ACTIVE</span>
              </div>
            </div>
            <div className="flex-1 flex items-end gap-1.5 mt-auto">
              {data.userGrowthBars.map((h, i) => (
                <div
                  key={i}
                  className={`flex-1 transition-all duration-500 hover:opacity-80 rounded-t-sm ${i < 3 ? 'bg-[#e2e8f0]' : 'bg-[#fcd34d]'}`}
                  style={{ height: `${h}%` }}
                ></div>
              ))}
            </div>
          </div>

          <div className="w-full xl:w-[350px] bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-[#1e293b] flex flex-col justify-between">
            <h2 className="text-sm text-[#64748b] font-bold tracking-widest uppercase">Activity Trend Graph</h2>
            <div className="space-y-6 mt-6">
              <div className="flex justify-between items-end border-b border-gray-100 pb-2">
                <span className="text-[11px] text-[#64748b]">Peak Usage</span>
                <span className="text-xl font-bold">{data.activityTrend.peakUsage}</span>
              </div>
              <div className="flex justify-between items-end border-b border-gray-100 pb-2">
                <span className="text-[11px] text-[#64748b]">Low Usage</span>
                <span className="text-xl font-bold">{data.activityTrend.lowUsage}</span>
              </div>
              <div className="flex justify-between items-end border-b border-gray-100 pb-2">
                <span className="text-[11px] text-[#64748b]">Avg Duration</span>
                <span className="text-xl font-bold">{data.activityTrend.avgDuration}</span>
              </div>
            </div>
            <div className="mt-8 bg-[#f8fafc] h-14 rounded-lg flex items-center justify-center relative overflow-hidden border border-[#e2e8f0]">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#e2e8f0] to-transparent w-1/2 animate-[shimmer_2s_infinite]"></div>
              <span className="text-[9px] font-bold text-[#64748b] tracking-[0.3em] uppercase relative z-10">PROCESSING...</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8">
          <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-4">
            <h2 className="text-lg font-bold text-[#1e293b]">Recent Activity List</h2>
            <span className="text-[9px] font-bold text-[#64748b] tracking-widest uppercase">LAST 24 HOURS</span>
          </div>

          <div className="min-h-[350px] w-full">
            {/* Desktop Header */}
            <div className="hidden lg:grid grid-cols-12 gap-4 border-b border-gray-100 pb-3 text-[9px] font-bold text-[#64748b] tracking-widest uppercase">
              <div className="col-span-2">TIMESTAMP</div>
              <div className="col-span-3">USER / ACTOR</div>
              <div className="col-span-4">ACTION DETAILS</div>
              <div className="col-span-2">RISK LEVEL</div>
              <div className="col-span-1 text-right pr-2">VIEW</div>
            </div>

            <div className="divide-y divide-gray-100">
              {currentActivityList.map((item) => (
                <div key={item.id} className="flex flex-col lg:grid lg:grid-cols-12 gap-4 lg:gap-4 py-4 hover:bg-[#f8fafc] transition-colors last:border-0">
                  
                  {/* Timestamp */}
                  <div className="w-full lg:col-span-2 flex justify-between lg:block">
                    <span className="lg:hidden text-[9px] font-bold text-[#64748b] tracking-widest uppercase">Timestamp</span>
                    <div className="text-right lg:text-left">
                      <div className="text-[11px] text-[#64748b]">{item.timestamp[0]}</div>
                      <div className="text-[11px] text-[#64748b]">{item.timestamp[1]}</div>
                    </div>
                  </div>

                  {/* User / Actor */}
                  <div className="w-full lg:col-span-3 flex justify-between lg:block">
                    <span className="lg:hidden text-[9px] font-bold text-[#64748b] tracking-widest uppercase">User / Actor</span>
                    <div className="text-right lg:text-left font-bold text-[13px] leading-tight text-[#1e293b]">
                      <div>{item.user[0]}</div>
                      <div>{item.user[1]}</div>
                    </div>
                  </div>

                  {/* Action Details */}
                  <div className="w-full lg:col-span-4">
                    <span className="lg:hidden text-[9px] font-bold text-[#64748b] tracking-widest uppercase mb-1 block">Action Details</span>
                    <div className="text-[13px] text-[#475569] lg:pr-8">
                      {item.action}
                    </div>
                  </div>

                  {/* Risk Level */}
                  <div className="w-full lg:col-span-2 flex justify-between lg:block items-center">
                    <span className="lg:hidden text-[9px] font-bold text-[#64748b] tracking-widest uppercase">Risk Level</span>
                    <div>
                      {item.risk === 'LOW' ? (
                        <span className="bg-[#f1f5f9] text-[#64748b] rounded-md text-[9px] font-bold px-2 py-1 tracking-wider uppercase border border-gray-100">LOW</span>
                      ) : (
                        <span className="bg-orange-50 text-orange-600 rounded-md text-[9px] font-bold px-2 py-1 tracking-wider uppercase border border-orange-100">MEDIUM</span>
                      )}
                    </div>
                  </div>

                  {/* View */}
                  <div className="w-full lg:col-span-1 flex justify-end lg:block items-center pt-2 lg:pt-0 border-t border-gray-100 lg:border-0 mt-2 lg:mt-0">
                    <button 
                      onClick={() => navigate('/notifications')}
                      className="text-[#94a3b8] hover:text-[#06b6d4] transition-colors inline-flex items-center gap-2 lg:block lg:float-right lg:pr-2"
                    >
                      <span className="lg:hidden text-[11px] font-bold text-[#64748b] uppercase tracking-widest">View Details</span>
                      <ExternalLink size={14} />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center mt-8 border-t border-gray-100 pt-4">
            <span className="text-[10px] text-[#64748b] font-medium">
              Showing {currentActivityList.length} of {data.totalEvents.toLocaleString()} events
            </span>
            <div className="flex gap-1.5">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-lg border border-[#e2e8f0] flex items-center justify-center bg-white text-[#64748b] hover:bg-[#f1f5f9] transition-colors text-[10px] font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                &lt;
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageClick(page)}
                  className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors text-[10px] font-bold ${currentPage === page
                      ? 'bg-[#06b6d4] text-white border-[#06b6d4] shadow-sm'
                      : 'bg-white text-[#64748b] hover:bg-[#f1f5f9] border-[#e2e8f0]'
                    }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-lg border border-[#e2e8f0] flex items-center justify-center bg-white text-[#64748b] hover:bg-[#f1f5f9] transition-colors text-[10px] font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                &gt;
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

