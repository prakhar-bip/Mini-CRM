import React from 'react';
import type { TeamTasksStats } from '../types/managerDashboard.types';
import { CheckSquare, ArrowRight } from 'lucide-react';

interface TeamTasksCardProps {
  stats?: TeamTasksStats;
  loading?: boolean;
}

export const TeamTasksCard: React.FC<TeamTasksCardProps> = ({ stats, loading }) => {
  if (loading || !stats) {
    return (
      <div style={styles.card}>
        <div style={styles.skeletonTitle} />
        <div style={styles.skeletonGrid} />
      </div>
    );
  }

  const total = stats.pending + stats.inProgress + stats.completed + stats.overdue;

  return (
    <div style={styles.card} className="card-hover-effect">
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckSquare size={18} color="#5B90E5" />
          <h3 style={styles.title}>Team Tasks</h3>
        </div>
        <button onClick={() => alert('View Team Tasks')} style={styles.viewBtn}>
          <span>View Team Tasks</span>
          <ArrowRight size={14} />
        </button>
      </div>

      <div style={styles.grid}>
        <div style={styles.taskBox}>
          <span style={styles.taskVal}>{stats.pending}</span>
          <span style={styles.taskLabel}>Pending</span>
        </div>
        <div style={styles.taskBox}>
          <span style={{ ...styles.taskVal, color: '#5B90E5' }}>{stats.inProgress}</span>
          <span style={styles.taskLabel}>In Progress</span>
        </div>
        <div style={styles.taskBox}>
          <span style={{ ...styles.taskVal, color: '#45C98A' }}>{stats.completed}</span>
          <span style={styles.taskLabel}>Completed</span>
        </div>
        <div style={styles.taskBox}>
          <span style={{ ...styles.taskVal, color: '#E76576' }}>{stats.overdue}</span>
          <span style={styles.taskLabel}>Overdue</span>
        </div>
      </div>

      <div style={styles.progressRow}>
        <div style={styles.track}>
          <div
            style={{
              width: `${(stats.completed / total) * 100}%`,
              backgroundColor: '#45C98A',
              height: '100%',
            }}
          />
          <div
            style={{
              width: `${(stats.inProgress / total) * 100}%`,
              backgroundColor: '#5B90E5',
              height: '100%',
            }}
          />
        </div>
        <span style={styles.completionText}>
          {Math.round((stats.completed / total) * 100)}% Tasks Completed
        </span>
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
  viewBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'transparent',
    color: '#5B90E5',
    fontSize: '0.8rem',
    fontWeight: 700,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px',
    marginBottom: '16px',
  },
  taskBox: {
    backgroundColor: 'var(--bg-section)',
    borderRadius: '10px',
    padding: '12px',
    textAlign: 'center',
    border: '1px solid var(--border-color)',
  },
  taskVal: {
    display: 'block',
    fontSize: '1.3rem',
    fontWeight: 800,
    color: 'var(--text-main)',
  },
  taskLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-sub)',
    fontWeight: 600,
  },
  progressRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  track: {
    flex: 1,
    height: '6px',
    backgroundColor: 'var(--bg-section)',
    borderRadius: '4px',
    overflow: 'hidden',
    display: 'flex',
  },
  completionText: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#45C98A',
  },
  skeletonTitle: {
    height: '18px',
    width: '120px',
    backgroundColor: 'var(--bg-section)',
    borderRadius: '4px',
    marginBottom: '16px',
  },
  skeletonGrid: {
    height: '80px',
    backgroundColor: 'var(--bg-section)',
    borderRadius: '10px',
  },
};
