import React from "react";
import { Search, Bell, HelpCircle, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import adminImage from "../../assets/image/adminkickclick.jpg";

const ParentHeader = ({ showDrawer }) => {
  const navigate = useNavigate();
  return (
    <div className="h-[72px] flex items-center justify-between px-4 md:px-8 bg-white border-b border-gray-100 font-sans">

      {/* Left side: Title & Hamburger */}
      <div className="flex items-center gap-3">
        <button onClick={showDrawer} className="lg:hidden text-[#64748b] hover:text-[#0f172a] transition-colors flex-shrink-0">
          <Menu size={24} strokeWidth={2} />
        </button>
        <h1 className="text-xl font-bold text-[#1eb4cd] tracking-tight hidden sm:block">
          Parent Dashboard
        </h1>
      </div>

      {/* Middle: Search Box */}
      {/* <div className="flex-1 max-w-3xl px-4 md:px-12">
        <div className="relative flex items-center w-full">
          <Search className="absolute left-3 text-gray-400" size={15} strokeWidth={2} />
          <input
            type="text"
            placeholder="Search..."
            className="w-full h-[42px] pl-11 pr-4 text-[13px] text-gray-700 bg-[#f8fafc] border border-[#e2e8f0] rounded-full focus:outline-none focus:ring-1 focus:ring-gray-200 focus:bg-white transition-all placeholder:text-[#94a3b8]"
          />
        </div>
      </div> */}

      {/* Right side: Icons and Profile */}
      <div className="flex items-center gap-6">
        <button onClick={() => navigate('/notifications')} className="text-[#64748b] hover:text-[#0f172a] transition-colors focus:outline-none">
          <Bell size={18} strokeWidth={2} />
        </button>

        <div onClick={() => navigate('/settings')} className="w-8 h-8 rounded-sm overflow-hidden bg-[#1e293b] cursor-pointer shadow-sm hover:opacity-80 transition-opacity">
          <img src={adminImage} alt="Admin Profile" className="w-full h-full object-cover" />
        </div>
      </div>

    </div>
  );
};

export default ParentHeader;

