import React from 'react';
import type { SalesTargetInfo } from '../types/salesDashboard.types';
import { Target, Clock } from 'lucide-react';

interface SalesTargetCardProps {
  targetInfo?: SalesTargetInfo;
  loading?: boolean;
}

export const SalesTargetCard: React.FC<SalesTargetCardProps> = ({ targetInfo, loading }) => {
  if (loading || !targetInfo) {
    return (
      <div style={styles.card}>
        <div style={styles.skeletonTitle} />
        <div style={styles.skeletonBody} />
      </div>
    );
  }

  const isExceeded = targetInfo.percentage >= 100;
  const barColor = isExceeded ? '#45C98A' : '#5B90E5';

  return (
    <div style={styles.card} className="card-hover-effect">
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Target size={18} color={barColor} />
          <h3 style={styles.title}>Monthly Sales Target</h3>
        </div>
        <div style={styles.daysBadge}>
          <Clock size={12} />
          <span>{targetInfo.daysRemaining} days remaining</span>
        </div>
      </div>

      <div style={styles.valuesGrid}>
        <div style={styles.valBox}>
          <span style={styles.valLabel}>Target</span>
          <span style={styles.valText}>{targetInfo.targetFormatted}</span>
        </div>
        <div style={styles.valBox}>
          <span style={styles.valLabel}>Achieved</span>
          <span style={{ ...styles.valText, color: barColor }}>{targetInfo.achievedFormatted}</span>
        </div>
        <div style={styles.valBox}>
          <span style={styles.valLabel}>Remaining</span>
          <span style={styles.valText}>{targetInfo.remainingFormatted}</span>
        </div>
      </div>

      <div style={styles.progressContainer}>
        <div style={styles.progressHeader}>
          <span style={{ fontWeight: 700, color: barColor }}>
            {targetInfo.percentage}% achieved
          </span>
          <span style={styles.subText}>Monthly Goal</span>
        </div>
        <div style={styles.track}>
          <div
            style={{
              width: `${Math.min(targetInfo.percentage, 100)}%`,
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
  daysBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: 'var(--text-sub)',
    backgroundColor: 'var(--bg-section)',
    padding: '4px 10px',
    borderRadius: '12px',
    border: '1px solid var(--border-color)',
  },
  valuesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    marginBottom: '20px',
  },
  valBox: {
    backgroundColor: 'var(--bg-section)',
    borderRadius: '12px',
    padding: '12px 14px',
    border: '1px solid var(--border-color)',
  },
  valLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-sub)',
    fontWeight: 600,
    display: 'block',
    marginBottom: '2px',
  },
  valText: {
    fontSize: '1.25rem',
    fontWeight: 800,
    color: 'var(--text-main)',
  },
  progressContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
  },
  subText: {
    color: 'var(--text-sub)',
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
    height: '120px',
    backgroundColor: 'var(--bg-section)',
    borderRadius: '10px',
  },
};
