import React from 'react';
import type { TaskRow } from '../types/employeeDashboard.types';

interface MyTasksTableProps {
  tasks?: TaskRow[];
  loading?: boolean;
}

export const MyTasksTable: React.FC<MyTasksTableProps> = ({ tasks = [], loading }) => {
  const getPriorityBadge = (priority: TaskRow['priority']) => {
    switch (priority) {
      case 'Critical':
        return <span style={styles.badgeCritical}>Critical</span>;
      case 'High':
        return <span style={styles.badgeHigh}>High</span>;
      case 'Medium':
        return <span style={styles.badgeMedium}>Medium</span>;
      default:
        return <span style={styles.badgeLow}>Low</span>;
    }
  };

  const getStatusBadge = (status: TaskRow['status']) => {
    switch (status) {
      case 'Completed':
        return <span style={styles.badgeCompleted}>Completed</span>;
      case 'In Progress':
        return <span style={styles.badgeInProgress}>In Progress</span>;
      case 'Overdue':
        return <span style={styles.badgeOverdue}>Overdue</span>;
      default:
        return <span style={styles.badgePending}>Pending</span>;
    }
  };

  if (loading) {
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
        <h3 style={styles.title}>My Assigned Tasks</h3>
        <span style={styles.badgeCount}>{tasks.length} Active Tasks</span>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Task Title</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Priority</th>
              <th style={styles.th}>Due Date</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Assigned By</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} style={styles.tr}>
                <td style={styles.td}>
                  <strong>{task.title}</strong>
                </td>
                <td style={styles.td}>{task.type}</td>
                <td style={styles.td}>{getPriorityBadge(task.priority)}</td>
                <td style={styles.td}>{task.dueDate}</td>
                <td style={styles.td}>{getStatusBadge(task.status)}</td>
                <td style={styles.td}>{task.assignedBy}</td>
                <td style={{ ...styles.td, textAlign: 'right' }}>
                  <button
                    onClick={() => alert(`Update task status for ${task.title}`)}
                    style={styles.actionBtn}
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
  badgeCount: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#5B90E5',
    backgroundColor: 'var(--very-light-blue)',
    padding: '4px 10px',
    borderRadius: '12px',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.85rem',
  },
  th: {
    textAlign: 'left',
    padding: '10px 12px',
    backgroundColor: 'var(--bg-section)',
    color: 'var(--text-main)',
    fontWeight: 700,
    borderBottom: '1px solid var(--border-color)',
  },
  tr: {
    borderBottom: '1px solid var(--border-color)',
  },
  td: {
    padding: '12px',
    color: 'var(--text-main)',
  },
  badgeCritical: {
    backgroundColor: '#FEF2F2',
    color: '#E76576',
    padding: '2px 8px',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: 800,
  },
  badgeHigh: {
    backgroundColor: '#FEF3C7',
    color: '#D97706',
    padding: '2px 8px',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: 700,
  },
  badgeMedium: {
    backgroundColor: '#EFF6FF',
    color: '#5B90E5',
    padding: '2px 8px',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: 700,
  },
  badgeLow: {
    backgroundColor: 'var(--bg-section)',
    color: 'var(--text-sub)',
    padding: '2px 8px',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: 600,
  },
  badgeCompleted: {
    backgroundColor: '#F0FDF4',
    color: '#45C98A',
    padding: '2px 8px',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: 700,
  },
  badgeInProgress: {
    backgroundColor: '#EFF6FF',
    color: '#5B90E5',
    padding: '2px 8px',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: 700,
  },
  badgeOverdue: {
    backgroundColor: '#FEF2F2',
    color: '#E76576',
    padding: '2px 8px',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: 800,
  },
  badgePending: {
    backgroundColor: '#F1F5F9',
    color: '#64748B',
    padding: '2px 8px',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: 600,
  },
  actionBtn: {
    padding: '4px 10px',
    backgroundColor: 'var(--bg-card)',
    color: '#5B90E5',
    border: '1px solid #5B90E5',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: 600,
  },
  skeletonTitle: {
    height: '18px',
    width: '140px',
    backgroundColor: 'var(--bg-section)',
    borderRadius: '4px',
    marginBottom: '16px',
  },
  skeletonBody: {
    height: '140px',
    backgroundColor: 'var(--bg-section)',
    borderRadius: '10px',
  },
};
