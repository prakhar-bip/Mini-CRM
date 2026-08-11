import React, { useState, useEffect } from 'react';
import { UserCog, ShieldCheck, CheckCircle2, Plus, X } from 'lucide-react';

interface UsersViewProps {
  autoOpenTrigger?: number;
}

export const UsersView: React.FC<UsersViewProps> = ({ autoOpenTrigger }) => {
  const [users, setUsers] = useState([
    { id: 1, name: 'System Administrator', email: 'admin@example.com', role: 'ADMIN', status: 'Active', department: 'Executive Management' },
    { id: 2, name: 'Sales Account Manager', email: 'sales@example.com', role: 'SALES', status: 'Active', department: 'Sales & CRM' },
    { id: 3, name: 'Warehouse Operations Manager', email: 'warehouse@example.com', role: 'WAREHOUSE', status: 'Active', department: 'Warehouse & Inventory' },
    { id: 4, name: 'Accounts Associate', email: 'accounts@example.com', role: 'ACCOUNTS', status: 'Active', department: 'Finance & Accounts' },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'SALES',
    department: 'Sales & CRM',
  });

  useEffect(() => {
    if (autoOpenTrigger && autoOpenTrigger > 0) {
      setShowAddModal(true);
    }
  }, [autoOpenTrigger]);

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;

    const created = {
      id: users.length + 1,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: 'Active',
      department: newUser.department,
    };

    setUsers([...users, created]);
    setShowAddModal(false);
    setNewUser({ name: '', email: '', role: 'SALES', department: 'Sales & CRM' });
    setFormSuccess(`User ${created.name} added successfully!`);
    setTimeout(() => setFormSuccess(null), 4000);
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <div>
          <h2 style={styles.heading}>User Management & Staff Directory</h2>
          <p style={styles.subheading}>Manage internal user accounts, access roles, and permissions matrix.</p>
        </div>
        <button onClick={() => setShowAddModal(true)} style={styles.addBtn}>
          <Plus size={16} />
          <span>+ Add Employee / User</span>
        </button>
      </div>

      {formSuccess && (
        <div style={styles.successBanner}>
          <CheckCircle2 size={16} color="#45C98A" />
          <span>{formSuccess}</span>
        </div>
      )}

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

      {/* Add User Modal Form */}
      {showAddModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0 }}>Add New Employee / User</h3>
              <button onClick={() => setShowAddModal(false)} style={styles.closeBtn}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
              <div>
                <label style={styles.label}>Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Verma"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  style={styles.input}
                />
              </div>

              <div>
                <label style={styles.label}>Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. vikram@example.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  style={styles.input}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={styles.label}>Access Role *</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    style={styles.input}
                  >
                    <option value="ADMIN">ADMIN (System Administrator)</option>
                    <option value="SALES">SALES (Sales Executive)</option>
                    <option value="WAREHOUSE">WAREHOUSE (Warehouse Manager)</option>
                    <option value="ACCOUNTS">ACCOUNTS (Accounts Manager)</option>
                  </select>
                </div>

                <div>
                  <label style={styles.label}>Department</label>
                  <input
                    type="text"
                    placeholder="e.g. Sales & Logistics"
                    value={newUser.department}
                    onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.modalActions}>
                <button type="button" onClick={() => setShowAddModal(false)} style={styles.cancelBtn}>
                  Cancel
                </button>
                <button type="submit" style={styles.submitBtn}>
                  Save Employee User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RBAC Matrix Information Card */}
      <div style={styles.matrixCard}>
        <div style={styles.matrixHeader}>
          <ShieldCheck size={18} color="#5B90E5" />
          <h3 style={styles.matrixTitle}>Role-Based Access Control (RBAC) System Roles</h3>
        </div>
        <div style={styles.matrixGrid}>
          <div style={styles.matrixBox}>
            <strong>ADMIN (System Administrator)</strong>
            <p>Full read/write/delete access across Customers, Products, Inventory, Sales Challans, Users, and Audit Reports.</p>
          </div>
          <div style={styles.matrixBox}>
            <strong>SALES (Sales Executive)</strong>
            <p>Full read/write access for Customer CRM, Follow-up Notes, Opportunities, and Sales Challan creation/drafting.</p>
          </div>
          <div style={styles.matrixBox}>
            <strong>WAREHOUSE (Warehouse Manager)</strong>
            <p>Full CRUD for Product Catalog, Stock IN/OUT movements, Inventory alerts, and Challan fulfillment viewing.</p>
          </div>
          <div style={styles.matrixBox}>
            <strong>ACCOUNTS (Accounts Manager)</strong>
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
  addBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    backgroundColor: '#5B90E5',
    color: '#FFFFFF',
    borderRadius: '10px',
    fontWeight: 700,
    fontSize: '0.85rem',
    border: 'none',
    cursor: 'pointer',
  },
  successBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 14px',
    backgroundColor: '#F0FDF4',
    border: '1px solid #BBF7D0',
    borderRadius: '8px',
    color: '#45C98A',
    fontWeight: 600,
    fontSize: '0.85rem',
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
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    width: '100%',
    maxWidth: '500px',
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '24px',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '12px',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-sub)',
    cursor: 'pointer',
  },
  label: {
    display: 'block',
    fontSize: '0.8rem',
    fontWeight: 700,
    marginBottom: '4px',
    color: 'var(--text-main)',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    backgroundColor: 'var(--bg-section)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    color: 'var(--text-main)',
    fontSize: '0.85rem',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '12px',
  },
  cancelBtn: {
    padding: '10px 16px',
    backgroundColor: 'transparent',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    color: 'var(--text-main)',
    fontWeight: 600,
    cursor: 'pointer',
  },
  submitBtn: {
    padding: '10px 18px',
    backgroundColor: '#5B90E5',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 700,
    cursor: 'pointer',
  },
};
