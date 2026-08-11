import React, { useState, useEffect, useCallback } from 'react';
import { axiosClient } from '../../api/axiosClient';
import { ShoppingCart, CheckCircle2, XCircle, Eye, X, AlertCircle, Trash2, Printer } from 'lucide-react';

interface ChallansViewProps {
  autoOpenAdd?: boolean;
}

export const ChallansView: React.FC<ChallansViewProps> = ({ autoOpenAdd }) => {
  const [challans, setChallans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedChallanDetail, setSelectedChallanDetail] = useState<any | null>(null);

  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [apiErrorMsg, setApiErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (autoOpenAdd) {
      handleOpenCreate();
    }
  }, [autoOpenAdd]);

  // Form State
  const [selectedCustomerId, setSelectedCustomerId] = useState<number>(0);
  const [challanNumberInput, setChallanNumberInput] = useState('');
  const [items, setItems] = useState<{ productId: number; quantity: number }[]>([
    { productId: 0, quantity: 1 },
  ]);

  const loadChallans = useCallback(async () => {
    setLoading(true);
    try {
      let query = `/challans?page=${page}&limit=10`;
      if (statusFilter) query += `&status=${statusFilter}`;

      const res = await axiosClient.get(query);
      setChallans(res.data.data || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (err: any) {
      console.warn('Error loading challans:', err);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  const loadOptions = async () => {
    try {
      const [cRes, pRes] = await Promise.all([
        axiosClient.get('/customers?limit=100'),
        axiosClient.get('/products?limit=100'),
      ]);
      setCustomers(cRes.data.data || []);
      setProducts(pRes.data.data || []);

      if (cRes.data.data?.length > 0) setSelectedCustomerId(cRes.data.data[0].id);
      if (pRes.data.data?.length > 0) setItems([{ productId: pRes.data.data[0].id, quantity: 1 }]);
    } catch (err) {
      console.warn('Error loading options:', err);
    }
  };

  useEffect(() => {
    loadChallans();
  }, [loadChallans]);

  const handleOpenCreate = () => {
    loadOptions();
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const rand = Math.floor(1000 + Math.random() * 9000);
    setChallanNumberInput(`CH-${dateStr}-${rand}`);
    setFormError(null);
    setShowCreateModal(true);
  };

  const handleAddItemRow = () => {
    const defaultP = products[0]?.id || 0;
    setItems((prev) => [...prev, { productId: defaultP, quantity: 1 }]);
  };

  const handleRemoveItemRow = (idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleItemChange = (idx: number, field: 'productId' | 'quantity', val: any) => {
    setItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: val } : item))
    );
  };

  const calculateTotalQty = () => {
    return items.reduce((sum, item) => sum + (parseInt(String(item.quantity), 10) || 0), 0);
  };

  const handleSaveChallanDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setApiErrorMsg(null);
    try {
      if (!selectedCustomerId) {
        setFormError('Please select a customer.');
        return;
      }
      if (items.length === 0 || items.some((i) => !i.productId || i.quantity <= 0)) {
        setFormError('Please add valid products and quantities.');
        return;
      }

      await axiosClient.post('/challans', {
        customerId: selectedCustomerId,
        challanNumber: challanNumberInput.trim() || undefined,
        items,
      });

      setSuccessMsg('Sales Challan saved as DRAFT successfully!');
      setShowCreateModal(false);
      loadChallans();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to create challan draft');
    }
  };

  const handleConfirmChallan = async (challanId: number) => {
    setApiErrorMsg(null);
    try {
      await axiosClient.put(`/challans/${challanId}/confirm`);
      setSuccessMsg(`Challan #${challanId} CONFIRMED! Stock deducted successfully.`);
      loadChallans();
      if (selectedChallanDetail && selectedChallanDetail.id === challanId) {
        setSelectedChallanDetail(null);
      }
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      // Handles insufficient stock or invalid status error
      const msg = err.response?.data?.message || 'Failed to confirm challan';
      setApiErrorMsg(msg);
    }
  };

  const handleCancelChallan = async (challanId: number) => {
    setApiErrorMsg(null);
    try {
      await axiosClient.put(`/challans/${challanId}/cancel`);
      setSuccessMsg('Challan cancelled successfully.');
      loadChallans();
      setSelectedChallanDetail(null);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setApiErrorMsg(err.response?.data?.message || 'Failed to cancel challan');
    }
  };

  const handleViewDetail = async (id: number) => {
    try {
      const res = await axiosClient.get(`/challans/${id}`);
      setSelectedChallanDetail(res.data);
    } catch (err: any) {
      alert('Failed to view challan details');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <div>
          <h2 style={styles.heading}>Sales Challans & Order Fulfillment</h2>
          <p style={styles.subheading}>Create sales challans, save drafts, and confirm orders with automatic stock deduction.</p>
        </div>
        <button onClick={handleOpenCreate} style={styles.addBtn}>
          <ShoppingCart size={16} />
          <span>+ Create Sales Challan</span>
        </button>
      </div>

      {successMsg && (
        <div style={styles.successBanner}>
          <CheckCircle2 size={16} color="#45C98A" />
          <span>{successMsg}</span>
        </div>
      )}

      {apiErrorMsg && (
        <div style={styles.errorBox}>
          <AlertCircle size={16} color="#E76576" />
          <span>{apiErrorMsg}</span>
          <button onClick={() => setApiErrorMsg(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#E76576' }}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* Filter Bar */}
      <div style={styles.filterBar}>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={styles.selectFilter}
        >
          <option value="">All Challan Statuses</option>
          <option value="DRAFT">DRAFT</option>
          <option value="CONFIRMED">CONFIRMED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
      </div>

      {/* Table */}
      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Challan #</th>
              <th style={styles.th}>Customer</th>
              <th style={styles.th}>Total Quantity</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Created By</th>
              <th style={styles.th}>Created Date</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '30px' }}>
                  Loading challans...
                </td>
              </tr>
            ) : challans.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-sub)' }}>
                  No sales challans found.
                </td>
              </tr>
            ) : (
              challans.map((ch) => (
                <tr key={ch.id} style={styles.tr}>
                  <td style={styles.td}>
                    <strong>{ch.challanNumber}</strong>
                  </td>
                  <td style={styles.td}>
                    <div>{ch.customer?.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)' }}>{ch.customer?.businessName}</div>
                  </td>
                  <td style={{ ...styles.td, fontWeight: 700 }}>{ch.totalQuantity} Units</td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.statusBadge,
                        backgroundColor:
                          ch.status === 'CONFIRMED'
                            ? '#F0FDF4'
                            : ch.status === 'DRAFT'
                            ? '#EFF6FF'
                            : '#FEF2F2',
                        color:
                          ch.status === 'CONFIRMED'
                            ? '#45C98A'
                            : ch.status === 'DRAFT'
                            ? '#5B90E5'
                            : '#E76576',
                      }}
                    >
                      {ch.status}
                    </span>
                  </td>
                  <td style={styles.td}>{ch.createdBy?.name || 'Sales Staff'}</td>
                  <td style={styles.td}>{new Date(ch.createdAt).toISOString().slice(0, 10)}</td>
                  <td style={{ ...styles.td, textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button onClick={() => handleViewDetail(ch.id)} style={styles.iconBtn} title="View Details">
                        <Eye size={14} />
                      </button>
                      {ch.status === 'DRAFT' && (
                        <button
                          onClick={() => handleConfirmChallan(ch.id)}
                          style={styles.confirmBtn}
                          title="Confirm & Deduct Stock"
                        >
                          Confirm
                        </button>
                      )}
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

      {/* Create Sales Challan Modal */}
      {showCreateModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3>Create Sales Challan (Draft)</h3>
              <button onClick={() => setShowCreateModal(false)} style={styles.closeBtn}>
                <X size={18} />
              </button>
            </div>

            {formError && (
              <div style={styles.errorBox}>
                <AlertCircle size={16} color="#E76576" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveChallanDraft} style={styles.form}>
              <div style={styles.formGrid}>
                <div>
                  <label style={styles.label}>Select Customer *</label>
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => setSelectedCustomerId(parseInt(e.target.value, 10))}
                    style={styles.input}
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.businessName})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={styles.label}>Challan Number *</label>
                  <input
                    type="text"
                    value={challanNumberInput}
                    onChange={(e) => setChallanNumberInput(e.target.value)}
                    style={styles.input}
                  />
                </div>
              </div>

              {/* Line Items */}
              <div style={{ marginTop: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={styles.label}>Line Item Products *</label>
                  <button type="button" onClick={handleAddItemRow} style={styles.smallAddBtn}>
                    + Add Line Item
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <select
                        value={item.productId}
                        onChange={(e) => handleItemChange(idx, 'productId', parseInt(e.target.value, 10))}
                        style={{ ...styles.input, flex: 2 }}
                      >
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} (SKU: {p.sku}) — Stock: {p.currentStock}
                          </option>
                        ))}
                      </select>

                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(idx, 'quantity', parseInt(e.target.value, 10))}
                        style={{ ...styles.input, flex: 1 }}
                        placeholder="Qty"
                      />

                      {items.length > 1 && (
                        <button type="button" onClick={() => handleRemoveItemRow(idx)} style={styles.trashBtn}>
                          <Trash2 size={14} color="#E76576" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '12px', fontSize: '0.85rem', fontWeight: 700, textAlign: 'right' }}>
                  Total Quantity: <span style={{ color: '#5B90E5' }}>{calculateTotalQty()} Units</span>
                </div>
              </div>

              <div style={styles.modalActions}>
                <button type="button" onClick={() => setShowCreateModal(false)} style={styles.cancelBtn}>
                  Cancel
                </button>
                <button type="submit" style={styles.submitBtn}>
                  Save Draft Challan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Drawer */}
      {selectedChallanDetail && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <div>
                <h3 style={{ margin: 0 }}>Challan {selectedChallanDetail.challanNumber}</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-sub)' }}>
                  Customer: {selectedChallanDetail.customer?.name} ({selectedChallanDetail.customer?.businessName})
                </span>
              </div>
              <button onClick={() => setSelectedChallanDetail(null)} style={styles.closeBtn}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '12px 0', borderBottom: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
              <div><strong>Status:</strong> {selectedChallanDetail.status}</div>
              <div><strong>Total Quantity:</strong> {selectedChallanDetail.totalQuantity} Units</div>
              <div><strong>Created By:</strong> {selectedChallanDetail.createdBy?.name} ({selectedChallanDetail.createdBy?.role})</div>
              <div><strong>Date:</strong> {new Date(selectedChallanDetail.createdAt).toLocaleString()}</div>
            </div>

            <div style={{ marginTop: '16px' }}>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '8px' }}>Line Items (Snapshots Saved)</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {selectedChallanDetail.items?.map((item: any) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: 'var(--bg-section)', borderRadius: '6px', fontSize: '0.825rem' }}>
                    <div>
                      <strong>{item.productNameSnapshot}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)' }}>SKU: {item.skuSnapshot}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div>{item.quantity} Units × ₹{item.unitPriceSnapshot}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => window.print()}
                style={{
                  padding: '8px 14px',
                  backgroundColor: 'var(--bg-section)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  color: 'var(--text-main)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                }}
              >
                <Printer size={14} />
                <span>Print / Export PDF</span>
              </button>
              {selectedChallanDetail.status === 'DRAFT' && (
                <>
                  <button onClick={() => handleCancelChallan(selectedChallanDetail.id)} style={styles.cancelBtn}>
                    <XCircle size={14} />
                    <span>Cancel Challan</span>
                  </button>
                  <button onClick={() => handleConfirmChallan(selectedChallanDetail.id)} style={styles.submitBtn}>
                    <CheckCircle2 size={14} />
                    <span>Confirm & Deduct Stock</span>
                  </button>
                </>
              )}
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
  statusBadge: {
    fontSize: '0.75rem',
    fontWeight: 700,
    padding: '2px 8px',
    borderRadius: '6px',
  },
  confirmBtn: {
    padding: '4px 10px',
    backgroundColor: '#45C98A',
    color: '#FFFFFF',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: 700,
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
  smallAddBtn: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#5B90E5',
    backgroundColor: 'transparent',
    border: 'none',
  },
  trashBtn: {
    padding: '6px',
    backgroundColor: 'transparent',
    border: 'none',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '12px',
  },
  cancelBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    backgroundColor: 'transparent',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    fontSize: '0.85rem',
    color: 'var(--text-main)',
  },
  submitBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    backgroundColor: '#5B90E5',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 700,
    fontSize: '0.85rem',
  },
};
