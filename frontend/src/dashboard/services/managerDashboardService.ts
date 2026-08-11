import { axiosClient } from '../../api/axiosClient';
import type { ManagerDashboardData } from '../types/managerDashboard.types';

const MOCK_MANAGER_DATA: ManagerDashboardData = {
  kpis: {
    revenue: {
      title: 'Total Revenue',
      value: '₹18.6L',
      change: '+10.8%',
      isPositive: true,
      timeframe: 'vs last month',
    },
    pipeline: {
      title: 'Sales Pipeline',
      value: '₹42.5L',
      change: '+14.2%',
      isPositive: true,
      timeframe: 'current pipeline',
    },
    customers: {
      title: 'Active Customers',
      value: '1,842',
      change: '+7.4%',
      isPositive: true,
      timeframe: 'this month',
    },
    teamPerformance: {
      title: 'Team Performance',
      value: '87%',
      change: '+5.1%',
      isPositive: true,
      timeframe: 'target achievement',
    },
  },
  salesTrend: [
    { label: 'Jan', revenue: 1420000, orders: 280 },
    { label: 'Feb', revenue: 1680000, orders: 340 },
    { label: 'Mar', revenue: 1860000, orders: 390 },
    { label: 'Apr', revenue: 1750000, orders: 360 },
    { label: 'May', revenue: 2100000, orders: 420 },
    { label: 'Jun', revenue: 2350000, orders: 460 },
  ],
  teamMembers: [
    { id: '1', name: 'Aarav Shah', target: '₹8.0L', achieved: '₹7.4L', percentage: 92 },
    { id: '2', name: 'Priya Patel', target: '₹7.5L', achieved: '₹8.1L', percentage: 108 },
    { id: '3', name: 'Rahul Mehta', target: '₹6.0L', achieved: '₹5.2L', percentage: 87 },
    { id: '4', name: 'Neha Joshi', target: '₹7.0L', achieved: '₹6.8L', percentage: 97 },
  ],
  pipelineStages: [
    { stage: 'Leads', count: 248, value: '₹12.4L', conversion: '100%' },
    { stage: 'Qualified', count: 126, value: '₹18.8L', conversion: '50.8%' },
    { stage: 'Proposal', count: 74, value: '₹14.2L', conversion: '29.8%' },
    { stage: 'Negotiation', count: 41, value: '₹9.5L', conversion: '16.5%' },
    { stage: 'Won', count: 28, value: '₹7.6L', conversion: '11.2%' },
  ],
  customerStats: {
    newCustomers: 96,
    activeCustomers: 1842,
    atRiskCustomers: 23,
    growth: '+7.4%',
  },
  recentOrders: [
    { id: '1', orderNumber: '#CH-20260811-3938', customerName: 'Sharma Electronics', date: '2026-08-11', amount: '₹42,500', status: 'Completed', assignedTo: 'Priya Patel' },
    { id: '2', orderNumber: '#CH-20260811-4012', customerName: 'Apex Hardware Mart', date: '2026-08-11', amount: '₹1,24,000', status: 'Processing', assignedTo: 'Aarav Shah' },
    { id: '3', orderNumber: '#CH-20260810-1842', customerName: 'Metro Industrial Supplies', date: '2026-08-10', amount: '₹88,900', status: 'Pending', assignedTo: 'Rahul Mehta' },
    { id: '4', orderNumber: '#CH-20260809-0092', customerName: 'Global Electricals', date: '2026-08-09', amount: '₹15,400', status: 'Cancelled', assignedTo: 'Neha Joshi' },
  ],
  teamTasks: {
    pending: 24,
    inProgress: 18,
    completed: 86,
    overdue: 5,
  },
  inventoryAlerts: [
    { id: '1', name: 'Laptop Pro 14', stock: 12, minStock: 25, category: 'Electronics' },
    { id: '2', name: 'Wireless Ergonomic Mouse', stock: 8, minStock: 30, category: 'Accessories' },
    { id: '3', name: 'Executive Office Chair', stock: 5, minStock: 15, category: 'Furniture' },
  ],
  operationalAlerts: [
    { id: '1', title: 'Low Inventory Alert', detail: 'Laptop Pro 14 has 12 units remaining', type: 'inventory' },
    { id: '2', title: 'Pending Approval', detail: 'Order #ORD-1048 requires manager sign-off', type: 'approval' },
    { id: '3', title: 'Overdue Task', detail: 'Follow up with Acme Corp is overdue', type: 'task' },
    { id: '4', title: 'Customer Risk', detail: '3 wholesale clients have no activity 30+ days', type: 'risk' },
  ],
  teamAvailability: {
    active: 32,
    remote: 8,
    onLeave: 3,
    unavailable: 1,
  },
};

export const fetchManagerDashboardOverview = async (): Promise<ManagerDashboardData> => {
  try {
    const [statsRes, custRes, prodRes, challanRes] = await Promise.allSettled([
      axiosClient.get('/dashboard/stats'),
      axiosClient.get('/customers?page=1&limit=5'),
      axiosClient.get('/products?lowStock=true'),
      axiosClient.get('/challans?page=1&limit=5'),
    ]);

    const data: ManagerDashboardData = { ...MOCK_MANAGER_DATA };

    if (statsRes.status === 'fulfilled' && statsRes.value.data) {
      data.kpis.customers.value = statsRes.value.data.customerCount.toLocaleString();
    }

    if (custRes.status === 'fulfilled' && custRes.value.data) {
      const totalCust = custRes.value.data.pagination?.total || 1842;
      data.kpis.customers.value = totalCust.toLocaleString();
    }

    if (prodRes.status === 'fulfilled' && prodRes.value.data?.data) {
      const lowStockProducts = prodRes.value.data.data;
      if (lowStockProducts.length > 0) {
        data.inventoryAlerts = lowStockProducts.map((p: any) => ({
          id: String(p.id),
          name: p.name,
          stock: p.currentStock,
          minStock: p.minimumStock,
          category: p.category,
        }));
      }
    }

    if (challanRes.status === 'fulfilled' && challanRes.value.data?.data) {
      const liveChallans = challanRes.value.data.data;
      if (liveChallans.length > 0) {
        data.recentOrders = liveChallans.map((ch: any) => ({
          id: String(ch.id),
          orderNumber: ch.challanNumber,
          customerName: ch.customer?.name || 'Wholesale Client',
          date: new Date(ch.createdAt).toISOString().slice(0, 10),
          amount: `₹${(ch.totalQuantity * 1250).toLocaleString()}`,
          status: ch.status === 'CONFIRMED' ? 'Completed' : ch.status === 'CANCELLED' ? 'Cancelled' : 'Processing',
          assignedTo: ch.createdBy?.name || 'Sales Representative',
        }));
      }
    }

    return data;
  } catch (error) {
    console.warn('Backend API fetch error, using fallback manager data:', error);
    return MOCK_MANAGER_DATA;
  }
};
