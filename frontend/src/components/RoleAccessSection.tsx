import React from 'react';
import { Shield, TrendingUp, Package, FileText, CheckCircle2, ArrowRight } from 'lucide-react';

interface RoleAccessSectionProps {
  onOpenAuth: (roleKey?: string) => void;
}

export const RoleAccessSection: React.FC<RoleAccessSectionProps> = ({ onOpenAuth }) => {
  const roles = [
    {
      key: 'ADMIN',
      icon: <Shield size={24} color="#5B90E5" />,
      title: 'Administrator',
      roleBadge: 'ADMIN',
      email: 'admin@example.com',
      desc: 'Full system access, business oversight, user seeding, and complete CRUD across all modules.',
      permissions: [
        'Full System Control',
        'User Seeding & DB Access',
        'Customer & Sales CRUD',
        'Product & Inventory Control',
      ],
    },
    {
      key: 'SALES',
      icon: <TrendingUp size={24} color="#5B90E5" />,
      title: 'Sales Manager',
      roleBadge: 'SALES',
      email: 'sales@example.com',
      desc: 'Customer relationships, CRM follow-ups, sales challan creation, and deal pipeline.',
      permissions: [
        'Customer CRM Full CRUD',
        'Follow-up Logging',
        'Sales Challan Creation',
        'Product Catalog (Read-Only)',
      ],
    },
    {
      key: 'WAREHOUSE',
      icon: <Package size={24} color="#5B90E5" />,
      title: 'Warehouse Manager',
      roleBadge: 'WAREHOUSE',
      email: 'warehouse@example.com',
      desc: 'Product catalog, warehouse stock adjustments (IN/OUT), SKU tracking, and inventory audits.',
      permissions: [
        'Product Catalog Control',
        'Stock Adjustments (IN/OUT)',
        'Inventory Audit Log View',
        'Customer & Challan (Read-Only)',
      ],
    },
    {
      key: 'ACCOUNTS',
      icon: <FileText size={24} color="#5B90E5" />,
      title: 'Accounts / Employee',
      roleBadge: 'ACCOUNTS',
      email: 'accounts@example.com',
      desc: 'Financial oversight, operational read-only reporting, and order history auditing.',
      permissions: [
        'Read-Only Customer CRM',
        'Read-Only Product Catalog',
        'Read-Only Sales Challans',
        'Financial Audit Reports',
      ],
    },
  ];

  return (
    <section id="rbac" style={styles.section}>
      <div className="container">
        <div className="section-header">
          <div className="eyebrow-badge">ROLE-BASED ACCESS CONTROL</div>
          <h2>The Right Access for Every Role</h2>
          <p>
            Keep your operations secure with role-based access that gives each team member
            the tools and information relevant to their responsibilities.
          </p>
        </div>

        <div style={styles.grid}>
          {roles.map((role, idx) => (
            <div key={idx} style={styles.card}>
              <div style={styles.cardTop}>
                <div style={styles.iconBg}>{role.icon}</div>
                <span style={styles.roleBadge}>{role.roleBadge}</span>
              </div>
              <h3 style={styles.roleTitle}>{role.title}</h3>
              <p style={styles.emailSub}>{role.email}</p>
              <p style={styles.roleDesc}>{role.desc}</p>

              <div style={styles.permList}>
                {role.permissions.map((perm, pIdx) => (
                  <div key={pIdx} style={styles.permItem}>
                    <CheckCircle2 size={14} color="#45C98A" />
                    <span>{perm}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => onOpenAuth(role.key)}
                style={styles.demoLoginBtn}
              >
                <span>Login as {role.title}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  section: {
    padding: '90px 0',
    backgroundColor: 'var(--bg-section)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '28px',
  },
  card: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: 'var(--shadow-card)',
    display: 'flex',
    flexDirection: 'column',
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  iconBg: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: 'var(--very-light-blue)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleBadge: {
    fontSize: '0.75rem',
    fontWeight: 800,
    color: '#5B90E5',
    backgroundColor: 'var(--very-light-blue)',
    border: '1px solid var(--border-color)',
    padding: '4px 12px',
    borderRadius: '20px',
  },
  roleTitle: {
    fontSize: '1.3rem',
    fontWeight: 700,
    color: 'var(--text-main)',
    marginBottom: '2px',
  },
  emailSub: {
    fontSize: '0.85rem',
    color: '#5B90E5',
    fontWeight: 600,
    marginBottom: '12px',
  },
  roleDesc: {
    fontSize: '0.95rem',
    color: 'var(--text-sub)',
    lineHeight: 1.5,
    marginBottom: '20px',
  },
  permList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '24px',
    flex: 1,
  },
  permItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '0.875rem',
    color: 'var(--text-main)',
    fontWeight: 500,
  },
  demoLoginBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px',
    backgroundColor: 'var(--very-light-blue)',
    color: '#5B90E5',
    fontSize: '0.9rem',
    fontWeight: 700,
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
  },
};
