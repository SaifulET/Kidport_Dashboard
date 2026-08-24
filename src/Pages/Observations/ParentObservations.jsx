import React, { useState, useEffect } from 'react';
import { Loader2, ListFilter, AlertTriangle, Trash2, X } from 'lucide-react';

const ParentObservations = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [obsToDelete, setObsToDelete] = useState(null);

  const handleDeleteConfirm = () => {
    if (obsToDelete) {
      setData(prev => ({
        ...prev,
        total: prev.total - 1,
        today: prev.today - 1,
        entries: prev.entries.filter(e => e.id !== obsToDelete.id)
      }));
      setDeleteModalOpen(false);
      setObsToDelete(null);
    }
  };

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setData({
        total: 12456,
        today: 142,
        byDaycare: 8924,
        byParent: 3532,
        entries: [
          { id: 1, time: '2 hours ago', child: 'Emma Johnson', event: 'Playing with blocks: Built tower independently', status: ['PROCESSED'] },
          { id: 2, time: '3 hours ago', child: 'Liam Smith', event: 'Speaking in sentences: Expressed needs', status: ['PROCESSED'] },
          { id: 3, time: '5 hours ago', child: 'Olivia Martinez', event: 'Sharing toys: Demonstrated empathy', status: ['PENDING', 'FLAGGED'] },
          { id: 4, time: '1 day ago', child: 'Noah Brown', event: 'Drawing shapes: Accurate circles and squares', status: ['PROCESSED'] }
        ]
      });
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-gray-400">
          <Loader2 className="animate-spin" size={32} />
          <p className="text-[10px] font-bold tracking-widest uppercase">Loading Observations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-[#f8fafc] font-sans text-[#1e293b]">
      <div className="mx-auto max-w-7xl animate-in fade-in zoom-in duration-500">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-10">
          <div className="w-1/2">
            <p className="text-[9px] font-bold text-[#64748b] tracking-widest uppercase mb-2">MANAGEMENT TERMINAL</p>
            <h1 className="text-5xl font-black tracking-tighter mb-4 uppercase text-[#1e293b]">Observations</h1>
            <p className="text-sm text-[#64748b] leading-relaxed pr-8">
              Raw system feed of all recorded behavioral and milestone observations across the network.
            </p>
          </div>
          <div className="flex gap-3 mt-8">
            <button className="bg-white border border-[#e2e8f0] hover:bg-[#f1f5f9] text-[#1e293b] text-[10px] font-bold tracking-wider uppercase px-6 py-3 rounded-lg shadow-sm transition-colors">
              EXPORT DATA
            </button>
          </div>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col justify-between h-40 border-l-4 border-l-[#06b6d4]">
            <h3 className="text-[9px] font-bold text-[#64748b] tracking-widest uppercase">TOTAL OBSERVATIONS</h3>
            <div className="text-5xl font-light tracking-tight text-[#1e293b]">{data.total.toLocaleString()}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col justify-between h-40 border-l-4 border-l-[#10b981]">
            <h3 className="text-[9px] font-bold text-[#64748b] tracking-widest uppercase">TODAY'S OBSERVATIONS</h3>
            <div className="text-5xl font-light tracking-tight text-[#1e293b]">{data.today}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col justify-between h-40 border-l-4 border-l-[#fbbf24]">
            <h3 className="text-[9px] font-bold text-[#64748b] tracking-widest uppercase">OBSERVATION BY DAYCARE</h3>
            <div className="text-5xl font-light tracking-tight text-[#1e293b]">{data.byDaycare.toLocaleString()}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col justify-between h-40 border-l-4 border-l-[#a855f7]">
            <h3 className="text-[9px] font-bold text-[#64748b] tracking-widest uppercase">OBSERVATION BY PARENT</h3>
            <div className="text-5xl font-light tracking-tight text-[#1e293b]">{data.byParent.toLocaleString()}</div>
          </div>
        </div>

        {/* Registry Records Block */}
        <div className="bg-white mb-8 border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          {/* Registry Header */}
          <div className="bg-[#f8fafc] px-8 py-5 flex justify-between items-center border-b border-gray-100">
            <div className="flex items-center gap-8">
              <h2 className="text-[11px] font-bold tracking-widest uppercase text-[#1e293b]">OBSERVATION LOGS</h2>
            </div>
            <div className="flex gap-4 text-[#64748b]">
              <ListFilter size={16} className="cursor-pointer hover:text-[#1e293b]" />
            </div>
          </div>

          {/* Table Headers */}
          <div className="px-8 py-4 flex items-center border-b border-gray-100 bg-white">
            <div className="w-[15%] text-[9px] font-bold text-[#64748b] tracking-widest uppercase">TIMESTAMP</div>
            <div className="w-[20%] text-[9px] font-bold text-[#64748b] tracking-widest uppercase">TARGET</div>
            <div className="w-[45%] text-[9px] font-bold text-[#64748b] tracking-widest uppercase">EVENT DETAILS</div>
            <div className="w-[20%] text-right text-[9px] font-bold text-[#64748b] tracking-widest uppercase">ACTIONS</div>
          </div>

          {/* Table Rows (Mock Data) */}
          <div className="flex flex-col min-h-[300px]">
            {data.entries.length > 0 ? (
              data.entries.map((obs) => (
                <div key={obs.id} className="px-8 py-5 flex items-center border-b border-gray-100 last:border-0 hover:bg-[#f1f5f9] transition-colors">
                  <div className="w-[15%] text-[11px] text-[#475569] font-medium">{obs.time}</div>
                  <div className="w-[20%] text-[13px] font-bold text-[#1e293b]">{obs.child}</div>
                  <div className="w-[45%] text-[13px] text-[#475569]">{obs.event}</div>
                  <div className="w-[20%] flex justify-end items-center gap-4">
                    <button 
                      onClick={() => {
                        setObsToDelete(obs);
                        setDeleteModalOpen(true);
                      }}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      title="Delete Observation"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-1 items-center justify-center bg-white text-sm text-[#94a3b8] font-medium">
                No observations found matching your criteria.
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="px-8 py-5 flex justify-between items-center border-t border-gray-100">
            <span className="text-[10px] font-medium text-[#64748b]">
              Showing {data.entries.length} of {data.total.toLocaleString()} entries
            </span>
            <div className="flex gap-1.5">
              <button className="w-8 h-8 rounded-lg flex items-center justify-center border border-[#e2e8f0] bg-white text-[#64748b] hover:bg-[#f1f5f9] text-[10px] font-bold disabled:opacity-50 disabled:cursor-not-allowed">
                &lt;
              </button>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center border bg-[#06b6d4] text-white border-[#06b6d4] text-[10px] font-bold">1</button>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center border bg-white text-[#1e293b] border-[#e2e8f0] hover:bg-[#f1f5f9] text-[10px] font-bold">2</button>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center border border-[#e2e8f0] bg-white text-[#64748b] hover:bg-[#f1f5f9] text-[10px] font-bold transition-colors">
                &gt;
              </button>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteModalOpen && obsToDelete && (
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
                      setObsToDelete(null);
                    }} 
                    className="text-[#94a3b8] hover:text-[#0f172a] transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <h2 className="text-xl font-bold text-[#0f172a] mb-2">Delete Observation?</h2>
                <p className="text-[#64748b] text-[14px] leading-relaxed mb-6">
                  Are you sure you want to delete the observation for <strong className="text-[#0f172a]">{obsToDelete.child}</strong>? This action cannot be undone.
                </p>

                <div className="bg-[#f8fafc] p-4 rounded-xl border border-[#e2e8f0] mb-8 flex flex-col justify-start">
                  <span className="text-[11px] font-semibold text-[#94a3b8] mb-1">EVENT DETAIL</span>
                  <span className="text-[13px] text-[#1e293b] font-medium">{obsToDelete.event}</span>
                </div>

                <div className="flex justify-end gap-3">
                  <button 
                    onClick={() => {
                      setDeleteModalOpen(false);
                      setObsToDelete(null);
                    }} 
                    className="px-5 py-2.5 text-[13px] font-semibold text-[#64748b] hover:text-[#0f172a] hover:bg-[#f8fafc] border border-transparent hover:border-[#e2e8f0] rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleDeleteConfirm}
                    className="px-5 py-2.5 text-[13px] font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors shadow-sm"
                  >
                    Delete Observation
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

export default ParentObservations;
