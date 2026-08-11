import React from 'react';
import type { SalesActivityItem } from '../types/salesDashboard.types';
import { Activity, Target, UserPlus, Send, CheckCircle2 } from 'lucide-react';

interface SalesActivityFeedProps {
  activities?: SalesActivityItem[];
  loading?: boolean;
}

export const SalesActivityFeed: React.FC<SalesActivityFeedProps> = ({
  activities = [],
  loading,
}) => {
  const getIcon = (type: SalesActivityItem['type']) => {
    switch (type) {
      case 'opportunity':
        return <Target size={14} color="#5B90E5" />;
      case 'lead':
        return <UserPlus size={14} color="#5B90E5" />;
      case 'proposal':
        return <Send size={14} color="#5B90E5" />;
      case 'deal':
        return <CheckCircle2 size={14} color="#45C98A" />;
      default:
        return <Activity size={14} color="#64748B" />;
    }
  };

  if (loading) {
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
        <h3 style={styles.title}>Recent Activity</h3>
        <span style={styles.badge}>Live Feed</span>
      </div>

      <div style={styles.list}>
        {activities.map((act) => (
          <div key={act.id} style={styles.itemRow}>
            <div style={styles.iconBg}>{getIcon(act.type)}</div>
            <div style={styles.content}>
              <strong style={styles.actTitle}>{act.title}</strong>
              <span style={styles.actCompany}>{act.company}</span>
            </div>
            <span style={styles.actTime}>{act.time}</span>
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
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  itemRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  },
  iconBg: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    backgroundColor: 'var(--very-light-blue)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: '2px',
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  actTitle: {
    fontSize: '0.85rem',
    color: 'var(--text-main)',
    lineHeight: 1.3,
  },
  actCompany: {
    fontSize: '0.75rem',
    color: 'var(--text-sub)',
    fontWeight: 600,
  },
  actTime: {
    fontSize: '0.75rem',
    color: 'var(--text-muted-dynamic)',
    flexShrink: 0,
  },
  skeletonTitle: {
    height: '18px',
    width: '120px',
    backgroundColor: 'var(--bg-section)',
    borderRadius: '4px',
    marginBottom: '16px',
  },
  skeletonList: {
    height: '120px',
    backgroundColor: 'var(--bg-section)',
    borderRadius: '10px',
  },
};
