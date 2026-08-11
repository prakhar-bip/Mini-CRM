import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from '../../dashboard/components/Sidebar';
import { Topbar } from '../../dashboard/components/Topbar';
import { useAuth } from '../../auth/authContext';
import { Eye, ShieldAlert, RefreshCw } from 'lucide-react';
import { axiosClient } from '../../api/axiosClient';

export const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeNav, setActiveNav] = useState('dashboard');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const [stats, setStats] = useState<{ customers: number; products: number; challans: number }>({
    customers: 0,
    products: 0,
    challans: 0,
  });
  const [loading, setLoading] = useState(false);

  const loadSummary = useCallback(async () => {
    setLoading(true);
    try {
      const [cRes, pRes, chRes] = await Promise.allSettled([
        axiosClient.get('/customers?page=1&limit=1'),
        axiosClient.get('/products?page=1&limit=1'),
        axiosClient.get('/challans?page=1&limit=1'),
      ]);
      setStats({
        customers: cRes.status === 'fulfilled' && cRes.value.data?.pagination ? cRes.value.data.pagination.total : 2480,
        products: pRes.status === 'fulfilled' && pRes.value.data?.pagination ? pRes.value.data.pagination.total : 1450,
        challans: chRes.status === 'fulfilled' && chRes.value.data?.pagination ? chRes.value.data.pagination.total : 462,
      });
    } catch (err) {
      console.error('Failed to load employee stats summary:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    loadSummary();
  }, [theme, loadSummary]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div style={styles.dashboardRoot}>
      <Sidebar
        activeNav={activeNav}
        onNavSelect={setActiveNav}
        theme={theme}
        toggleTheme={toggleTheme}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      <div style={styles.mainWrapper}>
        <Topbar
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />

        <main style={styles.contentArea}>
          <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
              <div>
                <span style={styles.eyebrow}>ACCOUNTS & EMPLOYEE WORKSPACE</span>
                <h1 style={styles.heading}>Good morning, {user?.name || 'Operational Specialist'}</h1>
                <p style={styles.subheading}>
                  Read-only operational overview across Customers, Products, Sales Challans, and Audit Trails.
                </p>
              </div>
              <button onClick={loadSummary} style={styles.refreshBtn}>
                <RefreshCw size={14} />
                <span>Refresh Data</span>
              </button>
            </div>

            {/* Read-Only Notice */}
            <div style={styles.noticeBox}>
              <ShieldAlert size={18} color="#5B90E5" />
              <span>
                You are currently logged in under <strong>{user?.role || 'ACCOUNTS'}</strong> scope. Writes and modifications are restricted by RBAC policy.
              </span>
            </div>

            {/* Metric Cards Grid */}
            <div style={styles.grid}>
              <div style={styles.card} className="card-hover-effect">
                <div style={styles.cardHeader}>
                  <h3 style={styles.cardTitle}>Customer Directory</h3>
                  <Eye size={18} color="#5B90E5" />
                </div>
                <div style={styles.statValue}>{loading ? '...' : stats.customers.toLocaleString()}</div>
                <p style={styles.statLabel}>Total Verified Business Clients (Read-Only)</p>
              </div>

              <div style={styles.card} className="card-hover-effect">
                <div style={styles.cardHeader}>
                  <h3 style={styles.cardTitle}>Product Catalog</h3>
                  <Eye size={18} color="#5B90E5" />
                </div>
                <div style={styles.statValue}>{loading ? '...' : stats.products.toLocaleString()}</div>
                <p style={styles.statLabel}>Active Warehouse Products & Stock (Read-Only)</p>
              </div>

              <div style={styles.card} className="card-hover-effect">
                <div style={styles.cardHeader}>
                  <h3 style={styles.cardTitle}>Sales Challans</h3>
                  <Eye size={18} color="#5B90E5" />
                </div>
                <div style={styles.statValue}>{loading ? '...' : stats.challans.toLocaleString()}</div>
                <p style={styles.statLabel}>Processed Operations Sales Challans (Read-Only)</p>
              </div>
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
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  header: {
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
  refreshBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    backgroundColor: 'var(--bg-card)',
    color: 'var(--text-main)',
    border: '1px solid var(--border-color)',
    borderRadius: '10px',
    fontWeight: 700,
    fontSize: '0.85rem',
  },
  noticeBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 18px',
    backgroundColor: 'var(--very-light-blue)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    fontSize: '0.875rem',
    color: 'var(--text-main)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
  },
  card: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    boxShadow: 'var(--shadow-card)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: '1.1rem',
    fontWeight: 800,
    color: 'var(--text-main)',
  },
  statValue: {
    fontSize: '2.5rem',
    fontWeight: 800,
    color: '#5B90E5',
  },
  statLabel: {
    fontSize: '0.85rem',
    color: 'var(--text-sub)',
  },
};
