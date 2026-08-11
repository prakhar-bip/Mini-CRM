import React from 'react';
import type { TeamMemberPerformance } from '../types/managerDashboard.types';

interface TeamPerformanceCardProps {
  members?: TeamMemberPerformance[];
  loading?: boolean;
}

export const TeamPerformanceCard: React.FC<TeamPerformanceCardProps> = ({
  members = [],
  loading,
}) => {
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
        <h3 style={styles.title}>Team Performance</h3>
        <span style={styles.badge}>Monthly Targets</span>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Employee</th>
              <th style={styles.th}>Target</th>
              <th style={styles.th}>Achieved</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => {
              const isExceeded = m.percentage >= 100;
              const isLow = m.percentage < 85;
              const barColor = isExceeded ? '#45C98A' : isLow ? '#E76576' : '#5B90E5';

              return (
                <tr key={m.id} style={styles.tr}>
                  <td style={styles.td}>
                    <strong>{m.name}</strong>
                  </td>
                  <td style={styles.td}>{m.target}</td>
                  <td style={{ ...styles.td, fontWeight: 700 }}>{m.achieved}</td>
                  <td style={styles.td}>
                    <div style={styles.statusCell}>
                      <div style={styles.progressTrack}>
                        <div
                          style={{
                            width: `${Math.min(m.percentage, 100)}%`,
                            backgroundColor: barColor,
                            height: '100%',
                            borderRadius: '4px',
                          }}
                        />
                      </div>
                      <span style={{ fontWeight: 700, color: barColor, fontSize: '0.75rem' }}>
                        {m.percentage}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
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
  badge: {
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
  statusCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '120px',
  },
  progressTrack: {
    flex: 1,
    height: '6px',
    backgroundColor: 'var(--bg-section)',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  skeletonTitle: {
    height: '18px',
    width: '140px',
    backgroundColor: 'var(--bg-section)',
    borderRadius: '4px',
    marginBottom: '16px',
  },
  skeletonBody: {
    height: '160px',
    backgroundColor: 'var(--bg-section)',
    borderRadius: '10px',
  },
};
