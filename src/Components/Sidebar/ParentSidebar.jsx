import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Users,
  Smile,
  Brain,
  Settings,
  MessageSquare,
  LogOut
} from "lucide-react";
import { clearSession } from "../../lib/api";

const ParentSidebar = ({ closeDrawer }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearSession();
    navigate('/sign-in');
  };

  const menuItems = [
    { icon: LayoutGrid, label: "Dashboard", Link: "/" },
    { icon: Users, label: "Caregivers", Link: "/user-management" },
    { icon: Smile, label: "Children", Link: "/children" },
    { icon: Brain, label: "AI Monitoring", Link: "/ai-monitoring" },
    { icon: Settings, label: "Settings", Link: "/settings" },
    { icon: MessageSquare, label: "Support", Link: "/support" },
  ];

  return (
    <div className="w-64 md:w-72 bg-white h-full flex flex-col font-sans border-r border-gray-100 shrink-0">
      {/* Sidebar Header */}
      <div className="pt-8 px-6 mb-8 border-b border-gray-100 pb-6">
        <img src="/fulllogo.svg" alt="Seymour" className="h-10 w-auto mb-2" />
        <p className="text-[9px] text-[#64748b] tracking-[0.15em] uppercase pl-1">
          Admin Section
        </p>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 flex flex-col px-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.Link ||
            (item.Link !== '/' && location.pathname.startsWith(item.Link));

          const Icon = item.icon;

          return (
            <React.Fragment key={item.label}>
              <Link
                to={item.Link}
                onClick={closeDrawer}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-full transition-colors ${isActive
                  ? "bg-[#bdf0f1] text-[#1aa3b9] font-semibold"
                  : "text-[#4a5568] hover:bg-gray-50 font-medium"
                  }`}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 1.5} />
                <span className="text-[13px]">{item.label}</span>
              </Link>
              {/* Separator below active menu item */}
              {isActive && (
                <div className="mx-4 my-2 border-b-[1.5px] border-transparent"></div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 mt-auto">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#00a99d] rounded-full flex items-center justify-center text-white font-bold text-xs">AD</div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#1e293b] uppercase tracking-wide leading-tight">
                Parent Profile
              </span>
              <span className="text-[9px] text-[#64748b] italic mt-0.5">
                v2.4.0-stable
              </span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="text-red-500 hover:bg-red-50 transition-colors p-2 rounded-full"
            title="Log Out"
          >
            <LogOut size={16} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParentSidebar;

