import React from 'react';
import type { RevenueCategory } from '../types/dashboard.types';

interface RevenueBreakdownProps {
  categories?: RevenueCategory[];
  loading?: boolean;
}

export const RevenueBreakdown: React.FC<RevenueBreakdownProps> = ({
  categories = [],
  loading,
}) => {
  if (loading || categories.length === 0) {
    return (
      <div style={styles.card}>
        <div style={styles.skeletonTitle} />
        <div style={styles.skeletonBody} />
      </div>
    );
  }

  return (
    <div style={styles.card} className="card-hover-effect">
      <div style={styles.header}>
        <h3 style={styles.title}>Revenue Breakdown</h3>
        <span style={styles.badge}>2026 Distribution</span>
      </div>

      {/* Stacked Percentage Bar */}
      <div style={styles.stackedBar}>
        {categories.map((cat, idx) => (
          <div
            key={idx}
            style={{
              width: `${cat.percentage}%`,
              backgroundColor: cat.color,
              height: '100%',
            }}
            title={`${cat.name}: ${cat.percentage}%`}
          />
        ))}
      </div>

      {/* Category List */}
      <div style={styles.catList}>
        {categories.map((cat, idx) => (
          <div key={idx} style={styles.catRow}>
            <div style={styles.catInfo}>
              <div style={{ ...styles.colorDot, backgroundColor: cat.color }} />
              <span style={styles.catName}>{cat.name}</span>
            </div>
            <div style={styles.catValRow}>
              <span style={styles.catAmount}>{cat.amount}</span>
              <span style={styles.catPercent}>({cat.percentage}%)</span>
            </div>
          </div>
        ))}
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
  stackedBar: {
    height: '12px',
    borderRadius: '6px',
    overflow: 'hidden',
    display: 'flex',
    marginBottom: '20px',
    backgroundColor: 'var(--bg-section)',
  },
  colorDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
  },
  catList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  catRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.85rem',
  },
  catInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  catName: {
    color: 'var(--text-main)',
    fontWeight: 600,
  },
  catValRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  catAmount: {
    fontWeight: 700,
    color: 'var(--text-main)',
  },
  catPercent: {
    color: 'var(--text-sub)',
    fontSize: '0.75rem',
  },
  skeletonTitle: {
    height: '18px',
    width: '120px',
    backgroundColor: 'var(--bg-section)',
    borderRadius: '4px',
    marginBottom: '20px',
  },
  skeletonBody: {
    height: '140px',
    backgroundColor: 'var(--bg-section)',
    borderRadius: '8px',
  },
};
