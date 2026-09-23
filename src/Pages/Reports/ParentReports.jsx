import React, { useState, useEffect, useMemo } from 'react';
import { Loader2, X, ChevronDown } from 'lucide-react';
import jsPDF from 'jspdf';

const ParentReports = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [filterStatus, setFilterStatus] = useState('All');
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [newReportData, setNewReportData] = useState({ name: '', domains: 'BEHAVIORAL' });

  const handleFilterToggle = () => {
    setFilterStatus(prev => {
      if (prev === 'All') return 'Active';
      if (prev === 'Active') return 'Inactive';
      return 'All';
    });
    setCurrentPage(1);
  };

  const handleGenerateReportSubmit = (e) => {
    e.preventDefault();
    if (!newReportData.name) return;
    
    const newReport = {
      id: data.reports.length > 0 ? Math.max(...data.reports.map(r => r.id)) + 1 : 1,
      name: newReportData.name,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      domains: [newReportData.domains],
      status: 'active'
    };
    
    setData(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        totalGenerated: (parseInt(prev.stats.totalGenerated.replace(/,/g, '')) + 1).toLocaleString()
      },
      reports: [newReport, ...prev.reports]
    }));
    
    setNewReportData({ name: '', domains: 'BEHAVIORAL' });
    setIsGenerateModalOpen(false);
  };

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setData({
          stats: {
            totalGenerated: '1,284',
            activeNodes: '42',
            anomaliesDetected: '03'
          },
          reports: [
            { id: 1, name: 'Benjamin Harrison', date: 'Oct 24, 2023', domains: ['BEHAVIORAL', 'COGNITIVE'], status: 'active' },
            { id: 2, name: 'Sophia Chen', date: 'Oct 23, 2023', domains: ['SOCIAL-EMOTIONAL'], status: 'inactive' },
            { id: 3, name: 'Lucas Montgomery', date: 'Oct 22, 2023', domains: ['LINGUISTIC', 'MOTOR SKILLS', '+2'], status: 'active' },
            { id: 4, name: 'Elena Rodriguez', date: 'Oct 22, 2023', domains: ['COGNITIVE'], status: 'inactive' },
            { id: 5, name: 'Oliver Smith', date: 'Oct 21, 2023', domains: ['BEHAVIORAL', 'PHYSICAL'], status: 'active' },
            // Extra dummy items for pagination
            { id: 6, name: 'Ava Johnson', date: 'Oct 20, 2023', domains: ['COGNITIVE', 'LINGUISTIC'], status: 'active' },
            { id: 7, name: 'William Davis', date: 'Oct 19, 2023', domains: ['MOTOR SKILLS'], status: 'inactive' },
            { id: 8, name: 'Mia Wilson', date: 'Oct 18, 2023', domains: ['BEHAVIORAL', 'SOCIAL-EMOTIONAL'], status: 'active' }
          ],
          systemStatus: 'OPTIMAL',
          lastSync: '12:04:33 UTC'
        });
      } catch (_error) {} finally {
        setLoading(false);
      }
    };
    
    fetchReports();
  }, []);

  const filteredReports = useMemo(() => {
    if (!data) return [];
    return data.reports.filter(r => {
      if (filterStatus === 'All') return true;
      return r.status.toLowerCase() === filterStatus.toLowerCase();
    });
  }, [data, filterStatus]);

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-gray-400">
          <Loader2 className="animate-spin" size={32} />
          <p className="text-[10px] font-bold tracking-widest uppercase">Loading Reports...</p>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentReports = filteredReports.slice(startIndex, startIndex + itemsPerPage);

  const handleDownload = (report) => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(18);
    doc.text(`Child Report: ${report.name}`, 14, 22);
    
    // Details
    doc.setFontSize(12);
    doc.text(`Date: ${report.date}`, 14, 32);
    doc.text(`Status: ${report.status.toUpperCase()}`, 14, 40);
    doc.text(`Domains Included: ${report.domains.join(', ')}`, 14, 48);
    
    // Divider
    doc.setLineWidth(0.5);
    doc.line(14, 54, 196, 54);
    
    // Summary
    doc.setFontSize(14);
    doc.text("Summary of Findings", 14, 64);
    doc.setFontSize(12);
    
    const summaryText = `This is an automatically generated mock report for ${report.name}. Monitoring indicated normal progress across most domains with some specific observations recorded in the latest sessions.`;
    
    const splitText = doc.splitTextToSize(summaryText, 180);
    doc.text(splitText, 14, 74);
    
    // Footer metadata
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated by: Seymour Parent Terminal`, 14, 270);
    doc.text(`System Status: ${data.systemStatus}`, 14, 276);
    doc.text(`Timestamp: ${new Date().toISOString()}`, 14, 282);
    
    // Save the PDF
    const safeName = report.name.replace(/\s+/g, '_').toLowerCase();
    doc.save(`report_${safeName}_${report.date.replace(/[\s,]+/g, '_')}.pdf`);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-[#f8fafc] font-sans text-[#1e293b]">
      <div className="mx-auto max-w-7xl animate-in fade-in zoom-in duration-500">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-10 gap-6">
          <div>
            <p className="text-[10px] font-bold text-[#64748b] tracking-[0.2em] uppercase mb-2">OPERATIONAL INTELLIGENCE</p>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-[#1e293b]">Reports</h1>
          </div>
          <div className="flex flex-wrap gap-3 mb-0 md:mb-2 w-full md:w-auto">
            <button onClick={handleFilterToggle} disabled={!data} className="flex-1 md:flex-none bg-white border border-[#e2e8f0] hover:bg-[#f1f5f9] text-[#1e293b] text-[10px] font-bold tracking-wider uppercase px-6 py-3 rounded-lg shadow-sm transition-colors disabled:opacity-50 whitespace-nowrap">
              FILTER VIEW: {filterStatus}
            </button>
            <button onClick={() => setIsGenerateModalOpen(true)} disabled={!data} className="flex-1 md:flex-none bg-[#06b6d4] hover:bg-[#0891b2] text-white text-[10px] font-bold tracking-wider uppercase px-6 py-3 rounded-lg shadow-sm transition-colors disabled:opacity-50 whitespace-nowrap">
              GENERATE NEW REPORT
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-10">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-10 flex flex-col justify-between h-auto min-h-[192px] border-l-4 border-l-[#06b6d4]">
            <h3 className="text-[9px] font-bold text-[#64748b] tracking-[0.15em] uppercase">TOTAL GENERATED</h3>
            <div className="text-6xl font-light tracking-tight text-[#1e293b]">{data.stats.totalGenerated}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-10 flex flex-col justify-between h-auto min-h-[192px]">
            <h3 className="text-[9px] font-bold text-[#64748b] tracking-[0.15em] uppercase">ACTIVE MONITORING NODES</h3>
            <div className="text-6xl font-light tracking-tight text-[#1e293b]">{data.stats.activeNodes}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-10 flex flex-col justify-between h-auto min-h-[192px] text-[#1e293b]">
            <h3 className="text-[9px] font-bold text-[#64748b] tracking-[0.15em] uppercase">ANOMALIES DETECTED</h3>
            <div className="text-6xl font-light tracking-tight text-[#1e293b]">{data.stats.anomaliesDetected}</div>
          </div>
        </div>

        {/* Table Section */}
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Desktop Table Headers */}
          <div className="hidden lg:flex bg-[#f8fafc] px-8 py-5 items-center border-b border-gray-100">
            <div className="w-[30%] text-[10px] font-bold text-[#64748b] tracking-[0.1em] uppercase">CHILD NAME</div>
            <div className="w-[20%] text-[10px] font-bold text-[#64748b] tracking-[0.1em] uppercase">DATE</div>
            <div className="w-[40%] text-[10px] font-bold text-[#64748b] tracking-[0.1em] uppercase">DOMAINS INCLUDED</div>
            <div className="w-[10%] text-right text-[10px] font-bold text-[#64748b] tracking-[0.1em] uppercase">ACTIONS</div>
          </div>
          
          {/* Table Rows */}
          <div className="flex flex-col min-h-[400px]">
            {currentReports.map((report) => (
              <div key={report.id} className="bg-white px-6 lg:px-8 py-6 flex flex-col lg:flex-row lg:items-center border-b border-gray-100 hover:bg-[#f1f5f9] transition-colors gap-4 lg:gap-0 last:border-0">
                <div className="w-full lg:w-[30%] flex justify-between lg:justify-start items-center gap-4">
                  <span className="lg:hidden text-[10px] font-bold text-[#64748b] tracking-[0.1em] uppercase">CHILD NAME</span>
                  <div className="flex items-center gap-3 lg:gap-4">
                    <div className={`w-1.5 h-1.5 flex-shrink-0 rounded-full ${report.status === 'active' ? 'bg-[#10b981]' : 'bg-[#94a3b8]'}`}></div>
                    <span className="text-[13px] font-bold text-[#1e293b]">{report.name}</span>
                  </div>
                </div>
                <div className="w-full lg:w-[20%] flex justify-between lg:justify-start items-center text-[13px] text-[#475569]">
                  <span className="lg:hidden text-[10px] font-bold text-[#64748b] tracking-[0.1em] uppercase">DATE</span>
                  <span>{report.date}</span>
                </div>
                <div className="w-full lg:w-[40%] flex justify-between lg:justify-start items-start lg:items-center">
                  <span className="lg:hidden text-[10px] font-bold text-[#64748b] tracking-[0.1em] uppercase pt-1">DOMAINS</span>
                  <div className="flex gap-2 flex-wrap justify-end lg:justify-start max-w-[60%] lg:max-w-full">
                    {report.domains.map((domain, idx) => (
                      <span 
                        key={idx} 
                        className="bg-[#f1f5f9] text-[#1e293b] rounded-lg border border-gray-100 text-[9px] font-bold px-2 py-1.5 tracking-widest uppercase"
                      >
                        {domain}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="w-full lg:w-[10%] flex justify-end pt-4 lg:pt-0 border-t border-gray-100 lg:border-t-0 mt-2 lg:mt-0">
                  <button onClick={() => handleDownload(report)} className="text-[10px] font-bold text-[#06b6d4] border-b-2 border-[#06b6d4] pb-0.5 hover:text-[#0891b2] hover:border-[#0891b2] transition-colors tracking-widest uppercase whitespace-nowrap">
                    DOWNLOAD
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

          {/* Footer Section */}
          <div className="mt-8 flex flex-col md:flex-row justify-between items-start md:items-center py-4 gap-6">
            <div className="flex flex-wrap gap-4 md:gap-8 text-[10px] font-bold tracking-widest uppercase">
              <span className="text-[#64748b]">
                SYSTEM STATUS: <span className="text-[#1e293b]">{data.systemStatus}</span>
              </span>
              <span className="text-[#64748b]">
                LAST SYNC: <span className="text-[#1e293b]">{data.lastSync}</span>
              </span>
            </div>
            
            <div className="flex gap-1.5">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-white text-[#64748b] hover:bg-[#f1f5f9] transition-colors text-[10px] font-bold disabled:opacity-50 disabled:cursor-not-allowed border border-[#e2e8f0]"
              >
                &lt;
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors text-[10px] font-bold border ${
                    currentPage === page 
                      ? 'bg-[#06b6d4] text-white border-[#06b6d4] shadow-sm' 
                      : 'bg-white text-[#64748b] hover:bg-[#f1f5f9] border-[#e2e8f0]'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-white text-[#64748b] hover:bg-[#f1f5f9] transition-colors text-[10px] font-bold disabled:opacity-50 disabled:cursor-not-allowed border border-[#e2e8f0]"
              >
                &gt;
              </button>
            </div>
          </div>

        {/* Generate Report Modal */}
        {isGenerateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 rounded-xl overflow-hidden">
              <div className="bg-white text-[#1e293b] border-b border-gray-100 p-4 flex justify-between items-center">
                <h2 className="text-[11px] font-bold tracking-widest uppercase">Generate Report</h2>
                <button onClick={() => setIsGenerateModalOpen(false)} className="text-[#64748b] hover:text-[#1e293b] transition-colors">
                  <X size={16} />
                </button>
              </div>
              <form onSubmit={handleGenerateReportSubmit}>
                <div className="p-6 space-y-5">
                  <div>
                    <label className="block text-[9px] font-bold text-[#64748b] tracking-widest uppercase mb-2">Subject Name</label>
                    <input 
                      type="text" 
                      required 
                      value={newReportData.name}
                      onChange={(e) => setNewReportData({...newReportData, name: e.target.value})}
                      className="w-full px-4 py-2.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-[13px] text-[#1e293b] focus:outline-none focus:ring-1 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-shadow"
                      placeholder="e.g. Liam Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-[#64748b] tracking-widest uppercase mb-2">Primary Domain</label>
                    <div className="relative">
                      <select 
                        value={newReportData.domains}
                        onChange={(e) => setNewReportData({...newReportData, domains: e.target.value})}
                        className="w-full px-4 py-2.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-[13px] text-[#1e293b] appearance-none focus:outline-none focus:ring-1 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-shadow cursor-pointer"
                      >
                        <option value="BEHAVIORAL">Behavioral</option>
                        <option value="COGNITIVE">Cognitive</option>
                        <option value="SOCIAL-EMOTIONAL">Social-Emotional</option>
                        <option value="LINGUISTIC">Linguistic</option>
                        <option value="MOTOR SKILLS">Motor Skills</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none" size={14} />
                    </div>
                  </div>
                </div>
                <div className="bg-[#f8fafc] border-t border-gray-100 p-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsGenerateModalOpen(false)} className="bg-white border border-[#e2e8f0] hover:bg-[#f1f5f9] text-[#1e293b] text-[10px] font-bold tracking-wider uppercase px-5 py-2.5 rounded-lg transition-colors">
                    CANCEL
                  </button>
                  <button type="submit" className="bg-[#06b6d4] hover:bg-[#0891b2] text-white text-[10px] font-bold tracking-wider uppercase px-5 py-2.5 rounded-lg transition-colors">
                    GENERATE
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ParentReports;

