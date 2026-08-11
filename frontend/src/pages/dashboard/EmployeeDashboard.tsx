import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/authContext';
import { FileText, LogOut, Eye } from 'lucide-react';
import { axiosClient } from '../../api/axiosClient';

export const EmployeeDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<{ customers: number; products: number; challans: number }>({
    customers: 0,
    products: 0,
    challans: 0,
  });
  const [loading, setLoading] = useState(false);

  const loadSummary = async () => {
    setLoading(true);
    try {
      const [cRes, pRes, chRes] = await Promise.all([
        axiosClient.get('/customers?page=1&limit=1'),
        axiosClient.get('/products?page=1&limit=1'),
        axiosClient.get('/challans?page=1&limit=1'),
      ]);
      setStats({
        customers: cRes.data.pagination?.total || 0,
        products: pRes.data.pagination?.total || 0,
        challans: chRes.data.pagination?.total || 0,
      });
    } catch (err) {
      console.error('Failed to load employee stats summary:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  return (
    <div className="container" style={styles.container}>
      <div style={styles.banner}>
        <div>
          <div style={styles.badge}>
            <FileText size={14} color="#5B90E5" />
            <span>EMPLOYEE / ACCOUNTS WORKSPACE (/dashboard/employee)</span>
          </div>
          <h2 style={styles.title}>Operational Read-Only Overview — {user?.name}</h2>
          <p style={styles.sub}>Read-Only access to Customers, Product Catalog, Sales Challans, and Audit Logs.</p>
        </div>
        <button onClick={logout} style={styles.logoutBtn}>
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>

      <div style={styles.grid}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3>Customer Directory</h3>
            <Eye size={18} color="#5B90E5" />
          </div>
          <div style={styles.statValue}>{loading ? '...' : stats.customers}</div>
          <p style={styles.statLabel}>Total Verified Business Clients (Read-Only)</p>
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3>Product Catalog</h3>
            <Eye size={18} color="#5B90E5" />
          </div>
          <div style={styles.statValue}>{loading ? '...' : stats.products}</div>
          <p style={styles.statLabel}>Warehouse Active Products (Read-Only)</p>
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3>Sales Challans</h3>
            <Eye size={18} color="#5B90E5" />
          </div>
          <div style={styles.statValue}>{loading ? '...' : stats.challans}</div>
          <p style={styles.statLabel}>Processed Operations Challans (Read-Only)</p>
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
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' },
  card: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    padding: '28px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  statValue: { fontSize: '2.5rem', fontWeight: 800, color: '#5B90E5' },
  statLabel: { fontSize: '0.85rem', color: 'var(--text-sub)' },
};
