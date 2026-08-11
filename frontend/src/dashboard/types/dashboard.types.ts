export interface KpiData {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  timeframe: string;
}

export interface ChartDataPoint {
  label: string;
  revenue: number;
  orders: number;
}

export interface RevenueCategory {
  name: string;
  percentage: number;
  amount: string;
  color: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  time: string;
  type: 'order' | 'customer' | 'stock' | 'employee' | 'deal';
}

export interface OrderRow {
  id: string;
  orderNumber: string;
  customerName: string;
  date: string;
  amount: string;
  status: 'Completed' | 'Processing' | 'Pending' | 'Cancelled';
  assignedTo: string;
}

export interface InventoryAlertItem {
  id: string;
  name: string;
  stock: number;
  minStock: number;
  category: string;
}

export interface EmployeeStats {
  total: number;
  active: number;
  onLeave: number;
  inactive: number;
}

export interface CustomerStats {
  newCustomers: number;
  activeCustomers: number;
  leads: number;
  conversionRate: string;
}

export interface DashboardOverviewData {
  kpis: {
    revenue: KpiData;
    customers: KpiData;
    orders: KpiData;
    employees: KpiData;
  };
  chartData: ChartDataPoint[];
  revenueBreakdown: RevenueCategory[];
  recentActivity: ActivityItem[];
  recentOrders: OrderRow[];
  inventoryAlerts: InventoryAlertItem[];
  customerStats: CustomerStats;
  employeeStats: EmployeeStats;
}
