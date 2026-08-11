import React, { useState } from 'react';
import type { FollowUpItem } from '../types/salesDashboard.types';
import { CalendarCheck, CheckCircle2, Clock } from 'lucide-react';

interface FollowUpsCardProps {
  items?: FollowUpItem[];
  loading?: boolean;
}

export const FollowUpsCard: React.FC<FollowUpsCardProps> = ({ items = [], loading }) => {
  const [list, setList] = useState<FollowUpItem[]>(items);

  React.useEffect(() => {
    setList(items);
  }, [items]);

  const toggleComplete = (id: string) => {
    setList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CalendarCheck size={18} color="#5B90E5" />
          <h3 style={styles.title}>Follow-Ups Due Today</h3>
        </div>
        <span style={styles.badge}>{list.filter((i) => !i.completed).length} Pending</span>
      </div>

      <div style={styles.list}>
        {list.map((item) => (
          <div
            key={item.id}
            style={{
              ...styles.itemRow,
              opacity: item.completed ? 0.6 : 1,
            }}
          >
            <button onClick={() => toggleComplete(item.id)} style={styles.checkBtn}>
              <CheckCircle2
                size={18}
                color={item.completed ? '#45C98A' : 'var(--border-color)'}
              />
            </button>

            <div style={styles.itemContent}>
              <strong style={{ ...styles.compName, textDecoration: item.completed ? 'line-through' : 'none' }}>
                {item.customerName}
              </strong>
              <span style={styles.activityLabel}>{item.activityType}</span>
            </div>

            <div style={styles.timeTag}>
              <Clock size={12} color="#5B90E5" />
              <span>{item.time}</span>
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
    gap: '12px',
  },
  itemRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 14px',
    backgroundColor: 'var(--bg-section)',
    borderRadius: '10px',
    border: '1px solid var(--border-color)',
    transition: 'opacity 0.2s ease',
  },
  checkBtn: {
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2px',
  },
  itemContent: {
    flex: 1,
    margin: '0 12px',
    display: 'flex',
    flexDirection: 'column',
  },
  compName: {
    fontSize: '0.85rem',
    color: 'var(--text-main)',
  },
  activityLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-sub)',
  },
  timeTag: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#5B90E5',
    backgroundColor: 'var(--very-light-blue)',
    padding: '4px 8px',
    borderRadius: '6px',
  },
  skeletonTitle: {
    height: '18px',
    width: '140px',
    backgroundColor: 'var(--bg-section)',
    borderRadius: '4px',
    marginBottom: '16px',
  },
  skeletonList: {
    height: '100px',
    backgroundColor: 'var(--bg-section)',
    borderRadius: '10px',
  },
};
