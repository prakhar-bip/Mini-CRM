import React, { useState, useEffect, useCallback } from 'react';
import { axiosClient } from '../../api/axiosClient';
import { Boxes, ArrowUpRight, ArrowDownLeft, AlertCircle, CheckCircle2, History, X } from 'lucide-react';

interface InventoryViewProps {
  autoOpenAdd?: boolean;
}

export const InventoryView: React.FC<InventoryViewProps> = ({ autoOpenAdd }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [movements, setMovements] = useState<any[]>([]);
  const [showAdjustModal, setShowAdjustModal] = useState(false);

  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (autoOpenAdd) {
      handleOpenAdjust();
    }
  }, [autoOpenAdd]);

  const [adjustData, setAdjustData] = useState({
    productId: 0,
    type: 'IN',
    quantity: '10',
    reason: 'Purchase Order stock arrival',
  });

  const loadInventory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/products?limit=50');
      setProducts(res.data.data || []);
    } catch (err: any) {
      console.warn('Error loading inventory:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  const handleOpenAdjust = (p?: any) => {
    setAdjustData({
      productId: p ? p.id : products[0]?.id || 0,
      type: 'IN',
      quantity: '10',
      reason: 'Stock Audit / PO Intake',
    });
    setFormError(null);
    setShowAdjustModal(true);
  };

  const handleViewMovements = async (p: any) => {
    setSelectedProduct(p);
    try {
      const res = await axiosClient.get(`/products/${p.id}/movements`);
      setMovements(res.data || []);
    } catch (err) {
      setMovements([]);
    }
  };

  const handleSubmitAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    try {
      const pId = adjustData.productId;
      const qty = parseInt(adjustData.quantity, 10);
      if (!pId || qty <= 0) {
        setFormError('Please select a valid product and positive quantity.');
        return;
      }

      await axiosClient.post(`/products/${pId}/movements`, {
        quantity: qty,
        type: adjustData.type,
        reason: adjustData.reason,
      });

      setSuccessMsg(`Stock movement (${adjustData.type} ${qty}) logged successfully!`);
      setShowAdjustModal(false);
      loadInventory();
      if (selectedProduct && selectedProduct.id === pId) {
        handleViewMovements(selectedProduct);
      }
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      // Handles negative stock error or bad request
      setFormError(err.response?.data?.message || 'Failed to log stock movement.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <div>
          <h2 style={styles.heading}>Inventory Control & Stock Adjustments</h2>
          <p style={styles.subheading}>Track current stock levels, log Stock IN/OUT movements, and audit inventory logs.</p>
        </div>
        <button onClick={() => handleOpenAdjust()} style={styles.addBtn}>
          <Boxes size={16} />
          <span>+ Log Stock Movement</span>
        </button>
      </div>

      {successMsg && (
        <div style={styles.successBanner}>
          <CheckCircle2 size={16} color="#45C98A" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Table */}
      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Product Name</th>
              <th style={styles.th}>SKU</th>
              <th style={styles.th}>Warehouse Location</th>
              <th style={styles.th}>Current Stock</th>
              <th style={styles.th}>Min Stock Alert</th>
              <th style={styles.th}>Inventory Status</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '30px' }}>
                  Loading inventory stock...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-sub)' }}>
                  No inventory items found.
                </td>
              </tr>
            ) : (
              products.map((p) => {
                const isLow = p.currentStock <= p.minimumStock;
                return (
                  <tr key={p.id} style={styles.tr}>
                    <td style={styles.td}>
                      <strong>{p.name}</strong>
                    </td>
                    <td style={styles.td}><code>{p.sku}</code></td>
                    <td style={styles.td}>{p.warehouseLocation}</td>
                    <td style={{ ...styles.td, fontWeight: 800, fontSize: '1rem', color: isLow ? '#E76576' : '#5B90E5' }}>
                      {p.currentStock}
                    </td>
                    <td style={styles.td}>{p.minimumStock}</td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.statusBadge,
                          backgroundColor: isLow ? '#FEF2F2' : '#F0FDF4',
                          color: isLow ? '#E76576' : '#45C98A',
                        }}
                      >
                        {isLow ? 'Low Stock Warning' : 'Healthy Stock'}
                      </span>
                    </td>
                    <td style={{ ...styles.td, textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button onClick={() => handleOpenAdjust(p)} style={styles.actionBtn}>
                          Adjust
                        </button>
                        <button onClick={() => handleViewMovements(p)} style={styles.iconBtn} title="View Stock Movement Audit History">
                          <History size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Stock Adjustment Modal */}
      {showAdjustModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3>Log Stock Movement (IN / OUT)</h3>
              <button onClick={() => setShowAdjustModal(false)} style={styles.closeBtn}>
                <X size={18} />
              </button>
            </div>

            {formError && (
              <div style={styles.errorBox}>
                <AlertCircle size={16} color="#E76576" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitAdjustment} style={styles.form}>
              <div>
                <label style={styles.label}>Select Product *</label>
                <select
                  value={adjustData.productId}
                  onChange={(e) => setAdjustData({ ...adjustData, productId: parseInt(e.target.value, 10) })}
                  style={styles.input}
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (SKU: {p.sku}) — Available: {p.currentStock}
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.formGrid}>
                <div>
                  <label style={styles.label}>Movement Type *</label>
                  <select
                    value={adjustData.type}
                    onChange={(e) => setAdjustData({ ...adjustData, type: e.target.value })}
                    style={styles.input}
                  >
                    <option value="IN">IN (Stock Arrival / Purchase)</option>
                    <option value="OUT">OUT (Stock Deduction / Issue)</option>
                  </select>
                </div>

                <div>
                  <label style={styles.label}>Quantity *</label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={adjustData.quantity}
                    onChange={(e) => setAdjustData({ ...adjustData, quantity: e.target.value })}
                    style={styles.input}
                  />
                </div>
              </div>

              <div>
                <label style={styles.label}>Reason / Reference *</label>
                <textarea
                  required
                  rows={2}
                  value={adjustData.reason}
                  onChange={(e) => setAdjustData({ ...adjustData, reason: e.target.value })}
                  style={styles.input}
                  placeholder="e.g. Received PO #1042 or Damaged Stock Deduction"
                />
              </div>

              <div style={styles.modalActions}>
                <button type="button" onClick={() => setShowAdjustModal(false)} style={styles.cancelBtn}>
                  Cancel
                </button>
                <button type="submit" style={styles.submitBtn}>
                  Log Stock Movement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Movement Audit Trail Drawer */}
      {selectedProduct && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <div>
                <h3 style={{ margin: 0 }}>Stock Audit History</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-sub)' }}>
                  {selectedProduct.name} (SKU: {selectedProduct.sku})
                </span>
              </div>
              <button onClick={() => setSelectedProduct(null)} style={styles.closeBtn}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
              {movements.length === 0 ? (
                <span style={{ fontSize: '0.8rem', color: 'var(--text-sub)' }}>No stock movement logs found for this product.</span>
              ) : (
                movements.map((m) => (
                  <div
                    key={m.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      backgroundColor: 'var(--bg-section)',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {m.type === 'IN' ? (
                        <ArrowDownLeft size={18} color="#45C98A" />
                      ) : (
                        <ArrowUpRight size={18} color="#E76576" />
                      )}
                      <div>
                        <strong>{m.type} {m.quantity} Units</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)' }}>{m.reason}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-sub)' }}>
                      <div>{m.createdBy?.name || 'User'}</div>
                      <div>{new Date(m.createdAt).toLocaleString()}</div>
                    </div>
                  </div>
                ))
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
  actionBtn: {
    padding: '4px 10px',
    backgroundColor: 'var(--bg-card)',
    border: '1px solid #5B90E5',
    color: '#5B90E5',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: 600,
  },
  iconBtn: {
    padding: '6px',
    backgroundColor: 'var(--bg-section)',
    border: '1px solid var(--border-color)',
    borderRadius: '6px',
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
    maxWidth: '550px',
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
