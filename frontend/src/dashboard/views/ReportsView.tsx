import React, { useState, useEffect } from 'react';
import { axiosClient } from '../../api/axiosClient';
import { RefreshCw, FileText, CheckCircle2 } from 'lucide-react';

export const ReportsView: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [recentChallans, setRecentChallans] = useState<any[]>([]);
  const [recentCustomers, setRecentCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReportData = async () => {
    setLoading(true);
    try {
      const [sRes, chRes, cRes] = await Promise.all([
        axiosClient.get('/dashboard/stats'),
        axiosClient.get('/challans?limit=10'),
        axiosClient.get('/customers?limit=10'),
      ]);
      setStats(sRes.data);
      setRecentChallans(chRes.data.data || []);
      setRecentCustomers(cRes.data.data || []);
    } catch (err) {
      console.warn('Error loading report data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReportData();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <div>
          <h2 style={styles.heading}>Audit Reports & System Analytics</h2>
          <p style={styles.subheading}>Generate real-time business performance summaries and audit trails.</p>
        </div>
        <button onClick={loadReportData} style={styles.refreshBtn}>
          <RefreshCw size={14} />
          <span>Refresh Audit Logs</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Total Customers</span>
          <strong style={styles.statVal}>{stats?.customerCount ?? 0}</strong>
          <span style={styles.statSub}>{stats?.activeCustomerCount ?? 0} Active • {stats?.leadCount ?? 0} Leads</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Product Catalog</span>
          <strong style={styles.statVal}>{stats?.productCount ?? 0}</strong>
          <span style={{ ...styles.statSub, color: stats?.lowStockCount > 0 ? '#E76576' : 'var(--text-sub)' }}>
            {stats?.lowStockCount ?? 0} Low Stock Items
          </span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Sales Challans</span>
          <strong style={styles.statVal}>{stats?.challanCount ?? 0}</strong>
          <span style={styles.statSub}>{stats?.confirmedChallanCount ?? 0} Confirmed • {stats?.draftChallanCount ?? 0} Drafts</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Stock Movement Logs</span>
          <strong style={styles.statVal}>{stats?.stockMovementCount ?? 0}</strong>
          <span style={styles.statSub}>Audit Trail Entries</span>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div style={styles.middleRow}>
        <div style={styles.tableCard}>
          <div style={styles.cardHeader}>
            <FileText size={16} color="#5B90E5" />
            <h3 style={styles.cardTitle}>Recent Sales Challans Audit</h3>
          </div>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Challan #</th>
                <th style={styles.th}>Customer</th>
                <th style={styles.th}>Total Qty</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Created Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ padding: '20px', textAlign: 'center' }}>Loading report...</td></tr>
              ) : recentChallans.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: '20px', textAlign: 'center' }}>No audit records found.</td></tr>
              ) : (
                recentChallans.map((ch) => (
                  <tr key={ch.id} style={styles.tr}>
                    <td style={styles.td}><strong>{ch.challanNumber}</strong></td>
                    <td style={styles.td}>{ch.customer?.name}</td>
                    <td style={styles.td}>{ch.totalQuantity} Units</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, color: ch.status === 'CONFIRMED' ? '#45C98A' : '#5B90E5' }}>
                        {ch.status}
                      </span>
                    </td>
                    <td style={styles.td}>{new Date(ch.createdAt).toISOString().slice(0, 10)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div style={styles.tableCard}>
          <div style={styles.cardHeader}>
            <CheckCircle2 size={16} color="#45C98A" />
            <h3 style={styles.cardTitle}>Recent Customer Registrations</h3>
          </div>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Customer</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} style={{ padding: '20px', textAlign: 'center' }}>Loading audit...</td></tr>
              ) : recentCustomers.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: '20px', textAlign: 'center' }}>No customers found.</td></tr>
              ) : (
                recentCustomers.map((c) => (
                  <tr key={c.id} style={styles.tr}>
                    <td style={styles.td}><strong>{c.name}</strong></td>
                    <td style={styles.td}>{c.customerType}</td>
                    <td style={styles.td}>{c.status}</td>
                    <td style={styles.td}>{new Date(c.createdAt).toISOString().slice(0, 10)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heading: {
    fontSize: '1.5rem',
    fontWeight: 800,
    color: 'var(--text-main)',
    margin: 0,
  },
  subheading: {
    fontSize: '0.85rem',
    color: 'var(--text-sub)',
    margin: '4px 0 0 0',
  },
  refreshBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    fontSize: '0.85rem',
    color: 'var(--text-main)',
    fontWeight: 600,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
  },
  statCard: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  statLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-sub)',
    fontWeight: 600,
  },
  statVal: {
    fontSize: '1.5rem',
    fontWeight: 800,
    color: 'var(--text-main)',
  },
  statSub: {
    fontSize: '0.75rem',
    color: 'var(--text-sub)',
  },
  middleRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  tableCard: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    backgroundColor: 'var(--bg-section)',
    borderBottom: '1px solid var(--border-color)',
  },
  cardTitle: {
    fontSize: '0.95rem',
    fontWeight: 700,
    margin: 0,
    color: 'var(--text-main)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.85rem',
  },
  th: {
    textAlign: 'left',
    padding: '10px 12px',
    backgroundColor: 'var(--bg-card)',
    color: 'var(--text-main)',
    fontWeight: 700,
    borderBottom: '1px solid var(--border-color)',
  },
  tr: {
    borderBottom: '1px solid var(--border-color)',
  },
  td: {
    padding: '10px 12px',
    color: 'var(--text-main)',
  },
  badge: {
    fontSize: '0.75rem',
    fontWeight: 700,
  },
};
