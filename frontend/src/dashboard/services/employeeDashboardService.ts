import { axiosClient } from '../../api/axiosClient';
import type { EmployeeDashboardData } from '../types/employeeDashboard.types';

const MOCK_EMPLOYEE_DATA: EmployeeDashboardData = {
  kpis: {
    myTasks: {
      title: 'My Tasks',
      value: '18',
      change: 'Assigned tasks',
      isPositive: true,
      timeframe: 'total active',
    },
    dueToday: {
      title: 'Due Today',
      value: '6',
      change: 'Tasks due today',
      isPositive: true,
      timeframe: 'urgent focus',
    },
    completed: {
      title: 'Completed',
      value: '42',
      change: '+12%',
      isPositive: true,
      timeframe: 'this month',
    },
    overdue: {
      title: 'Overdue',
      value: '2',
      change: 'Needs attention',
      isPositive: false,
      timeframe: 'critical delay',
    },
  },
  priorities: [
    { id: '1', time: '09:30 AM', title: 'Follow up with Acme Corporation', category: 'Customer follow-up', status: 'In Progress' },
    { id: '2', time: '11:00 AM', title: 'Process Order #CH-20260811-3938', category: 'Order processing', status: 'Pending' },
    { id: '3', time: '01:30 PM', title: 'Update customer contact information', category: 'CRM task', status: 'Pending' },
    { id: '4', time: '03:00 PM', title: 'Submit daily operations report', category: 'Reporting task', status: 'Pending' },
  ],
  tasks: [
    { id: '1', title: 'Verify GST invoice for Apex Hardware', type: 'Accounts', priority: 'High', dueDate: 'Today', status: 'In Progress', assignedBy: 'Priya Patel' },
    { id: '2', title: 'Audit Stock Movement IN #58', type: 'Inventory', priority: 'Medium', dueDate: 'Today', status: 'Pending', assignedBy: 'Warehouse Manager' },
    { id: '3', title: 'Confirm Delivery Challan #CH-4012', type: 'Sales Ops', priority: 'Critical', dueDate: 'Today', status: 'Overdue', assignedBy: 'Aarav Shah' },
    { id: '4', title: 'Reconcile July Accounts Ledger', type: 'Finance', priority: 'High', dueDate: 'Tomorrow', status: 'Pending', assignedBy: 'Priya Patel' },
    { id: '5', title: 'Update Product Minimum Stock Alerts', type: 'Catalog', priority: 'Low', dueDate: '2026-08-15', status: 'Completed', assignedBy: 'Admin User' },
  ],
  taskSummary: {
    pending: 8,
    inProgress: 5,
    completed: 42,
    overdue: 2,
  },
  progress: {
    completed: 42,
    total: 52,
    percentage: 80.8,
  },
  customers: [
    { id: '1', name: 'Sharma Electronics', company: 'Sharma Wholesale Ltd', lastActivity: '2 hours ago', nextFollowUp: 'Today 2:00 PM', status: 'Active' },
    { id: '2', name: 'Apex Hardware Mart', company: 'Apex Traders', lastActivity: 'Yesterday', nextFollowUp: 'Tomorrow', status: 'Follow-up' },
    { id: '3', name: 'Metro Industrial Supplies', company: 'Metro Corp', lastActivity: '3 days ago', nextFollowUp: 'Overdue', status: 'At Risk' },
  ],
  orders: [
    { id: '1', orderNumber: '#CH-20260811-3938', customerName: 'Sharma Electronics', date: '2026-08-11', amount: '₹42,500', status: 'Completed', assignedTo: 'You' },
    { id: '2', orderNumber: '#CH-20260811-4012', customerName: 'Apex Hardware Mart', date: '2026-08-11', amount: '₹1,24,000', status: 'Processing', assignedTo: 'You' },
  ],
  schedule: [
    { id: '1', time: '10:30 AM', title: 'Customer Call', subtitle: 'Acme Corporation' },
    { id: '2', time: '01:00 PM', title: 'Team Sync Meeting', subtitle: 'Operations & Accounts' },
    { id: '3', time: '03:30 PM', title: 'Order Review', subtitle: 'Challan #CH-20260811-3938' },
  ],
  profile: {
    name: 'Rahul Mehta',
    employeeId: 'EMP-1042',
    department: 'Operations & Accounts',
    designation: 'Operations Associate',
    manager: 'Priya Patel',
    joiningDate: 'Jan 15, 2025',
  },
};

export const fetchEmployeeDashboardOverview = async (): Promise<EmployeeDashboardData> => {
  try {
    const [cRes, chRes] = await Promise.allSettled([
      axiosClient.get('/customers?page=1&limit=5'),
      axiosClient.get('/challans?page=1&limit=5'),
    ]);

    const data: EmployeeDashboardData = { ...MOCK_EMPLOYEE_DATA };

    if (cRes.status === 'fulfilled' && cRes.value.data?.data) {
      const liveCustomers = cRes.value.data.data;
      if (liveCustomers.length > 0) {
        data.customers = liveCustomers.slice(0, 3).map((c: any) => ({
          id: String(c.id),
          name: c.name,
          company: c.businessName || 'Business Client',
          lastActivity: '1 hour ago',
          nextFollowUp: c.followUpDate ? new Date(c.followUpDate).toISOString().slice(0, 10) : 'Today',
          status: c.status === 'ACTIVE' ? 'Active' : 'Follow-up',
        }));
      }
    }

    if (chRes.status === 'fulfilled' && chRes.value.data?.data) {
      const liveChallans = chRes.value.data.data;
      if (liveChallans.length > 0) {
        data.orders = liveChallans.map((ch: any) => ({
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
    console.warn('Backend API fetch error, using fallback employee data:', error);
    return MOCK_EMPLOYEE_DATA;
  }
};
