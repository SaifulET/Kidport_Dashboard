import React, { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import MetricCards from '../../Components/Subscription/MetricCards';
import ActivePlans from '../../Components/Subscription/ActivePlans';
import RecentActivity from '../../Components/Subscription/RecentActivity';
import RevenueGrowth from '../../Components/Subscription/RevenueGrowth';
import SubscriptionTable from '../../Components/Subscription/SubscriptionTable';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { apiGet } from '../../lib/api';

const SubscriptionManagement = () => {
  const [filterStatus, setFilterStatus] = useState('All Subs');
  const [filterPlanType, setFilterPlanType] = useState('Plan Type');
  const [subscriptions, setSubscriptions] = useState([]);
  const [summary, setSummary] = useState({ metrics: {}, activePlans: [], revenueGrowth: [], recentActivity: [] });
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const loadSubscriptions = async () => {
      try {
        const params = new URLSearchParams({ limit: '100' });
        if (filterStatus !== 'All Subs') params.set('status', filterStatus);
        if (filterPlanType !== 'Plan Type') params.set('plan', filterPlanType);

        const [listResponse, summaryResponse] = await Promise.all([
          apiGet(`/admin/subscriptions?${params.toString()}`),
          apiGet('/admin/subscriptions/summary')
        ]);

        setSubscriptions(listResponse.data);
        setTotal(listResponse.pagination.total);
        setSummary(summaryResponse.data);
      } catch (error) {
        console.error('Error loading subscriptions:', error);
        setSubscriptions([]);
      }
    };

    loadSubscriptions();
  }, [filterStatus, filterPlanType]);

  const handleExportPDF = () => {
    if (subscriptions.length === 0) {
      alert("No data to export!");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Subscription Report', 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    doc.autoTable({
      head: [["User", "Email", "Plan Type", "Renewal Date", "Payment", "Status"]],
      body: subscriptions.map((sub) => [
        sub.name,
        sub.email,
        sub.plan,
        new Date(sub.date).toLocaleDateString(),
        sub.payment,
        sub.status,
      ]),
      startY: 40,
      theme: 'grid',
      styles: { fontSize: 9 },
      headStyles: { fillColor: [59, 130, 246] }
    });

    doc.save(`subscriptions_report_${new Date().getTime()}.pdf`);
  };

  return (
    <div className="min-h-screen p-8 bg-[#0A0D14] text-white font-sans">
      <div className="max-w-[1600px] mx-auto animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-[28px] font-bold tracking-tight mb-1">Subscription Management</h1>
            <p className="text-[#94A3B8] text-[13px] font-medium">Manage memberships, billing activity, and subscription performance.</p>
          </div>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 bg-[#131B2F] border border-[#1E293B] hover:bg-[#1E293B] transition-colors text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm whitespace-nowrap"
          >
            <Download size={16} />
            Export Report
          </button>
        </div>

        <MetricCards metrics={summary.metrics} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 flex flex-col gap-6">
            <ActivePlans plans={summary.activePlans} />
            <RecentActivity activities={summary.recentActivity} />
          </div>

          <div className="lg:col-span-8 flex flex-col h-full">
            <RevenueGrowth chartData={summary.revenueGrowth} />
            <SubscriptionTable
              subscriptions={subscriptions}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              filterPlanType={filterPlanType}
              setFilterPlanType={setFilterPlanType}
              total={total}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionManagement;
