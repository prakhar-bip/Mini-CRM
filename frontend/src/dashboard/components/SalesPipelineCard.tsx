import React from 'react';
import type { PipelineStage } from '../types/managerDashboard.types';
import { Target, ChevronRight } from 'lucide-react';

interface SalesPipelineCardProps {
  stages?: PipelineStage[];
  loading?: boolean;
}

export const SalesPipelineCard: React.FC<SalesPipelineCardProps> = ({
  stages = [],
  loading,
}) => {
  if (loading || stages.length === 0) {
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
          <Target size={18} color="#5B90E5" />
          <h3 style={styles.title}>Sales Pipeline</h3>
        </div>
        <span style={styles.badge}>Funnel Conversion</span>
      </div>

      <div style={styles.pipelineFlow}>
        {stages.map((st, idx) => (
          <React.Fragment key={st.stage}>
            <div style={styles.stageBox}>
              <div style={styles.stageTop}>
                <span style={styles.stageName}>{st.stage}</span>
                <span style={styles.stageCount}>{st.count}</span>
              </div>
              <span style={styles.stageVal}>{st.value}</span>
              <span style={styles.stageConv}>{st.conversion} Conv.</span>
            </div>
            {idx < stages.length - 1 && (
              <ChevronRight size={16} color="#64748B" style={styles.arrow} />
            )}
          </React.Fragment>
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
    fontSize: '1.15rem',
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
  pipelineFlow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
    overflowX: 'auto',
  },
  stageBox: {
    flex: 1,
    backgroundColor: 'var(--bg-section)',
    borderRadius: '12px',
    padding: '12px 14px',
    border: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    minWidth: '110px',
  },
  stageTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
  },
  stageName: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: 'var(--text-sub)',
  },
  stageCount: {
    fontSize: '0.7rem',
    fontWeight: 800,
    backgroundColor: 'var(--very-light-blue)',
    color: '#5B90E5',
    padding: '2px 6px',
    borderRadius: '6px',
  },
  stageVal: {
    fontSize: '1.1rem',
    fontWeight: 800,
    color: 'var(--text-main)',
  },
  stageConv: {
    fontSize: '0.7rem',
    color: '#45C98A',
    fontWeight: 600,
    marginTop: '2px',
  },
  arrow: {
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
    height: '100px',
    backgroundColor: 'var(--bg-section)',
    borderRadius: '10px',
  },
};
