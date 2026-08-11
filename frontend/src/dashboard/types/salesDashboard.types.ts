import type { KpiData, ChartDataPoint, OrderRow } from './dashboard.types';
import type { PipelineStage } from './managerDashboard.types';

export interface SalesTargetInfo {
  targetAmount: number;
  targetFormatted: string;
  achievedAmount: number;
  achievedFormatted: string;
  remainingFormatted: string;
  percentage: number;
  daysRemaining: number;
}

export interface FunnelStep {
  stage: string;
  count: number;
  conversionRate?: string;
}

export interface LeadRow {
  id: string;
  name: string;
  company: string;
  source: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Nurturing' | 'Converted' | 'Lost';
  value: string;
  lastContact: string;
  nextFollowUp: string;
}

export interface PriorityOpportunityRow {
  id: string;
  title: string;
  customerName: string;
  value: string;
  stage: string;
  probability: number;
  expectedClose: string;
}

export interface FollowUpItem {
  id: string;
  customerName: string;
  activityType: string;
  time: string;
  completed: boolean;
}

export interface SalesActivityItem {
  id: string;
  title: string;
  company: string;
  time: string;
  type: 'opportunity' | 'lead' | 'proposal' | 'deal';
}

export interface PerformanceMetrics {
  calls: number;
  meetings: number;
  emails: number;
  proposals: number;
  dealsWon: number;
}

export interface SalesDashboardData {
  kpis: {
    revenue: KpiData;
    pipeline: KpiData;
    openDeals: KpiData;
    winRate: KpiData;
  };
  target: SalesTargetInfo;
  revenueTrend: ChartDataPoint[];
  pipelineStages: PipelineStage[];
  funnelSteps: FunnelStep[];
  leads: LeadRow[];
  followUps: FollowUpItem[];
  opportunities: PriorityOpportunityRow[];
  recentOrders: OrderRow[];
  recentActivities: SalesActivityItem[];
  performance: PerformanceMetrics;
}
