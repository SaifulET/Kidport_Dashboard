import React, { useState, useEffect, useMemo } from 'react';
import { ChevronDown, Loader2, X } from 'lucide-react';

const ParentUserManagement = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  
  // Search, Filter, and Pagination State (Terminal)
  const [globalSearch, setGlobalSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('All Profiles');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // View Modal State
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState(null);

  // Status Confirmation State
  const [statusConfirmUserId, setStatusConfirmUserId] = useState(null);
  const statusConfirmUser = data?.users.find(u => u.id === statusConfirmUserId);

  // Create Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newUserFormData, setNewUserFormData] = useState({ name: '', email: '', role: 'PARENT' });

  const handleExportCSV = () => {
    if (!data) return;
    const headers = ["ID", "Name", "Email", "Role", "Status"];
    const csvContent = [
      headers.join(","),
      ...data.users.map(u => `${u.id},"${u.name}","${u.email}",${u.role},${u.status}`)
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "user_directory.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateUserSubmit = (e) => {
    e.preventDefault();
    if (!newUserFormData.name || !newUserFormData.email) return;

    const initials = newUserFormData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    
    const newUser = {
      id: data.users.length > 0 ? Math.max(...data.users.map(u => u.id)) + 1 : 1,
      initials: initials,
      name: newUserFormData.name,
      email: newUserFormData.email,
      role: newUserFormData.role,
      status: 'ACTIVE'
    };

    setData(prev => ({
      ...prev,
      totalUsers: prev.totalUsers + 1,
      users: [newUser, ...prev.users]
    }));
    
    setNewUserFormData({ name: '', email: '', role: 'PARENT' });
    setIsCreateModalOpen(false);
  };

  const handleViewClick = (user) => {
    setViewingUser(user);
    setIsViewModalOpen(true);
  };

  const handleToggleStatus = (userId) => {
    setData(prevData => ({
      ...prevData,
      users: prevData.users.map(user => 
        user.id === userId 
          ? { ...user, status: user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' }
          : user
      )
    }));
  };

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        setData({
          totalUsers: 1284,
          growthPct: '+12%',
          users: [
            { id: 1, initials: 'JA', name: 'Julianna Abrams', email: 'j.abrams@example.com', role: 'PARENT', status: 'ACTIVE' },
            { id: 2, initials: 'BT', name: 'Bright Tree Daycare', email: 'hello@brighttree.example', role: 'DAYCARE', status: 'SUSPENDED' },
            { id: 3, initials: 'SL', name: 'Sarah Lin', email: 'lin.sarah@gmail.com', role: 'PARENT', status: 'ACTIVE' },
            { id: 4, initials: 'LS', name: 'Little Steps Center', email: 'admin@littlesteps.example', role: 'DAYCARE', status: 'ACTIVE' }
          ],
          rolesDistribution: [
            { label: 'Parents', percentage: 70 },
            { label: 'Daycare', percentage: 30 }
          ],
          auditLogs: [
            { time: '12:44 PM', text: <>User <span className="font-bold">j.abrams</span> updated profile security settings</> },
            { time: '11:02 AM', text: <>New registration: <span className="font-bold">linda.v@care.com</span> (Daycare)</> }
          ],
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Filter and Search Logic
  const filteredUsers = useMemo(() => {
    if (!data) return [];
    return data.users.filter(user => {
      const matchesRole = selectedRole === 'All Profiles' || user.role.toLowerCase() === selectedRole.toLowerCase();
      const searchLower = globalSearch.toLowerCase();
      const matchesSearch = 
        user.name.toLowerCase().includes(searchLower) || 
        user.email.toLowerCase().includes(searchLower) ||
        user.initials.toLowerCase().includes(searchLower);
      return matchesRole && matchesSearch;
    });
  }, [data, globalSearch, selectedRole]);

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-gray-400">
          <Loader2 className="animate-spin" size={32} />
          <p className="text-[10px] font-bold tracking-widest uppercase">Loading Directory...</p>
        </div>
      </div>
    );
  }

  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen p-4 md:p-8 bg-[#f8fafc] font-sans text-[#1e293b]">
      <div className="mx-auto max-w-7xl animate-in fade-in zoom-in duration-500">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 text-[#1e293b]">User Management</h1>
            <p className="text-xs text-[#64748b]">
              Directory of all ecosystem participants and access levels.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <button onClick={handleExportCSV} disabled={!data} className="flex-1 md:flex-none bg-white border border-[#e2e8f0] hover:bg-[#f1f5f9] text-[#1e293b] text-[10px] font-bold tracking-wider uppercase px-5 py-2.5 rounded-lg shadow-sm transition-colors disabled:opacity-50 whitespace-nowrap">
              EXPORT CSV
            </button>
            <button onClick={() => setIsCreateModalOpen(true)} disabled={!data} className="flex-1 md:flex-none bg-[#06b6d4] hover:bg-[#0891b2] text-white text-[10px] font-bold tracking-wider uppercase px-5 py-2.5 rounded-lg shadow-sm transition-colors disabled:opacity-50 whitespace-nowrap">
              CREATE NEW USER
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 w-full xl:w-2/3">
            <div className="flex-1 w-full">
              <label className="block text-[9px] font-bold text-[#64748b] tracking-widest uppercase mb-2">
                SEARCH DIRECTORY
              </label>
              <input
                type="text"
                placeholder="Name, email, or unique ID..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-[#e2e8f0] rounded-lg text-[13px] text-[#1e293b] focus:outline-none focus:ring-1 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-shadow"
              />
            </div>
            <div className="w-full md:w-48">
              <label className="block text-[9px] font-bold text-[#64748b] tracking-widest uppercase mb-2">
                ROLE
              </label>
              <div className="relative">
                <select 
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-[#e2e8f0] rounded-lg text-[13px] text-[#1e293b] appearance-none focus:outline-none focus:ring-1 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-shadow cursor-pointer"
                >
                  <option value="All Profiles">All Profiles</option>
                  <option value="PARENT">Parent</option>
                  <option value="DAYCARE">Daycare</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none" size={14} />
              </div>
            </div>
          </div>
          
          <div className="w-full xl:w-auto text-left xl:text-right border-t xl:border-0 border-[#e2e8f0] pt-4 xl:pt-0 mt-2 xl:mt-0">
            <div className="flex items-end justify-start xl:justify-end gap-6 mb-2">
              <span className="text-[9px] font-bold text-[#64748b] tracking-widest uppercase mb-1">TOTAL USERS</span>
              <span className="text-3xl font-bold tracking-tight text-[#1e293b]">{data.totalUsers.toLocaleString()}</span>
            </div>
            <div className="hidden xl:block h-px w-full bg-gray-200 mb-1"></div>
            <p className="text-[9px] text-[#64748b]">{data.growthPct} growth this month</p>
          </div>
        </div>

        <div className="w-full bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <div className="hidden lg:flex bg-[#f8fafc] px-6 py-4 items-center border-b border-gray-100">
            <div className="w-1/4 text-[9px] font-bold text-[#64748b] tracking-widest uppercase">NAME</div>
            <div className="w-1/4 text-[9px] font-bold text-[#64748b] tracking-widest uppercase">EMAIL</div>
            <div className="w-[15%] text-[9px] font-bold text-[#64748b] tracking-widest uppercase">ROLE</div>
            <div className="w-1/4 text-[9px] font-bold text-[#64748b] tracking-widest uppercase">STATUS</div>
            <div className="w-[10%] text-right text-[9px] font-bold text-[#64748b] tracking-widest uppercase">ACTIONS</div>
          </div>
          
          <div className="flex flex-col min-h-[280px]">
            {currentUsers.length > 0 ? (
              currentUsers.map((user) => (
                <div key={user.id} className="p-6 lg:px-6 lg:py-5 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-0 bg-white hover:bg-[#f1f5f9] transition-colors border-b border-gray-100 last:border-0">
                  
                  {/* Name */}
                  <div className="w-full lg:w-1/4 flex items-center gap-4">
                    <div className="w-8 h-8 bg-[#f1f5f9] rounded-full flex items-center justify-center text-[11px] font-bold tracking-wider shrink-0 text-[#1e293b]">
                      {user.initials}
                    </div>
                    <span className="text-[13px] font-bold text-[#1e293b]">{user.name}</span>
                  </div>

                  {/* Email */}
                  <div className="w-full lg:w-1/4 flex flex-col lg:block justify-between items-start gap-1">
                    <span className="lg:hidden text-[9px] font-bold text-[#64748b] tracking-widest uppercase">EMAIL</span>
                    <span className="text-[13px] text-[#475569] lg:truncate pr-4 w-full break-all">
                      {user.email}
                    </span>
                  </div>

                  {/* Role */}
                  <div className="w-full lg:w-[15%] flex justify-between lg:block items-center">
                    <span className="lg:hidden text-[9px] font-bold text-[#64748b] tracking-widest uppercase">ROLE</span>
                    <span className="bg-[#f1f5f9] text-[#1e293b] border border-gray-100 rounded-lg text-[9px] font-bold px-2 py-1 tracking-widest uppercase">
                      {user.role}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="w-full lg:w-1/4 flex justify-between lg:justify-start items-center gap-2">
                    <span className="lg:hidden text-[9px] font-bold text-[#64748b] tracking-widest uppercase">STATUS</span>
                    <div className="flex items-center gap-2">
                      {user.status === 'ACTIVE' ? (
                        <>
                          <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></div>
                          <span className="text-[10px] font-bold tracking-widest uppercase text-[#1e293b]">ACTIVE</span>
                        </>
                      ) : (
                        <>
                          <div className="w-1.5 h-1.5 rounded-full border border-[#94a3b8]"></div>
                          <span className="text-[10px] font-bold text-[#94a3b8] tracking-widest uppercase">SUSPENDED</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="w-full lg:w-[10%] flex lg:justify-end gap-3 text-[9px] font-bold tracking-widest uppercase pt-4 lg:pt-0 mt-2 lg:mt-0 border-t border-gray-100 lg:border-0">
                    <button onClick={() => handleViewClick(user)} className="text-[#94a3b8] hover:text-[#06b6d4] transition-colors">VIEW</button>
                    <button 
                      onClick={() => setStatusConfirmUserId(user.id)}
                      className={`${user.status === 'ACTIVE' ? 'text-red-500 hover:text-red-700' : 'text-[#10b981] hover:text-[#059669]'} transition-colors`}
                    >
                      {user.status === 'ACTIVE' ? 'DISABLE' : 'ENABLE'}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-1 items-center justify-center bg-white text-sm text-[#94a3b8] font-medium">
                No users found matching your criteria.
              </div>
            )}
          </div>

          <div className="bg-white border-t border-gray-100 px-6 py-4 flex flex-col md:flex-row gap-4 justify-between items-center">
            <span className="text-[9px] font-bold text-[#64748b] tracking-widest uppercase text-center md:text-left">
              SHOWING {totalItems > 0 ? startIndex + 1 : 0}-{Math.min(endIndex, totalItems)} OF {totalItems} USERS
            </span>
            <div className="flex flex-wrap justify-center gap-1.5">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-lg border border-[#e2e8f0] flex items-center justify-center bg-white text-[#64748b] hover:bg-[#f1f5f9] transition-colors text-[10px] font-bold disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                &lt;
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors text-[10px] font-bold shrink-0 border ${
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
                className="w-8 h-8 rounded-lg border border-[#e2e8f0] flex items-center justify-center bg-white text-[#64748b] hover:bg-[#f1f5f9] transition-colors text-[10px] font-bold disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                &gt;
              </button>
            </div>
          </div>
        </div>

        {/* View Modal */}
        {isViewModalOpen && viewingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md shadow-2xl rounded-xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="bg-white border-b border-gray-100 text-[#1e293b] p-4 flex justify-between items-center">
                <h2 className="text-[11px] font-bold tracking-widest uppercase">User Details</h2>
                <button onClick={() => setIsViewModalOpen(false)} className="text-[#94a3b8] hover:text-[#1e293b] transition-colors">
                  <X size={16} />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#f1f5f9] rounded-full flex items-center justify-center text-[14px] font-bold tracking-wider text-[#1e293b]">
                    {viewingUser.initials}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#1e293b]">{viewingUser.name}</h3>
                    <p className="text-[12px] text-[#475569]">{viewingUser.email}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold text-[#64748b] tracking-widest uppercase mb-1">Unique ID</label>
                    <p className="text-[13px] font-medium text-[#1e293b]">#{viewingUser.id}</p>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-[#64748b] tracking-widest uppercase mb-1">Role</label>
                    <span className="bg-[#f1f5f9] text-[#1e293b] border border-gray-100 rounded-lg text-[9px] font-bold px-2 py-1 tracking-widest uppercase inline-block mt-1">
                      {viewingUser.role}
                    </span>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-[#64748b] tracking-widest uppercase mb-1">Status</label>
                    <div className="flex items-center gap-2 mt-1">
                      {viewingUser.status === 'ACTIVE' ? (
                        <>
                          <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] shrink-0"></div>
                          <span className="text-[10px] font-bold text-[#1e293b] tracking-widest uppercase">ACTIVE</span>
                        </>
                      ) : (
                        <>
                          <div className="w-1.5 h-1.5 rounded-full border border-[#94a3b8] shrink-0"></div>
                          <span className="text-[10px] font-bold text-[#94a3b8] tracking-widest uppercase">SUSPENDED</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-[#64748b] tracking-widest uppercase mb-1">Last Login</label>
                    <p className="text-[13px] font-medium text-[#1e293b]">Today, 09:41 AM</p>
                  </div>
                </div>
              </div>
              <div className="bg-[#f8fafc] border-t border-gray-100 p-4 flex justify-end">
                <button onClick={() => setIsViewModalOpen(false)} className="bg-white border border-[#e2e8f0] hover:bg-[#f1f5f9] text-[#1e293b] rounded-lg text-[10px] font-bold tracking-wider uppercase px-5 py-2.5 transition-colors">
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Create Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md shadow-2xl rounded-xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="bg-white text-[#1e293b] border-b border-gray-100 p-4 flex justify-between items-center">
                <h2 className="text-[11px] font-bold tracking-widest uppercase">Create New User</h2>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-[#94a3b8] hover:text-[#1e293b] transition-colors">
                  <X size={16} />
                </button>
              </div>
              <form onSubmit={handleCreateUserSubmit}>
                <div className="p-6 space-y-5">
                  <div>
                    <label className="block text-[9px] font-bold text-[#64748b] tracking-widest uppercase mb-2">Full Name</label>
                    <input 
                      type="text" 
                      required 
                      value={newUserFormData.name}
                      onChange={(e) => setNewUserFormData({...newUserFormData, name: e.target.value})}
                      className="w-full px-4 py-2.5 bg-white border border-[#e2e8f0] rounded-lg text-[13px] text-[#1e293b] focus:outline-none focus:ring-1 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-shadow"
                      placeholder="e.g. Jane Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-[#64748b] tracking-widest uppercase mb-2">Email Address</label>
                    <input 
                      type="email" 
                      required 
                      value={newUserFormData.email}
                      onChange={(e) => setNewUserFormData({...newUserFormData, email: e.target.value})}
                      className="w-full px-4 py-2.5 bg-white border border-[#e2e8f0] rounded-lg text-[13px] text-[#1e293b] focus:outline-none focus:ring-1 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-shadow"
                      placeholder="e.g. jane@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-[#64748b] tracking-widest uppercase mb-2">Assign Role</label>
                    <div className="relative">
                      <select 
                        value={newUserFormData.role}
                        onChange={(e) => setNewUserFormData({...newUserFormData, role: e.target.value})}
                        className="w-full px-4 py-2.5 bg-white border border-[#e2e8f0] rounded-lg text-[13px] text-[#1e293b] appearance-none focus:outline-none focus:ring-1 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-shadow cursor-pointer"
                      >
                        <option value="PARENT">Parent</option>
                        <option value="DAYCARE">Daycare</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none" size={14} />
                    </div>
                  </div>
                </div>
                <div className="bg-[#f8fafc] border-t border-gray-100 p-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsCreateModalOpen(false)} className="bg-white border border-[#e2e8f0] hover:bg-[#f1f5f9] text-[#1e293b] rounded-lg text-[10px] font-bold tracking-wider uppercase px-5 py-2.5 transition-colors">
                    CANCEL
                  </button>
                  <button type="submit" className="bg-[#06b6d4] hover:bg-[#0891b2] rounded-lg text-white text-[10px] font-bold tracking-wider uppercase px-5 py-2.5 transition-colors">
                    CREATE
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Status Confirmation Modal */}
        {statusConfirmUserId && statusConfirmUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md shadow-2xl rounded-xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="bg-white border-b border-gray-100 text-[#1e293b] p-4 flex justify-between items-center">
                <h2 className="text-[11px] font-bold tracking-widest uppercase">
                  {statusConfirmUser.status === 'ACTIVE' ? 'Disable User Account?' : 'Enable User Account?'}
                </h2>
                <button onClick={() => setStatusConfirmUserId(null)} className="text-[#94a3b8] hover:text-[#1e293b] transition-colors">
                  <X size={16} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#f1f5f9] rounded-full flex items-center justify-center text-[14px] font-bold tracking-wider text-[#1e293b]">
                    {statusConfirmUser.initials}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#1e293b]">{statusConfirmUser.name}</h3>
                    <p className="text-[12px] text-[#475569]">{statusConfirmUser.email}</p>
                  </div>
                </div>
                <p className="text-[13px] text-[#64748b] leading-relaxed">
                  Are you sure you want to {statusConfirmUser.status === 'ACTIVE' ? 'disable' : 'enable'} access for this user?
                  {statusConfirmUser.status === 'ACTIVE' 
                    ? ' This will temporarily suspend their ecosystem access.' 
                    : ' This will restore their active status and log-in capabilities.'}
                </p>
              </div>
              <div className="bg-[#f8fafc] border-t border-gray-100 p-4 flex justify-end gap-3">
                <button 
                  onClick={() => setStatusConfirmUserId(null)} 
                  className="bg-white border border-[#e2e8f0] hover:bg-[#f1f5f9] text-[#1e293b] rounded-lg text-[10px] font-bold tracking-wider uppercase px-5 py-2.5 transition-colors"
                >
                  CANCEL
                </button>
                <button 
                  onClick={() => {
                    handleToggleStatus(statusConfirmUser.id);
                    setStatusConfirmUserId(null);
                  }} 
                  className={`rounded-lg text-[10px] font-bold tracking-wider uppercase px-5 py-2.5 text-white transition-colors shadow-sm ${
                    statusConfirmUser.status === 'ACTIVE' ? 'bg-red-500 hover:bg-red-600' : 'bg-[#10b981] hover:bg-[#059669]'
                  }`}
                >
                  {statusConfirmUser.status === 'ACTIVE' ? 'DISABLE' : 'ENABLE'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentUserManagement;

