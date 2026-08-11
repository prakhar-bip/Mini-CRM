import React from 'react';
import { UserPlus, FileSpreadsheet, PackagePlus, UserCheck, FileBarChart } from 'lucide-react';

interface QuickActionsProps {
  onActionClick: (actionKey: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onActionClick }) => {
  return (
    <div style={styles.card} className="card-hover-effect">
      <h3 style={styles.title}>Quick Actions</h3>
      <div style={styles.btnGrid}>
        <button
          onClick={() => onActionClick('add_customer')}
          style={{ ...styles.btn, backgroundColor: '#5B90E5', color: '#FFFFFF', border: 'none' }}
        >
          <UserPlus size={16} />
          <span>Add Customer</span>
        </button>

        <button
          onClick={() => onActionClick('create_order')}
          style={styles.secondaryBtn}
        >
          <FileSpreadsheet size={16} color="#5B90E5" />
          <span>Create Order</span>
        </button>

        <button
          onClick={() => onActionClick('add_product')}
          style={styles.secondaryBtn}
        >
          <PackagePlus size={16} color="#5B90E5" />
          <span>Add Product</span>
        </button>

        <button
          onClick={() => onActionClick('add_employee')}
          style={styles.secondaryBtn}
        >
          <UserCheck size={16} color="#5B90E5" />
          <span>Add Employee</span>
        </button>

        <button
          onClick={() => onActionClick('generate_report')}
          style={styles.secondaryBtn}
        >
          <FileBarChart size={16} color="#5B90E5" />
          <span>Generate Report</span>
        </button>
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
  title: {
    fontSize: '1.1rem',
    fontWeight: 800,
    color: 'var(--text-main)',
    marginBottom: '16px',
  },
  btnGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
  },
  btn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: 700,
    cursor: 'pointer',
  },
  secondaryBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: 700,
    backgroundColor: 'var(--bg-card)',
    color: 'var(--text-main)',
    border: '1px solid var(--border-color)',
    cursor: 'pointer',
  },
};
