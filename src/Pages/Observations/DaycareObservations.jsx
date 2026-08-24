import React, { useState, useEffect, useMemo } from 'react';
import { Search, ChevronDown, Video, Mic, FileText, Eye, CheckCircle2, Flag, Clock, Loader2, Trash2, AlertTriangle, X } from 'lucide-react';

const DaycareObservations = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  // Search and Filter State
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');

  // Delete observation modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [obsToDelete, setObsToDelete] = useState(null);

  const handleDeleteConfirm = () => {
    if (obsToDelete) {
      setData(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          total: (parseInt(prev.stats.total.replace(/,/g, '')) - 1).toLocaleString(),
          today: (parseInt(prev.stats.today) - 1).toString()
        },
        observations: prev.observations.filter(o => o.id !== obsToDelete.id)
      }));
      setDeleteModalOpen(false);
      setObsToDelete(null);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        setData({
          stats: {
            total: "12,456",
            today: "142",
            byDaycare: "8,924",
            byParent: "3,532"
          },
          observations: [
            {
              id: 1,
              type: 'video',
              iconColor: 'bg-[#f3e8ff] text-[#a855f7]',
              title: 'Playing with blocks',
              subtitle: 'Emma built a tower with 5 blocks independently',
              child: 'Emma Johnson',
              author: 'Sarah Martinez',
              time: '2 hours ago',
              tags: ['Motor', 'Cognitive'],
              insights: 3,
              status: ['Processed']
            },
            {
              id: 2,
              type: 'audio',
              iconColor: 'bg-[#e0f2fe] text-[#3b82f6]',
              title: 'Speaking in sentences',
              subtitle: 'Liam used complete sentences to express needs',
              child: 'Liam Smith',
              author: 'Emily Chen',
              time: '3 hours ago',
              tags: ['Language', 'Social'],
              insights: 2,
              status: ['Processed']
            },
            {
              id: 3,
              type: 'document',
              iconColor: 'bg-[#f1f5f9] text-[#475569]',
              title: 'Sharing toys with friends',
              subtitle: 'Demonstrated empathy and sharing behavior',
              child: 'Olivia Martinez',
              author: 'John Davidson',
              time: '5 hours ago',
              tags: ['Social'],
              insights: 1,
              status: ['Flagged', 'Pending']
            },
            {
              id: 4,
              type: 'visual',
              iconColor: 'bg-[#fce7f3] text-[#ec4899]',
              title: 'Drawing shapes',
              subtitle: 'Drew circles and squares accurately',
              child: 'Noah Brown',
              author: 'Michael Roberts',
              time: '1 day ago',
              tags: ['Motor', 'Cognitive'],
              insights: 4,
              status: ['Processed']
            }
          ]
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredObservations = useMemo(() => {
    if (!data) return [];
    return data.observations.filter(obs => {
      const searchLower = search.toLowerCase();
      const matchesSearch = 
        obs.title.toLowerCase().includes(searchLower) || 
        obs.child.toLowerCase().includes(searchLower) ||
        obs.author.toLowerCase().includes(searchLower);
      
      const matchesType = typeFilter === 'All Types' || obs.type === typeFilter.toLowerCase();

      return matchesSearch && matchesType;
    });
  }, [data, search, typeFilter]);

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

  const getIcon = (type) => {
    switch(type) {
      case 'video': return <Video size={18} />;
      case 'audio': return <Mic size={18} />;
      case 'document': return <FileText size={18} />;
      case 'visual': return <Eye size={18} />;
      default: return <FileText size={18} />;
    }
  };



  return (
    <div className="min-h-screen bg-[#fdfdfd] p-6 lg:p-10 font-sans text-[#1e293b]">
      <div className="max-w-[1200px] mx-auto animate-in fade-in duration-500">
        
        {/* Header Title */}
        <div className="mb-8">
          <h1 className="text-[26px] font-bold text-[#0f172a] mb-1 leading-tight">Observations</h1>
          <p className="text-[13px] text-[#64748b]">Monitor and review all recorded observations</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-[14px] border border-gray-100 p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] relative overflow-hidden">
            <p className="text-[12px] font-medium text-[#64748b] mb-2">Total Observations</p>
            <h3 className="text-[28px] font-bold text-[#0f172a] mb-2">{data.stats.total}</h3>
            <div className="absolute bottom-6 left-6 right-6 h-1 bg-[#06b6d4]"></div>
          </div>

          <div className="bg-white rounded-[14px] border border-gray-100 p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] relative overflow-hidden">
            <p className="text-[12px] font-medium text-[#64748b] mb-2">Today's Observations</p>
            <h3 className="text-[28px] font-bold text-[#0f172a] mb-2">{data.stats.today}</h3>
            <div className="absolute bottom-6 left-6 right-6 h-1 bg-[#10b981]"></div>
          </div>

          <div className="bg-white rounded-[14px] border border-gray-100 p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] relative overflow-hidden">
            <p className="text-[12px] font-medium text-[#64748b] mb-2">Observations by Daycare</p>
            <h3 className="text-[28px] font-bold text-[#0f172a] mb-2">{data.stats.byDaycare}</h3>
            <div className="absolute bottom-6 left-6 right-6 h-1 bg-[#fbbf24]"></div>
          </div>

          <div className="bg-white rounded-[14px] border border-gray-100 p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] relative overflow-hidden">
            <p className="text-[12px] font-medium text-[#64748b] mb-2">Observations by Parent</p>
            <h3 className="text-[28px] font-bold text-[#0f172a] mb-2">{data.stats.byParent}</h3>
            <div className="absolute bottom-6 left-6 right-6 h-1 bg-[#a855f7]"></div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-[14px] border border-gray-100 p-3 mb-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          <div className="w-full md:flex-1 relative md:pl-2">
            <Search className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={16} strokeWidth={2.5} />
            <input 
              type="text"
              placeholder="Search observations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#f8fafc] border border-transparent rounded-lg text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-gray-100 focus:bg-white transition-all placeholder:text-[#94a3b8]"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-auto">
              <select 
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 bg-[#f8fafc] border border-gray-100 rounded-full text-[13px] font-semibold text-[#475569] appearance-none focus:outline-none focus:ring-1 focus:ring-gray-200 cursor-pointer sm:min-w-[130px]"
              >
                <option value="All Types">All Types</option>
                <option value="Video">Video</option>
                <option value="Audio">Audio</option>
                <option value="Document">Document</option>
                <option value="Visual">Visual</option>
              </select>
              <ChevronDown size={14} strokeWidth={3} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Observations List */}
        <div className="space-y-4">
          {filteredObservations.length > 0 ? (
            filteredObservations.map((obs) => (
              <div key={obs.id} className="bg-white rounded-[16px] border border-gray-100 p-4 md:p-6 shadow-[0_2px_15px_-5px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_25px_-5px_rgba(0,0,0,0.06)] transition-shadow flex flex-col sm:flex-row items-start gap-4 md:gap-6">
                
                {/* Icon */}
                <div className={`w-[52px] h-[52px] rounded-full flex items-center justify-center shrink-0 ${obs.iconColor}`}>
                  {getIcon(obs.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 lg:gap-0 mb-3 w-full">
                    <div>
                      <h3 className="text-[16px] font-bold text-[#0f172a] mb-1 leading-tight">{obs.title}</h3>
                      <p className="text-[13px] text-[#64748b]">{obs.subtitle}</p>
                    </div>
                  </div>

                  {/* Metadata Row */}
                  <div className="flex flex-wrap items-center gap-4 md:gap-6 text-[12px] mb-4">
                    <div className="flex items-center gap-1.5 text-[#64748b]">
                      <span>Child:</span>
                      <span className="font-semibold text-[#1e293b]">{obs.child}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#64748b]">
                      <span>By:</span>
                      <span className="font-semibold text-[#1e293b]">{obs.author}</span>
                    </div>
                    <div className="text-[#94a3b8]">
                      {obs.time}
                    </div>
                  </div>

                  {/* Tags Row */}
                  <div className="flex flex-wrap items-center gap-2 md:gap-3">
                    {obs.tags.map((tag, idx) => (
                      <span key={idx} className="bg-[#ccfbf1] text-[#0d9488] px-3 py-1 rounded-full text-[11px] font-bold border border-[#99f6e4]">
                        {tag}
                      </span>
                    ))}
                    <div className="flex items-center gap-2 text-[#64748b] text-[11px] font-medium ml-2 w-full sm:w-auto mt-2 sm:mt-0">
                      <div className="hidden sm:block w-1 h-1 bg-[#cbd5e1] rounded-full"></div>
                      {obs.insights} AI Insights Generated
                    </div>
                  </div>

                </div>

                {/* Actions: Delete button */}
                <div className="self-center shrink-0">
                  <button 
                    onClick={() => {
                      setObsToDelete(obs);
                      setDeleteModalOpen(true);
                    }}
                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2.5 rounded-xl transition-all duration-200"
                    title="Delete Observation"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

              </div>
            ))
          ) : (
            <div className="py-16 text-center text-[14px] font-medium text-[#64748b] bg-white rounded-[16px] border border-gray-100">
               No observations found matching your criteria.
            </div>
          )}
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
                  Are you sure you want to delete the observation <strong className="text-[#0f172a]">"{obsToDelete.title}"</strong>? This action cannot be undone.
                </p>

                <div className="bg-[#f8fafc] p-4 rounded-xl border border-[#e2e8f0] mb-8 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${obsToDelete.iconColor}`}>
                    {getIcon(obsToDelete.type)}
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold text-[#0f172a]">{obsToDelete.title}</h3>
                    <p className="text-[12px] text-[#64748b]">Child: {obsToDelete.child}</p>
                  </div>
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

export default DaycareObservations;

