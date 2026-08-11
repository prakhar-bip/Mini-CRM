import React from 'react';
import { ArrowRight, Layers } from 'lucide-react';

interface FinalCTAProps {
  onOpenAuth: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onOpenAuth }) => {
  return (
    <section style={styles.section}>
      <div className="container">
        <div style={styles.card}>
          <div style={styles.content}>
            <div style={styles.iconBadge}>
              <Layers size={20} color="#5B90E5" />
            </div>
            <h2 style={styles.heading}>Ready to Simplify Your Business Operations?</h2>
            <p style={styles.desc}>
              Bring your teams, customers, and operations together in one centralized
              platform designed for security, clarity, and growth.
            </p>
            <div style={styles.btnRow}>
              <button onClick={onOpenAuth} style={styles.primaryBtn}>
                <span>Get Started</span>
                <ArrowRight size={18} />
              </button>
              <a href="#features" style={styles.secondaryBtn}>
                Explore Platform
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  section: {
    padding: '80px 0',
    backgroundColor: 'var(--bg-main)',
  },
  card: {
    backgroundColor: 'var(--bg-section)',
    border: '1px solid var(--border-color)',
    borderRadius: '24px',
    padding: '64px 32px',
    textAlign: 'center',
    boxShadow: 'var(--shadow-card)',
  },
  content: {
    maxWidth: '680px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  iconBadge: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  heading: {
    fontSize: '2.5rem',
    fontWeight: 800,
    color: 'var(--text-main)',
    lineHeight: 1.2,
    marginBottom: '16px',
  },
  desc: {
    fontSize: '1.1rem',
    color: 'var(--text-sub)',
    lineHeight: 1.6,
    marginBottom: '32px',
  },
  btnRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  primaryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    padding: '14px 28px',
    backgroundColor: '#5B90E5',
    color: '#FFFFFF',
    fontSize: '1rem',
    fontWeight: 700,
    borderRadius: '10px',
    boxShadow: '0 4px 14px rgba(91, 144, 229, 0.3)',
  },
  secondaryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '14px 28px',
    backgroundColor: 'var(--bg-card)',
    color: 'var(--text-main)',
    fontSize: '1rem',
    fontWeight: 600,
    borderRadius: '10px',
    border: '1px solid var(--border-color)',
    textDecoration: 'none',
  },
};
