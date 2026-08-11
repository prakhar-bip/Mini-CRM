import React from 'react';
import type { TeamAvailabilityStats } from '../types/managerDashboard.types';
import { Users } from 'lucide-react';

interface TeamAvailabilityCardProps {
  stats?: TeamAvailabilityStats;
  loading?: boolean;
}

export const TeamAvailabilityCard: React.FC<TeamAvailabilityCardProps> = ({
  stats,
  loading,
}) => {
  if (loading || !stats) {
    return (
      <div style={styles.card}>
        <div style={styles.skeletonTitle} />
        <div style={styles.skeletonList} />
      </div>
    );
  }

  const total = stats.active + stats.remote + stats.onLeave + stats.unavailable;

  return (
    <div style={styles.card} className="card-hover-effect">
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={18} color="#5B90E5" />
          <h3 style={styles.title}>Team Availability</h3>
        </div>
        <span style={styles.badge}>{total} Members</span>
      </div>

      <div style={styles.list}>
        <div style={styles.row}>
          <span style={styles.label}>Active On-Site</span>
          <span style={{ ...styles.val, color: '#45C98A' }}>{stats.active}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Remote Work</span>
          <span style={{ ...styles.val, color: '#5B90E5' }}>{stats.remote}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>On Leave</span>
          <span style={{ ...styles.val, color: '#9DC0F7' }}>{stats.onLeave}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Unavailable</span>
          <span style={{ ...styles.val, color: '#64748B' }}>{stats.unavailable}</span>
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
    gap: '10px',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 12px',
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
