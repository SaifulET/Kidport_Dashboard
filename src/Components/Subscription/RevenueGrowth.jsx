import React from 'react';

const RevenueGrowth = ({ chartData = [] }) => {

  return (
    <div className="bg-[#131B2F] rounded-2xl p-6 border border-[#1E293B] shadow-sm mb-6">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-white text-xl font-medium">Revenue Growth</h2>
        <div className="flex items-center gap-4 text-[10px] font-bold text-[#94A3B8]">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#64748B]"></div>
            Monthly
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#2DD4BF]"></div>
            Yearly
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="h-[220px] flex items-end justify-between px-2 gap-4 mt-8">
        {chartData.map((data, idx) => (
          <div key={idx} className="flex flex-col items-center w-full group">
            {/* Stacked Bar Container */}
            <div className="w-full max-w-[48px] h-[160px] flex flex-col justify-end gap-1 mb-4">
              {/* Top part (Yearly) */}
              <div 
                className={`w-full rounded-t-sm transition-all duration-300 ${
                  idx >= chartData.length - 2 ? 'bg-[#0F766E]/50 group-hover:bg-[#0F766E]/70' : 'bg-[#1E293B] group-hover:bg-[#334155]'
                }`}
                style={{ height: `${data.val2}%` }}
              ></div>
              {/* Bottom part (Monthly) */}
              <div 
                className={`w-full rounded-b-sm transition-all duration-300 ${
                  idx >= chartData.length - 2 ? 'bg-[#2DD4BF] group-hover:bg-[#34D399] shadow-[0_0_15px_rgba(45,212,191,0.3)]' : 'bg-[#475569] group-hover:bg-[#64748B]'
                }`}
                style={{ height: `${data.val1}%` }}
              ></div>
            </div>
            {/* Label */}
            <span className="text-[#64748B] text-[9px] font-bold tracking-widest">{data.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RevenueGrowth;
