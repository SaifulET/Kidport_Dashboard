import React, { useCallback, useEffect, useState } from 'react';
import { Loader2, Plus, Pencil, Trash2, Save, X, RefreshCw, Layers } from 'lucide-react';
import { apiDelete, apiGet, apiPatch, apiPost } from '../../lib/api';

const formatNumber = (value) => Number(value || 0).toLocaleString();

export default function DomainManagement() {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState(null);
  const [newDomainName, setNewDomainName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const loadDomains = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiGet('/admin/domains?limit=100');
      setDomains(response.data || []);
    } catch (err) {
      setError(err.message || 'Unable to load domains');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDomains();
  }, [loadDomains]);

  const totalObservations = domains.reduce((sum, domain) => sum + Number(domain.observationCount || 0), 0);

  const handleCreate = async (event) => {
    event.preventDefault();
    const name = newDomainName.trim();
    if (!name) return;

    setSaving(true);
    setError('');
    setNotice('');
    try {
      const response = await apiPost('/admin/domains', { name });
      setDomains((current) => [...current, response.data].sort((a, b) => a.name.localeCompare(b.name)));
      setNewDomainName('');
      setNotice('Domain created successfully.');
    } catch (err) {
      setError(err.message || 'Unable to create domain');
    } finally {
      setSaving(false);
    }
  };

  const startEditing = (domain) => {
    setEditingId(domain.id);
    setEditingName(domain.name);
    setError('');
    setNotice('');
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleUpdate = async (domainId) => {
    const name = editingName.trim();
    if (!name) return;

    setActionId(domainId);
    setError('');
    setNotice('');
    try {
      const response = await apiPatch(`/admin/domains/${domainId}`, { name });
      setDomains((current) => current.map((domain) => (domain.id === domainId ? response.data : domain)));
      setEditingId(null);
      setEditingName('');
      setNotice('Domain updated successfully.');
    } catch (err) {
      setError(err.message || 'Unable to update domain');
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (domain) => {
    const confirmed = window.confirm(`Delete "${domain.name}"? Existing observations will keep their historical domain reference.`);
    if (!confirmed) return;

    setActionId(domain.id);
    setError('');
    setNotice('');
    try {
      await apiDelete(`/admin/domains/${domain.id}`);
      setDomains((current) => current.filter((item) => item.id !== domain.id));
      setNotice('Domain deleted successfully.');
    } catch (err) {
      setError(err.message || 'Unable to delete domain');
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10 font-sans text-[#1e293b]">
      <div className="max-w-[1400px] mx-auto animate-in fade-in duration-500">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#0f172a] mb-1">Domain</h1>
          <p className="text-[13px] text-[#64748b]">Organize development domains used across observations and milestones.</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Layers size={18} className="text-[#06b6d4]" />
                <h3 className="text-[14px] font-bold text-[#1e293b]">Development Domains</h3>
              </div>
              <p className="text-[12px] text-[#64748b]">
                {formatNumber(domains.length)} domains | {formatNumber(totalObservations)} observations
              </p>
            </div>

            <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <input
                value={newDomainName}
                onChange={(event) => setNewDomainName(event.target.value)}
                placeholder="New domain name"
                className="h-10 min-w-0 sm:w-64 rounded-lg border border-gray-200 px-3 text-[13px] outline-none focus:border-[#06b6d4] focus:ring-2 focus:ring-[#cffafe]"
              />
              <button
                type="submit"
                disabled={saving || !newDomainName.trim()}
                className="h-10 inline-flex items-center justify-center gap-2 rounded-lg bg-[#06b6d4] px-4 text-[12px] font-bold text-white transition-colors hover:bg-[#0891b2] disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                Create
              </button>
            </form>
          </div>

          {(notice || error) && (
            <div className={`mb-4 rounded-lg border px-4 py-3 text-[12px] font-semibold ${error ? 'border-[#fecaca] bg-[#fef2f2] text-[#be123c]' : 'border-[#bbf7d0] bg-[#f0fdf4] text-[#166534]'}`}>
              {error || notice}
            </div>
          )}

          {loading ? (
            <div className="h-44 flex items-center justify-center text-[#94a3b8]">
              <Loader2 className="animate-spin" size={24} />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-left">
                    <th className="py-3 pr-4 text-[11px] font-bold uppercase tracking-wider text-[#64748b]">Domain Name</th>
                    <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-[#64748b]">Slug</th>
                    <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-[#64748b]">Observations</th>
                    <th className="py-3 pl-4 text-right text-[11px] font-bold uppercase tracking-wider text-[#64748b]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {domains.map((domain) => {
                    const isEditing = editingId === domain.id;
                    const isBusy = actionId === domain.id;

                    return (
                      <tr key={domain.id} className="border-b border-gray-50 last:border-0">
                        <td className="py-4 pr-4">
                          {isEditing ? (
                            <input
                              value={editingName}
                              onChange={(event) => setEditingName(event.target.value)}
                              className="h-9 w-full rounded-lg border border-gray-200 px-3 text-[13px] outline-none focus:border-[#06b6d4] focus:ring-2 focus:ring-[#cffafe]"
                              autoFocus
                            />
                          ) : (
                            <span className="text-[13px] font-bold text-[#1e293b]">{domain.name}</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-[12px] text-[#64748b]">{domain.slug}</td>
                        <td className="py-4 px-4">
                          <span className="inline-flex min-w-12 items-center justify-center rounded-full bg-[#f1f5f9] px-3 py-1 text-[12px] font-bold text-[#334155]">
                            {formatNumber(domain.observationCount)}
                          </span>
                        </td>
                        <td className="py-4 pl-4">
                          <div className="flex items-center justify-end gap-2">
                            {isEditing ? (
                              <>
                                <button
                                  type="button"
                                  title="Save domain"
                                  onClick={() => handleUpdate(domain.id)}
                                  disabled={isBusy || !editingName.trim()}
                                  className="h-9 w-9 inline-flex items-center justify-center rounded-lg bg-[#ecfdf5] text-[#059669] transition-colors hover:bg-[#d1fae5] disabled:cursor-not-allowed disabled:text-gray-300"
                                >
                                  {isBusy ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                </button>
                                <button
                                  type="button"
                                  title="Cancel edit"
                                  onClick={cancelEditing}
                                  disabled={isBusy}
                                  className="h-9 w-9 inline-flex items-center justify-center rounded-lg bg-[#f8fafc] text-[#64748b] transition-colors hover:bg-[#e2e8f0]"
                                >
                                  <X size={16} />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  title="Edit domain"
                                  onClick={() => startEditing(domain)}
                                  className="h-9 w-9 inline-flex items-center justify-center rounded-lg bg-[#eff6ff] text-[#2563eb] transition-colors hover:bg-[#dbeafe]"
                                >
                                  <Pencil size={16} />
                                </button>
                                <button
                                  type="button"
                                  title="Delete domain"
                                  onClick={() => handleDelete(domain)}
                                  disabled={isBusy}
                                  className="h-9 w-9 inline-flex items-center justify-center rounded-lg bg-[#fef2f2] text-[#e11d48] transition-colors hover:bg-[#fee2e2] disabled:cursor-not-allowed disabled:text-gray-300"
                                >
                                  {isBusy ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {!domains.length && (
                    <tr>
                      <td colSpan="4" className="py-12 text-center text-[13px] text-[#94a3b8]">
                        No active domains found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          <button
            type="button"
            onClick={loadDomains}
            className="mt-4 inline-flex items-center gap-2 text-[12px] font-bold text-[#06b6d4] hover:text-[#0891b2]"
          >
            <RefreshCw size={14} />
            Refresh domains
          </button>
        </div>
      </div>
    </div>
  );
}
