import React, { useState } from 'react';
import type { OrderRow } from '../types/dashboard.types';
import { MoreVertical, Eye, Edit, Trash2 } from 'lucide-react';

interface OrdersTableProps {
  orders?: OrderRow[];
  loading?: boolean;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({
  orders = [],
  loading,
}) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const getStatusBadge = (status: OrderRow['status']) => {
    switch (status) {
      case 'Completed':
        return <span style={styles.badgeSuccess}>Completed</span>;
      case 'Processing':
        return <span style={styles.badgeProcessing}>Processing</span>;
      case 'Pending':
        return <span style={styles.badgePending}>Pending</span>;
      case 'Cancelled':
        return <span style={styles.badgeCancelled}>Cancelled</span>;
      default:
        return <span style={styles.badgePending}>{status}</span>;
    }
  };

  const handleDelete = (_id: string, orderNum: string) => {
    if (window.confirm(`Are you sure you want to delete order ${orderNum}? This action cannot be undone.`)) {
      alert(`Order ${orderNum} deleted successfully.`);
      setActiveMenuId(null);
    }
  };

  if (loading) {
    return (
      <div style={styles.card}>
        <div style={styles.skeletonHeader} />
        <div style={styles.skeletonTable} />
      </div>
    );
  }

  return (
    <div style={styles.card} className="card-hover-effect">
      <div style={styles.cardHeader}>
        <h3 style={styles.title}>Recent Orders</h3>
        <span style={styles.badgeCount}>{orders.length} Active Orders</span>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Order ID</th>
              <th style={styles.th}>Customer</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Assigned To</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} style={styles.tr}>
                <td style={styles.td}>
                  <strong>{order.orderNumber}</strong>
                </td>
                <td style={styles.td}>{order.customerName}</td>
                <td style={styles.td}>{order.date}</td>
                <td style={{ ...styles.td, fontWeight: 700 }}>{order.amount}</td>
                <td style={styles.td}>{getStatusBadge(order.status)}</td>
                <td style={styles.td}>{order.assignedTo}</td>
                <td style={{ ...styles.td, textAlign: 'right', position: 'relative' }}>
                  <button
                    onClick={() =>
                      setActiveMenuId(activeMenuId === order.id ? null : order.id)
                    }
                    style={styles.actionBtn}
                  >
                    <MoreVertical size={16} color="#64748B" />
                  </button>

                  {activeMenuId === order.id && (
                    <div style={styles.actionMenu}>
                      <button
                        onClick={() => {
                          alert(`View Order ${order.orderNumber}`);
                          setActiveMenuId(null);
                        }}
                        style={styles.menuItem}
                      >
                        <Eye size={14} />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => {
                          alert(`Edit Order ${order.orderNumber}`);
                          setActiveMenuId(null);
                        }}
                        style={styles.menuItem}
                      >
                        <Edit size={14} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(order.id, order.orderNumber)}
                        style={{ ...styles.menuItem, color: '#E76576' }}
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  title: {
    fontSize: '1.15rem',
    fontWeight: 800,
    color: 'var(--text-main)',
  },
  badgeCount: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#5B90E5',
    backgroundColor: 'var(--very-light-blue)',
    padding: '4px 10px',
    borderRadius: '12px',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.875rem',
  },
  th: {
    textAlign: 'left',
    padding: '12px 14px',
    backgroundColor: 'var(--bg-section)',
    color: 'var(--text-main)',
    fontWeight: 700,
    borderBottom: '1px solid var(--border-color)',
  },
  tr: {
    transition: 'background-color 0.15s ease',
  },
  td: {
    padding: '14px',
    borderBottom: '1px solid var(--border-color)',
    color: 'var(--text-main)',
  },
  badgeSuccess: {
    backgroundColor: '#F0FDF4',
    color: '#45C98A',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: 700,
    border: '1px solid #BBF7D0',
  },
  badgeProcessing: {
    backgroundColor: '#EFF6FF',
    color: '#5B90E5',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: 700,
    border: '1px solid #BFDBFE',
  },
  badgePending: {
    backgroundColor: '#F1F5F9',
    color: '#64748B',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: 700,
    border: '1px solid #CBD5E1',
  },
  badgeCancelled: {
    backgroundColor: '#FEF2F2',
    color: '#E76576',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: 700,
    border: '1px solid #FCA5A5',
  },
  actionBtn: {
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    backgroundColor: 'transparent',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionMenu: {
    position: 'absolute',
    top: '36px',
    right: '12px',
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '10px',
    boxShadow: 'var(--shadow-modal)',
    padding: '6px',
    zIndex: 100,
    display: 'flex',
    flexDirection: 'column',
    width: '120px',
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 10px',
    backgroundColor: 'transparent',
    color: 'var(--text-main)',
    fontSize: '0.8rem',
    fontWeight: 600,
    borderRadius: '6px',
    textAlign: 'left',
  },
  skeletonHeader: {
    height: '20px',
    width: '140px',
    backgroundColor: 'var(--bg-section)',
    borderRadius: '4px',
    marginBottom: '20px',
  },
  skeletonTable: {
    height: '180px',
    backgroundColor: 'var(--bg-section)',
    borderRadius: '10px',
  },
};
