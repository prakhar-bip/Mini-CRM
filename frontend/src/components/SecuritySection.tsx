import React from 'react';
import { ShieldCheck, Lock, Database, Check, Server, KeyRound, Cpu } from 'lucide-react';

export const SecuritySection: React.FC = () => {
  const points = [
    'Role-based authorization',
    'Secure authentication',
    'Centralized PostgreSQL database',
    'Structured API architecture',
    'Controlled access to business modules',
    'Data-driven dashboards',
  ];

  return (
    <section style={styles.section}>
      <div className="container" style={styles.grid}>
        {/* Left Column: Points & Content */}
        <div style={styles.leftCol}>
          <div className="eyebrow-badge">ENTERPRISE SECURITY & RELIABILITY</div>
          <h2 style={styles.heading}>Built for Controlled Business Operations</h2>
          <p style={styles.description}>
            Our platform provides enterprise-level security architecture, strict JWT token
            verification, role-based route middleware, and audited database transactions.
          </p>

          <div style={styles.pointsGrid}>
            {points.map((point, idx) => (
              <div key={idx} style={styles.pointItem}>
                <div style={styles.checkBg}>
                  <Check size={14} color="#5B90E5" />
                </div>
                <span style={styles.pointText}>{point}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Security Card Illustration */}
        <div style={styles.rightCol}>
          <div style={styles.securityCard}>
            <div style={styles.securityHeader}>
              <div style={styles.shieldIconBg}>
                <ShieldCheck size={28} color="#5B90E5" />
              </div>
              <div>
                <h4 style={styles.cardTitle}>System Protection</h4>
                <p style={styles.cardSub}>JWT & RBAC Security Layer</p>
              </div>
            </div>

            <div style={styles.badgeList}>
              <div style={styles.securityBadgeItem}>
                <Lock size={16} color="#5B90E5" />
                <div>
                  <strong>Bcrypt Password Hashing</strong>
                  <p>10 rounds salt encryption</p>
                </div>
              </div>

              <div style={styles.securityBadgeItem}>
                <KeyRound size={16} color="#5B90E5" />
                <div>
                  <strong>Bearer JWT Token Verification</strong>
                  <p>1-day strict expiration policy</p>
                </div>
              </div>

              <div style={styles.securityBadgeItem}>
                <Database size={16} color="#5B90E5" />
                <div>
                  <strong>PostgreSQL Transaction Safety</strong>
                  <p>Atomic stock deduction & rollback</p>
                </div>
              </div>

              <div style={styles.securityBadgeItem}>
                <Server size={16} color="#5B90E5" />
                <div>
                  <strong>Structured Express TS Backend</strong>
                  <p>401/403 Strict Route Enforcement</p>
                </div>
              </div>
            </div>

            <div style={styles.securityFooter}>
              <Cpu size={14} color="#45C98A" />
              <span>100% Verified System Integrity</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  section: {
    padding: '90px 0',
    backgroundColor: 'var(--bg-main)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '48px',
    alignItems: 'center',
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  heading: {
    fontSize: '2.25rem',
    fontWeight: 800,
    color: 'var(--text-main)',
    marginBottom: '16px',
  },
  description: {
    fontSize: '1.05rem',
    color: 'var(--text-sub)',
    lineHeight: 1.6,
    marginBottom: '32px',
  },
  pointsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
    width: '100%',
  },
  pointItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  checkBg: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: 'var(--very-light-blue)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  pointText: {
    fontSize: '0.95rem',
    fontWeight: 600,
    color: 'var(--text-main)',
  },
  rightCol: {
    width: '100%',
  },
  securityCard: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '20px',
    padding: '32px',
    boxShadow: 'var(--shadow-modal)',
  },
  securityHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '24px',
    paddingBottom: '20px',
    borderBottom: '1px solid var(--border-color)',
  },
  shieldIconBg: {
    width: '56px',
    height: '56px',
    borderRadius: '14px',
    backgroundColor: 'var(--very-light-blue)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: 'var(--text-main)',
  },
  cardSub: {
    fontSize: '0.85rem',
    color: '#5B90E5',
    fontWeight: 600,
  },
  badgeList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '24px',
  },
  securityBadgeItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '12px 16px',
    backgroundColor: 'var(--very-light-blue)',
    borderRadius: '10px',
    border: '1px solid var(--border-color)',
    fontSize: '0.85rem',
    color: 'var(--text-main)',
  },
  securityFooter: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.8rem',
    fontWeight: 700,
    color: '#45C98A',
    backgroundColor: '#F0FDF4',
    padding: '8px 14px',
    borderRadius: '8px',
    border: '1px solid #BBF7D0',
  },
};
