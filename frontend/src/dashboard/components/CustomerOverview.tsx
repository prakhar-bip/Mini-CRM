import React from 'react';
import type { CustomerStats } from '../types/dashboard.types';
import { Users, UserCheck, UserPlus, Target } from 'lucide-react';

interface CustomerOverviewProps {
  stats?: CustomerStats;
  loading?: boolean;
}

export const CustomerOverview: React.FC<CustomerOverviewProps> = ({ stats, loading }) => {
  if (loading || !stats) {
    return (
      <div style={styles.card}>
        <div style={styles.skeletonTitle} />
        <div style={styles.skeletonGrid} />
      </div>
    );
  }

  return (
    <div style={styles.card} className="card-hover-effect">
      <div style={styles.header}>
        <h3 style={styles.title}>Customer Overview</h3>
        <span style={styles.badge}>CRM Performance</span>
      </div>

      <div style={styles.grid}>
        <div style={styles.statBox}>
          <div style={styles.statTop}>
            <UserPlus size={16} color="#5B90E5" />
            <span style={styles.statLabel}>New Customers</span>
          </div>
          <span style={styles.statVal}>{stats.newCustomers}</span>
        </div>

        <div style={styles.statBox}>
          <div style={styles.statTop}>
            <UserCheck size={16} color="#45C98A" />
            <span style={styles.statLabel}>Active Customers</span>
          </div>
          <span style={styles.statVal}>{stats.activeCustomers.toLocaleString()}</span>
        </div>

        <div style={styles.statBox}>
          <div style={styles.statTop}>
            <Users size={16} color="#9DC0F7" />
            <span style={styles.statLabel}>Leads Pipeline</span>
          </div>
          <span style={styles.statVal}>{stats.leads}</span>
        </div>

        <div style={styles.statBox}>
          <div style={styles.statTop}>
            <Target size={16} color="#5B90E5" />
            <span style={styles.statLabel}>Conversion Rate</span>
          </div>
          <span style={{ ...styles.statVal, color: '#45C98A' }}>{stats.conversionRate}</span>
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
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  title: {
    fontSize: '1.1rem',
    fontWeight: 800,
    color: 'var(--text-main)',
  },
  badge: {
    fontSize: '0.7rem',
    fontWeight: 700,
    color: '#5B90E5',
    backgroundColor: 'var(--very-light-blue)',
    padding: '2px 8px',
    borderRadius: '6px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
  },
  statBox: {
    backgroundColor: 'var(--bg-section)',
    borderRadius: '12px',
    padding: '16px',
    border: '1px solid var(--border-color)',
  },
  statTop: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
  },
  statLabel: {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: 'var(--text-sub)',
  },
  statVal: {
    fontSize: '1.4rem',
    fontWeight: 800,
    color: 'var(--text-main)',
  },
  skeletonTitle: {
    height: '18px',
    width: '120px',
    backgroundColor: 'var(--bg-section)',
    borderRadius: '4px',
    marginBottom: '20px',
  },
  skeletonGrid: {
    height: '80px',
    backgroundColor: 'var(--bg-section)',
    borderRadius: '12px',
  },
};
