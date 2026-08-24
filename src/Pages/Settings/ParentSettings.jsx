import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const ParentSettings = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  // Form State
  const [parentName, setParentName] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [savedName, setSavedName] = useState('');
  const [savedEmail, setSavedEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const isChanged = parentName !== savedName || parentEmail !== savedEmail;

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));

        const mockData = {
          uid: 'KP-992-X-PARENT',
          name: 'Parent Zero',
          email: 'parent@kidport.internal',
        };

        setData(mockData);
        setParentName(mockData.name);
        setParentEmail(mockData.email);
        setSavedName(mockData.name);
        setSavedEmail(mockData.email);

      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleUpdateProfile = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSavedName(parentName);
      setSavedEmail(parentEmail);
      alert("Profile updated successfully!");
    }, 1000);
  };

  const handleCancel = () => {
    setParentName(savedName);
    setParentEmail(savedEmail);
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-gray-400">
          <Loader2 className="animate-spin" size={32} />
          <p className="text-[10px] font-bold tracking-widest uppercase">Initializing Settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-12 bg-[#f8fafc] font-sans text-[#1e293b]">
      <div className="mx-auto max-w-2xl animate-in fade-in zoom-in duration-500">

        {/* Header Section */}
        <div className="mb-8 md:mb-12">
          <p className="text-[9px] font-bold text-[#64748b] tracking-[0.2em] uppercase mb-2">PARENT PROFILE</p>
          <h1 className="text-3xl md:text-4xl font-light tracking-tight text-[#1e293b]">Parent Profile</h1>
        </div>

        {/* Right Content Area */}
        <div className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm">
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end border-b border-gray-200 pb-3 mb-8 gap-2 sm:gap-0">
            <h2 className="text-lg font-bold tracking-tight text-[#1e293b]">Parent Account Details</h2>
            <span className="text-[9px] font-mono text-[#64748b] tracking-widest uppercase">
              UID: {data.uid}
            </span>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-[9px] font-bold text-[#64748b] tracking-[0.1em] uppercase mb-3">
                Full Name
              </label>
              <input
                type="text"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                className="w-full bg-[#f8fafc] px-4 py-3 text-[13px] text-[#1e293b] rounded-lg border border-gray-100 focus:outline-none focus:ring-1 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-all"
              />
            </div>
            <div>
              <label className="block text-[9px] font-bold text-[#64748b] tracking-[0.1em] uppercase mb-3">
                Email Address
              </label>
              <input
                type="email"
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                className="w-full bg-[#f8fafc] px-4 py-3 text-[13px] text-[#1e293b] rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-all"
              />
            </div>

            {isChanged && (
              <div className="pt-4 flex justify-end gap-3 animate-in slide-in-from-bottom duration-250">
                <button 
                  onClick={handleCancel}
                  className="px-5 py-2.5 text-[11px] font-bold text-[#64748b] hover:text-[#1e293b] rounded-lg border border-gray-200 transition-colors uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateProfile}
                  disabled={isSaving}
                  className="bg-[#06b6d4] hover:bg-[#0891b2] rounded-lg shadow-sm text-white text-[11px] font-bold px-8 py-3 transition-colors tracking-wide disabled:opacity-50 flex items-center justify-center min-w-[140px]"
                >
                  {isSaving ? <Loader2 className="animate-spin" size={16} /> : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ParentSettings;
