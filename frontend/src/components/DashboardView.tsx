import React, { useState, useEffect } from 'react';
import {
  Users,
  Package,
  FileSpreadsheet,
  BarChart3,
  ShieldCheck,
  RefreshCw,
  LogOut,
  AlertCircle,
} from 'lucide-react';
import { axiosClient } from '../api/axiosClient';

interface DashboardViewProps {
  user: any;
  onLogout: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'customers' | 'products' | 'challans'>('overview');
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [challans, setChallans] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === 'customers') {
        const res = await axiosClient.get('/customers?page=1&limit=10');
        setCustomers(res.data.data || []);
      } else if (activeTab === 'products') {
        const res = await axiosClient.get('/products?page=1&limit=10');
        setProducts(res.data.data || []);
      } else if (activeTab === 'challans') {
        const res = await axiosClient.get('/challans?page=1&limit=10');
        setChallans(res.data.data || []);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch resource data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  return (
    <div className="container" style={styles.container}>
      {/* Workspace Top Banner */}
      <div style={styles.banner}>
        <div>
          <div style={styles.roleTag}>
            <ShieldCheck size={14} color="#5B90E5" />
            <span>ACTIVE WORKSPACE ({user.role})</span>
          </div>
          <h2 style={styles.bannerTitle}>Welcome back, {user.name || user.email}!</h2>
          <p style={styles.bannerSubtitle}>
            Role-Scoped Workspace • Logged in as <strong>{user.email}</strong>
          </p>
        </div>
        <button onClick={onLogout} style={styles.logoutBtn}>
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Tabs */}
      <div style={styles.tabRow}>
        <button
          onClick={() => setActiveTab('overview')}
          style={{ ...styles.tabBtn, ...(activeTab === 'overview' ? styles.tabActive : {}) }}
        >
          <BarChart3 size={16} />
          <span>Overview</span>
        </button>
        <button
          onClick={() => setActiveTab('customers')}
          style={{ ...styles.tabBtn, ...(activeTab === 'customers' ? styles.tabActive : {}) }}
        >
          <Users size={16} />
          <span>Customer CRM</span>
        </button>
        <button
          onClick={() => setActiveTab('products')}
          style={{ ...styles.tabBtn, ...(activeTab === 'products' ? styles.tabActive : {}) }}
        >
          <Package size={16} />
          <span>Products & Stock</span>
        </button>
        <button
          onClick={() => setActiveTab('challans')}
          style={{ ...styles.tabBtn, ...(activeTab === 'challans' ? styles.tabActive : {}) }}
        >
          <FileSpreadsheet size={16} />
          <span>Sales Challans</span>
        </button>
      </div>

      {/* Content Panels */}
      {error && (
        <div style={styles.errorBox}>
          <AlertCircle size={18} color="#E76576" />
          <span>{error}</span>
        </div>
      )}

      {activeTab === 'overview' && (
        <div style={styles.overviewGrid}>
          <div style={styles.kpiCard}>
            <Users size={24} color="#5B90E5" />
            <h3>Customer Management</h3>
            <p>Read/Write permissions governed by <strong>{user.role}</strong> policy.</p>
            <button onClick={() => setActiveTab('customers')} style={styles.actionBtn}>
              View Customers
            </button>
          </div>

          <div style={styles.kpiCard}>
            <Package size={24} color="#5B90E5" />
            <h3>Product & Stock</h3>
            <p>Warehouse catalog & stock adjustment controls.</p>
            <button onClick={() => setActiveTab('products')} style={styles.actionBtn}>
              View Inventory
            </button>
          </div>

          <div style={styles.kpiCard}>
            <FileSpreadsheet size={24} color="#5B90E5" />
            <h3>Sales Challans</h3>
            <p>Transactional stock deduction & draft orders.</p>
            <button onClick={() => setActiveTab('challans')} style={styles.actionBtn}>
              View Sales Challans
            </button>
          </div>
        </div>
      )}

      {activeTab === 'customers' && (
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <h3>Customer CRM Directory</h3>
            <button onClick={fetchData} style={styles.refreshBtn}>
              <RefreshCw size={14} />
              <span>Refresh</span>
            </button>
          </div>
          {loading ? (
            <p>Loading customers...</p>
          ) : customers.length === 0 ? (
            <p style={styles.emptyText}>No customer records found. Add your first customer via API!</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Mobile</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id}>
                    <td style={styles.td}><strong>{c.name}</strong><br /><small>{c.businessName}</small></td>
                    <td style={styles.td}>{c.customerType}</td>
                    <td style={styles.td}>{c.mobile}</td>
                    <td style={styles.td}><span style={styles.pill}>{c.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === 'products' && (
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <h3>Product Catalog & Inventory</h3>
            <button onClick={fetchData} style={styles.refreshBtn}>
              <RefreshCw size={14} />
              <span>Refresh</span>
            </button>
          </div>
          {loading ? (
            <p>Loading products...</p>
          ) : products.length === 0 ? (
            <p style={styles.emptyText}>No product records found.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Product Name</th>
                  <th style={styles.th}>SKU</th>
                  <th style={styles.th}>Price</th>
                  <th style={styles.th}>Current Stock</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td style={styles.td}><strong>{p.name}</strong><br /><small>{p.category}</small></td>
                    <td style={styles.td}>{p.sku}</td>
                    <td style={styles.td}>₹{parseFloat(p.unitPrice).toFixed(2)}</td>
                    <td style={styles.td}>
                      <span style={{ fontWeight: 700, color: p.currentStock <= p.minimumStock ? '#E76576' : '#45C98A' }}>
                        {p.currentStock} units
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === 'challans' && (
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <h3>Sales Challans Operations</h3>
            <button onClick={fetchData} style={styles.refreshBtn}>
              <RefreshCw size={14} />
              <span>Refresh</span>
            </button>
          </div>
          {loading ? (
            <p>Loading sales challans...</p>
          ) : challans.length === 0 ? (
            <p style={styles.emptyText}>No sales challans found.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Challan #</th>
                  <th style={styles.th}>Customer</th>
                  <th style={styles.th}>Total Quantity</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {challans.map((ch) => (
                  <tr key={ch.id}>
                    <td style={styles.td}><strong>{ch.challanNumber}</strong></td>
                    <td style={styles.td}>{ch.customer?.name}</td>
                    <td style={styles.td}>{ch.totalQuantity} items</td>
                    <td style={styles.td}><span style={styles.pill}>{ch.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    paddingTop: '32px',
    paddingBottom: '64px',
  },
  banner: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    padding: '24px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    boxShadow: 'var(--shadow-card)',
  },
  roleTag: {
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
  bannerTitle: {
    fontSize: '1.5rem',
    fontWeight: 800,
    color: 'var(--text-main)',
    marginBottom: '4px',
  },
  bannerSubtitle: {
    fontSize: '0.9rem',
    color: 'var(--text-sub)',
  },
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
    fontSize: '0.9rem',
  },
  tabRow: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
  },
  tabBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '10px',
    color: 'var(--text-sub)',
    fontSize: '0.95rem',
    fontWeight: 600,
  },
  tabActive: {
    backgroundColor: '#5B90E5',
    color: '#FFFFFF',
    borderColor: '#5B90E5',
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 16px',
    backgroundColor: '#FEF2F2',
    border: '1px solid #FCA5A5',
    borderRadius: '10px',
    color: '#DC2626',
    fontSize: '0.9rem',
    marginBottom: '20px',
  },
  overviewGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
  },
  kpiCard: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: 'var(--shadow-card)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  actionBtn: {
    padding: '10px',
    backgroundColor: 'var(--very-light-blue)',
    color: '#5B90E5',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    fontWeight: 700,
    fontSize: '0.85rem',
    marginTop: 'auto',
  },
  panel: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: 'var(--shadow-card)',
  },
  panelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  refreshBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    backgroundColor: 'var(--bg-section)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'var(--text-main)',
  },
  emptyText: {
    fontSize: '0.95rem',
    color: 'var(--text-sub)',
    textAlign: 'center',
    padding: '32px 0',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.9rem',
  },
  th: {
    textAlign: 'left',
    padding: '10px 14px',
    borderBottom: '2px solid var(--border-color)',
    color: 'var(--text-sub)',
  },
  td: {
    padding: '12px 14px',
    borderBottom: '1px solid var(--border-color)',
    color: 'var(--text-main)',
  },
  pill: {
    fontSize: '0.75rem',
    fontWeight: 700,
    backgroundColor: 'var(--very-light-blue)',
    color: '#5B90E5',
    padding: '4px 10px',
    borderRadius: '12px',
  },
};
