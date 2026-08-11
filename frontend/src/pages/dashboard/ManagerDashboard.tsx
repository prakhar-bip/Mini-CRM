import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/authContext';
import { Boxes, LogOut, RefreshCw, AlertCircle } from 'lucide-react';
import { axiosClient } from '../../api/axiosClient';

export const ManagerDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosClient.get('/products?page=1&limit=10');
      setProducts(res.data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load warehouse products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="container" style={styles.container}>
      <div style={styles.banner}>
        <div>
          <div style={styles.badge}>
            <Boxes size={14} color="#5B90E5" />
            <span>WAREHOUSE MANAGER WORKSPACE (/dashboard/manager)</span>
          </div>
          <h2 style={styles.title}>Inventory Operations — {user?.name}</h2>
          <p style={styles.sub}>Full permissions for Product Catalog CRUD & Stock Movements IN/OUT.</p>
        </div>
        <button onClick={logout} style={styles.logoutBtn}>
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>

      <div style={styles.panel}>
        <div style={styles.panelHead}>
          <h3>Warehouse Products & Stock Control</h3>
          <button onClick={loadProducts} style={styles.refreshBtn}>
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>
        </div>

        {error && (
          <div style={styles.errorAlert}>
            <AlertCircle size={16} color="#E76576" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <p>Loading inventory products...</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Product Name</th>
                <th style={styles.th}>SKU</th>
                <th style={styles.th}>Unit Price</th>
                <th style={styles.th}>Current Stock</th>
                <th style={styles.th}>Min Stock</th>
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
                  <td style={styles.td}>{p.minimumStock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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
  errorAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px',
    backgroundColor: '#FEF2F2',
    color: '#DC2626',
    borderRadius: '8px',
    marginBottom: '16px',
  },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' },
  th: { textAlign: 'left', padding: '10px 14px', borderBottom: '2px solid var(--border-color)' },
  td: { padding: '12px 14px', borderBottom: '1px solid var(--border-color)' },
};
