import React from 'react';
import { Building2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer style={styles.footer}>
      <div className="container" style={styles.grid}>
        {/* Left Column: Brand info */}
        <div style={styles.brandCol}>
          <a href="#home" style={styles.logo}>
            <div style={styles.logoIconBg}>
              <Building2 size={20} color="#5B90E5" />
            </div>
            <span style={styles.logoText}>
              Mini<span style={{ color: '#5B90E5' }}>ERP</span>
            </span>
          </a>
          <p style={styles.brandDesc}>
            A centralized ERP and CRM operations platform for modern business teams.
          </p>
        </div>

        {/* Links Column 1: Platform */}
        <div style={styles.col}>
          <h4 style={styles.colTitle}>Platform</h4>
          <a href="#home" style={styles.link}>Dashboard</a>
          <a href="#features" style={styles.link}>CRM</a>
          <a href="#features" style={styles.link}>Sales</a>
          <a href="#features" style={styles.link}>Inventory</a>
          <a href="#features" style={styles.link}>Employees</a>
        </div>

        {/* Links Column 2: Company */}
        <div style={styles.col}>
          <h4 style={styles.colTitle}>Company</h4>
          <a href="#home" style={styles.link}>About</a>
          <a href="#features" style={styles.link}>Features</a>
          <a href="#modules" style={styles.link}>Modules</a>
        </div>

        {/* Links Column 3: Resources */}
        <div style={styles.col}>
          <h4 style={styles.colTitle}>Resources</h4>
          <a href="#rbac" style={styles.link}>Documentation</a>
          <a href="#rbac" style={styles.link}>Support</a>
          <a href="#rbac" style={styles.link}>Security</a>
        </div>
      </div>

      <div className="container" style={styles.bottomRow}>
        <p style={styles.copyright}>© 2026 MiniERP. All rights reserved.</p>
        <p style={styles.placementTag}>College Recruitment Placement Case Study — FundsRoom</p>
      </div>
    </footer>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  footer: {
    backgroundColor: 'var(--bg-main)',
    borderTop: '1px solid var(--border-color)',
    paddingTop: '64px',
    paddingBottom: '32px',
    transition: 'background-color 0.25s ease',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr',
    gap: '48px',
    marginBottom: '48px',
  },
  brandCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
  },
  logoIconBg: {
    width: '34px',
    height: '34px',
    borderRadius: '8px',
    backgroundColor: 'var(--very-light-blue)',
    border: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: '1.25rem',
    fontWeight: 800,
    color: 'var(--text-main)',
  },
  brandDesc: {
    fontSize: '0.9rem',
    color: 'var(--text-sub)',
    lineHeight: 1.5,
    maxWidth: '320px',
  },
  col: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  colTitle: {
    fontSize: '0.95rem',
    fontWeight: 700,
    color: 'var(--text-main)',
    marginBottom: '4px',
  },
  link: {
    fontSize: '0.875rem',
    color: 'var(--text-sub)',
    textDecoration: 'none',
    transition: 'color 0.2s ease',
  },
  bottomRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '24px',
    borderTop: '1px solid var(--border-color)',
    fontSize: '0.85rem',
    color: 'var(--text-muted-dynamic)',
    flexWrap: 'wrap',
    gap: '12px',
  },
  copyright: {
    margin: 0,
  },
  placementTag: {
    margin: 0,
    fontWeight: 600,
    color: '#5B90E5',
  },
};
