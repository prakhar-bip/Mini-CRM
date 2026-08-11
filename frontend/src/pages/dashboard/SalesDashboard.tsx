import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from '../../dashboard/components/Sidebar';
import { Topbar } from '../../dashboard/components/Topbar';
import { KpiCard } from '../../dashboard/components/KpiCard';
import { SalesChart } from '../../dashboard/components/SalesChart';
import { SalesTargetCard } from '../../dashboard/components/SalesTargetCard';
import { SalesPipelineCard } from '../../dashboard/components/SalesPipelineCard';
import { LeadFunnelCard } from '../../dashboard/components/LeadFunnelCard';
import { MyLeadsTable } from '../../dashboard/components/MyLeadsTable';
import { FollowUpsCard } from '../../dashboard/components/FollowUpsCard';
import { PriorityOpportunitiesTable } from '../../dashboard/components/PriorityOpportunitiesTable';
import { SalesActivityFeed } from '../../dashboard/components/SalesActivityFeed';
import { QuickActions } from '../../dashboard/components/QuickActions';
import { fetchSalesDashboardOverview } from '../../dashboard/services/salesDashboardService';
import type { SalesDashboardData } from '../../dashboard/types/salesDashboard.types';

import {
  TrendingUp,
  Target,
  Briefcase,
  CheckCircle2,
  Plus,
  ChevronDown,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

import { CustomersView } from '../../dashboard/views/CustomersView';
import { ProductsView } from '../../dashboard/views/ProductsView';
import { InventoryView } from '../../dashboard/views/InventoryView';
import { ChallansView } from '../../dashboard/views/ChallansView';
import { ReportsView } from '../../dashboard/views/ReportsView';
import { SettingsView } from '../../dashboard/views/SettingsView';

export const SalesDashboard: React.FC = () => {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showCreateDropdown, setShowCreateDropdown] = useState(false);
  const [autoOpenModal, setAutoOpenModal] = useState(false);

  const [data, setData] = useState<SalesDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchSalesDashboardOverview();
      setData(res);
    } catch (err: any) {
      setError('Unable to load sales workspace data. Please try again.');
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

  const handleNavSelect = (key: string) => {
    setAutoOpenModal(false);
    setActiveNav(key);
  };

  const handleQuickAction = (key: string) => {
    setShowCreateDropdown(false);
    setAutoOpenModal(true);
    if (key === 'add_lead' || key === 'add_customer') setActiveNav('customers');
    else if (key === 'create_deal' || key === 'create_opportunity') setActiveNav('orders');
    else alert(`Sales Action: ${key.toUpperCase().replace('_', ' ')}`);
  };

  const renderNavContent = () => {
    switch (activeNav) {
      case 'customers':
      case 'leads':
      case 'opportunities':
        return <CustomersView autoOpenAdd={autoOpenModal} />;
      case 'products':
        return <ProductsView autoOpenAdd={autoOpenModal} />;
      case 'inventory':
        return <InventoryView autoOpenAdd={autoOpenModal} />;
      case 'orders':
      case 'sales':
      case 'deals':
        return <ChallansView autoOpenAdd={autoOpenModal} />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return (
          <div style={styles.container}>
            {/* Header */}
            <div style={styles.pageHeader}>
              <div>
                <span style={styles.eyebrow}>SALES OVERVIEW</span>
                <h1 style={styles.heading}>Good morning, Sales</h1>
                <p style={styles.subheading}>
                  Track your pipeline, customers, deals, and sales performance from one workspace.
                </p>
              </div>

              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowCreateDropdown(!showCreateDropdown)}
                  style={styles.createBtn}
                >
                  <Plus size={16} />
                  <span>+ Add New</span>
                  <ChevronDown size={14} />
                </button>

                {showCreateDropdown && (
                  <div style={styles.createDropdown}>
                    <button
                      onClick={() => handleQuickAction('add_lead')}
                      style={styles.createItem}
                    >
                      + Add Customer/Lead
                    </button>
                    <button
                      onClick={() => handleQuickAction('create_deal')}
                      style={styles.createItem}
                    >
                      + Create Challan
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

            {/* 1. Four Primary Sales KPI Cards */}
            <div style={styles.kpiGrid}>
              <KpiCard
                data={data?.kpis.revenue}
                icon={<TrendingUp size={18} color="#5B90E5" />}
                loading={loading}
              />
              <KpiCard
                data={data?.kpis.pipeline}
                icon={<Target size={18} color="#5B90E5" />}
                loading={loading}
              />
              <KpiCard
                data={data?.kpis.openDeals}
                icon={<Briefcase size={18} color="#5B90E5" />}
                loading={loading}
              />
              <KpiCard
                data={data?.kpis.winRate}
                icon={<CheckCircle2 size={18} color="#45C98A" />}
                loading={loading}
              />
            </div>

            {/* 2. Target Progress & Revenue Performance Trend Split */}
            <div style={styles.middleRow}>
              <div style={{ flex: 1 }}>
                <SalesTargetCard targetInfo={data?.target} loading={loading} />
              </div>
              <div style={{ flex: 1.2 }}>
                <SalesChart data={data?.revenueTrend} loading={loading} />
              </div>
            </div>

            {/* 3. Sales Pipeline Funnel & Lead Conversion Split */}
            <div style={styles.middleRow}>
              <div style={{ flex: 1.2 }}>
                <SalesPipelineCard stages={data?.pipelineStages} loading={loading} />
              </div>
              <div style={{ flex: 1 }}>
                <LeadFunnelCard steps={data?.funnelSteps} loading={loading} />
              </div>
            </div>

            {/* 4. My Leads Directory Table */}
            <div style={styles.sectionMargin}>
              <MyLeadsTable leads={data?.leads} loading={loading} />
            </div>

            {/* 5. Priority Opportunities & Follow-ups Split Row */}
            <div style={styles.middleRow}>
              <div style={{ flex: 1.3 }}>
                <PriorityOpportunitiesTable opportunities={data?.opportunities} loading={loading} />
              </div>
              <div style={{ flex: 1 }}>
                <FollowUpsCard items={data?.followUps} loading={loading} />
              </div>
            </div>

            {/* 6. Recent Sales Activity & Quick Actions */}
            <div style={styles.middleRow}>
              <div style={{ flex: 1 }}>
                <SalesActivityFeed activities={data?.recentActivities} loading={loading} />
              </div>
              <div style={{ flex: 1 }}>
                <QuickActions onActionClick={handleQuickAction} />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div style={styles.dashboardRoot}>
      {/* Shared Sidebar Navigation */}
      <Sidebar
        activeNav={activeNav}
        onNavSelect={handleNavSelect}
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

        <main style={styles.contentArea}>{renderNavContent()}</main>
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
