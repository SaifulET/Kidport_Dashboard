import React, { useState, useEffect, useMemo } from 'react';
import { Search, ChevronDown, MoreVertical, Calendar, Heart, TrendingUp, RefreshCw, Loader2, X, AlertTriangle } from 'lucide-react';
import { apiGet, apiPatch } from '../../lib/api';

const DaycareChildren = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  // Search, Filter, and Pagination State
  const [search, setSearch] = useState('');
  const [ageFilter, setAgeFilter] = useState('All Ages');
  const [page, setPage] = useState(1);
  const itemsPerPage = 5; 

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [childToDelete, setChildToDelete] = useState(null);

  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [childToBlock, setChildToBlock] = useState(null);

  const [activeDropdownChildId, setActiveDropdownChildId] = useState(null);

  useEffect(() => {
    const handleOutsideClick = () => {
      setActiveDropdownChildId(null);
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const handleDeleteConfirm = () => {
    if (childToDelete) {
      apiPatch(`/admin/children/${childToDelete.id}/status`, { status: 'deleted' }).catch((error) => {
        console.error("Error deleting child:", error);
      });
      setData(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          total: (parseInt(prev.stats.total) - 1).toString(),
          active: Math.max(parseInt(prev.stats.active) - (childToDelete.blocked ? 0 : 1), 0).toString()
        },
        children: prev.children.filter(c => c.id !== childToDelete.id)
      }));
      setDeleteModalOpen(false);
      setChildToDelete(null);
    }
  };

  const handleBlockConfirm = () => {
    if (childToBlock) {
      const nextBlocked = !childToBlock.blocked;
      apiPatch(`/admin/children/${childToBlock.id}/status`, { status: nextBlocked ? 'archived' : 'active' }).catch((error) => {
        console.error("Error updating child:", error);
      });
      setData(prev => ({
        ...prev,
        children: prev.children.map(c => 
          c.id === childToBlock.id 
            ? { ...c, blocked: nextBlocked } 
            : c
        )
      }));
      setBlockModalOpen(false);
      setChildToBlock(null);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [childrenResponse, summaryResponse] = await Promise.all([
          apiGet('/admin/children?limit=100'),
          apiGet('/admin/children-summary')
        ]);

        setData({
          stats: {
            total: summaryResponse.data.total.toLocaleString(),
            active: summaryResponse.data.active.toLocaleString(),
            observations: summaryResponse.data.observations.toLocaleString(),
            avgAge: summaryResponse.data.avgAge
          },
          children: childrenResponse.data.map((child) => ({ ...child, color: 'bg-[#06b6d4]' })),
          totalChildren: childrenResponse.pagination.total
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredChildren = useMemo(() => {
    if (!data) return [];
    return data.children.filter(child => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        child.name.toLowerCase().includes(searchLower) ||
        child.parents.toLowerCase().includes(searchLower);

      let matchesAge = true;
      if (ageFilter !== "All Ages") {
        const ageYears = parseInt(child.age);
        if (ageFilter === "0-2") {
          matchesAge = ageYears <= 2;
        } else if (ageFilter === "3-4") {
          matchesAge = ageYears === 3 || ageYears === 4;
        } else if (ageFilter === "5+") {
          matchesAge = ageYears >= 5;
        }
      }

      return matchesSearch && matchesAge;
    });
  }, [data, search, ageFilter]);

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-gray-400">
          <Loader2 className="animate-spin" size={32} />
          <p className="text-[10px] font-bold tracking-widest uppercase">Loading Child Profiles...</p>
        </div>
      </div>
    );
  }

  const displayTotal = filteredChildren.length;
  const totalPages = Math.ceil(displayTotal / itemsPerPage) || 1;
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, displayTotal);

  const currentChildren = filteredChildren.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-[#fdfdfd] p-4 md:p-6 lg:p-10 font-sans text-[#1e293b]">
      <div className="max-w-[1400px] mx-auto animate-in fade-in duration-500">

        {/* Header Title */}
        <div className="mb-8">
          <h1 className="text-[26px] font-bold text-[#0f172a] mb-1 leading-tight">Child Profiles</h1>
          <p className="text-[13px] text-[#64748b]">Monitor all children and their development progress</p>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-[14px] border border-gray-100 p-6 flex flex-col shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
            <div className="w-[42px] h-[42px] rounded-full bg-[#e0f2fe] flex items-center justify-center text-[#0284c7] mb-4">
              <RefreshCw size={20} strokeWidth={2} />
            </div>
            <p className="text-[12px] font-medium text-[#64748b] mb-1">Total Children</p>
            <h3 className="text-[28px] font-bold text-[#0f172a] leading-none">{data.stats.total}</h3>
          </div>

          <div className="bg-white rounded-[14px] border border-gray-100 p-6 flex flex-col shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
            <div className="w-[42px] h-[42px] rounded-full bg-[#dcfce7] flex items-center justify-center text-[#16a34a] mb-4">
              <TrendingUp size={20} strokeWidth={2} />
            </div>
            <p className="text-[12px] font-medium text-[#64748b] mb-1">Active Profiles</p>
            <h3 className="text-[28px] font-bold text-[#0f172a] leading-none">{data.stats.active}</h3>
          </div>

          <div className="bg-white rounded-[14px] border border-gray-100 p-6 flex flex-col shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
            <div className="w-[42px] h-[42px] rounded-full bg-[#fee2e2] flex items-center justify-center text-[#ef4444] mb-4">
              <Heart size={20} strokeWidth={2} />
            </div>
            <p className="text-[12px] font-medium text-[#64748b] mb-1">Total Observations</p>
            <h3 className="text-[28px] font-bold text-[#0f172a] leading-none">{data.stats.observations}</h3>
          </div>

          <div className="bg-white rounded-[14px] border border-gray-100 p-6 flex flex-col shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
            <div className="w-[42px] h-[42px] rounded-full bg-[#fef3c7] flex items-center justify-center text-[#d97706] mb-4">
              <Calendar size={20} strokeWidth={2} />
            </div>
            <p className="text-[12px] font-medium text-[#64748b] mb-1">Avg. Age</p>
            <h3 className="text-[28px] font-bold text-[#0f172a] leading-none">{data.stats.avgAge}</h3>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-[14px] border border-gray-100 p-3 mb-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">

          <div className="w-full md:w-auto flex-1 relative pl-0 md:pl-2">
            <Search className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={16} strokeWidth={2.5} />
            <input
              type="text"
              placeholder="Search by child name, parent name, or ID..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 md:pl-10 pr-4 py-2 bg-[#f8fafc] border border-transparent rounded-lg text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-gray-100 focus:bg-white transition-all placeholder:text-[#94a3b8]"
            />
          </div>

          <div className="w-full md:w-auto flex flex-wrap md:flex-nowrap items-center gap-3 md:gap-4">
            <div className="relative flex-1 md:flex-none">
              <select
                value={ageFilter}
                onChange={(e) => {
                  setAgeFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full md:w-auto pl-4 pr-10 py-2.5 bg-[#f8fafc] md:bg-white rounded-lg md:rounded-none text-[13px] font-semibold text-[#475569] appearance-none focus:outline-none cursor-pointer min-w-[120px]"
              >
                <option value="All Ages">All Ages</option>
                <option value="0-2">0 - 2 years</option>
                <option value="3-4">3 - 4 years</option>
                <option value="5+">5+ years</option>
              </select>
              <ChevronDown size={14} strokeWidth={3} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none" />
            </div>

            <button className="flex-1 md:flex-none bg-[#06b6d4] hover:bg-[#0891b2] text-white px-7 py-2.5 rounded-full text-[13px] font-semibold transition-colors whitespace-nowrap">
              Apply Filters
            </button>
          </div>
        </div>

        {/* Profile Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {currentChildren.length > 0 ? (
            currentChildren.map((child) => (
              <div key={child.id} className="bg-white rounded-[16px] border border-gray-100 p-6 shadow-[0_2px_15px_-5px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_25px_-5px_rgba(0,0,0,0.08)] transition-shadow">

                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-[46px] h-[46px] rounded-full flex items-center justify-center text-white font-bold text-[15px] shadow-sm ${child.color}`}>
                      {child.initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-[15px] font-bold text-[#0f172a] leading-tight mb-0.5">{child.name}</h3>
                        {child.blocked && (
                          <span className="bg-red-100 text-red-600 text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                            Blocked
                          </span>
                        )}
                      </div>
                      <p className="text-[12px] text-[#64748b] font-medium">{child.age}</p>
                    </div>
                  </div>
                  <div className="relative">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDropdownChildId(activeDropdownChildId === child.id ? null : child.id);
                      }}
                      className="text-[#94a3b8] hover:text-[#475569] transition-colors p-1"
                    >
                      <MoreVertical size={18} />
                    </button>
                    {activeDropdownChildId === child.id && (
                      <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-100 rounded-xl shadow-xl z-30 py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDropdownChildId(null);
                            setChildToBlock(child);
                            setBlockModalOpen(true);
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          {child.blocked ? 'Unblock' : 'Block'}
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDropdownChildId(null);
                            setChildToDelete(child);
                            setDeleteModalOpen(true);
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-bold text-red-500 hover:bg-red-50 transition-colors border-t border-gray-100/50"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-2 text-[12px] font-medium text-[#475569]">
                    <Calendar size={14} className="text-[#94a3b8]" />
                    Born: {child.born}
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold text-[#94a3b8] tracking-wide uppercase mb-1">Parents</p>
                    <p className="text-[13px] font-semibold text-[#1e293b]">{child.parents}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-[#f0fdfa] rounded-xl p-3 flex flex-col items-center justify-center border border-[#ccfbf1]">
                    <p className="text-[9px] font-semibold text-[#64748b] mb-1">Observations</p>
                    <span className="text-[18px] font-bold text-[#0d9488]">{child.observations}</span>
                  </div>
                  <div className="bg-[#fffbeb] rounded-xl p-3 flex flex-col items-center justify-center border border-[#fef3c7]">
                    <p className="text-[9px] font-semibold text-[#64748b] mb-1">Milestones</p>
                    <span className="text-[18px] font-bold text-[#d97706]">{child.milestones}</span>
                  </div>
                  <div className="bg-[#fef2f2] rounded-xl p-3 flex flex-col items-center justify-center border border-[#fee2e2]">
                    <p className="text-[9px] font-semibold text-[#64748b] mb-1">Care Circle</p>
                    <span className="text-[18px] font-bold text-[#e11d48]">{child.careCircle}</span>
                  </div>
                </div>

                {/* Development Focus Bars */}
                <div className="mb-6">
                  <p className="text-[11px] font-semibold text-[#64748b] mb-3">Development Focus</p>
                  <div className="flex gap-2">
                    {[
                      { name: 'Language & Literacy', color: 'bg-[#06b6d4]', pct: ((child.id * 17 + 50) % 41) + 55 },
                      { name: 'Motor', color: 'bg-[#10b981]', pct: ((child.id * 23 + 40) % 36) + 60 },
                      { name: 'Social', color: 'bg-[#fbbf24]', pct: ((child.id * 13 + 60) % 46) + 50 },
                      { name: 'Cognitive', color: 'bg-[#ef4444]', pct: ((child.id * 29 + 30) % 31) + 65 },
                      { name: 'Creative Arts & Expression', color: 'bg-[#a855f7]', pct: ((child.id * 19 + 70) % 41) + 55 },
                      { name: 'Community & Self-Awareness', color: 'bg-[#ec4899]', pct: ((child.id * 7 + 80) % 36) + 60 }
                    ].map((domain, index) => (
                      <div 
                        key={index} 
                        title={`${domain.name}: ${domain.pct}%`}
                        className="h-1.5 flex-1 bg-[#f1f5f9] dark:bg-gray-800 rounded-full cursor-pointer relative group transition-all duration-300 hover:scale-y-150"
                      >
                        {/* Progress Fill */}
                        <div 
                          className={`h-full ${domain.color} rounded-full`}
                          style={{ width: `${domain.pct}%` }}
                        ></div>
                        {/* Custom Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-[#1e293b] text-white text-[10px] font-bold py-1 px-2.5 rounded shadow-lg whitespace-nowrap z-20 pointer-events-none transition-all">
                          {domain.name}: {domain.pct}%
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1e293b]"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center text-[11px] font-medium text-[#94a3b8] pt-4 border-t border-gray-100">
                  <span>Last activity</span>
                  <span className="text-[#1e293b] font-semibold">{child.lastActivity}</span>
                </div>

              </div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center text-[14px] font-medium text-[#64748b]">
              No child profiles found matching your criteria.
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        <div className="bg-white rounded-[14px] border border-gray-100 p-4 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex items-center justify-between">
          <span className="text-[13px] font-medium text-[#64748b] pl-2">
            Showing {currentChildren.length > 0 ? startIndex + 1 : 0} to {endIndex} of {displayTotal} children
          </span>
          <div className="flex gap-1.5">
            <button
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="w-8 h-8 flex items-center justify-center bg-white text-[#64748b] hover:bg-[#f1f5f9] transition-colors text-[13px] font-bold disabled:opacity-50 disabled:cursor-not-allowed border border-[#e2e8f0] rounded-lg"
            >
              &lt;
            </button>

            {Array.from({ length: 3 }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 flex items-center justify-center transition-colors text-[13px] font-bold rounded-lg border ${page === p
                  ? 'bg-[#06b6d4] text-white border-[#06b6d4] shadow-sm'
                  : 'bg-white text-[#64748b] hover:bg-[#f1f5f9] border-[#e2e8f0]'
                  }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages || totalPages === 0}
              className="w-8 h-8 flex items-center justify-center bg-white text-[#64748b] hover:bg-[#f1f5f9] transition-colors text-[13px] font-bold disabled:opacity-50 disabled:cursor-not-allowed border border-[#e2e8f0] rounded-lg"
            >
              &gt;
            </button>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteModalOpen && childToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl animate-in zoom-in-95 duration-200 border border-[#e2e8f0]">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                    <AlertTriangle size={24} strokeWidth={2} />
                  </div>
                  <button 
                    onClick={() => {
                      setDeleteModalOpen(false);
                      setChildToDelete(null);
                    }} 
                    className="text-[#94a3b8] hover:text-[#0f172a] transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <h2 className="text-xl font-bold text-[#0f172a] mb-2">Delete Child Profile?</h2>
                <p className="text-[#64748b] text-[14px] leading-relaxed mb-6">
                  Are you sure you want to delete <strong className="text-[#0f172a]">{childToDelete.name}</strong> from the daycare system? This action cannot be undone and will remove all associated observations and milestones.
                </p>

                <div className="bg-[#f8fafc] p-4 rounded-xl border border-[#e2e8f0] mb-8 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-[14px] shadow-sm ${childToDelete.color}`}>
                    {childToDelete.initials}
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold text-[#0f172a]">{childToDelete.name}</h3>
                    <p className="text-[12px] text-[#64748b]">Parents: {childToDelete.parents}</p>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button 
                    onClick={() => {
                      setDeleteModalOpen(false);
                      setChildToDelete(null);
                    }} 
                    className="px-5 py-2.5 text-[13px] font-semibold text-[#64748b] hover:text-[#0f172a] hover:bg-[#f8fafc] border border-transparent hover:border-[#e2e8f0] rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleDeleteConfirm}
                    className="px-5 py-2.5 text-[13px] font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors shadow-sm"
                  >
                    Delete Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Block Confirmation Modal */}
        {blockModalOpen && childToBlock && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl animate-in zoom-in-95 duration-200 border border-[#e2e8f0]">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${childToBlock.blocked ? 'bg-emerald-100 text-emerald-500' : 'bg-amber-100 text-amber-500'}`}>
                    {childToBlock.blocked ? <Heart size={24} strokeWidth={2} /> : <AlertTriangle size={24} strokeWidth={2} />}
                  </div>
                  <button 
                    onClick={() => {
                      setBlockModalOpen(false);
                      setChildToBlock(null);
                    }} 
                    className="text-[#94a3b8] hover:text-[#0f172a] transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <h2 className="text-xl font-bold text-[#0f172a] mb-2">
                  {childToBlock.blocked ? 'Unblock Child Profile?' : 'Block Child Profile?'}
                </h2>
                <p className="text-[#64748b] text-[14px] leading-relaxed mb-6">
                  Are you sure you want to {childToBlock.blocked ? 'unblock' : 'block'} <strong className="text-[#0f172a]">{childToBlock.name}</strong>?
                  {childToBlock.blocked 
                    ? ' This will restore their active status and access within the daycare system.' 
                    : ' This will suspend their profile access and highlight them as blocked.'}
                </p>

                <div className="bg-[#f8fafc] p-4 rounded-xl border border-[#e2e8f0] mb-8 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-[14px] shadow-sm ${childToBlock.color}`}>
                    {childToBlock.initials}
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold text-[#0f172a]">{childToBlock.name}</h3>
                    <p className="text-[12px] text-[#64748b]">Parents: {childToBlock.parents}</p>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button 
                    onClick={() => {
                      setBlockModalOpen(false);
                      setChildToBlock(null);
                    }} 
                    className="px-5 py-2.5 text-[13px] font-semibold text-[#64748b] hover:text-[#0f172a] hover:bg-[#f8fafc] border border-transparent hover:border-[#e2e8f0] rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleBlockConfirm}
                    className={`px-5 py-2.5 text-[13px] font-semibold text-white rounded-xl transition-colors shadow-sm ${
                      childToBlock.blocked ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-amber-500 hover:bg-amber-600'
                    }`}
                  >
                    {childToBlock.blocked ? 'Unblock Child' : 'Block Child'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default DaycareChildren;

