import React, { useState, useEffect, useCallback } from 'react';
import { UserCog, ShieldCheck, CheckCircle2, Plus, X, Trash2, AlertCircle } from 'lucide-react';
import { axiosClient } from '../../api/axiosClient';
import { useAuth } from '../../auth/authContext';

interface UsersViewProps {
  autoOpenTrigger?: number;
}

export const UsersView: React.FC<UsersViewProps> = ({ autoOpenTrigger }) => {
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'ADMIN';

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deletingUser, setDeletingUser] = useState<any | null>(null);

  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'SALES',
    password: '',
  });

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/users');
      setUsers(res.data || []);
    } catch (err: any) {
      console.warn('Error fetching users from DB:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    if (autoOpenTrigger && autoOpenTrigger > 0 && isAdmin) {
      setShowAddModal(true);
    }
  }, [autoOpenTrigger, isAdmin]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;
    setFormError(null);
    setSubmitting(true);

    try {
      const res = await axiosClient.post('/users', {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        password: newUser.password || 'Password@123',
      });

      setShowAddModal(false);
      setNewUser({ name: '', email: '', role: 'SALES', password: '' });
      setFormSuccess(res.data.message || `User created successfully!`);
      loadUsers();
      setTimeout(() => setFormSuccess(null), 4000);
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingUser) return;
    setSubmitting(true);
    setFormError(null);

    try {
      const res = await axiosClient.delete(`/users/${deletingUser.id}`);
      setUsers((prev) => prev.filter((u) => u.id !== deletingUser.id));
      setFormSuccess(res.data.message || `User ${deletingUser.name} deleted successfully!`);
      setDeletingUser(null);
      setTimeout(() => setFormSuccess(null), 4000);
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <div>
          <h2 style={styles.heading}>User Management & Staff Directory</h2>
          <p style={styles.subheading}>Manage internal user accounts, access roles, and permissions matrix.</p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowAddModal(true)} style={styles.addBtn}>
            <Plus size={16} />
            <span>+ Add Employee / User</span>
          </button>
        )}
      </div>

      {formSuccess && (
        <div style={styles.successBanner}>
          <CheckCircle2 size={16} color="#45C98A" />
          <span>{formSuccess}</span>
        </div>
      )}

      {formError && !showAddModal && !deletingUser && (
        <div style={styles.errorBox}>
          <AlertCircle size={16} color="#E76576" />
          <span>{formError}</span>
        </div>
      )}

      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Full Name</th>
              <th style={styles.th}>Email Address</th>
              <th style={styles.th}>Backend Role</th>
              <th style={styles.th}>Joined Date</th>
              {isAdmin && <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={isAdmin ? 5 : 4} style={{ textAlign: 'center', padding: '30px' }}>
                  Loading users directory...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 5 : 4} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-sub)' }}>
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} style={styles.tr}>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <UserCog size={16} color="#5B90E5" />
                      <strong>{u.name}</strong>
                    </div>
                  </td>
                  <td style={styles.td}><code>{u.email}</code></td>
                  <td style={styles.td}>
                    <span style={styles.roleBadge}>{u.role}</span>
                  </td>
                  <td style={styles.td}>
                    {u.createdAt ? new Date(u.createdAt).toISOString().slice(0, 10) : 'Active'}
                  </td>
                  {isAdmin && (
                    <td style={{ ...styles.td, textAlign: 'right' }}>
                      {u.id !== currentUser?.id ? (
                        <button
                          onClick={() => {
                            setFormError(null);
                            setDeletingUser(u);
                          }}
                          style={styles.deleteBtn}
                          title="Delete User"
                        >
                          <Trash2 size={14} color="#E76576" />
                          <span>Delete</span>
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-sub)', fontStyle: 'italic' }}>
                          Current User
                        </span>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal for Delete User */}
      {deletingUser && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0, color: '#E76576' }}>Delete User Account</h3>
              <button onClick={() => setDeletingUser(null)} style={styles.closeBtn} disabled={submitting}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '16px 0' }}>
              <p style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                Are you sure you want to delete this user? This action cannot be undone.
              </p>
              <div style={{ padding: '10px', backgroundColor: 'var(--bg-section)', borderRadius: '8px', fontSize: '0.85rem' }}>
                <strong>{deletingUser.name}</strong> ({deletingUser.email}) — Role: <code>{deletingUser.role}</code>
              </div>

              {formError && (
                <div style={{ ...styles.errorBox, marginTop: '12px' }}>
                  <AlertCircle size={14} color="#E76576" />
                  <span>{formError}</span>
                </div>
              )}
            </div>

            <div style={styles.modalActions}>
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                style={styles.cancelBtn}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                style={styles.confirmDeleteBtn}
                disabled={submitting}
              >
                {submitting ? 'Deleting...' : 'Delete User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal Form */}
      {showAddModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0 }}>Add New Employee / User</h3>
              <button onClick={() => setShowAddModal(false)} style={styles.closeBtn} disabled={submitting}>
                <X size={18} />
              </button>
            </div>

            {formError && (
              <div style={{ ...styles.errorBox, marginTop: '12px' }}>
                <AlertCircle size={14} color="#E76576" />
                <span>{formError}</span>
              </div>
            )}

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
                    <option value="ADMIN">ADMIN</option>
                    <option value="SALES">SALES</option>
                    <option value="WAREHOUSE">WAREHOUSE</option>
                    <option value="ACCOUNTS">ACCOUNTS</option>
                  </select>
                </div>

                <div>
                  <label style={styles.label}>Password (Optional)</label>
                  <input
                    type="password"
                    placeholder="Default: Password@123"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.modalActions}>
                <button type="button" onClick={() => setShowAddModal(false)} style={styles.cancelBtn} disabled={submitting}>
                  Cancel
                </button>
                <button type="submit" style={styles.submitBtn} disabled={submitting}>
                  {submitting ? 'Saving...' : 'Save Employee User'}
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
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 12px',
    backgroundColor: '#FEF2F2',
    border: '1px solid #FCA5A5',
    borderRadius: '8px',
    color: '#E76576',
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
  deleteBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    backgroundColor: '#FEF2F2',
    border: '1px solid #FCA5A5',
    borderRadius: '6px',
    color: '#E76576',
    fontSize: '0.75rem',
    fontWeight: 700,
    cursor: 'pointer',
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
  confirmDeleteBtn: {
    padding: '10px 18px',
    backgroundColor: '#E76576',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 700,
    cursor: 'pointer',
  },
};
