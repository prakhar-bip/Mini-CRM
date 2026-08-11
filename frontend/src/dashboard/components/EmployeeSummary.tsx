import React from 'react';
import type { EmployeeStats } from '../types/dashboard.types';
import { UserCheck } from 'lucide-react';

interface EmployeeSummaryProps {
  stats?: EmployeeStats;
  loading?: boolean;
}

export const EmployeeSummary: React.FC<EmployeeSummaryProps> = ({ stats, loading }) => {
  if (loading || !stats) {
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
          <UserCheck size={18} color="#5B90E5" />
          <h3 style={styles.title}>Employee Overview</h3>
        </div>
        <span style={styles.badge}>{stats.total} Total</span>
      </div>

      <div style={styles.list}>
        <div style={styles.row}>
          <span style={styles.label}>Active Workforce</span>
          <span style={{ ...styles.val, color: '#45C98A' }}>{stats.active}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>On Scheduled Leave</span>
          <span style={{ ...styles.val, color: '#5B90E5' }}>{stats.onLeave}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Inactive / Suspended</span>
          <span style={{ ...styles.val, color: '#64748B' }}>{stats.inactive}</span>
        </div>
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
  badge: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#5B90E5',
    backgroundColor: 'var(--very-light-blue)',
    padding: '4px 10px',
    borderRadius: '12px',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 12px',
    backgroundColor: 'var(--bg-section)',
    borderRadius: '8px',
    fontSize: '0.85rem',
  },
  label: {
    color: 'var(--text-main)',
    fontWeight: 600,
  },
  val: {
    fontWeight: 800,
    fontSize: '0.95rem',
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
