import { useState } from 'react';
import { Globe, Loader2 } from 'lucide-react';

const DaycareSettings = () => {
  const [initials, setInitials] = useState({ name: "Seymour", email: "support@seymour.internal" });
  const [platformName, setPlatformName] = useState(initials.name);
  const [supportEmail, setSupportEmail] = useState(initials.email);
  const [isSaving, setIsSaving] = useState(false);

  const isChanged = platformName !== initials.name || supportEmail !== initials.email;

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setInitials({ name: platformName, email: supportEmail });
      alert("Settings saved successfully!");
    }, 1000);
  };

  const handleCancel = () => {
    setPlatformName(initials.name);
    setSupportEmail(initials.email);
  };

  return (
    <div className="min-h-screen bg-[#fdfdfd] p-6 lg:p-10 font-sans text-[#1e293b]">
      <div className="max-w-[600px] mx-auto animate-in fade-in duration-500">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[26px] font-bold text-[#0f172a] mb-1 leading-tight">Daycare Profile</h1>
          <p className="text-[13px] text-[#64748b]">Manage daycare account details and support contact information</p>
        </div>

        <div className="space-y-6">

          {/* Profile Settings */}
          <div className="bg-white rounded-[14px] border border-gray-100 p-6 lg:p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-[42px] h-[42px] rounded-full bg-[#e0f2fe] flex items-center justify-center text-[#06b6d4] shrink-0">
                <Globe size={20} />
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-[#1e293b]">Daycare Account Details</h3>
                <p className="text-[12px] text-[#64748b]">Configure daycare profile information</p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-[12px] font-semibold text-[#475569] mb-2">Daycare Name</label>
                <input
                  type="text"
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                  className="w-full bg-[#f8fafc] border border-transparent focus:border-gray-200 focus:bg-white rounded-lg px-4 py-2.5 text-[13px] font-medium text-[#1e293b] outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#475569] mb-2">Support Email</label>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full bg-[#f8fafc] border border-transparent focus:border-gray-200 focus:bg-white rounded-lg px-4 py-2.5 text-[13px] font-medium text-[#1e293b] outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Action Bar */}
          {isChanged && (
            <div className="bg-white rounded-[14px] border border-gray-100 p-6 lg:p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex justify-end gap-3 animate-in slide-in-from-bottom duration-250">
              <button 
                onClick={handleCancel}
                className="px-5 py-2.5 text-[13px] font-semibold text-[#64748b] hover:text-[#1e293b] hover:bg-gray-50 rounded-full transition-colors border border-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-5 py-2.5 text-[13px] font-semibold text-white bg-[#06b6d4] hover:bg-[#0891b2] disabled:bg-gray-400 rounded-full transition-colors flex items-center justify-center gap-2 min-w-[120px]"
              >
                {isSaving ? <Loader2 className="animate-spin" size={16} /> : "Save Changes"}
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default DaycareSettings;
