import React from 'react';
import { Users, TrendingUp, Package, Briefcase, BarChart3, ShieldCheck } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Users size={24} color="#5B90E5" />,
      title: 'Customer Management',
      desc: 'Manage customer profiles, interactions, leads, and relationship history from one place.',
    },
    {
      icon: <TrendingUp size={24} color="#5B90E5" />,
      title: 'Sales Management',
      desc: 'Track leads, opportunities, deals, sales activity, and pipeline progress.',
    },
    {
      icon: <Package size={24} color="#5B90E5" />,
      title: 'Inventory Control',
      desc: 'Monitor products, stock levels, inventory movement, and availability.',
    },
    {
      icon: <Briefcase size={24} color="#5B90E5" />,
      title: 'Employee Management',
      desc: 'Manage employees, departments, roles, and operational responsibilities.',
    },
    {
      icon: <BarChart3 size={24} color="#5B90E5" />,
      title: 'Business Analytics',
      desc: 'Turn operational data into meaningful KPIs, reports, and performance insights.',
    },
    {
      icon: <ShieldCheck size={24} color="#5B90E5" />,
      title: 'Role-Based Security',
      desc: 'Control access to business data and operations based on user roles and permissions.',
    },
  ];

  return (
    <section id="features" style={styles.section}>
      <div className="container">
        <div className="section-header">
          <div className="eyebrow-badge">
            POWERFUL BUSINESS OPERATIONS
          </div>
          <h2>Everything Your Team Needs in One Workspace</h2>
          <p>
            Bring your core business operations and customer workflows together with a
            centralized platform built for clarity, control, and efficiency.
          </p>
        </div>

        <div style={styles.grid}>
          {features.map((feature, idx) => (
            <div key={idx} style={styles.card} className="card-hover-effect">
              <div style={styles.iconBg}>{feature.icon}</div>
              <h3 style={styles.cardTitle}>{feature.title}</h3>
              <p style={styles.cardDesc}>{feature.desc}</p>
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
    backgroundColor: 'var(--bg-main)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '28px',
  },
  card: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: 'var(--shadow-card)',
    transition: 'transform 0.2s ease, border-color 0.2s ease',
  },
  iconBg: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: 'var(--very-light-blue)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  cardTitle: {
    fontSize: '1.2rem',
    fontWeight: 700,
    color: 'var(--text-main)',
    marginBottom: '10px',
  },
  cardDesc: {
    fontSize: '0.95rem',
    color: 'var(--text-sub)',
    lineHeight: 1.5,
  },
};
