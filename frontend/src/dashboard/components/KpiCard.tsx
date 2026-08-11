import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { KpiData } from '../types/dashboard.types';

interface KpiCardProps {
  data?: KpiData;
  icon: React.ReactNode;
  loading?: boolean;
}

export const KpiCard: React.FC<KpiCardProps> = ({ data, icon, loading }) => {
  if (loading || !data) {
    return (
      <div style={styles.card}>
        <div style={styles.skeletonHeader} />
        <div style={styles.skeletonVal} />
        <div style={styles.skeletonSub} />
      </div>
    );
  }

  return (
    <div style={styles.card} className="card-hover-effect">
      <div style={styles.header}>
        <span style={styles.title}>{data.title}</span>
        <div style={styles.iconBox}>{icon}</div>
      </div>
      <div style={styles.value}>{data.value}</div>
      <div style={styles.trendRow}>
        {data.isPositive ? (
          <ArrowUpRight size={14} color="#45C98A" />
        ) : (
          <ArrowDownRight size={14} color="#E76576" />
        )}
        <span
          style={{
            fontWeight: 700,
            color: data.isPositive ? '#45C98A' : '#E76576',
          }}
        >
          {data.change}
        </span>
        <span style={styles.timeframe}>{data.timeframe}</span>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  card: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: 'var(--shadow-card)',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  title: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'var(--text-sub)',
  },
  iconBox: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    backgroundColor: 'var(--very-light-blue)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: '1.75rem',
    fontWeight: 800,
    color: 'var(--text-main)',
    letterSpacing: '-0.02em',
    marginBottom: '8px',
  },
  trendRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.8rem',
  },
  timeframe: {
    color: 'var(--text-muted-dynamic)',
  },
  skeletonHeader: {
    height: '16px',
    width: '60%',
    backgroundColor: 'var(--bg-section)',
    borderRadius: '4px',
    marginBottom: '16px',
  },
  skeletonVal: {
    height: '28px',
    width: '80%',
    backgroundColor: 'var(--bg-section)',
    borderRadius: '6px',
    marginBottom: '12px',
  },
  skeletonSub: {
    height: '14px',
    width: '50%',
    backgroundColor: 'var(--bg-section)',
    borderRadius: '4px',
  },
};
