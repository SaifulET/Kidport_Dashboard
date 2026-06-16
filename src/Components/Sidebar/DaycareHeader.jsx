import React from "react";
import { Search, Bell, ChevronDown, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DaycareHeader = ({ showDrawer }) => {
  const navigate = useNavigate();
  return (
    <div className="h-[72px] flex items-center justify-between px-4 md:px-8 bg-white border-b border-gray-100 font-sans">

      {/* Left: Mobile Menu & Search Box */}
      <div className="flex items-center flex-1 max-w-[500px] gap-3">
        <button onClick={showDrawer} className="lg:hidden text-[#64748b] hover:text-[#0f172a] transition-colors flex-shrink-0">
          <Menu size={24} strokeWidth={2} />
        </button>

        <h1 className="text-xl font-bold text-[#1eb4cd] tracking-tight hidden sm:block">
          Daycare Dashboard
        </h1>

      </div>

      {/* Right side: Icons and Profile */}
      <div className="flex items-center gap-6 ml-auto">
        {/* Notification Bell */}
        <button onClick={() => navigate('/daycare-notifications')} className="relative text-[#64748b] hover:text-[#0f172a] transition-colors focus:outline-none mt-1">
          <Bell size={22} strokeWidth={1.5} />
          <span className="absolute -top-0.5 right-0 w-2.5 h-2.5 bg-[#f87171] rounded-full border-2 border-white"></span>
        </button>

        {/* Profile Section */}
        <div
          onClick={() => navigate('/settings')}
          className="flex items-center gap-3 cursor-pointer pl-6 border-l border-gray-100 hover:bg-gray-50 p-2 -my-2 rounded-lg transition-colors"
        >
          {/* Avatar */}
          <div className="w-[38px] h-[38px] rounded-full bg-[#00a99d] flex items-center justify-center text-white font-bold text-[14px] shadow-sm">
            AD
          </div>
          {/* Name/Role */}
          <div className="flex-col pr-1 hidden sm:flex">
            <span className="text-[13px] font-bold text-[#1e293b] leading-tight">Admin User</span>
            <span className="text-[11px] text-[#64748b]">Super Admin</span>
          </div>
          {/* Chevron */}
          <ChevronDown size={14} className="text-[#94a3b8]" />
        </div>
      </div>

    </div>
  );
};

export default DaycareHeader;

