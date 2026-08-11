import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from '../../dashboard/components/Sidebar';
import { Topbar } from '../../dashboard/components/Topbar';
import { KpiCard } from '../../dashboard/components/KpiCard';
import { TodaysPrioritiesCard } from '../../dashboard/components/TodaysPrioritiesCard';
import { MyTasksTable } from '../../dashboard/components/MyTasksTable';
import { WorkProgressCard } from '../../dashboard/components/WorkProgressCard';
import { UpcomingScheduleCard } from '../../dashboard/components/UpcomingScheduleCard';
import { EmployeeProfileCard } from '../../dashboard/components/EmployeeProfileCard';
import { OrdersTable } from '../../dashboard/components/OrdersTable';
import { QuickActions } from '../../dashboard/components/QuickActions';
import { fetchEmployeeDashboardOverview } from '../../dashboard/services/employeeDashboardService';
import type { EmployeeDashboardData } from '../../dashboard/types/employeeDashboard.types';
import { useAuth } from '../../auth/authContext';

import {
  CheckSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  ChevronDown,
  RefreshCw,
} from 'lucide-react';

export const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeNav, setActiveNav] = useState('dashboard');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showCreateDropdown, setShowCreateDropdown] = useState(false);

  const [data, setData] = useState<EmployeeDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchEmployeeDashboardOverview();
      setData(res);
    } catch (err: any) {
      setError('Unable to load employee workspace data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    loadData();
  }, [theme, loadData]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleQuickAction = (key: string) => {
    setShowCreateDropdown(false);
    alert(`Employee Action: ${key.toUpperCase().replace('_', ' ')}`);
  };

  const firstName = user?.name ? user.name.split(' ')[0] : 'Employee';

  return (
    <div style={styles.dashboardRoot}>
      {/* Shared Sidebar Navigation */}
      <Sidebar
        activeNav={activeNav}
        onNavSelect={setActiveNav}
        theme={theme}
        toggleTheme={toggleTheme}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div style={styles.mainWrapper}>
        <Topbar
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />

        <main style={styles.contentArea}>
          <div style={styles.container}>
            {/* Header */}
            <div style={styles.pageHeader}>
              <div>
                <span style={styles.eyebrow}>MY WORKSPACE</span>
                <h1 style={styles.heading}>Good morning, {firstName}</h1>
                <p style={styles.subheading}>Here's what you need to focus on today.</p>
              </div>

              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowCreateDropdown(!showCreateDropdown)}
                  style={styles.createBtn}
                >
                  <Plus size={16} />
                  <span>+ New Task</span>
                  <ChevronDown size={14} />
                </button>

                {showCreateDropdown && (
                  <div style={styles.createDropdown}>
                    <button
                      onClick={() => handleQuickAction('add_activity')}
                      style={styles.createItem}
                    >
                      + Add Activity
                    </button>
                    <button
                      onClick={() => handleQuickAction('view_schedule')}
                      style={styles.createItem}
                    >
                      View Schedule
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Error Handling State */}
            {error && (
              <div style={styles.errorBox}>
                <AlertCircle size={18} color="#E76576" />
                <span style={{ color: '#E76576', fontWeight: 600 }}>{error}</span>
                <button onClick={loadData} style={styles.retryBtn}>
                  <RefreshCw size={14} />
                  <span>Retry</span>
                </button>
              </div>
            )}

            {/* 1. Four Employee Personal KPI Cards */}
            <div style={styles.kpiGrid}>
              <KpiCard
                data={data?.kpis.myTasks}
                icon={<CheckSquare size={18} color="#5B90E5" />}
                loading={loading}
              />
              <KpiCard
                data={data?.kpis.dueToday}
                icon={<Clock size={18} color="#5B90E5" />}
                loading={loading}
              />
              <KpiCard
                data={data?.kpis.completed}
                icon={<CheckCircle2 size={18} color="#45C98A" />}
                loading={loading}
              />
              <KpiCard
                data={data?.kpis.overdue}
                icon={<AlertCircle size={18} color="#E76576" />}
                loading={loading}
              />
            </div>

            {/* 2. Today's Priorities & Work Progress Split */}
            <div style={styles.middleRow}>
              <div style={{ flex: 1.3 }}>
                <TodaysPrioritiesCard items={data?.priorities} loading={loading} />
              </div>
              <div style={{ flex: 1 }}>
                <WorkProgressCard progress={data?.progress} loading={loading} />
              </div>
            </div>

            {/* 3. My Tasks Directory Table */}
            <div style={styles.sectionMargin}>
              <MyTasksTable tasks={data?.tasks} loading={loading} />
            </div>

            {/* 4. Upcoming Schedule & Employee Profile Split */}
            <div style={styles.middleRow}>
              <div style={{ flex: 1 }}>
                <UpcomingScheduleCard events={data?.schedule} loading={loading} />
              </div>
              <div style={{ flex: 1 }}>
                <EmployeeProfileCard profile={data?.profile} loading={loading} />
              </div>
            </div>

            {/* 5. Assigned Orders Table & Quick Actions */}
            <div style={styles.sectionMargin}>
              <OrdersTable orders={data?.orders} loading={loading} />
            </div>

            <div style={styles.sectionMargin}>
              <QuickActions onActionClick={handleQuickAction} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  dashboardRoot: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: 'var(--bg-main)',
    color: 'var(--text-main)',
  },
  mainWrapper: {
    flex: 1,
    marginLeft: '250px',
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  contentArea: {
    flex: 1,
    padding: '32px 24px 60px 24px',
    backgroundColor: 'var(--bg-section)',
    transition: 'background-color 0.25s ease',
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '16px',
  },
  eyebrow: {
    fontSize: '0.75rem',
    fontWeight: 800,
    color: '#5B90E5',
    letterSpacing: '0.08em',
  },
  heading: {
    fontSize: '2rem',
    fontWeight: 800,
    color: 'var(--text-main)',
    margin: '4px 0 6px 0',
  },
  subheading: {
    fontSize: '0.95rem',
    color: 'var(--text-sub)',
  },
  createBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 18px',
    backgroundColor: '#5B90E5',
    color: '#FFFFFF',
    borderRadius: '10px',
    fontWeight: 700,
    fontSize: '0.9rem',
    boxShadow: '0 4px 12px rgba(91, 144, 229, 0.25)',
  },
  createDropdown: {
    position: 'absolute',
    top: '48px',
    right: 0,
    width: '180px',
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '10px',
    boxShadow: 'var(--shadow-modal)',
    padding: '6px',
    zIndex: 100,
    display: 'flex',
    flexDirection: 'column',
  },
  createItem: {
    padding: '10px 12px',
    backgroundColor: 'transparent',
    color: 'var(--text-main)',
    fontSize: '0.85rem',
    fontWeight: 600,
    textAlign: 'left',
    borderRadius: '6px',
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    backgroundColor: '#FEF2F2',
    border: '1px solid #FCA5A5',
    borderRadius: '10px',
    fontSize: '0.875rem',
  },
  retryBtn: {
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    backgroundColor: '#E76576',
    color: '#FFFFFF',
    borderRadius: '6px',
    fontWeight: 700,
    fontSize: '0.8rem',
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
  },
  middleRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  sectionMargin: {
    width: '100%',
  },
};
