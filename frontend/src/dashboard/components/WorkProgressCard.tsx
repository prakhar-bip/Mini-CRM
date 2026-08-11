import React from 'react';
import type { WorkProgressStats } from '../types/employeeDashboard.types';
import { Award } from 'lucide-react';

interface WorkProgressCardProps {
  progress?: WorkProgressStats;
  loading?: boolean;
}

export const WorkProgressCard: React.FC<WorkProgressCardProps> = ({ progress, loading }) => {
  if (loading || !progress) {
    return (
      <div style={styles.card}>
        <div style={styles.skeletonTitle} />
        <div style={styles.skeletonBody} />
      </div>
    );
  }

  const isExceeded = progress.percentage >= 100;
  const barColor = isExceeded ? '#45C98A' : '#5B90E5';

  return (
    <div style={styles.card} className="card-hover-effect">
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Award size={18} color={barColor} />
          <h3 style={styles.title}>My Work Progress</h3>
        </div>
        <span style={styles.badge}>{progress.percentage}% Target</span>
      </div>

      <div style={styles.content}>
        <div style={styles.numbersRow}>
          <div>
            <span style={styles.subLabel}>Completed Tasks</span>
            <strong style={styles.bigVal}>{progress.completed} / {progress.total}</strong>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={styles.subLabel}>Completion Rate</span>
            <strong style={{ ...styles.bigVal, color: barColor }}>{progress.percentage}%</strong>
          </div>
        </div>

        <div style={styles.track}>
          <div
            style={{
              width: `${Math.min(progress.percentage, 100)}%`,
              backgroundColor: barColor,
              height: '100%',
              borderRadius: '6px',
            }}
          />
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
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#5B90E5',
    backgroundColor: 'var(--very-light-blue)',
    padding: '4px 10px',
    borderRadius: '12px',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  numbersRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-sub)',
    display: 'block',
  },
  bigVal: {
    fontSize: '1.4rem',
    fontWeight: 800,
    color: 'var(--text-main)',
  },
  track: {
    height: '10px',
    backgroundColor: 'var(--bg-section)',
    borderRadius: '6px',
    overflow: 'hidden',
  },
  skeletonTitle: {
    height: '18px',
    width: '140px',
    backgroundColor: 'var(--bg-section)',
    borderRadius: '4px',
    marginBottom: '16px',
  },
  skeletonBody: {
    height: '80px',
    backgroundColor: 'var(--bg-section)',
    borderRadius: '10px',
  },
};
