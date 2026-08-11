import React from 'react';
import type { FunnelStep } from '../types/salesDashboard.types';
import { Filter, ArrowRight } from 'lucide-react';

interface LeadFunnelCardProps {
  steps?: FunnelStep[];
  loading?: boolean;
}

export const LeadFunnelCard: React.FC<LeadFunnelCardProps> = ({ steps = [], loading }) => {
  if (loading || steps.length === 0) {
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={18} color="#5B90E5" />
          <h3 style={styles.title}>Lead Conversion Funnel</h3>
        </div>
        <span style={styles.badge}>Funnel Efficiency</span>
      </div>

      <div style={styles.funnelGrid}>
        {steps.map((step, idx) => (
          <div key={idx} style={styles.funnelCol}>
            <div style={styles.stepCard}>
              <span style={styles.stepCount}>{step.count}</span>
              <span style={styles.stepStage}>{step.stage}</span>
            </div>
            {step.conversionRate && (
              <div style={styles.convPill}>
                <ArrowRight size={12} color="#45C98A" />
                <span>{step.conversionRate}</span>
              </div>
            )}
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
  funnelGrid: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
    overflowX: 'auto',
  },
  funnelCol: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flex: 1,
    minWidth: '100px',
  },
  stepCard: {
    backgroundColor: 'var(--bg-section)',
    borderRadius: '12px',
    padding: '12px 14px',
    border: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
  },
  stepCount: {
    fontSize: '1.4rem',
    fontWeight: 800,
    color: 'var(--text-main)',
  },
  stepStage: {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: 'var(--text-sub)',
    textAlign: 'center',
  },
  convPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '0.7rem',
    fontWeight: 700,
    color: '#45C98A',
    backgroundColor: '#F0FDF4',
    padding: '2px 6px',
    borderRadius: '8px',
    border: '1px solid #BBF7D0',
    flexShrink: 0,
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
