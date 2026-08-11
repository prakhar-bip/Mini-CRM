import React from 'react';
import {
  LayoutDashboard,
  Users2,
  TrendingUp,
  UserCheck,
  Package,
  Boxes,
  Briefcase,
  FileBarChart,
  Settings,
} from 'lucide-react';

export const ModulesSection: React.FC = () => {
  const modules = [
    { icon: <LayoutDashboard size={20} color="#5B90E5" />, name: 'Dashboard', desc: 'Real-time business performance overview & KPIs.', highlight: true },
    { icon: <Users2 size={20} color="#5B90E5" />, name: 'CRM', desc: 'Customer pipeline and interaction tracking.', highlight: true },
    { icon: <TrendingUp size={20} color="#5B90E5" />, name: 'Sales', desc: 'Sales order management and deal stages.', highlight: false },
    { icon: <UserCheck size={20} color="#5B90E5" />, name: 'Customers', desc: 'Centralized business customer directory.', highlight: true },
    { icon: <Package size={20} color="#5B90E5" />, name: 'Products', desc: 'SKU catalog, pricing, and warehouse mapping.', highlight: true },
    { icon: <Boxes size={20} color="#5B90E5" />, name: 'Inventory', desc: 'Stock movements IN/OUT with audit trail.', highlight: true },
    { icon: <Briefcase size={20} color="#5B90E5" />, name: 'Employees', desc: 'Team member roles and operational scoping.', highlight: false },
    { icon: <FileBarChart size={20} color="#5B90E5" />, name: 'Reports', desc: 'Stock audit logs and sales turnover stats.', highlight: false },
    { icon: <Settings size={20} color="#5B90E5" />, name: 'Settings', desc: 'System configuration and RBAC security.', highlight: false },
  ];

  return (
    <section id="modules" style={styles.section}>
      <div className="container">
        <div className="section-header">
          <div className="eyebrow-badge">ENTERPRISE MODULES</div>
          <h2>One Platform. Multiple Business Functions.</h2>
          <p>
            Connect every operational department in your organization with specialized,
            role-scoped application modules.
          </p>
        </div>

        <div style={styles.grid}>
          {modules.map((mod, idx) => (
            <div
              key={idx}
              style={{
                ...styles.moduleCard,
                borderColor: mod.highlight ? '#5B90E5' : 'var(--border-color)',
              }}
            >
              <div style={styles.cardHeader}>
                <div style={styles.iconBg}>{mod.icon}</div>
                {mod.highlight && <span style={styles.coreTag}>Core Module</span>}
              </div>
              <h3 style={styles.moduleName}>{mod.name}</h3>
              <p style={styles.moduleDesc}>{mod.desc}</p>
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
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
  },
  moduleCard: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '14px',
    padding: '24px',
    boxShadow: 'var(--shadow-card)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  iconBg: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    backgroundColor: 'var(--very-light-blue)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coreTag: {
    fontSize: '0.7rem',
    fontWeight: 700,
    color: '#5B90E5',
    backgroundColor: 'var(--very-light-blue)',
    padding: '4px 10px',
    borderRadius: '12px',
    border: '1px solid var(--border-color)',
  },
  moduleName: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: 'var(--text-main)',
    marginBottom: '6px',
  },
  moduleDesc: {
    fontSize: '0.875rem',
    color: 'var(--text-sub)',
    lineHeight: 1.4,
  },
};
