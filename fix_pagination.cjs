const fs = require('fs');
const glob = require('glob');
const path = require('path');

const files = [
  'src/Pages/AIMonitoring/ParentAIMonitoring.jsx',
  'src/Pages/Children/ParentChildren.jsx',
  'src/Pages/Notifications/ParentNotifications.jsx',
  'src/Pages/Observations/ParentObservations.jsx',
  'src/Pages/Reports/ParentReports.jsx',
  'src/Pages/UserManagement/ParentUserManagement.jsx'
];

files.forEach(file => {
  const filepath = path.join(__dirname, file);
  if (!fs.existsSync(filepath)) return;
  
  let content = fs.readFileSync(filepath, 'utf8');

  // Replace standard pagination active/inactive expressions
  // Target: 'bg-[#06b6d4] text-white border-[#06b6d4]'
  content = content.replace(/'bg-\[#06b6d4\] text-white border-\[#06b6d4\]'/g, "'bg-[#06b6d4] text-white border-[#06b6d4] shadow-sm'");
  
  // Target: 'bg-white border-gray-200 text-[#1e293b] hover:bg-[#f8fafc]' or 'bg-white text-gray-500 hover:bg-gray-100' or similar
  // We can just use regex for the inactive string
  content = content.replace(/'bg-white border-gray-200 text-\[#1e293b\] hover:bg-\[#f8fafc\]'/g, "'bg-white text-[#64748b] hover:bg-[#f1f5f9] border-[#e2e8f0]'");
  
  // Target previous/next buttons classes
  // "w-8 h-8 rounded-md flex items-center justify-center bg-white text-[#64748b] hover:bg-[#f8fafc] transition-colors text-[10px] font-bold disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200"
  content = content.replace(/rounded-md/g, "rounded-lg");
  content = content.replace(/border-gray-200/g, "border-[#e2e8f0]");
  content = content.replace(/hover:bg-\[#f8fafc\]/g, "hover:bg-[#f1f5f9]");
  
  // For AIMonitoring it has border-[#e8e8e8] text-gray-500 hover:bg-gray-100
  content = content.replace(/text-gray-500 hover:bg-gray-100/g, "text-[#64748b] hover:bg-[#f1f5f9]");
  content = content.replace(/border-\[#e8e8e8\]/g, "border-[#e2e8f0]");

  // For ParentChildren it has border-gray-200 text-gray-400 hover:bg-gray-50
  content = content.replace(/text-gray-400 hover:bg-gray-50/g, "text-[#64748b] hover:bg-[#f1f5f9]");

  fs.writeFileSync(filepath, content, 'utf8');
});
