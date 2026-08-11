import React from 'react';
import type { ScheduleEvent } from '../types/employeeDashboard.types';
import { Calendar, Clock, ChevronRight } from 'lucide-react';

interface UpcomingScheduleCardProps {
  events?: ScheduleEvent[];
  loading?: boolean;
}

export const UpcomingScheduleCard: React.FC<UpcomingScheduleCardProps> = ({
  events = [],
  loading,
}) => {
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
          <Calendar size={18} color="#5B90E5" />
          <h3 style={styles.title}>Upcoming Schedule</h3>
        </div>
        <span style={styles.badge}>{events.length} Events</span>
      </div>

      <div style={styles.list}>
        {events.map((ev) => (
          <div key={ev.id} style={styles.eventRow}>
            <div style={styles.timeTag}>
              <Clock size={12} color="#5B90E5" />
              <span>{ev.time}</span>
            </div>
            <div style={styles.content}>
              <strong style={styles.evTitle}>{ev.title}</strong>
              <span style={styles.evSub}>{ev.subtitle}</span>
            </div>
            <ChevronRight size={16} color="#64748B" />
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
  eventRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 14px',
    backgroundColor: 'var(--bg-section)',
    borderRadius: '10px',
    border: '1px solid var(--border-color)',
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
  evTitle: {
    fontSize: '0.85rem',
    color: 'var(--text-main)',
  },
  evSub: {
    fontSize: '0.75rem',
    color: 'var(--text-sub)',
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
