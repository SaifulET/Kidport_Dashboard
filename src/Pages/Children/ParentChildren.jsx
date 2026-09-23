import React, { useState, useEffect } from 'react';
import { Shield, Mail, QrCode, TrendingUp, AlertTriangle, Loader2, Filter, ListFilter, X } from 'lucide-react';

const ParentChildren = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [filterTab, setFilterTab] = useState('All Entries');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [newChildFormData, setNewChildFormData] = useState({ name: '', age: '', parent: '' });

  const handleExportCSV = () => {
    if (!data) return;
    const headers = ["ID", "Name", "Age", "Parent", "Circles", "Status"];
    const csvContent = [
      headers.join(","),
      ...data.registry.map(c => `"${c.id}","${c.name}","${c.age}","${c.parent}",${c.circles},${c.status}`)
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "children_registry.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRegisterChildSubmit = (e) => {
    e.preventDefault();
    if (!newChildFormData.name || !newChildFormData.parent) return;

    const initials = newChildFormData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const randomId = 'KP-' + Math.floor(1000 + Math.random() * 9000) + '-' + String.fromCharCode(65 + Math.floor(Math.random() * 26));

    const newChild = {
      id: randomId,
      initials: initials,
      name: newChildFormData.name,
      age: parseInt(newChildFormData.age) || 0,
      parent: newChildFormData.parent,
      circles: 1,
      status: 'Active'
    };

    setData(prev => ({
      ...prev,
      totalEntries: prev.totalEntries + 1,
      registry: [newChild, ...prev.registry]
    }));
    
    setNewChildFormData({ name: '', age: '', parent: '' });
    setIsRegisterModalOpen(false);
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
    setCurrentPage(1);
  };

  const handleViewDetails = (child) => {
    setSelectedChild(child);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        setData({
          stats: {
            managed: { value: '1,284', trend: '+12% from last month' },
            circles: { value: '3,902', trend: 'Avg 3.1 circles per child' },
            alert: { value: '0.04%', trend: 'System healthy' }
          },
          registry: [
            { id: 'KP-2938-X', initials: 'AM', name: 'Aria Miller', age: 6, parent: 'Sarah Miller', circles: 4, status: 'Active' },
            { id: 'KP-1102-Y', initials: 'LW', name: 'Liam Watson', age: 8, parent: 'David Watson', circles: 2, status: 'Alert' },
            { id: 'KP-5542-Z', initials: 'EC', name: 'Elena Chen', age: 5, parent: 'Michael Chen', circles: 5, status: 'Active' },
            { id: 'KP-0081-B', initials: 'JB', name: 'Julian Brooks', age: 11, parent: 'Amanda Brooks', circles: 3, status: 'Pending' },
            { id: 'KP-9982-A', initials: 'MR', name: 'Mia Robinson', age: 7, parent: 'Chloe Robinson', circles: 2, status: 'Alert' },
            { id: 'KP-3321-C', initials: 'NS', name: 'Noah Smith', age: 9, parent: 'James Smith', circles: 4, status: 'Active' }
          ],
          totalEntries: 1284,
          registryHealth: 94
        });
      } catch (_error) {} finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-gray-400">
          <Loader2 className="animate-spin" size={32} />
          <p className="text-[10px] font-bold tracking-widest uppercase">Loading Registry...</p>
        </div>
      </div>
    );
  }

  const filteredRegistry = data.registry.filter(child => {
    if (filterTab === 'All Entries') return true;
    if (filterTab === 'Alerts Only') return child.status === 'Alert';
    if (filterTab === 'Pending Review') return child.status === 'Pending';
    return true;
  }).sort((a, b) => {
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];
    
    if (typeof aValue === 'string') aValue = aValue.toLowerCase();
    if (typeof bValue === 'string') bValue = bValue.toLowerCase();

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(filteredRegistry.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEntries = filteredRegistry.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen p-4 md:p-8 bg-[#f8fafc] font-sans text-[#1e293b]">
      <div className="mx-auto max-w-7xl animate-in fade-in zoom-in duration-500">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-8 md:mb-10 gap-6">
          <div className="w-full md:w-1/2">
            <p className="text-[9px] font-bold text-[#64748b] tracking-widest uppercase mb-2">MANAGEMENT TERMINAL</p>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 uppercase text-[#1e293b]">Children</h1>
            <p className="text-sm text-[#64748b] leading-relaxed md:pr-8">
              Comprehensive database of all registered minors. Manage care circles, monitor AI safety scores, and review parental permissions.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 mt-0 md:mt-8 w-full md:w-auto">
            <button onClick={handleExportCSV} disabled={!data} className="flex-1 md:flex-none bg-white border border-[#e2e8f0] hover:bg-[#f1f5f9] text-[#1e293b] text-[10px] font-bold tracking-wider uppercase px-6 py-3 transition-colors disabled:opacity-50 whitespace-nowrap rounded-lg shadow-sm">
              EXPORT CSV
            </button>
            <button onClick={() => setIsRegisterModalOpen(true)} disabled={!data} className="flex-1 md:flex-none bg-[#06b6d4] hover:bg-[#0891b2] text-white text-[10px] font-bold tracking-wider uppercase px-6 py-3 transition-colors disabled:opacity-50 whitespace-nowrap rounded-lg shadow-sm">
              + REGISTER CHILD
            </button>
          </div>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 flex flex-col justify-between h-40 border-l-4 border-l-[#06b6d4]">
            <h3 className="text-[9px] font-bold text-[#64748b] tracking-widest uppercase">TOTAL MANAGED</h3>
            <div className="text-5xl font-light tracking-tight text-[#1e293b]">{data.stats.managed.value}</div>
            <div className="flex items-center gap-2 text-[#06b6d4]">
              <TrendingUp size={12} strokeWidth={3} />
              <span className="text-[9px] font-medium tracking-wide text-[#64748b]">{data.stats.managed.trend}</span>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 flex flex-col justify-between h-40">
            <h3 className="text-[9px] font-bold text-[#64748b] tracking-widest uppercase">ACTIVE CIRCLES</h3>
            <div className="text-5xl font-light tracking-tight text-[#1e293b]">{data.stats.circles.value}</div>
            <div className="flex items-center gap-2 text-[#10b981]">
              <div className="w-3 h-3 flex items-center justify-center">
                 <span className="text-xs">⊛</span>
              </div>
              <span className="text-[9px] font-medium tracking-wide text-[#64748b]">{data.stats.circles.trend}</span>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 flex flex-col justify-between h-40">
            <h3 className="text-[9px] font-bold text-[#64748b] tracking-widest uppercase">AI ALERT INDEX</h3>
            <div className="text-5xl font-light tracking-tight text-[#1e293b]">{data.stats.alert.value}</div>
            <div className="flex items-center gap-2 text-red-500">
              <AlertTriangle size={12} strokeWidth={3} />
              <span className="text-[9px] font-medium tracking-wide text-[#64748b]">{data.stats.alert.trend}</span>
            </div>
          </div>
        </div>

        {/* Registry Records Block */}
        <div className="bg-white mb-8 border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          {/* Registry Header */}
          <div className="bg-[#f8fafc] px-4 md:px-8 py-4 md:py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 border-b border-gray-100">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 w-full md:w-auto">
              <h2 className="text-[11px] font-bold tracking-widest uppercase shrink-0 text-[#1e293b]">REGISTRY RECORDS</h2>
              <div className="hidden md:block h-4 w-px bg-gray-200"></div>
              <div className="flex flex-wrap gap-4 md:gap-6 text-[10px] font-semibold w-full md:w-auto">
                <button 
                  onClick={() => { setFilterTab('All Entries'); setCurrentPage(1); }}
                  className={`${filterTab === 'All Entries' ? 'text-[#06b6d4] border-b-2 border-[#06b6d4] pb-0.5' : 'text-[#64748b] hover:text-[#1e293b] transition-colors'}`}
                >All Entries</button>
                <button 
                  onClick={() => { setFilterTab('Alerts Only'); setCurrentPage(1); }}
                  className={`${filterTab === 'Alerts Only' ? 'text-[#06b6d4] border-b-2 border-[#06b6d4] pb-0.5' : 'text-[#64748b] hover:text-[#1e293b] transition-colors'}`}
                >Alerts Only</button>
                <button 
                  onClick={() => { setFilterTab('Pending Review'); setCurrentPage(1); }}
                  className={`${filterTab === 'Pending Review' ? 'text-[#06b6d4] border-b-2 border-[#06b6d4] pb-0.5' : 'text-[#64748b] hover:text-[#1e293b] transition-colors'}`}
                >Pending Review</button>
              </div>
            </div>
            <div className="flex gap-4 text-[#64748b] ml-auto md:ml-0">
              <button 
                onClick={() => handleSort('age')} 
                className={`hover:text-black transition-colors ${sortConfig.key === 'age' ? 'text-black' : ''}`}
                title={`Sort by Age (${sortConfig.key === 'age' && sortConfig.direction === 'asc' ? 'Desc' : 'Asc'})`}
              >
                <Filter size={16} />
              </button>
              <button 
                onClick={() => handleSort('name')} 
                className={`hover:text-black transition-colors ${sortConfig.key === 'name' ? 'text-black' : ''}`}
                title={`Sort by Name (${sortConfig.key === 'name' && sortConfig.direction === 'asc' ? 'Desc' : 'Asc'})`}
              >
                <ListFilter size={16} />
              </button>
            </div>
          </div>

          {/* Responsive Table Wrapper */}
          <div className="w-full">
            {/* Table Headers */}
            <div className="hidden lg:flex px-8 py-4 items-center border-b border-gray-100 bg-white">
              <div className="w-[30%] text-[9px] font-bold text-[#64748b] tracking-widest uppercase">CHILD NAME</div>
              <div className="w-[15%] text-[9px] font-bold text-[#64748b] tracking-widest uppercase">AGE</div>
              <div className="w-[25%] text-[9px] font-bold text-[#64748b] tracking-widest uppercase">PARENT NAME</div>
              <div className="w-[15%] text-[9px] font-bold text-[#64748b] tracking-widest uppercase">CARE CIRCLES</div>
              <div className="w-[15%] text-right text-[9px] font-bold text-[#64748b] tracking-widest uppercase">ACTIONS</div>
            </div>

            {/* Table Rows */}
            <div className="flex flex-col min-h-[300px]">
              {currentEntries.map((child, i) => (
                <div key={i} className="p-6 lg:px-8 lg:py-5 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-0 border-b border-gray-100 last:border-0 hover:bg-[#f1f5f9] transition-colors bg-white">
                  
                  {/* Name and ID */}
                  <div className="w-full lg:w-[30%] flex items-center gap-4">
                    <div className="w-9 h-9 bg-[#e0f2fe] text-[#0284c7] rounded-full flex items-center justify-center text-[11px] font-bold tracking-wider shrink-0">
                      {child.initials}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold text-[#1e293b]">{child.name}</span>
                      <span className="text-[9px] text-[#64748b] mt-0.5 tracking-wider">ID: {child.id}</span>
                    </div>
                  </div>

                  {/* Age */}
                  <div className="w-full lg:w-[15%] flex justify-between lg:block items-center">
                    <span className="lg:hidden text-[9px] font-bold text-[#64748b] tracking-widest uppercase">AGE</span>
                    <span className="text-[13px] text-[#475569] font-medium">
                      {child.age}
                    </span>
                  </div>

                  {/* Parent Name */}
                  <div className="w-full lg:w-[25%] flex justify-between lg:block items-center">
                    <span className="lg:hidden text-[9px] font-bold text-[#64748b] tracking-widest uppercase">PARENT NAME</span>
                    <span className="text-[13px] text-[#475569]">
                      {child.parent}
                    </span>
                  </div>

                  {/* Care Circles */}
                  <div className="w-full lg:w-[15%] flex justify-between lg:block items-center">
                    <span className="lg:hidden text-[9px] font-bold text-[#64748b] tracking-widest uppercase">CARE CIRCLES</span>
                    <span className="bg-[#f1f5f9] text-[#1e293b] rounded-lg text-[9px] font-bold px-2 py-1 tracking-widest uppercase border border-gray-100 whitespace-nowrap">
                      {child.circles} Circles
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="w-full lg:w-[15%] flex lg:justify-end mt-2 lg:mt-0 pt-4 lg:pt-0 border-t border-gray-100 lg:border-0">
                    <button onClick={() => handleViewDetails(child)} className="w-full lg:w-auto text-[9px] font-bold tracking-widest uppercase border border-[#e2e8f0] rounded-lg px-3 py-2.5 lg:py-1.5 hover:bg-[#06b6d4] hover:text-white hover:border-[#06b6d4] transition-all whitespace-nowrap text-[#64748b]">
                      VIEW DETAILS
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          <div className="px-8 py-5 flex justify-between items-center border-t border-[#e2e8f0]">
            <span className="text-[10px] font-medium text-gray-500">
              Showing {currentEntries.length} of {filteredRegistry.length} entries
            </span>
            <div className="flex gap-1.5">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-lg flex items-center justify-center border border-[#e2e8f0] text-[#64748b] hover:bg-[#f1f5f9] text-[10px] font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                &lt;
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors text-[10px] font-bold ${
                    currentPage === page 
                      ? 'bg-[#06b6d4] text-white border-[#06b6d4] shadow-sm' 
                      : 'bg-white text-[#64748b] border-[#e2e8f0] hover:bg-[#f1f5f9]'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-lg flex items-center justify-center border border-[#e2e8f0] text-[#64748b] hover:bg-[#f1f5f9] text-[10px] font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                &gt;
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col xl:flex-row gap-6">
          {/* Quick Actions */}
          <div className="w-full xl:w-[60%] bg-[#f4f4f4] p-6 md:p-10 flex flex-col justify-between relative overflow-hidden">
            {/* Background design element */}
            <div className="absolute -bottom-16 -right-16 text-gray-200/50">
              <Shield size={250} strokeWidth={1} />
            </div>
            
            <div className="relative z-10">
              <h2 className="text-xl font-medium tracking-tight mb-6 md:mb-8">QUICK ACTIONS</h2>
              <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                <div className="flex-1 bg-white p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <Shield size={18} className="mb-4 text-black" />
                  <h3 className="text-[11px] font-bold mb-2">Audit Safety Logs</h3>
                  <p className="text-[10px] text-gray-500 leading-relaxed">
                    Review behavioral patterns identified by AI for all minors.
                  </p>
                </div>
                <div className="flex-1 bg-white p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <Mail size={18} className="mb-4 text-black" />
                  <h3 className="text-[11px] font-bold mb-2">Broadcast to Parents</h3>
                  <p className="text-[10px] text-gray-500 leading-relaxed">
                    Send global notifications to all primary guardians.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Stack */}
          <div className="w-full xl:w-[40%] flex flex-col gap-6">
            <div className="bg-black text-white p-6 md:p-8 flex-1 flex flex-col justify-center">
              <h3 className="text-[9px] font-bold tracking-widest uppercase mb-6 text-gray-400">REGISTRY HEALTH</h3>
              <div className="w-full bg-[#333] h-1 mb-6">
                <div className="bg-white h-1" style={{ width: `${data.registryHealth}%` }}></div>
              </div>
              <p className="text-[11px] text-gray-300 leading-relaxed">
                {data.registryHealth}% of data entries are verified with primary ID documentation. 76 records require immediate manual validation.
              </p>
            </div>
            
            <div className="bg-[#e8e8e8] p-6 md:p-8 flex-1 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-300 transition-colors">
              <QrCode size={24} className="mb-4" />
              <h3 className="text-[11px] font-bold tracking-widest uppercase mb-2">GENERATE BATCH ID</h3>
              <p className="text-[10px] text-gray-500">
                Printable identification for local care circles.
              </p>
            </div>
          </div>
        </div>

        {/* View Details Modal */}
        {isModalOpen && selectedChild && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 rounded-xl overflow-hidden">
              <div className="bg-white text-[#1e293b] p-4 flex justify-between items-center border-b border-gray-100">
                <h2 className="text-[11px] font-bold tracking-widest uppercase">Child Details</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-[#64748b] hover:text-[#1e293b] transition-colors">
                  <X size={16} />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#e0f2fe] text-[#0284c7] rounded-full flex items-center justify-center text-[14px] font-bold tracking-wider">
                    {selectedChild.initials}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#1e293b]">{selectedChild.name}</h3>
                    <p className="text-[12px] text-[#64748b]">ID: {selectedChild.id}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold text-[#64748b] tracking-widest uppercase mb-1">Age</label>
                    <p className="text-[13px] font-medium text-[#1e293b]">{selectedChild.age} years</p>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-[#64748b] tracking-widest uppercase mb-1">Parent</label>
                    <p className="text-[13px] font-medium text-[#1e293b]">{selectedChild.parent}</p>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-[#64748b] tracking-widest uppercase mb-1">Care Circles</label>
                    <span className="bg-[#f1f5f9] text-[#1e293b] rounded-lg text-[9px] font-bold px-2 py-1 tracking-widest uppercase inline-block mt-1">
                      {selectedChild.circles} Circles
                    </span>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-[#64748b] tracking-widest uppercase mb-1">Registry Health</label>
                    <div className="flex items-center gap-2 mt-1 text-[#10b981]">
                      <div className="w-1.5 h-1.5 bg-[#10b981] rounded-full"></div>
                      <span className="text-[10px] font-bold tracking-widest uppercase">VERIFIED</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-[#f8fafc] p-4 flex justify-end border-t border-gray-100">
                <button onClick={() => setIsModalOpen(false)} className="bg-white border border-[#e2e8f0] hover:bg-[#f1f5f9] text-[#1e293b] text-[10px] font-bold tracking-wider uppercase px-5 py-2.5 rounded-lg transition-colors">
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Register Modal */}
        {isRegisterModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 rounded-xl overflow-hidden">
              <div className="bg-white text-[#1e293b] p-4 flex justify-between items-center border-b border-gray-100">
                <h2 className="text-[11px] font-bold tracking-widest uppercase">Register Child</h2>
                <button onClick={() => setIsRegisterModalOpen(false)} className="text-[#64748b] hover:text-[#1e293b] transition-colors">
                  <X size={16} />
                </button>
              </div>
              <form onSubmit={handleRegisterChildSubmit}>
                <div className="p-6 space-y-5">
                  <div>
                    <label className="block text-[9px] font-bold text-[#64748b] tracking-widest uppercase mb-2">Child's Full Name</label>
                    <input 
                      type="text" 
                      required 
                      value={newChildFormData.name}
                      onChange={(e) => setNewChildFormData({...newChildFormData, name: e.target.value})}
                      className="w-full px-4 py-2.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-[13px] text-[#1e293b] focus:outline-none focus:ring-1 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-shadow"
                      placeholder="e.g. Liam Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-[#64748b] tracking-widest uppercase mb-2">Age</label>
                    <input 
                      type="number" 
                      required 
                      min="0"
                      max="18"
                      value={newChildFormData.age}
                      onChange={(e) => setNewChildFormData({...newChildFormData, age: e.target.value})}
                      className="w-full px-4 py-2.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-[13px] text-[#1e293b] focus:outline-none focus:ring-1 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-shadow"
                      placeholder="e.g. 5"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-[#64748b] tracking-widest uppercase mb-2">Primary Parent/Guardian Name</label>
                    <input 
                      type="text" 
                      required 
                      value={newChildFormData.parent}
                      onChange={(e) => setNewChildFormData({...newChildFormData, parent: e.target.value})}
                      className="w-full px-4 py-2.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-[13px] text-[#1e293b] focus:outline-none focus:ring-1 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-shadow"
                      placeholder="e.g. David Smith"
                    />
                  </div>
                </div>
                <div className="bg-[#f8fafc] p-4 flex justify-end gap-3 border-t border-gray-100">
                  <button type="button" onClick={() => setIsRegisterModalOpen(false)} className="bg-white border border-[#e2e8f0] hover:bg-[#f1f5f9] text-[#1e293b] text-[10px] font-bold tracking-wider uppercase px-5 py-2.5 rounded-lg transition-colors">
                    CANCEL
                  </button>
                  <button type="submit" className="bg-[#06b6d4] hover:bg-[#0891b2] text-white text-[10px] font-bold tracking-wider uppercase px-5 py-2.5 rounded-lg transition-colors">
                    REGISTER
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

export default ParentChildren;

