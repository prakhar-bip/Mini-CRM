import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/authContext';
import { TrendingUp, LogOut, RefreshCw } from 'lucide-react';
import { axiosClient } from '../../api/axiosClient';

export const SalesDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [customers, setCustomers] = useState<any[]>([]);
  const [challans, setChallans] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadSalesData = async () => {
    setLoading(true);
    try {
      const [cRes, chRes] = await Promise.all([
        axiosClient.get('/customers?page=1&limit=5'),
        axiosClient.get('/challans?page=1&limit=5'),
      ]);
      setCustomers(cRes.data.data || []);
      setChallans(chRes.data.data || []);
    } catch (err: any) {
      console.error('Failed to load sales data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSalesData();
  }, []);

  return (
    <div className="container" style={styles.container}>
      <div style={styles.banner}>
        <div>
          <div style={styles.badge}>
            <TrendingUp size={14} color="#5B90E5" />
            <span>SALES WORKSPACE (/dashboard/sales)</span>
          </div>
          <h2 style={styles.title}>Sales & Customer CRM — {user?.name}</h2>
          <p style={styles.sub}>Full permissions for Customer CRM, Follow-ups, and Sales Challans.</p>
        </div>
        <button onClick={logout} style={styles.logoutBtn}>
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>

      <div style={styles.split}>
        {/* Customer Directory Panel */}
        <div style={styles.panel}>
          <div style={styles.panelHead}>
            <h3>Active Customers</h3>
            <button onClick={loadSalesData} style={styles.refreshBtn}>
              <RefreshCw size={14} />
            </button>
          </div>
          {loading ? (
            <p>Loading customers...</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Customer</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id}>
                    <td style={styles.td}><strong>{c.name}</strong></td>
                    <td style={styles.td}>{c.customerType}</td>
                    <td style={styles.td}><span style={styles.pill}>{c.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Sales Challans Panel */}
        <div style={styles.panel}>
          <div style={styles.panelHead}>
            <h3>Recent Sales Challans</h3>
            <button onClick={loadSalesData} style={styles.refreshBtn}>
              <RefreshCw size={14} />
            </button>
          </div>
          {loading ? (
            <p>Loading challans...</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Challan #</th>
                  <th style={styles.th}>Total Qty</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {challans.map((ch) => (
                  <tr key={ch.id}>
                    <td style={styles.td}><strong>{ch.challanNumber}</strong></td>
                    <td style={styles.td}>{ch.totalQuantity} items</td>
                    <td style={styles.td}><span style={styles.pill}>{ch.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: { padding: '32px 24px 64px 24px' },
  banner: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    padding: '24px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.75rem',
    fontWeight: 800,
    color: '#5B90E5',
    backgroundColor: 'var(--very-light-blue)',
    padding: '4px 10px',
    borderRadius: '12px',
    marginBottom: '8px',
  },
  title: { fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' },
  sub: { fontSize: '0.9rem', color: 'var(--text-sub)' },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 18px',
    backgroundColor: 'transparent',
    color: '#E76576',
    border: '1px solid #E76576',
    borderRadius: '8px',
    fontWeight: 600,
  },
  split: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' },
  panel: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    padding: '24px',
  },
  panelHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  refreshBtn: {
    padding: '6px 10px',
    backgroundColor: 'var(--bg-section)',
    border: '1px solid var(--border-color)',
    borderRadius: '6px',
  },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' },
  th: { textAlign: 'left', padding: '8px 10px', borderBottom: '2px solid var(--border-color)' },
  td: { padding: '10px', borderBottom: '1px solid var(--border-color)' },
  pill: { fontSize: '0.7rem', fontWeight: 700, backgroundColor: 'var(--very-light-blue)', color: '#5B90E5', padding: '2px 6px', borderRadius: '4px' },
};
