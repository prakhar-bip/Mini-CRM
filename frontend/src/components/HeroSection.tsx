import React from 'react';
import { ArrowRight, ShieldCheck, Lock, Database } from 'lucide-react';
import { HeroVisual } from './HeroVisual';

interface HeroSectionProps {
  onOpenAuth: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenAuth }) => {
  return (
    <section id="home" style={styles.section}>
      <div className="container" style={styles.grid}>
        {/* Left Column: Hero Text & CTAs */}
        <div style={styles.leftCol}>
          <div className="eyebrow-badge">
            BUSINESS OPERATIONS PLATFORM
          </div>

          <h1 style={styles.title}>
            Manage Your Business.{' '}
            <span style={{ color: '#5B90E5' }}>Connect Your Customers.</span>{' '}
            Grow Smarter.
          </h1>

          <p style={styles.description}>
            A unified ERP and CRM operations platform designed to help teams manage
            customers, sales, employees, inventory, and business operations from one
            centralized workspace.
          </p>

          <div style={styles.ctaGroup}>
            <button onClick={onOpenAuth} style={styles.primaryCta}>
              <span>Get Started</span>
              <ArrowRight size={18} />
            </button>
            <a href="#features" style={styles.secondaryCta}>
              Explore Features
            </a>
          </div>

          {/* Trust Status Line */}
          <div style={styles.trustLine}>
            <div style={styles.trustItem}>
              <ShieldCheck size={16} color="#5B90E5" />
              <span>Secure</span>
            </div>
            <span style={styles.trustDot}>•</span>
            <div style={styles.trustItem}>
              <Lock size={16} color="#5B90E5" />
              <span>Role-Based Access</span>
            </div>
            <span style={styles.trustDot}>•</span>
            <div style={styles.trustItem}>
              <Database size={16} color="#5B90E5" />
              <span>Centralized Operations</span>
            </div>
          </div>
        </div>

        {/* Right Column: Realistic SaaS Dashboard Visual */}
        <div style={styles.rightCol}>
          <HeroVisual />
        </div>
      </div>
    </section>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  section: {
    padding: '80px 0 60px 0',
    backgroundColor: 'var(--bg-main)',
    transition: 'background-color 0.25s ease',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.15fr',
    gap: '48px',
    alignItems: 'center',
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: '3.25rem',
    fontWeight: 800,
    color: 'var(--text-main)',
    lineHeight: 1.15,
    letterSpacing: '-0.03em',
    marginBottom: '20px',
  },
  description: {
    fontSize: '1.15rem',
    color: 'var(--text-sub)',
    lineHeight: 1.6,
    marginBottom: '32px',
    maxWidth: '540px',
  },
  ctaGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '36px',
    flexWrap: 'wrap',
  },
  primaryCta: {
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
  secondaryCta: {
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
    boxShadow: 'var(--shadow-card)',
  },
  trustLine: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'var(--text-sub)',
    flexWrap: 'wrap',
  },
  trustItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  trustDot: {
    color: '#C4CFE2',
  },
  rightCol: {
    width: '100%',
  },
};
