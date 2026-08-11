import React from 'react';
import { LogIn, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      icon: <LogIn size={20} color="#FFFFFF" />,
      title: 'Sign In',
      desc: 'Users securely authenticate through the centralized authentication system.',
    },
    {
      num: '02',
      icon: <ShieldCheck size={20} color="#FFFFFF" />,
      title: 'Access Your Workspace',
      desc: 'RBAC determines the dashboard and features available to each user.',
    },
    {
      num: '03',
      icon: <CheckCircle2 size={20} color="#FFFFFF" />,
      title: 'Manage Operations',
      desc: 'Teams manage customers, sales, inventory, employees, and business data from their workspace.',
    },
  ];

  return (
    <section style={styles.section}>
      <div className="container">
        <div className="section-header">
          <div className="eyebrow-badge">ONBOARDING WORKFLOW</div>
          <h2>Simple From Day One</h2>
          <p>
            Get up and running immediately with role-scoped authentication and intuitive
            operational views.
          </p>
        </div>

        <div style={styles.stepsRow}>
          {steps.map((step, idx) => (
            <div key={idx} style={styles.stepCard}>
              <div style={styles.badgeRow}>
                <div style={styles.numCircle}>{step.num}</div>
                <div style={styles.iconCircle}>{step.icon}</div>
              </div>
              <h3 style={styles.stepTitle}>{step.title}</h3>
              <p style={styles.stepDesc}>{step.desc}</p>
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
  stepsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '32px',
    position: 'relative',
  },
  stepCard: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: 'var(--shadow-card)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  badgeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
  },
  numCircle: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    backgroundColor: '#5B90E5',
    color: '#FFFFFF',
    fontWeight: 800,
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#2E4162',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: 'var(--text-main)',
    marginBottom: '10px',
  },
  stepDesc: {
    fontSize: '0.95rem',
    color: 'var(--text-sub)',
    lineHeight: 1.5,
  },
};
