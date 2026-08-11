import React from 'react';
import type { ActivityItem } from '../types/dashboard.types';
import {
  UserPlus,
  FileSpreadsheet,
  Boxes,
  UserCheck,
  TrendingUp,
  Clock,
} from 'lucide-react';

interface RecentActivityProps {
  activities?: ActivityItem[];
  loading?: boolean;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({
  activities = [],
  loading,
}) => {
  const getIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'customer':
        return <UserPlus size={14} color="#5B90E5" />;
      case 'order':
        return <FileSpreadsheet size={14} color="#45C98A" />;
      case 'stock':
        return <Boxes size={14} color="#5B90E5" />;
      case 'employee':
        return <UserCheck size={14} color="#2E4162" />;
      case 'deal':
        return <TrendingUp size={14} color="#5B90E5" />;
      default:
        return <Clock size={14} color="#64748B" />;
    }
  };

  if (loading || activities.length === 0) {
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
        <span style={styles.badge}>Live Audit Feed</span>
      </div>

      <div style={styles.list}>
        {activities.map((act) => (
          <div key={act.id} style={styles.item}>
            <div style={styles.iconBox}>{getIcon(act.type)}</div>
            <div style={styles.content}>
              <span style={styles.itemTitle}>{act.title}</span>
              <span style={styles.itemTime}>{act.time}</span>
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
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  item: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  },
  iconBox: {
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
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  itemTitle: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'var(--text-main)',
    lineHeight: 1.3,
  },
  itemTime: {
    fontSize: '0.75rem',
    color: 'var(--text-muted-dynamic)',
  },
  skeletonTitle: {
    height: '18px',
    width: '120px',
    backgroundColor: 'var(--bg-section)',
    borderRadius: '4px',
    marginBottom: '20px',
  },
  skeletonList: {
    height: '180px',
    backgroundColor: 'var(--bg-section)',
    borderRadius: '8px',
  },
};
