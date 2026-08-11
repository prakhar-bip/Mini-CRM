import React, { useState, useEffect, useCallback } from 'react';
import { axiosClient } from '../../api/axiosClient';
import {
  Search,
  Plus,
  Edit2,
  Eye,
  MessageSquare,
  X,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export const CustomersView: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any | null>(null);
  const [selectedCustomerDetail, setSelectedCustomerDetail] = useState<any | null>(null);
  const [followUps, setFollowUps] = useState<any[]>([]);
  const [newFollowUpNote, setNewFollowUpNote] = useState('');

  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    businessName: '',
    gstNumber: '',
    customerType: 'RETAIL',
    address: '',
    status: 'LEAD',
    followUpDate: '',
    notes: '',
  });

  const loadCustomers = useCallback(async () => {
    setLoading(true);
    try {
      let query = `/customers?page=${page}&limit=10`;
      if (search) query += `&search=${encodeURIComponent(search)}`;
      if (statusFilter) query += `&status=${statusFilter}`;
      if (typeFilter) query += `&customerType=${typeFilter}`;

      const res = await axiosClient.get(query);
      setCustomers(res.data.data || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (err: any) {
      console.warn('Error loading customers:', err);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, typeFilter]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setFormData({
      name: '',
      mobile: '',
      email: '',
      businessName: '',
      gstNumber: '',
      customerType: 'RETAIL',
      address: '',
      status: 'LEAD',
      followUpDate: '',
      notes: '',
    });
    setFormError(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (c: any) => {
    setEditingCustomer(c);
    setFormData({
      name: c.name || '',
      mobile: c.mobile || '',
      email: c.email || '',
      businessName: c.businessName || '',
      gstNumber: c.gstNumber || '',
      customerType: c.customerType || 'RETAIL',
      address: c.address || '',
      status: c.status || 'LEAD',
      followUpDate: c.followUpDate ? new Date(c.followUpDate).toISOString().slice(0, 10) : '',
      notes: c.notes || '',
    });
    setFormError(null);
    setShowAddModal(true);
  };

  const handleSubmitCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    try {
      const payload = {
        ...formData,
        gstNumber: formData.gstNumber.trim() || undefined,
        followUpDate: formData.followUpDate ? new Date(formData.followUpDate).toISOString() : undefined,
      };

      if (editingCustomer) {
        await axiosClient.put(`/customers/${editingCustomer.id}`, payload);
        setSuccessMsg('Customer updated successfully!');
      } else {
        await axiosClient.post('/customers', payload);
        setSuccessMsg('Customer created successfully!');
      }

      setShowAddModal(false);
      loadCustomers();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to save customer');
    }
  };

  const handleOpenDetail = async (c: any) => {
    setSelectedCustomerDetail(c);
    try {
      const res = await axiosClient.get(`/customers/${c.id}/followups`);
      setFollowUps(res.data || []);
    } catch (err) {
      setFollowUps([]);
    }
  };

  const handleAddFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFollowUpNote.trim() || !selectedCustomerDetail) return;
    try {
      await axiosClient.post(`/customers/${selectedCustomerDetail.id}/followups`, {
        note: newFollowUpNote,
      });
      setNewFollowUpNote('');
      const res = await axiosClient.get(`/customers/${selectedCustomerDetail.id}/followups`);
      setFollowUps(res.data || []);
      setSuccessMsg('Follow-up note added!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add follow-up note');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <div>
          <h2 style={styles.heading}>Customer CRM Directory</h2>
          <p style={styles.subheading}>Manage business clients, leads, and follow-up history.</p>
        </div>
        <button onClick={handleOpenAdd} style={styles.addBtn}>
          <Plus size={16} />
          <span>+ Add Customer</span>
        </button>
      </div>

      {successMsg && (
        <div style={styles.successBanner}>
          <CheckCircle2 size={16} color="#45C98A" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div style={styles.filterBar}>
        <div style={styles.searchBox}>
          <Search size={16} color="#64748B" />
          <input
            type="text"
            placeholder="Search by name, mobile, email, or business..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={styles.selectFilter}
        >
          <option value="">All Statuses</option>
          <option value="LEAD">LEAD</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          style={styles.selectFilter}
        >
          <option value="">All Types</option>
          <option value="RETAIL">RETAIL</option>
          <option value="WHOLESALE">WHOLESALE</option>
          <option value="DISTRIBUTOR">DISTRIBUTOR</option>
        </select>
      </div>

      {/* Table */}
      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Customer Name</th>
              <th style={styles.th}>Business Name</th>
              <th style={styles.th}>Contact Info</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Follow-up Date</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '30px' }}>
                  Loading customer directory...
                </td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-sub)' }}>
                  No customers found matching filters.
                </td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c.id} style={styles.tr}>
                  <td style={styles.td}>
                    <strong>{c.name}</strong>
                  </td>
                  <td style={styles.td}>{c.businessName}</td>
                  <td style={styles.td}>
                    <div>{c.mobile}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)' }}>{c.email}</div>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.typeBadge}>{c.customerType}</span>
                  </td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.statusBadge,
                        backgroundColor:
                          c.status === 'ACTIVE'
                            ? '#F0FDF4'
                            : c.status === 'LEAD'
                            ? '#EFF6FF'
                            : '#FEF2F2',
                        color:
                          c.status === 'ACTIVE'
                            ? '#45C98A'
                            : c.status === 'LEAD'
                            ? '#5B90E5'
                            : '#E76576',
                      }}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {c.followUpDate ? new Date(c.followUpDate).toISOString().slice(0, 10) : 'None'}
                  </td>
                  <td style={{ ...styles.td, textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button onClick={() => handleOpenDetail(c)} style={styles.iconBtn} title="View Details">
                        <Eye size={14} />
                      </button>
                      <button onClick={() => handleOpenEdit(c)} style={styles.iconBtn} title="Edit Customer">
                        <Edit2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div style={styles.paginationRow}>
          <span>Page {page} of {totalPages}</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              style={styles.pageBtn}
            >
              Previous
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              style={styles.pageBtn}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add / Edit Customer Modal */}
      {showAddModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3>{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</h3>
              <button onClick={() => setShowAddModal(false)} style={styles.closeBtn}>
                <X size={18} />
              </button>
            </div>

            {formError && (
              <div style={styles.errorBox}>
                <AlertCircle size={16} color="#E76576" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitCustomer} style={styles.form}>
              <div style={styles.formGrid}>
                <div>
                  <label style={styles.label}>Customer Name *</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={styles.input}
                    placeholder="e.g. Rohan Sharma"
                  />
                </div>
                <div>
                  <label style={styles.label}>Business Name *</label>
                  <input
                    required
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    style={styles.input}
                    placeholder="e.g. Acme Enterprises"
                  />
                </div>
                <div>
                  <label style={styles.label}>Mobile Number * (10 Digits)</label>
                  <input
                    required
                    type="text"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    style={styles.input}
                    placeholder="9876543210"
                  />
                </div>
                <div>
                  <label style={styles.label}>Email Address *</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={styles.input}
                    placeholder="rohan@acme.com"
                  />
                </div>
                <div>
                  <label style={styles.label}>GST Number (Optional)</label>
                  <input
                    type="text"
                    value={formData.gstNumber}
                    onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                    style={styles.input}
                    placeholder="27AAAPA1234A1Z5"
                  />
                </div>
                <div>
                  <label style={styles.label}>Customer Type *</label>
                  <select
                    value={formData.customerType}
                    onChange={(e) => setFormData({ ...formData, customerType: e.target.value })}
                    style={styles.input}
                  >
                    <option value="RETAIL">RETAIL</option>
                    <option value="WHOLESALE">WHOLESALE</option>
                    <option value="DISTRIBUTOR">DISTRIBUTOR</option>
                  </select>
                </div>
                <div>
                  <label style={styles.label}>Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    style={styles.input}
                  >
                    <option value="LEAD">LEAD</option>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
                <div>
                  <label style={styles.label}>Follow-up Date</label>
                  <input
                    type="date"
                    value={formData.followUpDate}
                    onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                    style={styles.input}
                  />
                </div>
              </div>

              <div>
                <label style={styles.label}>Address *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  style={styles.input}
                  placeholder="Street address, city, state..."
                />
              </div>

              <div>
                <label style={styles.label}>Initial Notes</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  style={styles.input}
                  placeholder="Key account notes or requirements..."
                />
              </div>

              <div style={styles.modalActions}>
                <button type="button" onClick={() => setShowAddModal(false)} style={styles.cancelBtn}>
                  Cancel
                </button>
                <button type="submit" style={styles.submitBtn}>
                  {editingCustomer ? 'Update Customer' : 'Save Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customer Detail Drawer */}
      {selectedCustomerDetail && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <div>
                <h3 style={{ margin: 0 }}>{selectedCustomerDetail.name}</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-sub)' }}>
                  {selectedCustomerDetail.businessName} • {selectedCustomerDetail.customerType}
                </span>
              </div>
              <button onClick={() => setSelectedCustomerDetail(null)} style={styles.closeBtn}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '16px 0', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '0.85rem' }}>
                <div><strong>Mobile:</strong> {selectedCustomerDetail.mobile}</div>
                <div><strong>Email:</strong> {selectedCustomerDetail.email}</div>
                <div><strong>GST:</strong> {selectedCustomerDetail.gstNumber || 'N/A'}</div>
                <div><strong>Status:</strong> {selectedCustomerDetail.status}</div>
                <div style={{ gridColumn: 'span 2' }}><strong>Address:</strong> {selectedCustomerDetail.address}</div>
              </div>
            </div>

            {/* Follow-ups Section */}
            <div style={{ marginTop: '16px' }}>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MessageSquare size={16} color="#5B90E5" />
                <span>Follow-up History Notes</span>
              </h4>

              <form onSubmit={handleAddFollowUp} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <input
                  type="text"
                  placeholder="Log follow-up note..."
                  value={newFollowUpNote}
                  onChange={(e) => setNewFollowUpNote(e.target.value)}
                  style={{ ...styles.input, flex: 1 }}
                />
                <button type="submit" style={styles.submitBtn}>
                  Add Note
                </button>
              </form>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                {followUps.length === 0 ? (
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-sub)' }}>No follow-up notes logged yet.</span>
                ) : (
                  followUps.map((f: any) => (
                    <div key={f.id} style={{ padding: '8px 12px', backgroundColor: 'var(--bg-section)', borderRadius: '8px', fontSize: '0.825rem' }}>
                      <p style={{ margin: '0 0 4px 0', fontWeight: 600 }}>{f.note}</p>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-sub)' }}>
                        Logged by {f.createdBy?.name || 'Staff'} on {new Date(f.createdAt).toLocaleString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
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
  filterBar: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  searchBox: {
    flex: 1,
    minWidth: '240px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    color: 'var(--text-main)',
    width: '100%',
    fontSize: '0.85rem',
  },
  selectFilter: {
    padding: '8px 12px',
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    color: 'var(--text-main)',
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
  typeBadge: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#5B90E5',
    backgroundColor: 'var(--very-light-blue)',
    padding: '2px 8px',
    borderRadius: '6px',
  },
  statusBadge: {
    fontSize: '0.75rem',
    fontWeight: 700,
    padding: '2px 8px',
    borderRadius: '6px',
  },
  iconBtn: {
    padding: '6px',
    backgroundColor: 'var(--bg-section)',
    border: '1px solid var(--border-color)',
    borderRadius: '6px',
    color: 'var(--text-main)',
  },
  paginationRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    fontSize: '0.8rem',
    color: 'var(--text-sub)',
    borderTop: '1px solid var(--border-color)',
  },
  pageBtn: {
    padding: '4px 10px',
    backgroundColor: 'var(--bg-section)',
    border: '1px solid var(--border-color)',
    borderRadius: '6px',
    fontSize: '0.75rem',
    color: 'var(--text-main)',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1200,
    padding: '20px',
  },
  modalContent: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '650px',
    maxHeight: '90vh',
    overflowY: 'auto',
    padding: '24px',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '1px solid var(--border-color)',
  },
  closeBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    color: 'var(--text-sub)',
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
    marginBottom: '16px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
  },
  label: {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: 'var(--text-main)',
    marginBottom: '4px',
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    backgroundColor: 'var(--bg-section)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    color: 'var(--text-main)',
    fontSize: '0.85rem',
    outline: 'none',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '12px',
  },
  cancelBtn: {
    padding: '8px 16px',
    backgroundColor: 'transparent',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    fontSize: '0.85rem',
    color: 'var(--text-main)',
  },
  submitBtn: {
    padding: '8px 16px',
    backgroundColor: '#5B90E5',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 700,
    fontSize: '0.85rem',
  },
};
