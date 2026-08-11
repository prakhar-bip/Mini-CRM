import React from 'react';
import type { EmployeeProfileInfo } from '../types/employeeDashboard.types';
import { UserCheck, ShieldCheck } from 'lucide-react';

interface EmployeeProfileCardProps {
  profile?: EmployeeProfileInfo;
  loading?: boolean;
}

export const EmployeeProfileCard: React.FC<EmployeeProfileCardProps> = ({ profile, loading }) => {
  if (loading || !profile) {
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
        <div style={styles.avatar}>
          <UserCheck size={20} color="#5B90E5" />
        </div>
        <div>
          <strong style={styles.name}>{profile.name}</strong>
          <span style={styles.idTag}>{profile.employeeId}</span>
        </div>
        <span style={styles.roleBadge}>
          <ShieldCheck size={12} />
          <span>Active Staff</span>
        </span>
      </div>

      <div style={styles.infoGrid}>
        <div style={styles.infoBox}>
          <span style={styles.label}>Department</span>
          <span style={styles.val}>{profile.department}</span>
        </div>
        <div style={styles.infoBox}>
          <span style={styles.label}>Designation</span>
          <span style={styles.val}>{profile.designation}</span>
        </div>
        <div style={styles.infoBox}>
          <span style={styles.label}>Direct Manager</span>
          <span style={styles.val}>{profile.manager}</span>
        </div>
        <div style={styles.infoBox}>
          <span style={styles.label}>Joining Date</span>
          <span style={styles.val}>{profile.joiningDate}</span>
        </div>
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
    alignItems: 'center',
    gap: '14px',
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: '1px solid var(--border-color)',
  },
  avatar: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    backgroundColor: 'var(--very-light-blue)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  name: {
    display: 'block',
    fontSize: '1.1rem',
    color: 'var(--text-main)',
  },
  idTag: {
    fontSize: '0.75rem',
    color: 'var(--text-sub)',
    fontWeight: 600,
  },
  roleBadge: {
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '0.7rem',
    fontWeight: 700,
    color: '#45C98A',
    backgroundColor: '#F0FDF4',
    padding: '4px 8px',
    borderRadius: '10px',
    border: '1px solid #BBF7D0',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
  },
  infoBox: {
    backgroundColor: 'var(--bg-section)',
    borderRadius: '10px',
    padding: '10px 12px',
    border: '1px solid var(--border-color)',
  },
  label: {
    fontSize: '0.7rem',
    color: 'var(--text-sub)',
    fontWeight: 600,
    display: 'block',
  },
  val: {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: 'var(--text-main)',
  },
  skeletonTitle: {
    height: '18px',
    width: '140px',
    backgroundColor: 'var(--bg-section)',
    borderRadius: '4px',
    marginBottom: '16px',
  },
  skeletonBody: {
    height: '100px',
    backgroundColor: 'var(--bg-section)',
    borderRadius: '10px',
  },
};
