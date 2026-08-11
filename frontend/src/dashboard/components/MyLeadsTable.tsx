import React from 'react';
import type { LeadRow } from '../types/salesDashboard.types';
import { PhoneCall } from 'lucide-react';

interface MyLeadsTableProps {
  leads?: LeadRow[];
  loading?: boolean;
}

export const MyLeadsTable: React.FC<MyLeadsTableProps> = ({ leads = [], loading }) => {
  const getStatusBadge = (status: LeadRow['status']) => {
    switch (status) {
      case 'Qualified':
        return <span style={styles.badgeQualified}>Qualified</span>;
      case 'Converted':
        return <span style={styles.badgeConverted}>Converted</span>;
      case 'Contacted':
        return <span style={styles.badgeContacted}>Contacted</span>;
      case 'Nurturing':
        return <span style={styles.badgeNurturing}>Nurturing</span>;
      default:
        return <span style={styles.badgeDefault}>{status}</span>;
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
        <h3 style={styles.title}>My Leads Directory</h3>
        <span style={styles.badgeCount}>{leads.length} Active Leads</span>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Lead Name</th>
              <th style={styles.th}>Company</th>
              <th style={styles.th}>Source</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Est. Value</th>
              <th style={styles.th}>Next Follow-up</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} style={styles.tr}>
                <td style={styles.td}>
                  <strong>{lead.name}</strong>
                </td>
                <td style={styles.td}>{lead.company}</td>
                <td style={styles.td}>{lead.source}</td>
                <td style={styles.td}>{getStatusBadge(lead.status)}</td>
                <td style={{ ...styles.td, fontWeight: 700 }}>{lead.value}</td>
                <td style={styles.td}>{lead.nextFollowUp}</td>
                <td style={{ ...styles.td, textAlign: 'right' }}>
                  <button
                    onClick={() => alert(`Log activity for lead ${lead.name}`)}
                    style={styles.actionBtn}
                  >
                    <PhoneCall size={12} />
                    <span>Contact</span>
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
  badgeQualified: {
    backgroundColor: '#EFF6FF',
    color: '#5B90E5',
    padding: '2px 8px',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: 700,
  },
  badgeConverted: {
    backgroundColor: '#F0FDF4',
    color: '#45C98A',
    padding: '2px 8px',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: 700,
  },
  badgeContacted: {
    backgroundColor: '#F1F5F9',
    color: '#64748B',
    padding: '2px 8px',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: 700,
  },
  badgeNurturing: {
    backgroundColor: '#FEF3C7',
    color: '#D97706',
    padding: '2px 8px',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: 700,
  },
  badgeDefault: {
    backgroundColor: 'var(--bg-section)',
    color: 'var(--text-main)',
    padding: '2px 8px',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: 700,
  },
  actionBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 10px',
    backgroundColor: '#5B90E5',
    color: '#FFFFFF',
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
