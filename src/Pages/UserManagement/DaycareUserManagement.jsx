import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Ban,
  Calendar,
  ChevronDown,
  Eye,
  Loader2,
  Mail,
  Phone,
  Power,
  Search,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserX,
  X,
} from 'lucide-react';
import { apiDelete, apiGet, apiPatch } from '../../lib/api';

const ROLE_STYLES = {
  Parent: 'bg-[#cffafe] text-[#0891b2] border-[#a5f3fc]',
  Daycare: 'bg-[#ede9fe] text-[#7c3aed] border-[#ddd6fe]',
};

const STATUS_STYLES = {
  Active: 'text-[#10b981] bg-[#ecfdf5] border-[#a7f3d0]',
  Inactive: 'text-[#64748b] bg-[#f8fafc] border-[#e2e8f0]',
};

const PROFILE_SECTIONS = [
  { role: 'Parent', label: 'Parent Profiles' },
  { role: 'Daycare', label: 'Daycare' },
];

const getInitials = (name) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

const getChildIdsForUser = (user) => user.childIds || user.children?.map((child) => child.id) || [];

const getChildrenForUser = (user) => user.children || [];

const DaycareUserManagement = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('Parent');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [page, setPage] = useState(1);
  const [detailsUserId, setDetailsUserId] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [blockUserId, setBlockUserId] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await apiGet('/admin/users?limit=100');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const enrichedUsers = useMemo(
    () =>
      users.map((user) => ({
        ...user,
        initials: getInitials(user.name),
        childIds: getChildIdsForUser(user),
      })),
    [users]
  );

  const filteredUsers = useMemo(() => {
    const searchLower = search.toLowerCase();

    return enrichedUsers.filter((user) => {
      const accountState = user.blocked ? 'Blocked' : 'Active';
      const matchesRole = user.role === roleFilter;
      
      let matchesStatus = true;
      if (statusFilter === 'Active') {
        matchesStatus = !user.blocked;
      } else if (statusFilter === 'Blocked') {
        matchesStatus = user.blocked;
      }

      const matchesSearch =
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.phone.toLowerCase().includes(searchLower) ||
        user.role.toLowerCase().includes(searchLower) ||
        accountState.toLowerCase().includes(searchLower);

      return matchesRole && matchesStatus && matchesSearch;
    });
  }, [enrichedUsers, roleFilter, search, statusFilter]);

  const sectionCounts = useMemo(
    () =>
      PROFILE_SECTIONS.reduce((counts, section) => {
        counts[section.role] = users.filter((user) => user.role === section.role).length;
        return counts;
      }, {}),
    [users]
  );

  const stats = useMemo(
    () => ({
      totalParents: users.filter((user) => user.role === 'Parent').length,
      totalDaycares: users.filter((user) => user.role === 'Daycare').length,
      activeCaregivers: users.filter((user) => user.role === 'Daycare' && !user.blocked).length,
      blockedCaregivers: users.filter((user) => user.role === 'Daycare' && user.blocked).length,
    }),
    [users]
  );

  const itemsPerPage = 6;
  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);
  const detailsUser = enrichedUsers.find((user) => user.id === detailsUserId);
  const deleteUser = enrichedUsers.find((user) => user.id === deleteUserId);
  const blockUser = enrichedUsers.find((user) => user.id === blockUserId);
  const detailsChildren = detailsUser ? getChildrenForUser(detailsUser) : [];
  const deleteChildren = deleteUser ? getChildrenForUser(deleteUser) : [];

  const toggleBlocked = async (userId) => {
    const user = users.find((item) => item.id === userId);
    if (!user) return;
    const nextBlocked = !user.blocked;
    await apiPatch(`/admin/users/${userId}/status`, { status: nextBlocked ? 'disabled' : 'active' });
    setUsers((previousUsers) =>
      previousUsers.map((item) =>
        item.id === userId ? { ...item, blocked: nextBlocked, status: nextBlocked ? 'Blocked' : 'Active' } : item
      )
    );
  };

  const confirmDeleteUser = async () => {
    if (!deleteUser) return;

    await apiDelete(`/admin/users/${deleteUser.id}`);
    setUsers((previousUsers) => previousUsers.filter((user) => user.id !== deleteUser.id));
    setDeleteUserId(null);
    if (detailsUserId === deleteUser.id) {
      setDetailsUserId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-gray-400">
          <Loader2 className="animate-spin" size={32} />
          <p className="text-[10px] font-bold tracking-widest uppercase">Loading Directory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10 font-sans text-[#1e293b]">
      <div className="max-w-[1400px] mx-auto animate-in fade-in duration-500">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#0f172a] mb-1">Admin Profile Management</h1>
          <p className="text-[13px] text-[#64748b]">Manage parent and daycare profiles as separate sections. Children and admin records stay outside role assignment.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <StatCard label="Total Parents" value={stats.totalParents} accent="bg-[#06b6d4]" />
          <StatCard label="Total Daycares" value={stats.totalDaycares} accent="bg-[#8b5cf6]" />
          <StatCard label="Active Caregiver" value={stats.activeCaregivers} accent="bg-[#10b981]" />
          <StatCard label="Blocked Caregivers" value={stats.blockedCaregivers} accent="bg-[#ef4444]" />
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={16} />
            <input
              type="text"
              placeholder="Search by name, email, phone, role, or status..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-[#f8fafc] border border-gray-100 rounded-lg text-[13px] focus:outline-none focus:ring-1 focus:ring-gray-200 transition-colors"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <ProfileSectionTabs
              selectedRole={roleFilter}
              counts={sectionCounts}
              onChange={(value) => {
                setRoleFilter(value);
                setPage(1);
              }}
            />
            <SelectFilter
              label="Status"
              value={statusFilter}
              onChange={(value) => {
                setStatusFilter(value);
                setPage(1);
              }}
              options={['All Status', 'Active', 'Blocked']}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="hidden xl:grid grid-cols-12 gap-4 p-4 border-b border-gray-100 bg-[#f8fafc] text-[10px] font-bold text-[#64748b] tracking-wider uppercase">
            <div className="col-span-3 pl-2">{roleFilter} Profile</div>
            <div className="col-span-3">Contact</div>
            <div className="col-span-1">Role</div>
            <div className="col-span-2">Account Status</div>
            <div className="col-span-1">Children</div>
            <div className="col-span-1">Created</div>
            <div className="col-span-1 text-right pr-2">Actions</div>
          </div>

          <div className="divide-y divide-gray-100">
            {currentUsers.length > 0 ? (
              currentUsers.map((user) => (
                <div key={user.id} className="flex flex-col xl:grid xl:grid-cols-12 gap-4 p-4 xl:items-center hover:bg-gray-50 transition-colors">
                  <div className="w-full xl:col-span-3 flex items-center gap-3 xl:pl-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-[13px] shrink-0 ${user.color}`}>
                      {user.initials}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-[14px] font-bold text-[#1e293b] truncate">{user.name}</h4>
                      <p className="text-[12px] text-[#94a3b8]">ID: {user.id}</p>
                    </div>
                  </div>

                  <div className="w-full xl:col-span-3 space-y-1 min-w-0">
                    <span className="xl:hidden text-[10px] font-bold text-[#64748b] tracking-wider uppercase mb-1 block">Contact</span>
                    <div className="flex items-center gap-2 text-[12px] text-[#475569] min-w-0">
                      <Mail size={12} className="text-[#94a3b8] shrink-0" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[12px] text-[#475569]">
                      <Phone size={12} className="text-[#94a3b8] shrink-0" />
                      {user.phone}
                    </div>
                  </div>

                  <div className="w-full xl:col-span-1 flex justify-between xl:justify-start items-center">
                    <span className="xl:hidden text-[10px] font-bold text-[#64748b] tracking-wider uppercase">Role</span>
                    <RoleBadge role={user.role} />
                  </div>

                  <div className="w-full xl:col-span-2 flex justify-between xl:justify-start items-center">
                    <span className="xl:hidden text-[10px] font-bold text-[#64748b] tracking-wider uppercase">Status</span>
                    <StatusBadge user={user} />
                  </div>

                  <div className="w-full xl:col-span-1 flex justify-between xl:block items-center">
                    <span className="xl:hidden text-[10px] font-bold text-[#64748b] tracking-wider uppercase">Children</span>
                    <span className="text-[12px] font-medium text-[#1e293b]">{user.childIds.length}</span>
                  </div>

                  <div className="w-full xl:col-span-1 flex justify-between xl:justify-start items-center">
                    <span className="xl:hidden text-[10px] font-bold text-[#64748b] tracking-wider uppercase">Created</span>
                    <div className="flex items-center gap-2 text-[12px] text-[#475569]">
                      <Calendar size={12} className="text-[#94a3b8]" />
                      {user.createdDate}
                    </div>
                  </div>

                  <div className="w-full xl:col-span-1 flex flex-row items-center xl:justify-end gap-2 xl:pr-2 pt-3 xl:pt-0 border-t border-gray-100 xl:border-0 mt-1 xl:mt-0">
                    <ActionButton label="Details" tone="neutral" onClick={() => setDetailsUserId(user.id)} icon={Eye} />
                    <ActionButton
                      label={user.blocked ? 'Unblock' : 'Block'}
                      tone={user.blocked ? 'success' : 'warning'}
                      onClick={() => setBlockUserId(user.id)}
                      icon={user.blocked ? ShieldCheck : Ban}
                    />
                    <ActionButton label="Delete" tone="danger" onClick={() => setDeleteUserId(user.id)} icon={Trash2} />
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-[13px] font-medium text-[#64748b]">
                No {roleFilter.toLowerCase()} profiles found matching your search and filter criteria.
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-[12px] text-[#64748b] text-center md:text-left">
              Showing {totalItems > 0 ? startIndex + 1 : 0} to {Math.min(endIndex, totalItems)} of {totalItems} {roleFilter.toLowerCase()} profiles
            </span>
            <div className="flex flex-wrap justify-center gap-1.5">
              <button
                onClick={() => setPage((previousPage) => Math.max(previousPage - 1, 1))}
                disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center bg-white text-[#64748b] hover:bg-[#f1f5f9] transition-colors text-[13px] font-bold disabled:opacity-50 disabled:cursor-not-allowed border border-[#e2e8f0] rounded-lg shrink-0"
              >
                &lt;
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  className={`w-8 h-8 flex items-center justify-center transition-colors text-[13px] font-bold rounded-lg border shrink-0 ${
                    page === pageNumber
                      ? 'bg-[#06b6d4] text-white border-[#06b6d4] shadow-sm'
                      : 'bg-white text-[#64748b] hover:bg-[#f1f5f9] border-[#e2e8f0]'
                  }`}
                >
                  {pageNumber}
                </button>
              ))}

              <button
                onClick={() => setPage((previousPage) => Math.min(previousPage + 1, totalPages))}
                disabled={page === totalPages || totalPages === 0}
                className="w-8 h-8 flex items-center justify-center bg-white text-[#64748b] hover:bg-[#f1f5f9] transition-colors text-[13px] font-bold disabled:opacity-50 disabled:cursor-not-allowed border border-[#e2e8f0] rounded-lg shrink-0"
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>

      {detailsUser && (
        <DetailsModal
          user={detailsUser}
          children={detailsChildren}
          onClose={() => setDetailsUserId(null)}
          onBlockClick={(id) => setBlockUserId(id)}
        />
      )}

      {deleteUser && (
        <DeleteModal
          user={deleteUser}
          children={deleteChildren}
          onClose={() => setDeleteUserId(null)}
          onConfirm={confirmDeleteUser}
        />
      )}

      {blockUser && (
        <BlockModal
          user={blockUser}
          onClose={() => setBlockUserId(null)}
          onConfirm={async () => {
            await toggleBlocked(blockUser.id);
            setBlockUserId(null);
          }}
        />
      )}
    </div>
  );
};

const StatCard = ({ label, value, accent }) => (
  <div className="bg-white rounded-xl border border-gray-100 p-6 flex flex-col justify-between shadow-sm relative overflow-hidden">
    <p className="text-[12px] font-medium text-[#64748b] mb-2">{label}</p>
    <h3 className="text-3xl font-bold text-[#0f172a] mb-4">{value.toLocaleString()}</h3>
    <div className={`absolute bottom-0 left-6 right-6 h-1 ${accent}`} />
  </div>
);

const SelectFilter = ({ label, value, onChange, options }) => (
  <div className="relative min-w-[150px]">
    <select
      aria-label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full pl-4 pr-10 py-2.5 bg-[#f8fafc] border border-gray-100 rounded-lg text-[13px] font-medium text-[#475569] appearance-none focus:outline-none focus:ring-1 focus:ring-gray-200 cursor-pointer"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none" />
  </div>
);

const ProfileSectionTabs = ({ selectedRole, counts, onChange }) => (
  <div className="flex bg-[#f8fafc] border border-gray-100 rounded-lg p-1 gap-1">
    {PROFILE_SECTIONS.map((section) => {
      const isSelected = selectedRole === section.role;

      return (
        <button
          key={section.role}
          type="button"
          onClick={() => onChange(section.role)}
          className={`px-3 py-2 rounded-md text-[12px] font-semibold transition-colors whitespace-nowrap ${
            isSelected
              ? 'bg-white text-[#0f172a] shadow-sm border border-[#e2e8f0]'
              : 'text-[#64748b] hover:text-[#0f172a]'
          }`}
        >
          {section.label}
          <span className="ml-2 text-[11px] text-[#94a3b8]">{counts[section.role] || 0}</span>
        </button>
      );
    })}
  </div>
);

const RoleBadge = ({ role }) => (
  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${ROLE_STYLES[role]}`}>
    {role}
  </span>
);

const StatusBadge = ({ user }) => (
  <div className="flex flex-wrap items-center gap-2">
    {user.blocked ? (
      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full border border-[#fecaca] bg-[#fef2f2] text-[#dc2626]">
        Blocked
      </span>
    ) : (
      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full border border-[#a7f3d0] bg-[#ecfdf5] text-[#10b981]">
        Active
      </span>
    )}
  </div>
);

const ActionButton = ({ label, tone, onClick, icon }) => {
  const toneClasses = {
    neutral: 'text-[#475569] hover:text-[#06b6d4] hover:border-[#bae6fd] hover:bg-[#e0f2fe]/40',
    success: 'text-[#047857] hover:text-[#065f46] hover:border-[#a7f3d0] hover:bg-[#ecfdf5]/40',
    warning: 'text-[#b45309] hover:text-[#92400e] hover:border-[#fde68a] hover:bg-[#fffbeb]/40',
    danger: 'text-[#dc2626] hover:text-[#b91c1c] hover:border-[#fecaca] hover:bg-[#fef2f2]/40',
  };

  return (
    <button
      onClick={onClick}
      title={label}
      className={`inline-flex items-center justify-center p-2 rounded-lg border border-transparent bg-white transition-colors duration-200 ${toneClasses[tone]}`}
    >
      {React.createElement(icon, { size: 16 })}
    </button>
  );
};

const DetailsModal = ({ user, children, onClose, onBlockClick }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
    <div className="bg-white w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-xl shadow-xl animate-in zoom-in-95 duration-200 border border-[#e2e8f0]">
      <div className="p-5 border-b border-gray-100 flex items-start justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-[14px] shrink-0 ${user.color}`}>
            {user.initials}
          </div>
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-[#0f172a] truncate">{user.name}</h2>
            <p className="text-[13px] text-[#64748b] truncate">{user.email}</p>
          </div>
        </div>
        <button onClick={onClose} className="text-[#94a3b8] hover:text-[#0f172a] transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="p-5 overflow-y-auto max-h-[calc(92vh-86px)]">
        <div className="grid grid-cols-1 gap-4 mb-6">
          <DetailItem label="Full Name" value={user.name} />
          <DetailItem label="Email" value={user.email} />
          <DetailItem label="Role" value={<RoleBadge role={user.role} />} />
          <DetailItem label="Account Status" value={<StatusBadge user={user} />} />
          <DetailItem label="Created Date" value={user.createdDate} />
          <DetailItem label="Children Associated" value={children.length.toString()} />
        </div>

        <div className="flex flex-row items-center gap-2 mb-6">
          <ActionButton
            label={user.blocked ? 'Unblock' : 'Block'}
            tone={user.blocked ? 'success' : 'warning'}
            onClick={() => {
              onClose();
              onBlockClick(user.id);
            }}
            icon={user.blocked ? ShieldCheck : Ban}
          />
        </div>

        <div className="border-t border-gray-100 pt-5">
          <h3 className="text-[13px] font-bold uppercase tracking-wider text-[#64748b] mb-4">Associated Children</h3>
          {children.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {children.map((child) => (
                <ChildCard key={child.id} child={child} user={user} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[#cbd5e1] p-6 text-center text-[13px] text-[#64748b]">
              No children are currently associated with this {user.role.toLowerCase()} user.
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

const DetailItem = ({ label, value }) => (
  <div className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
    <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748b] mb-2">{label}</p>
    <div className="text-[13px] font-semibold text-[#0f172a] break-words">{value}</div>
  </div>
);

const ChildCard = ({ child, user }) => {
  const association =
    user.role === 'Parent'
      ? child.relationship
      : `Enrolled at ${user.name}`;

  return (
    <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 flex gap-4">
      <img
        src={child.image}
        alt={child.name}
        className="w-16 h-16 rounded-xl object-cover shrink-0 bg-[#f1f5f9]"
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <h4 className="text-[14px] font-bold text-[#0f172a]">{child.name}</h4>
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${STATUS_STYLES[child.status]}`}>
            {child.status}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-[12px] text-[#475569] mb-3">
          <p><span className="font-semibold text-[#0f172a]">Age:</span> {child.age}</p>
          <p><span className="font-semibold text-[#0f172a]">DOB:</span> {child.dob}</p>
          <p><span className="font-semibold text-[#0f172a]">Gender:</span> {child.gender}</p>
          <p><span className="font-semibold text-[#0f172a]">Association:</span> {association}</p>
        </div>
        <p className="text-[12px] leading-relaxed text-[#64748b]">{child.development}</p>
      </div>
    </div>
  );
};

const DeleteModal = ({ user, children, onClose, onConfirm }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
    <div className="bg-white w-full max-w-lg rounded-xl shadow-xl animate-in zoom-in-95 duration-200 border border-[#e2e8f0]">
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-500">
            <AlertTriangle size={24} strokeWidth={2} />
          </div>
          <button onClick={onClose} className="text-[#94a3b8] hover:text-[#0f172a] transition-colors">
            <X size={20} />
          </button>
        </div>

        <h2 className="text-xl font-bold text-[#0f172a] mb-2">Delete User?</h2>
        <p className="text-[#64748b] text-[14px] leading-relaxed mb-5">
          This may permanently remove <strong className="text-[#0f172a]">{user.name}</strong> from the platform and revoke their access.
        </p>

        <div className="rounded-xl border border-[#fee2e2] bg-[#fef2f2] p-4 mb-5 text-[13px] text-[#991b1b] leading-relaxed">
          Associated children will not be deleted here. This action only removes this user's relationship from each child record, so children connected to another parent or daycare remain safely available.
        </div>

        <div className="bg-[#f8fafc] p-4 rounded-xl border border-[#e2e8f0] mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-[14px] shadow-sm ${user.color}`}>
              {user.initials}
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-[#0f172a]">{user.name}</h3>
              <p className="text-[12px] text-[#64748b]">Role: {user.role}</p>
            </div>
          </div>
          <p className="text-[12px] text-[#64748b]">
            Relationships affected: {children.length} child{children.length === 1 ? '' : 'ren'}
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-[13px] font-semibold text-[#64748b] hover:text-[#0f172a] hover:bg-[#f8fafc] border border-transparent hover:border-[#e2e8f0] rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 text-[13px] font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors shadow-sm"
          >
            Delete User
          </button>
        </div>
      </div>
    </div>
  </div>
);

const BlockModal = ({ user, onClose, onConfirm }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
    <div className="bg-white w-full max-w-lg rounded-xl shadow-xl animate-in zoom-in-95 duration-200 border border-[#e2e8f0]">
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${user.blocked ? 'bg-emerald-100 text-emerald-500' : 'bg-amber-100 text-amber-500'}`}>
            {user.blocked ? <ShieldCheck size={24} strokeWidth={2} /> : <Ban size={24} strokeWidth={2} />}
          </div>
          <button onClick={onClose} className="text-[#94a3b8] hover:text-[#0f172a] transition-colors">
            <X size={20} />
          </button>
        </div>

        <h2 className="text-xl font-bold text-[#0f172a] mb-2">{user.blocked ? 'Unblock User?' : 'Block User?'}</h2>
        <p className="text-[#64748b] text-[14px] leading-relaxed mb-5">
          Are you sure you want to {user.blocked ? 'unblock' : 'block'} <strong className="text-[#0f172a]">{user.name}</strong>? 
          {user.blocked 
            ? ' This will restore their active status and access to the system.' 
            : ' This will suspend their access and render them inactive.'}
        </p>

        <div className="bg-[#f8fafc] p-4 rounded-xl border border-[#e2e8f0] mb-8">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-[14px] shadow-sm ${user.color}`}>
              {user.initials}
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-[#0f172a]">{user.name}</h3>
              <p className="text-[12px] text-[#64748b]">Role: {user.role}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-[13px] font-semibold text-[#64748b] hover:text-[#0f172a] hover:bg-[#f8fafc] border border-transparent hover:border-[#e2e8f0] rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-5 py-2.5 text-[13px] font-semibold text-white rounded-xl transition-colors shadow-sm ${user.blocked ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-amber-500 hover:bg-amber-600'}`}
          >
            {user.blocked ? 'Unblock User' : 'Block User'}
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default DaycareUserManagement;
