import { axiosClient } from '../../api/axiosClient';
import type { SalesDashboardData } from '../types/salesDashboard.types';

const MOCK_SALES_DATA: SalesDashboardData = {
  kpis: {
    revenue: {
      title: 'My Revenue',
      value: '₹8.42L',
      change: '+14.8%',
      isPositive: true,
      timeframe: 'vs last month',
    },
    pipeline: {
      title: 'Pipeline Value',
      value: '₹21.6L',
      change: '+9.4%',
      isPositive: true,
      timeframe: 'current active',
    },
    openDeals: {
      title: 'Open Deals',
      value: '38',
      change: '+6',
      isPositive: true,
      timeframe: 'in progress',
    },
    winRate: {
      title: 'Win Rate',
      value: '34.6%',
      change: '+4.2%',
      isPositive: true,
      timeframe: 'this quarter',
    },
  },
  target: {
    targetAmount: 1200000,
    targetFormatted: '₹12,00,000',
    achievedAmount: 842000,
    achievedFormatted: '₹8,42,000',
    remainingFormatted: '₹3,58,000',
    percentage: 70.2,
    daysRemaining: 23,
  },
  revenueTrend: [
    { label: 'Week 1', revenue: 180000, orders: 12 },
    { label: 'Week 2', revenue: 240000, orders: 16 },
    { label: 'Week 3', revenue: 210000, orders: 14 },
    { label: 'Week 4', revenue: 212000, orders: 15 },
  ],
  pipelineStages: [
    { stage: 'Leads', count: 42, value: '₹9.2L', conversion: '100%' },
    { stage: 'Qualified', count: 28, value: '₹6.8L', conversion: '66.7%' },
    { stage: 'Proposal', count: 17, value: '₹4.6L', conversion: '40.4%' },
    { stage: 'Negotiation', count: 9, value: '₹3.2L', conversion: '21.4%' },
    { stage: 'Won', count: 12, value: '₹5.4L', conversion: '28.5%' },
  ],
  funnelSteps: [
    { stage: 'New Leads', count: 248 },
    { stage: 'Qualified', count: 126, conversionRate: '50.8%' },
    { stage: 'Opportunities', count: 74, conversionRate: '58.7%' },
    { stage: 'Proposals', count: 41, conversionRate: '55.4%' },
    { stage: 'Won Deals', count: 28, conversionRate: '68.3%' },
  ],
  leads: [
    { id: '1', name: 'Rohan Sharma', company: 'Acme Corporation', source: 'Website Inbound', status: 'Qualified', value: '₹4.8L', lastContact: '2026-08-10', nextFollowUp: 'Today 10:30 AM' },
    { id: '2', name: 'Ananya Verma', company: 'Nova Technologies', source: 'LinkedIn Outbound', status: 'Contacted', value: '₹3.2L', lastContact: '2026-08-09', nextFollowUp: 'Today 1:00 PM' },
    { id: '3', name: 'Vikram Malhotra', company: 'Bright Solutions', source: 'Referral', status: 'Nurturing', value: '₹2.1L', lastContact: '2026-08-08', nextFollowUp: 'Today 3:30 PM' },
    { id: '4', name: 'Siddharth Roy', company: 'Vertex Systems', source: 'Trade Expo', status: 'Converted', value: '₹5.4L', lastContact: '2026-08-07', nextFollowUp: 'Completed' },
  ],
  followUps: [
    { id: '1', customerName: 'Acme Corporation', activityType: 'Follow-up call with Rohan Sharma', time: '10:30 AM', completed: false },
    { id: '2', customerName: 'Nova Technologies', activityType: 'Product demo with Ananya Verma', time: '1:00 PM', completed: false },
    { id: '3', customerName: 'Bright Solutions', activityType: 'Proposal follow-up meeting', time: '3:30 PM', completed: false },
  ],
  opportunities: [
    { id: '1', title: 'Enterprise CRM Upgrade', customerName: 'Acme Corporation', value: '₹4.8L', stage: 'Negotiation', probability: 80, expectedClose: 'Aug 18' },
    { id: '2', title: 'ERP Integration Contract', customerName: 'Nova Technologies', value: '₹3.2L', stage: 'Proposal', probability: 65, expectedClose: 'Aug 24' },
    { id: '3', title: 'Annual Maintenance Deal', customerName: 'Bright Solutions', value: '₹2.1L', stage: 'Qualified', probability: 50, expectedClose: 'Aug 29' },
  ],
  recentOrders: [
    { id: '1', orderNumber: '#CH-20260811-3938', customerName: 'Sharma Electronics', date: '2026-08-11', amount: '₹42,500', status: 'Completed', assignedTo: 'You' },
    { id: '2', orderNumber: '#CH-20260811-4012', customerName: 'Apex Hardware Mart', date: '2026-08-11', amount: '₹1,24,000', status: 'Processing', assignedTo: 'You' },
  ],
  recentActivities: [
    { id: '1', title: 'Opportunity moved to Negotiation', company: 'Acme Corporation', time: '10 minutes ago', type: 'opportunity' },
    { id: '2', title: 'New inbound lead assigned', company: 'Nova Technologies', time: '32 minutes ago', type: 'lead' },
    { id: '3', title: 'Commercial proposal sent', company: 'Bright Solutions', time: '1 hour ago', type: 'proposal' },
    { id: '4', title: 'Deal marked as Won', company: 'Vertex Systems', time: '2 hours ago', type: 'deal' },
  ],
  performance: {
    calls: 42,
    meetings: 18,
    emails: 86,
    proposals: 11,
    dealsWon: 7,
  },
};

