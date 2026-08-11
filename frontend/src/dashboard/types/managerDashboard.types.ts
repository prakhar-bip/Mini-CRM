import type { KpiData, ChartDataPoint, OrderRow, InventoryAlertItem } from './dashboard.types';

export interface TeamMemberPerformance {
  id: string;
  name: string;
  target: string;
  achieved: string;
  percentage: number;
}

export interface PipelineStage {
  stage: 'Leads' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Won';
  count: number;
  value: string;
  conversion: string;
}

export interface ManagerCustomerStats {
  newCustomers: number;
  activeCustomers: number;
  atRiskCustomers: number;
  growth: string;
}

export interface TeamTasksStats {
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
}

export interface TeamAvailabilityStats {
  active: number;
  remote: number;
  onLeave: number;
  unavailable: number;
}

export interface OperationalAlert {
  id: string;
  title: string;
  detail: string;
  type: 'inventory' | 'approval' | 'task' | 'risk';
}

export interface ManagerDashboardData {
  kpis: {
    revenue: KpiData;
    pipeline: KpiData;
    customers: KpiData;
    teamPerformance: KpiData;
  };
  salesTrend: ChartDataPoint[];
  teamMembers: TeamMemberPerformance[];
  pipelineStages: PipelineStage[];
  customerStats: ManagerCustomerStats;
  recentOrders: OrderRow[];
  teamTasks: TeamTasksStats;
  inventoryAlerts: InventoryAlertItem[];
  operationalAlerts: OperationalAlert[];
  teamAvailability: TeamAvailabilityStats;
}
