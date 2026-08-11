import React from 'react';
import { Database, ShieldCheck, Activity, Layers } from 'lucide-react';

export const TrustStrip: React.FC = () => {
  const items = [
    {
      icon: <Database size={20} color="#5B90E5" />,
      title: 'Centralized Data',
      desc: 'All business information in one workspace.',
    },
    {
      icon: <ShieldCheck size={20} color="#5B90E5" />,
      title: 'Role-Based Access',
      desc: 'Users see only what they are authorized to access.',
    },
    {
      icon: <Activity size={20} color="#5B90E5" />,
      title: 'Real-Time Operations',
      desc: 'Track business activity from a single dashboard.',
    },
    {
      icon: <Layers size={20} color="#5B90E5" />,
      title: 'Scalable Architecture',
      desc: 'Designed for growing teams and workflows.',
    },
  ];

  return (
    <section style={styles.section}>
      <div className="container">
        <div style={styles.grid}>
          {items.map((item, idx) => (
            <div key={idx} style={styles.itemCard}>
              <div style={styles.iconBg}>{item.icon}</div>
              <div>
                <h4 style={styles.title}>{item.title}</h4>
                <p style={styles.desc}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  section: {
    padding: '24px 0',
    backgroundColor: 'var(--bg-section)',
    borderTop: '1px solid var(--border-color)',
    borderBottom: '1px solid var(--border-color)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '24px',
  },
  itemCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px',
  },
  iconBg: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  title: {
    fontSize: '0.95rem',
    fontWeight: 700,
    color: 'var(--text-main)',
    marginBottom: '2px',
  },
  desc: {
    fontSize: '0.8rem',
    color: 'var(--text-sub)',
    lineHeight: 1.4,
  },
};
