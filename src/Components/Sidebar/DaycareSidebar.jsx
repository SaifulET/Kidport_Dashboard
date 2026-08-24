import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Users,
  Smile,
  Brain,
  Settings,
  Eye,
  MessageSquare,
  LogOut
} from "lucide-react";
import { clearSession } from "../../lib/api";

const DaycareSidebar = ({ closeDrawer }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearSession();
    navigate('/sign-in');
  };

  const dashboardMenuItems = [
    { icon: LayoutGrid, label: "Dashboard", Link: "/" },
    { icon: Users, label: "Caregivers", Link: "/user-management" },
    { icon: Smile, label: "Children Profiles", Link: "/children" },
    { icon: Eye, label: "Observations", Link: "/observations" },
    { icon: Brain, label: "Milestones / AI", Link: "/ai-monitoring" },
    { icon: Settings, label: "Settings", Link: "/settings" },
    { icon: MessageSquare, label: "Support Desk", Link: "/support" },
  ];

  return (
    <div className="w-64 md:w-72 bg-white h-full flex flex-col font-sans border-r border-gray-100 shrink-0">
      {/* Sidebar Header */}
      <div className="pt-8 px-6 mb-8 border-b border-gray-100 pb-6">
        <img src="/fulllogo.svg" alt="Seymour" className="h-10 w-auto mb-2" />
        <p className="text-[11px] text-gray-500 pl-1">
          Admin Section
        </p>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 flex flex-col px-4 space-y-2 overflow-y-auto">
        {dashboardMenuItems.map((item) => {
          const isActive = location.pathname === item.Link ||
            (item.Link !== '/' && location.pathname.startsWith(item.Link));

          const Icon = item.icon;

          return (
            <Link
              key={item.label}
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
          );
        })}
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-100 mt-auto">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3.5 px-4 py-3 rounded-full w-full text-red-500 hover:bg-red-50 font-medium transition-colors"
        >
          <LogOut size={18} strokeWidth={1.5} />
          <span className="text-[13px]">Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default DaycareSidebar;

