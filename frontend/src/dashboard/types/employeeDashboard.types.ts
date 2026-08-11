import type { KpiData, OrderRow } from './dashboard.types';

export interface PriorityTaskItem {
  id: string;
  time: string;
  title: string;
  category: string;
  status: 'Pending' | 'In Progress' | 'Completed';
}

export interface TaskRow {
  id: string;
  title: string;
  type: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  dueDate: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Overdue';
  assignedBy: string;
}

export interface TaskSummaryStats {
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
}

export interface WorkProgressStats {
  completed: number;
  total: number;
  percentage: number;
}

export interface AssignedCustomerRow {
  id: string;
  name: string;
  company: string;
  lastActivity: string;
  nextFollowUp: string;
  status: 'Active' | 'Follow-up' | 'At Risk';
}

export interface ScheduleEvent {
  id: string;
  time: string;
  title: string;
  subtitle: string;
}

export interface EmployeeProfileInfo {
  name: string;
  employeeId: string;
  department: string;
  designation: string;
  manager: string;
  joiningDate: string;
}

export interface EmployeeDashboardData {
  kpis: {
    myTasks: KpiData;
    dueToday: KpiData;
    completed: KpiData;
    overdue: KpiData;
  };
  priorities: PriorityTaskItem[];
  tasks: TaskRow[];
  taskSummary: TaskSummaryStats;
  progress: WorkProgressStats;
  customers: AssignedCustomerRow[];
  orders: OrderRow[];
  schedule: ScheduleEvent[];
  profile: EmployeeProfileInfo;
}
