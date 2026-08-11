import React from 'react';
import type { InventoryAlertItem } from '../types/dashboard.types';
import { AlertTriangle, ArrowRight } from 'lucide-react';

interface InventoryAlertProps {
  alerts?: InventoryAlertItem[];
  loading?: boolean;
  onViewInventory?: () => void;
}

export const InventoryAlert: React.FC<InventoryAlertProps> = ({
  alerts = [],
  loading,
  onViewInventory,
}) => {
  if (loading) {
    return (
      <div style={styles.card}>
        <div style={styles.skeletonTitle} />
        <div style={styles.skeletonList} />
      </div>
    );
  }

  return (
    <div style={styles.card} className="card-hover-effect">
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={18} color="#E76576" />
          <h3 style={styles.title}>Inventory Alerts</h3>
        </div>
        <button onClick={onViewInventory} style={styles.viewBtn}>
          <span>View Inventory</span>
          <ArrowRight size={14} />
        </button>
      </div>

      <div style={styles.list}>
        {alerts.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={{ margin: 0, color: 'var(--text-sub)' }}>All inventory stock levels are healthy.</p>
          </div>
        ) : (
          alerts.map((item) => (
            <div key={item.id} style={styles.item}>
              <div>
                <strong style={styles.itemName}>{item.name}</strong>
                <span style={styles.itemCat}>{item.category}</span>
              </div>
              <div style={styles.stockBadge}>
                <span style={{ color: '#E76576', fontWeight: 800 }}>{item.stock} units</span>
                <span style={styles.minStockLabel}>(Min {item.minStock})</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  card: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: 'var(--shadow-card)',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  title: {
    fontSize: '1.1rem',
    fontWeight: 800,
    color: 'var(--text-main)',
  },
  viewBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'transparent',
    color: '#5B90E5',
    fontSize: '0.8rem',
    fontWeight: 700,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 14px',
    backgroundColor: 'var(--bg-section)',
    borderRadius: '10px',
    border: '1px solid var(--border-color)',
  },
  itemName: {
    display: 'block',
    fontSize: '0.85rem',
    color: 'var(--text-main)',
  },
  itemCat: {
    fontSize: '0.75rem',
    color: 'var(--text-sub)',
  },
  stockBadge: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    fontSize: '0.8rem',
  },
  minStockLabel: {
    fontSize: '0.7rem',
    color: 'var(--text-muted-dynamic)',
  },
  emptyState: {
    padding: '16px',
    textAlign: 'center',
  },
  skeletonTitle: {
    height: '18px',
    width: '120px',
    backgroundColor: 'var(--bg-section)',
    borderRadius: '4px',
    marginBottom: '16px',
  },
  skeletonList: {
    height: '100px',
    backgroundColor: 'var(--bg-section)',
    borderRadius: '8px',
  },
};
