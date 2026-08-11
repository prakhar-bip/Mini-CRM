import React from 'react';
import type { PriorityOpportunityRow } from '../types/salesDashboard.types';
import { Target, ArrowUpRight } from 'lucide-react';

interface PriorityOpportunitiesTableProps {
  opportunities?: PriorityOpportunityRow[];
  loading?: boolean;
}

export const PriorityOpportunitiesTable: React.FC<PriorityOpportunitiesTableProps> = ({
  opportunities = [],
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Target size={18} color="#5B90E5" />
          <h3 style={styles.title}>Priority Opportunities</h3>
        </div>
        <span style={styles.badge}>High Probability Deals</span>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Opportunity Title</th>
              <th style={styles.th}>Customer</th>
              <th style={styles.th}>Deal Value</th>
              <th style={styles.th}>Stage</th>
              <th style={styles.th}>Probability</th>
              <th style={styles.th}>Exp. Close</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {opportunities.map((opp) => (
              <tr key={opp.id} style={styles.tr}>
                <td style={styles.td}>
                  <strong>{opp.title}</strong>
                </td>
                <td style={styles.td}>{opp.customerName}</td>
                <td style={{ ...styles.td, fontWeight: 700, color: '#5B90E5' }}>{opp.value}</td>
                <td style={styles.td}>
                  <span style={styles.stagePill}>{opp.stage}</span>
                </td>
                <td style={styles.td}>
                  <div style={styles.probWrapper}>
                    <div style={styles.probTrack}>
                      <div
                        style={{
                          width: `${opp.probability}%`,
                          backgroundColor: opp.probability >= 70 ? '#45C98A' : '#5B90E5',
                          height: '100%',
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{opp.probability}%</span>
                  </div>
                </td>
                <td style={styles.td}>{opp.expectedClose}</td>
                <td style={{ ...styles.td, textAlign: 'right' }}>
                  <button
                    onClick={() => alert(`View opportunity details for ${opp.title}`)}
                    style={styles.openBtn}
                  >
                    <span>Details</span>
                    <ArrowUpRight size={12} />
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
  stagePill: {
    backgroundColor: 'var(--very-light-blue)',
    color: '#5B90E5',
    padding: '2px 8px',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: 700,
  },
  probWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    width: '80px',
  },
  probTrack: {
    flex: 1,
    height: '6px',
    backgroundColor: 'var(--bg-section)',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  openBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    backgroundColor: 'transparent',
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
