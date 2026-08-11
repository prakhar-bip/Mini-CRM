import React, { useState } from 'react';
import type { PriorityTaskItem } from '../types/employeeDashboard.types';
import { Clock, CheckCircle2 } from 'lucide-react';

interface TodaysPrioritiesCardProps {
  items?: PriorityTaskItem[];
  loading?: boolean;
}

export const TodaysPrioritiesCard: React.FC<TodaysPrioritiesCardProps> = ({
  items = [],
  loading,
}) => {
  const [list, setList] = useState<PriorityTaskItem[]>(items);

  React.useEffect(() => {
    setList(items);
  }, [items]);

  const toggleComplete = (id: string) => {
    setList((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: item.status === 'Completed' ? 'Pending' : 'Completed' }
          : item
      )
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
          <Clock size={18} color="#5B90E5" />
          <h3 style={styles.title}>Today's Priorities</h3>
        </div>
        <span style={styles.badge}>{list.filter((i) => i.status !== 'Completed').length} Pending</span>
      </div>

      <div style={styles.list}>
        {list.map((item) => {
          const isDone = item.status === 'Completed';
          return (
            <div
              key={item.id}
              style={{
                ...styles.itemRow,
                opacity: isDone ? 0.6 : 1,
              }}
            >
              <div style={styles.timeTag}>
                <Clock size={12} color="#5B90E5" />
                <span>{item.time}</span>
              </div>

              <div style={styles.content}>
                <strong style={{ ...styles.taskTitle, textDecoration: isDone ? 'line-through' : 'none' }}>
                  {item.title}
                </strong>
                <span style={styles.taskCat}>{item.category}</span>
              </div>

              <button onClick={() => toggleComplete(item.id)} style={styles.completeBtn}>
                <CheckCircle2 size={18} color={isDone ? '#45C98A' : 'var(--border-color)'} />
              </button>
            </div>
          );
        })}
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
    gap: '12px',
    padding: '12px 14px',
    backgroundColor: 'var(--bg-section)',
    borderRadius: '10px',
    border: '1px solid var(--border-color)',
    transition: 'all 0.15s ease',
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
    flexShrink: 0,
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  taskTitle: {
    fontSize: '0.85rem',
    color: 'var(--text-main)',
  },
  taskCat: {
    fontSize: '0.75rem',
    color: 'var(--text-sub)',
  },
  completeBtn: {
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2px',
  },
  skeletonTitle: {
    height: '18px',
    width: '140px',
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
