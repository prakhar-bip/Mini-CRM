import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/authContext';
import {
  Users,
  Package,
  FileSpreadsheet,
  BarChart3,
  ShieldCheck,
  RefreshCw,
  LogOut,
  Shield,
} from 'lucide-react';
import { axiosClient } from '../../api/axiosClient';

export const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'customers' | 'products' | 'challans'>('overview');
  const [dataList, setDataList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    if (activeTab === 'overview') return;
    setLoading(true);
    try {
      const res = await axiosClient.get(`/${activeTab}?page=1&limit=10`);
      setDataList(res.data.data || []);
    } catch (err) {
      console.error('Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  return (
    <div className="container" style={styles.container}>
      {/* Header Banner */}
      <div style={styles.banner}>
        <div>
          <div style={styles.badge}>
            <Shield size={14} color="#5B90E5" />
            <span>ADMINISTRATOR CONTROL CENTER (/dashboard/admin)</span>
          </div>
          <h2 style={styles.title}>System Control & Operations — {user?.name}</h2>
          <p style={styles.sub}>Full CRUD permissions across CRM, Inventory, Sales Challans, and RBAC Settings.</p>
        </div>
        <button onClick={logout} style={styles.logoutBtn}>
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div style={styles.tabs}>
        <button
          onClick={() => setActiveTab('overview')}
          style={{ ...styles.tab, ...(activeTab === 'overview' ? styles.activeTab : {}) }}
        >
          <BarChart3 size={16} />
          <span>System Overview</span>
        </button>
        <button
          onClick={() => setActiveTab('customers')}
          style={{ ...styles.tab, ...(activeTab === 'customers' ? styles.activeTab : {}) }}
        >
          <Users size={16} />
          <span>Customer CRM</span>
        </button>
        <button
          onClick={() => setActiveTab('products')}
          style={{ ...styles.tab, ...(activeTab === 'products' ? styles.activeTab : {}) }}
        >
          <Package size={16} />
          <span>Products & Stock</span>
        </button>
        <button
          onClick={() => setActiveTab('challans')}
          style={{ ...styles.tab, ...(activeTab === 'challans' ? styles.activeTab : {}) }}
        >
          <FileSpreadsheet size={16} />
          <span>Sales Challans</span>
        </button>
      </div>

      {/* View Content */}
      {activeTab === 'overview' ? (
        <div style={styles.grid}>
          <div style={styles.card}>
            <ShieldCheck size={28} color="#5B90E5" />
            <h3>Full Access Granted</h3>
            <p>You have root admin access over database seed, users, and business modules.</p>
          </div>
          <div style={styles.card}>
            <Users size={28} color="#5B90E5" />
            <h3>CRM Controls</h3>
            <p>Create, update, search, and manage customer follow-ups.</p>
          </div>
          <div style={styles.card}>
            <Package size={28} color="#5B90E5" />
            <h3>Inventory Control</h3>
            <p>Manage product catalog, SKU uniqueness, and stock movements IN/OUT.</p>
          </div>
        </div>
      ) : (
        <div style={styles.panel}>
          <div style={styles.panelHead}>
            <h3 style={{ textTransform: 'capitalize' }}>{activeTab} Management</h3>
            <button onClick={loadData} style={styles.refreshBtn}>
              <RefreshCw size={14} />
              <span>Refresh</span>
            </button>
          </div>
          {loading ? (
            <p>Loading {activeTab} data...</p>
          ) : (
            <div style={styles.tableBox}>
              <pre style={styles.jsonPreview}>{JSON.stringify(dataList, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
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
  tabs: { display: 'flex', gap: '12px', marginBottom: '24px' },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '10px',
    color: 'var(--text-sub)',
    fontWeight: 600,
  },
  activeTab: { backgroundColor: '#5B90E5', color: '#FFFFFF', borderColor: '#5B90E5' },
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
  panel: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    padding: '24px',
  },
  panelHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  refreshBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    backgroundColor: 'var(--bg-section)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    fontSize: '0.85rem',
  },
  tableBox: { backgroundColor: 'var(--bg-section)', padding: '16px', borderRadius: '10px', overflowX: 'auto' },
  jsonPreview: { fontSize: '0.85rem', color: 'var(--text-main)', margin: 0 },
};
