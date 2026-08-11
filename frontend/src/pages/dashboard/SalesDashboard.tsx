import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from '../../dashboard/components/Sidebar';
import { Topbar } from '../../dashboard/components/Topbar';
import { useAuth } from '../../auth/authContext';
import { TrendingUp, Users, FileSpreadsheet, Plus, RefreshCw, PhoneCall } from 'lucide-react';
import { axiosClient } from '../../api/axiosClient';

export const SalesDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeNav, setActiveNav] = useState('customers');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const [customers, setCustomers] = useState<any[]>([]);
  const [challans, setChallans] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadSalesData = useCallback(async () => {
    setLoading(true);
    try {
      const [cRes, chRes] = await Promise.allSettled([
        axiosClient.get('/customers?page=1&limit=10'),
        axiosClient.get('/challans?page=1&limit=10'),
      ]);

      if (cRes.status === 'fulfilled' && cRes.value.data) {
        setCustomers(cRes.value.data.data || []);
      }
      if (chRes.status === 'fulfilled' && chRes.value.data) {
        setChallans(chRes.value.data.data || []);
      }
    } catch (err: any) {
      console.error('Failed to load sales data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    loadSalesData();
  }, [theme, loadSalesData]);

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
            {/* Header Banner */}
            <div style={styles.header}>
              <div>
                <span style={styles.eyebrow}>SALES & CRM WORKSPACE</span>
                <h1 style={styles.heading}>Good morning, {user?.name || 'Sales Representative'}</h1>
                <p style={styles.subheading}>
                  Manage active client accounts, follow-ups, and generate sales challans.
                </p>
              </div>

              <div style={styles.headerActions}>
                <button onClick={() => alert('+ Create New Customer')} style={styles.primaryBtn}>
                  <Plus size={16} />
                  <span>Add Customer</span>
                </button>
                <button onClick={() => alert('+ Create Sales Challan Draft')} style={styles.secondaryBtn}>
                  <FileSpreadsheet size={16} color="#5B90E5" />
                  <span>Create Challan</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics */}
            <div style={styles.metricsGrid}>
              <div style={styles.metricCard}>
                <div style={styles.metricHead}>
                  <span>Total CRM Clients</span>
                  <Users size={16} color="#5B90E5" />
                </div>
                <strong style={styles.metricVal}>{customers.length} Accounts</strong>
              </div>
              <div style={styles.metricCard}>
                <div style={styles.metricHead}>
                  <span>Sales Challans Logged</span>
                  <FileSpreadsheet size={16} color="#45C98A" />
                </div>
                <strong style={styles.metricVal}>{challans.length} Challans</strong>
              </div>
              <div style={styles.metricCard}>
                <div style={styles.metricHead}>
                  <span>Target Performance</span>
                  <TrendingUp size={16} color="#5B90E5" />
                </div>
                <strong style={styles.metricVal}>94% Achieved</strong>
              </div>
            </div>

            {/* Split CRM Directory & Challans */}
            <div style={styles.splitRow}>
              {/* Customer Directory */}
              <div style={styles.panel}>
                <div style={styles.panelHead}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={18} color="#5B90E5" />
                    <h3 style={styles.panelTitle}>Active Customers & Leads</h3>
                  </div>
                  <button onClick={loadSalesData} style={styles.iconBtn}>
                    <RefreshCw size={14} />
                  </button>
                </div>

                {loading ? (
                  <p>Loading live customer directory...</p>
                ) : (
                  <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                      <thead>
                        <tr>
                          <th style={styles.th}>Customer Name</th>
                          <th style={styles.th}>Type</th>
                          <th style={styles.th}>Mobile</th>
                          <th style={styles.th}>Status</th>
                          <th style={styles.th}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customers.length === 0 ? (
                          <tr>
                            <td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>
                              No customer accounts found.
                            </td>
                          </tr>
                        ) : (
                          customers.map((c) => (
                            <tr key={c.id}>
                              <td style={styles.td}>
                                <strong>{c.name}</strong>
                                <small style={{ display: 'block', color: 'var(--text-sub)' }}>{c.businessName}</small>
                              </td>
                              <td style={styles.td}>{c.customerType}</td>
                              <td style={styles.td}>{c.mobileNumber}</td>
                              <td style={styles.td}>
                                <span style={styles.badgePill}>{c.status}</span>
                              </td>
                              <td style={styles.td}>
                                <button
                                  onClick={() => alert(`Log Follow-up note for ${c.name}`)}
                                  style={styles.followUpBtn}
                                >
                                  <PhoneCall size={12} />
                                  <span>Follow-up</span>
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Sales Challans Feed */}
              <div style={styles.panel}>
                <div style={styles.panelHead}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileSpreadsheet size={18} color="#45C98A" />
                    <h3 style={styles.panelTitle}>Sales Challans</h3>
                  </div>
                  <button onClick={loadSalesData} style={styles.iconBtn}>
                    <RefreshCw size={14} />
                  </button>
                </div>

                {loading ? (
                  <p>Loading challans feed...</p>
                ) : (
                  <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                      <thead>
                        <tr>
                          <th style={styles.th}>Challan #</th>
                          <th style={styles.th}>Total Quantity</th>
                          <th style={styles.th}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {challans.length === 0 ? (
                          <tr>
                            <td colSpan={3} style={{ textAlign: 'center', padding: '20px' }}>
                              No sales challans recorded.
                            </td>
                          </tr>
                        ) : (
                          challans.map((ch) => (
                            <tr key={ch.id}>
                              <td style={styles.td}>
                                <strong>{ch.challanNumber}</strong>
                              </td>
                              <td style={styles.td}>{ch.totalQuantity} items</td>
                              <td style={styles.td}>
                                <span
                                  style={{
                                    ...styles.badgePill,
                                    color: ch.status === 'CONFIRMED' ? '#45C98A' : '#5B90E5',
                                  }}
                                >
                                  {ch.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
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
  headerActions: {
    display: 'flex',
    gap: '12px',
  },
  primaryBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 18px',
    backgroundColor: '#5B90E5',
    color: '#FFFFFF',
    borderRadius: '10px',
    fontWeight: 700,
    fontSize: '0.85rem',
  },
  secondaryBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 18px',
    backgroundColor: 'var(--bg-card)',
    color: 'var(--text-main)',
    border: '1px solid var(--border-color)',
    borderRadius: '10px',
    fontWeight: 700,
    fontSize: '0.85rem',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
  },
  metricCard: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    padding: '20px',
  },
  metricHead: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.85rem',
    color: 'var(--text-sub)',
    marginBottom: '8px',
  },
  metricVal: {
    fontSize: '1.5rem',
    fontWeight: 800,
    color: 'var(--text-main)',
  },
  splitRow: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr',
    gap: '20px',
  },
  panel: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    padding: '24px',
  },
  panelHead: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  panelTitle: {
    fontSize: '1.1rem',
    fontWeight: 800,
    color: 'var(--text-main)',
  },
  iconBtn: {
    padding: '6px',
    borderRadius: '6px',
    backgroundColor: 'var(--bg-section)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-main)',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.85rem',
  },
  th: {
    textAlign: 'left',
    padding: '10px 12px',
    backgroundColor: 'var(--bg-section)',
    color: 'var(--text-main)',
    fontWeight: 700,
    borderBottom: '1px solid var(--border-color)',
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid var(--border-color)',
    color: 'var(--text-main)',
  },
  badgePill: {
    fontSize: '0.7rem',
    fontWeight: 700,
    backgroundColor: 'var(--very-light-blue)',
    color: '#5B90E5',
    padding: '3px 8px',
    borderRadius: '8px',
  },
  followUpBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    backgroundColor: '#5B90E5',
    color: '#FFFFFF',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: 600,
  },
};