export const fetchSalesDashboardOverview = async (): Promise<SalesDashboardData> => {
  try {
    const [statsRes, cRes, chRes] = await Promise.allSettled([
      axiosClient.get('/dashboard/stats'),
      axiosClient.get('/customers?page=1&limit=5'),
      axiosClient.get('/challans?page=1&limit=5'),
    ]);

    const data: SalesDashboardData = { ...MOCK_SALES_DATA };

    if (statsRes.status === 'fulfilled' && statsRes.value.data) {
      const stats = statsRes.value.data;
      data.kpis.openDeals.value = (stats.draftChallanCount + stats.leadCount).toString();
    }

    if (cRes.status === 'fulfilled' && cRes.value.data?.data) {
      const liveCustomers = cRes.value.data.data;
      if (liveCustomers.length > 0) {
        data.leads = liveCustomers.slice(0, 4).map((c: any) => ({
          id: String(c.id),
          name: c.name,
          company: c.businessName || 'Business Client',
          source: c.customerType || 'Inbound',
          status: c.status === 'ACTIVE' ? 'Converted' : c.status === 'LEAD' ? 'Qualified' : 'Contacted',
          value: '₹3.5L',
          lastContact: new Date(c.createdAt).toISOString().slice(0, 10),
          nextFollowUp: c.followUpDate ? new Date(c.followUpDate).toISOString().slice(0, 10) : 'Today',
        }));
      }
    }

    if (chRes.status === 'fulfilled' && chRes.value.data?.data) {
      const liveChallans = chRes.value.data.data;
      if (liveChallans.length > 0) {
        data.recentOrders = liveChallans.map((ch: any) => ({
          id: String(ch.id),
          orderNumber: ch.challanNumber,
          customerName: ch.customer?.name || 'Client',
          date: new Date(ch.createdAt).toISOString().slice(0, 10),
          amount: `₹${(ch.totalQuantity * 1250).toLocaleString()}`,
          status: ch.status === 'CONFIRMED' ? 'Completed' : ch.status === 'CANCELLED' ? 'Cancelled' : 'Processing',
          assignedTo: 'You',
        }));
      }
    }

    return data;
  } catch (error) {
    console.warn('Backend API fetch error, using fallback sales data:', error);
    return MOCK_SALES_DATA;
  }
};
