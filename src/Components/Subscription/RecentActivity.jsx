import React from 'react';
import { CheckCircle2, RefreshCw, AlertCircle } from 'lucide-react';

const RecentActivity = ({ activities = [] }) => {
  const iconFor = (type) =>
    type === 'failed' ? <AlertCircle size={16} className="text-[#FB7185]" /> :
    type === 'renewed' ? <RefreshCw size={16} className="text-[#60A5FA]" /> :
    <CheckCircle2 size={16} className="text-[#34D399]" />;

  return (
    <div className="bg-[#131B2F] rounded-2xl p-6 border border-[#1E293B] shadow-sm">
      <h3 className="text-white text-[15px] font-bold mb-6">Recent Activity</h3>

      <div className="flex flex-col gap-6">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
              activity.type === 'success' ? 'bg-[#064E3B]' :
                activity.type === 'renewed' ? 'bg-[#1E3A8A]' :
                  'bg-[#7F1D1D]'
            }`}>
              {iconFor(activity.type)}
            </div>
            <div>
              <p className="text-white text-[13px] font-bold mb-0.5">{activity.title}</p>
              <p className="text-[#64748B] text-[11px] font-medium">{activity.desc}</p>
            </div>
          </div>
        ))}
        {activities.length === 0 && (
          <p className="text-[#64748B] text-[12px] font-medium">No subscription activity yet.</p>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
