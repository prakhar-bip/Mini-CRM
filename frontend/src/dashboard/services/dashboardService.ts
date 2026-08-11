import { axiosClient } from '../../api/axiosClient';
import type { DashboardOverviewData } from '../types/dashboard.types';

const MOCK_FALLBACK_DATA: DashboardOverviewData = {
  kpis: {
    revenue: {
      title: 'Total Revenue',
      value: '₹24.8L',
      change: '+12.5%',
      isPositive: true,
      timeframe: 'vs last month',
    },
    customers: {
      title: 'Total Customers',
      value: '2,480',
      change: '+8.2%',
      isPositive: true,
      timeframe: 'vs last month',
    },
    orders: {
      title: 'Total Orders',
      value: '1,284',
      change: '+5.7%',
      isPositive: true,
      timeframe: 'vs last month',
    },
    employees: {
      title: 'Active Employees',
      value: '186',
      change: '+3.4%',
      isPositive: true,
      timeframe: 'vs last month',
    },
  },
  chartData: [
    { label: 'Jan', revenue: 1840000, orders: 340 },
    { label: 'Feb', revenue: 2100000, orders: 410 },
    { label: 'Mar', revenue: 2480000, orders: 462 },
    { label: 'Apr', revenue: 2250000, orders: 420 },
    { label: 'May', revenue: 2680000, orders: 490 },
    { label: 'Jun', revenue: 2950000, orders: 530 },
  ],
  revenueBreakdown: [
    { name: 'Product Sales', percentage: 62, amount: '₹15.37L', color: '#5B90E5' },
    { name: 'Services', percentage: 22, amount: '₹5.45L', color: '#446091' },
    { name: 'Subscriptions', percentage: 10, amount: '₹2.48L', color: '#9DC0F7' },
    { name: 'Other', percentage: 6, amount: '₹1.48L', color: '#D2D9E7' },
  ],
  recentActivity: [
    { id: '1', title: 'New customer Sharma Electronics registered', time: '2 minutes ago', type: 'customer' },
    { id: '2', title: 'Sales Challan #CH-20260811-3938 confirmed', time: '18 minutes ago', type: 'order' },
    { id: '3', title: 'Stock IN (+50 Copper Wire) logged by Warehouse', time: '42 minutes ago', type: 'stock' },
    { id: '4', title: 'New Sales Manager account verified', time: '1 hour ago', type: 'employee' },
    { id: '5', title: 'Distributor Deal marked as Won', time: '2 hours ago', type: 'deal' },
  ],
  recentOrders: [
    { id: '1', orderNumber: '#CH-20260811-3938', customerName: 'Sharma Electronics', date: '2026-08-11', amount: '₹42,500', status: 'Completed', assignedTo: 'Sales Team' },
    { id: '2', orderNumber: '#CH-20260811-4012', customerName: 'Apex Hardware Mart', date: '2026-08-11', amount: '₹1,24,000', status: 'Processing', assignedTo: 'Warehouse Manager' },
    { id: '3', orderNumber: '#CH-20260810-1842', customerName: 'Metro Industrial Supplies', date: '2026-08-10', amount: '₹88,900', status: 'Pending', assignedTo: 'Accounts' },
    { id: '4', orderNumber: '#CH-20260809-0092', customerName: 'Global Electricals', date: '2026-08-09', amount: '₹15,400', status: 'Cancelled', assignedTo: 'Sales Team' },
  ],
  inventoryAlerts: [
    { id: '1', name: 'Industrial Copper Wire 10mm', stock: 5, minStock: 20, category: 'Electrical' },
    { id: '2', name: 'Heavy Duty Steel Pipe 2 inch', stock: 2, minStock: 15, category: 'Pipes' },
    { id: '3', name: 'Solar Inverter 5kVA', stock: 3, minStock: 5, category: 'Inverters' },
  ],
  customerStats: {
    newCustomers: 124,
    activeCustomers: 2031,
    leads: 386,
    conversionRate: '32.8%',
  },
  employeeStats: {
    total: 186,
    active: 171,
    onLeave: 9,
    inactive: 6,
  },
};

export const fetchDashboardOverview = async (): Promise<DashboardOverviewData> => {
  try {
    const [statsRes, custRes, prodRes, challanRes] = await Promise.allSettled([
      axiosClient.get('/dashboard/stats'),
      axiosClient.get('/customers?page=1&limit=5'),
      axiosClient.get('/products?lowStock=true'),
      axiosClient.get('/challans?page=1&limit=5'),
    ]);

    const data: DashboardOverviewData = { ...MOCK_FALLBACK_DATA };

    if (statsRes.status === 'fulfilled' && statsRes.value.data) {
      const stats = statsRes.value.data;
      data.kpis.customers.value = stats.customerCount.toLocaleString();
      data.kpis.orders.value = stats.challanCount.toLocaleString();
      data.customerStats.activeCustomers = stats.activeCustomerCount;
      data.customerStats.leads = stats.leadCount;
    } else if (custRes.status === 'fulfilled' && custRes.value.data) {
      const totalCust = custRes.value.data.pagination?.total || 0;
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
          assignedTo: ch.createdBy?.name || 'Sales User',
        }));
      }
    }

    return data;
  } catch (error) {
    console.warn('Backend API fetch error, using fallback dashboard data:', error);
    return MOCK_FALLBACK_DATA;
  }
};
