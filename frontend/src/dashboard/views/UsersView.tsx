import React from 'react';
import { UserCog, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const UsersView: React.FC = () => {
  const users = [
    { id: 1, name: 'System Administrator', email: 'admin@example.com', role: 'ADMIN', status: 'Active', department: 'Executive Management' },
    { id: 2, name: 'Sales Account Manager', email: 'sales@example.com', role: 'SALES', status: 'Active', department: 'Sales & CRM' },
    { id: 3, name: 'Warehouse Operations Manager', email: 'warehouse@example.com', role: 'WAREHOUSE', status: 'Active', department: 'Warehouse & Inventory' },
    { id: 4, name: 'Accounts Associate', email: 'accounts@example.com', role: 'ACCOUNTS', status: 'Active', department: 'Finance & Accounts' },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <div>
          <h2 style={styles.heading}>User Management & Staff Administration</h2>
          <p style={styles.subheading}>Manage internal user accounts, access roles, and permissions matrix.</p>
        </div>
      </div>

      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Full Name</th>
              <th style={styles.th}>Email Address</th>
              <th style={styles.th}>Department</th>
              <th style={styles.th}>Backend Role</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={styles.tr}>
                <td style={styles.td}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <UserCog size={16} color="#5B90E5" />
                    <strong>{u.name}</strong>
                  </div>
                </td>
                <td style={styles.td}><code>{u.email}</code></td>
                <td style={styles.td}>{u.department}</td>
                <td style={styles.td}>
                  <span style={styles.roleBadge}>{u.role}</span>
                </td>
                <td style={styles.td}>
                  <span style={styles.statusBadge}>
                    <CheckCircle2 size={12} color="#45C98A" />
                    <span>{u.status}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* RBAC Matrix Information Card */}
      <div style={styles.matrixCard}>
        <div style={styles.matrixHeader}>
          <ShieldCheck size={18} color="#5B90E5" />
          <h3 style={styles.matrixTitle}>Role-Based Access Control (RBAC) Enforcement Policy</h3>
        </div>
        <div style={styles.matrixGrid}>
          <div style={styles.matrixBox}>
            <strong>ADMIN</strong>
            <p>Full read/write/delete access across Customers, Products, Inventory, Sales Challans, Users, and Audit Reports.</p>
          </div>
          <div style={styles.matrixBox}>
            <strong>SALES</strong>
            <p>Full read/write access for Customer CRM, Follow-up Notes, Opportunities, and Sales Challan creation/drafting.</p>
          </div>
          <div style={styles.matrixBox}>
            <strong>WAREHOUSE (Manager)</strong>
            <p>Full CRUD for Product Catalog, Stock IN/OUT movements, Inventory alerts, and Challan fulfillment viewing.</p>
          </div>
          <div style={styles.matrixBox}>
            <strong>ACCOUNTS (Employee)</strong>
            <p>Operational read access for Customer accounts, Product pricing, Sales Challan history, and personal work tasks.</p>
          </div>
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
  tableCard: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.85rem',
  },
  th: {
    textAlign: 'left',
    padding: '12px',
    backgroundColor: 'var(--bg-section)',
    color: 'var(--text-main)',
    fontWeight: 700,
    borderBottom: '1px solid var(--border-color)',
  },
  tr: {
    borderBottom: '1px solid var(--border-color)',
  },
  td: {
    padding: '12px',
    color: 'var(--text-main)',
  },
  roleBadge: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#5B90E5',
    backgroundColor: 'var(--very-light-blue)',
    padding: '2px 8px',
    borderRadius: '6px',
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#45C98A',
  },
  matrixCard: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '20px',
  },
  matrixHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
  },
  matrixTitle: {
    fontSize: '1rem',
    fontWeight: 800,
    margin: 0,
    color: 'var(--text-main)',
  },
  matrixGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
  },
  matrixBox: {
    backgroundColor: 'var(--bg-section)',
    borderRadius: '8px',
    padding: '12px',
    border: '1px solid var(--border-color)',
    fontSize: '0.8rem',
    color: 'var(--text-main)',
  },
};
