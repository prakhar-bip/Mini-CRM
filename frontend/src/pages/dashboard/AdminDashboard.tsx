import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../dashboard/components/Sidebar';
import { Topbar } from '../../dashboard/components/Topbar';
import { KpiCard } from '../../dashboard/components/KpiCard';
import { SalesChart } from '../../dashboard/components/SalesChart';
import { RevenueBreakdown } from '../../dashboard/components/RevenueBreakdown';
import { RecentActivity } from '../../dashboard/components/RecentActivity';
import { OrdersTable } from '../../dashboard/components/OrdersTable';
import { CustomerOverview } from '../../dashboard/components/CustomerOverview';
import { InventoryAlert } from '../../dashboard/components/InventoryAlert';
import { EmployeeSummary } from '../../dashboard/components/EmployeeSummary';
import { QuickActions } from '../../dashboard/components/QuickActions';
import { useDashboardData } from '../../dashboard/hooks/useDashboardData';

import {
  TrendingUp,
  Users,
  ShoppingCart,
  Briefcase,
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
import { UsersView } from '../../dashboard/views/UsersView';
import { SettingsView } from '../../dashboard/views/SettingsView';

export const AdminDashboard: React.FC = () => {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showCreateDropdown, setShowCreateDropdown] = useState(false);
  const [autoOpenModal, setAutoOpenModal] = useState(false);

  const { data, loading, error, retry } = useDashboardData();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

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
    if (key === 'add_customer') setActiveNav('customers');
    else if (key === 'add_product') setActiveNav('products');
    else if (key === 'create_order') setActiveNav('orders');
    else if (key === 'stock_adjust') setActiveNav('inventory');
    else alert(`Triggered Quick Action: ${key.toUpperCase().replace('_', ' ')}`);
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
      case 'users':
      case 'rbac':
      case 'employees':
        return <UsersView />;
      case 'settings':
        return <SettingsView />;
      default:
        return (
          <div style={styles.container}>
            {/* Page Header */}
            <div style={styles.pageHeader}>
              <div>
                <span style={styles.eyebrow}>OVERVIEW</span>
                <h1 style={styles.heading}>Good morning, Admin</h1>
                <p style={styles.subheading}>
                  Here's what's happening across your wholesale business operations today.
                </p>
              </div>

              {/* Create New Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowCreateDropdown(!showCreateDropdown)}
                  style={styles.createBtn}
                >
                  <Plus size={16} />
                  <span>+ Create New</span>
                  <ChevronDown size={14} />
                </button>

                {showCreateDropdown && (
                  <div style={styles.createDropdown}>
                    <button
                      onClick={() => handleQuickAction('add_customer')}
                      style={styles.createItem}
                    >
                      + Add Customer
                    </button>
                    <button
                      onClick={() => handleQuickAction('create_order')}
                      style={styles.createItem}
                    >
                      + Create Challan
                    </button>
                    <button
                      onClick={() => handleQuickAction('add_product')}
                      style={styles.createItem}
                    >
                      + Add Product
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Error State Banner */}
            {error && (
              <div style={styles.errorBox}>
                <AlertCircle size={18} color="#E76576" />
                <span style={{ color: '#E76576', fontWeight: 600 }}>{error}</span>
                <button onClick={retry} style={styles.retryBtn}>
                  <RefreshCw size={14} />
                  <span>Retry</span>
                </button>
              </div>
            )}

            {/* 1. Four Primary KPI Cards Grid */}
            <div style={styles.kpiGrid}>
              <KpiCard
                data={data?.kpis.revenue}
                icon={<TrendingUp size={18} color="#5B90E5" />}
                loading={loading}
              />
              <KpiCard
                data={data?.kpis.customers}
                icon={<Users size={18} color="#5B90E5" />}
                loading={loading}
              />
              <KpiCard
                data={data?.kpis.orders}
                icon={<ShoppingCart size={18} color="#5B90E5" />}
                loading={loading}
              />
              <KpiCard
                data={data?.kpis.employees}
                icon={<Briefcase size={18} color="#5B90E5" />}
                loading={loading}
              />
            </div>

            {/* 2. Charts & Analytics Split Row */}
            <div style={styles.chartRow}>
              <div style={styles.salesChartCol}>
                <SalesChart data={data?.chartData} loading={loading} />
              </div>
              <div style={styles.breakdownCol}>
                <RevenueBreakdown categories={data?.revenueBreakdown} loading={loading} />
              </div>
            </div>

            {/* 3. Recent Activity & Customer Overview Row */}
            <div style={styles.middleRow}>
              <div style={{ flex: 1 }}>
                <RecentActivity activities={data?.recentActivity} loading={loading} />
              </div>
              <div style={{ flex: 1 }}>
                <CustomerOverview stats={data?.customerStats} loading={loading} />
              </div>
            </div>

            {/* 4. Orders Data Table */}
            <div style={styles.sectionMargin}>
              <OrdersTable orders={data?.recentOrders} loading={loading} />
            </div>

            {/* 5. Inventory Alert & Employee Summary Split */}
            <div style={styles.bottomSplitRow}>
              <div style={{ flex: 1.2 }}>
                <InventoryAlert
                  alerts={data?.inventoryAlerts}
                  loading={loading}
                  onViewInventory={() => setActiveNav('inventory')}
                />
              </div>
              <div style={{ flex: 1 }}>
                <EmployeeSummary stats={data?.employeeStats} loading={loading} />
              </div>
            </div>

            {/* 6. Quick Actions Footer Section */}
            <div style={styles.sectionMargin}>
              <QuickActions onActionClick={handleQuickAction} />
            </div>
          </div>
        );
    }
  };

  return (
    <div style={styles.dashboardRoot}>
      {/* Sidebar Navigation */}
      <Sidebar
        activeNav={activeNav}
        onNavSelect={handleNavSelect}
        theme={theme}
        toggleTheme={toggleTheme}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Layout Area */}
      <div style={styles.mainWrapper}>
        {/* Top Header Navigation Bar */}
        <Topbar
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />

        {/* Scrollable Main Content */}
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
    transition: 'margin-left 0.3s ease',
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
  chartRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '20px',
  },
  salesChartCol: {
    width: '100%',
  },
  breakdownCol: {
    width: '100%',
  },
  middleRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  sectionMargin: {
    width: '100%',
  },
  bottomSplitRow: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr',
    gap: '20px',
  },
};
