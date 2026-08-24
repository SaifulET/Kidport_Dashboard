import React from 'react';
import { LayoutGrid, BadgeCheck } from 'lucide-react';

const ActivePlans = ({ plans = [] }) => {
  const [monthly = {}, yearly = {}] = plans;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-white text-lg font-medium mb-1">Active Plans</h2>
      
      {/* Monthly Membership */}
      <div className="bg-[#0B3B8A] rounded-2xl p-6 relative overflow-hidden group hover:shadow-[0_0_20px_rgba(11,59,138,0.5)] transition-all">
        <div className="flex justify-between items-start mb-4">
          <div className="bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
            Popular
          </div>
          <LayoutGrid className="text-white/40" size={24} />
        </div>
        
        <h3 className="text-white text-xl font-bold mb-2">Monthly Membership</h3>
        <div className="flex items-baseline gap-1 mb-6">
          <span className="text-white text-4xl font-bold">${monthly.price || 0}</span>
          <span className="text-white/70 text-sm font-medium">/{monthly.interval || 'mo'}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#07265E] rounded-xl p-3">
            <p className="text-white/70 text-[10px] font-bold mb-1">Subscribers</p>
            <p className="text-white font-bold text-sm">{Number(monthly.subscribers || 0).toLocaleString()}</p>
          </div>
          <div className="bg-[#07265E] rounded-xl p-3">
            <p className="text-white/70 text-[10px] font-bold mb-1">Conversion</p>
            <p className="text-white font-bold text-sm">{monthly.conversion || 0}%</p>
          </div>
        </div>
      </div>

      {/* Yearly Membership */}
      <div className="bg-[#064E3B] rounded-2xl p-6 relative overflow-hidden group hover:shadow-[0_0_20px_rgba(6,78,59,0.5)] transition-all">
        <div className="flex justify-between items-start mb-4">
          <div className="bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
            Best Value
          </div>
          <BadgeCheck className="text-white/40" size={24} />
        </div>
        
        <h3 className="text-white text-xl font-bold mb-2">Yearly Membership</h3>
        <div className="flex items-baseline gap-1 mb-6">
          <span className="text-white text-4xl font-bold">${yearly.price || 0}</span>
          <span className="text-white/70 text-sm font-medium">/{yearly.interval || 'yr'}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#022C22] rounded-xl p-3">
            <p className="text-white/70 text-[10px] font-bold mb-1">Subscribers</p>
            <p className="text-white font-bold text-sm">{Number(yearly.subscribers || 0).toLocaleString()}</p>
          </div>
          <div className="bg-[#022C22] rounded-xl p-3">
            <p className="text-white/70 text-[10px] font-bold mb-1">Conversion</p>
            <p className="text-white font-bold text-sm">{yearly.conversion || 0}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivePlans;
