import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuth } from '../auth/authContext';
import { useNavigate } from 'react-router-dom';

export const UnauthorizedPage: React.FC = () => {
  const { user, getDashboardRoute } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconBg}>
          <ShieldAlert size={40} color="#E76576" />
        </div>
        <h2 style={styles.title}>Access Restricted</h2>
        <p style={styles.desc}>
          You don't have permission to access this section. Your current role is{' '}
          <strong>{user?.role || 'Guest'}</strong>.
        </p>
        <button onClick={() => navigate(getDashboardRoute())} style={styles.btn}>
          <ArrowLeft size={16} />
          <span>Return to Dashboard</span>
        </button>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '70vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
  },
  card: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '20px',
    padding: '48px 32px',
    maxWidth: '460px',
    width: '100%',
    textAlign: 'center',
    boxShadow: 'var(--shadow-card)',
  },
  iconBg: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    backgroundColor: '#FEF2F2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px auto',
    border: '1px solid #FCA5A5',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: 800,
    color: 'var(--text-main)',
    marginBottom: '10px',
  },
  desc: {
    fontSize: '1rem',
    color: 'var(--text-sub)',
    lineHeight: 1.5,
    marginBottom: '28px',
  },
  btn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    backgroundColor: '#5B90E5',
    color: '#FFFFFF',
    fontWeight: 700,
    borderRadius: '10px',
    fontSize: '0.95rem',
  },
};
