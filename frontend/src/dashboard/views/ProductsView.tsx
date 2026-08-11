import React, { useState, useEffect, useCallback } from 'react';
import { axiosClient } from '../../api/axiosClient';
import { Search, Plus, Edit2, AlertTriangle, X, CheckCircle2, AlertCircle } from 'lucide-react';
interface ProductsViewProps {
  autoOpenAdd?: boolean;
}

export const ProductsView: React.FC<ProductsViewProps> = ({ autoOpenAdd }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (autoOpenAdd) {
      handleOpenAdd();
    }
  }, [autoOpenAdd]);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    unitPrice: '',
    currentStock: '0',
    minimumStock: '5',
    warehouseLocation: '',
  });

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      let query = `/products?page=${page}&limit=10`;
      if (search) query += `&search=${encodeURIComponent(search)}`;
      if (categoryFilter) query += `&category=${encodeURIComponent(categoryFilter)}`;
      if (lowStockOnly) query += `&lowStock=true`;

      const res = await axiosClient.get(query);
      setProducts(res.data.data || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (err: any) {
      console.warn('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  }, [page, search, categoryFilter, lowStockOnly]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      category: 'General',
      unitPrice: '100',
      currentStock: '10',
      minimumStock: '5',
      warehouseLocation: 'Warehouse A1',
    });
    setFormError(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (p: any) => {
    setEditingProduct(p);
    setFormData({
      name: p.name || '',
      sku: p.sku || '',
      category: p.category || '',
      unitPrice: p.unitPrice ? p.unitPrice.toString() : '0',
      currentStock: p.currentStock ? p.currentStock.toString() : '0',
      minimumStock: p.minimumStock ? p.minimumStock.toString() : '0',
      warehouseLocation: p.warehouseLocation || '',
    });
    setFormError(null);
    setShowAddModal(true);
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    try {
      const payload = {
        name: formData.name,
        sku: formData.sku,
        category: formData.category,
        unitPrice: parseFloat(formData.unitPrice),
        currentStock: parseInt(formData.currentStock, 10),
        minimumStock: parseInt(formData.minimumStock, 10),
        warehouseLocation: formData.warehouseLocation,
      };

      if (editingProduct) {
        await axiosClient.put(`/products/${editingProduct.id}`, payload);
        setSuccessMsg('Product updated successfully!');
      } else {
        await axiosClient.post('/products', payload);
        setSuccessMsg('Product created successfully!');
      }

      setShowAddModal(false);
      loadProducts();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to save product');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <div>
          <h2 style={styles.heading}>Product Catalog Management</h2>
          <p style={styles.subheading}>Manage products, SKUs, pricing, and warehouse locations.</p>
        </div>
        <button onClick={handleOpenAdd} style={styles.addBtn}>
          <Plus size={16} />
          <span>+ Add Product</span>
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
            placeholder="Search by product name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <input
          type="text"
          placeholder="Filter Category..."
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={styles.selectFilter}
        />

        <label style={styles.lowStockToggle}>
          <input
            type="checkbox"
            checked={lowStockOnly}
            onChange={(e) => setLowStockOnly(e.target.checked)}
          />
          <span>Low Stock Alerts Only</span>
        </label>
      </div>

      {/* Table */}
      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Product Name</th>
              <th style={styles.th}>SKU</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Unit Price</th>
              <th style={styles.th}>Current Stock</th>
              <th style={styles.th}>Min Alert</th>
              <th style={styles.th}>Location</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '30px' }}>
                  Loading catalog...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-sub)' }}>
                  No products found matching query.
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
                    <td style={styles.td}>
                      <code>{p.sku}</code>
                    </td>
                    <td style={styles.td}>{p.category}</td>
                    <td style={{ ...styles.td, fontWeight: 700 }}>₹{p.unitPrice}</td>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: 800, color: isLow ? '#E76576' : 'var(--text-main)' }}>
                          {p.currentStock}
                        </span>
                        {isLow && <AlertTriangle size={14} color="#E76576" />}
                      </div>
                    </td>
                    <td style={styles.td}>{p.minimumStock}</td>
                    <td style={styles.td}>{p.warehouseLocation}</td>
                    <td style={{ ...styles.td, textAlign: 'right' }}>
                      <button onClick={() => handleOpenEdit(p)} style={styles.iconBtn} title="Edit Product">
                        <Edit2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })
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

      {/* Add / Edit Product Modal */}
      {showAddModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
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

            <form onSubmit={handleSubmitProduct} style={styles.form}>
              <div style={styles.formGrid}>
                <div>
                  <label style={styles.label}>Product Name *</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={styles.input}
                    placeholder="e.g. Copper Wire 10mm"
                  />
                </div>
                <div>
                  <label style={styles.label}>SKU Code * (Unique)</label>
                  <input
                    required
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    style={styles.input}
                    placeholder="SKU-1092"
                  />
                </div>
                <div>
                  <label style={styles.label}>Category *</label>
                  <input
                    required
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={styles.input}
                    placeholder="Electrical"
                  />
                </div>
                <div>
                  <label style={styles.label}>Unit Price (₹) *</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    value={formData.unitPrice}
                    onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                    style={styles.input}
                    placeholder="250.00"
                  />
                </div>
                <div>
                  <label style={styles.label}>Current Stock Quantity *</label>
                  <input
                    required
                    type="number"
                    value={formData.currentStock}
                    onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })}
                    style={styles.input}
                    placeholder="50"
                  />
                </div>
                <div>
                  <label style={styles.label}>Minimum Stock Alert *</label>
                  <input
                    required
                    type="number"
                    value={formData.minimumStock}
                    onChange={(e) => setFormData({ ...formData, minimumStock: e.target.value })}
                    style={styles.input}
                    placeholder="10"
                  />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={styles.label}>Warehouse Location *</label>
                  <input
                    required
                    type="text"
                    value={formData.warehouseLocation}
                    onChange={(e) => setFormData({ ...formData, warehouseLocation: e.target.value })}
                    style={styles.input}
                    placeholder="Rack B4, Warehouse 1"
                  />
                </div>
              </div>

              <div style={styles.modalActions}>
                <button type="button" onClick={() => setShowAddModal(false)} style={styles.cancelBtn}>
                  Cancel
                </button>
                <button type="submit" style={styles.submitBtn}>
                  {editingProduct ? 'Update Product' : 'Save Product'}
                </button>
              </div>
            </form>
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
  lowStockToggle: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'var(--text-main)',
    cursor: 'pointer',
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
