import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, Eye, EyeOff, Shield, LogIn, AlertCircle, CheckCircle2 } from 'lucide-react';
import { axiosClient } from '../api/axiosClient';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRoleKey?: string;
  onLoginSuccess: (user: any, token: string) => void;
}

const PRESET_ACCOUNTS = {
  ADMIN: { email: 'admin@example.com', password: 'Password@123', label: 'Admin', role: 'ADMIN' },
  SALES: { email: 'sales@example.com', password: 'Password@123', label: 'Sales', role: 'SALES' },
  WAREHOUSE: { email: 'warehouse@example.com', password: 'Password@123', label: 'Warehouse', role: 'WAREHOUSE' },
  ACCOUNTS: { email: 'accounts@example.com', password: 'Password@123', label: 'Accounts', role: 'ACCOUNTS' },
};

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultRoleKey = 'ADMIN',
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('ADMIN');

  useEffect(() => {
    if (isOpen) {
      const presetKey = (defaultRoleKey.toUpperCase() in PRESET_ACCOUNTS
        ? defaultRoleKey.toUpperCase()
        : 'ADMIN') as keyof typeof PRESET_ACCOUNTS;

      fillAccount(presetKey);
    }
  }, [isOpen, defaultRoleKey]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const fillAccount = (key: keyof typeof PRESET_ACCOUNTS) => {
    setSelectedRole(key);
    setEmail(PRESET_ACCOUNTS[key].email);
    setPassword(PRESET_ACCOUNTS[key].password);
    setError(null);
    setSuccess(null);
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axiosClient.post('/auth/login', {
        email: email.trim(),
        password: password.trim(),
      });

      const { user, token } = response.data;

      if (rememberMe) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      }

      setSuccess(`Authenticated successfully as ${user.role}! Redirecting...`);
      setTimeout(() => {
        onLoginSuccess(user, token);
        onClose();
      }, 1000);
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Invalid login credentials. Please check your details.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button onClick={onClose} style={styles.closeBtn} aria-label="Close modal">
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={styles.header}>
          <div style={styles.iconBg}>
            <Shield size={24} color="#5B90E5" />
          </div>
          <h3 style={styles.title}>Sign In to MiniERP Workspace</h3>
          <p style={styles.subtitle}>Select a demo account or enter credentials</p>
        </div>

        {/* Preset Role Selector Buttons */}
        <div style={styles.roleSelector}>
          <span style={styles.selectorLabel}>Demo Account Presets:</span>
          <div style={styles.roleGrid}>
            {(Object.keys(PRESET_ACCOUNTS) as Array<keyof typeof PRESET_ACCOUNTS>).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => fillAccount(key)}
                style={{
                  ...styles.roleBtn,
                  backgroundColor: selectedRole === key ? '#5B90E5' : 'var(--bg-section)',
                  color: selectedRole === key ? '#FFFFFF' : 'var(--text-main)',
                  borderColor: selectedRole === key ? '#5B90E5' : 'var(--border-color)',
                }}
              >
                {PRESET_ACCOUNTS[key].label}
              </button>
            ))}
          </div>
        </div>

        {/* Feedback Messages */}
        {error && (
          <div style={styles.errorBox}>
            <AlertCircle size={16} color="#E76576" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div style={styles.successBox}>
            <CheckCircle2 size={16} color="#45C98A" />
            <span>{success}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputWrapper}>
              <Mail size={18} color="#64748B" style={styles.inputIcon} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={18} color="#64748B" style={styles.inputIcon} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                style={styles.input}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} color="#64748B" /> : <Eye size={18} color="#64748B" />}
              </button>
            </div>
          </div>

          <div style={styles.formOptions}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={styles.checkbox}
              />
              <span>Remember me</span>
            </label>
            <a
              href="#forgot"
              onClick={(e) => {
                e.preventDefault();
                alert('Demo Accounts Password: Password@123');
              }}
              style={styles.forgotLink}
            >
              Forgot password?
            </a>
          </div>

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <LogIn size={18} />
                <span>Sign In to Workspace</span>
              </>
            )}
          </button>
        </form>

        <div style={styles.footerNote}>
          <span>Secured via JWT & Role-Based Authorization</span>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    padding: '16px',
  },
  modal: {
    backgroundColor: 'var(--bg-card)',
    borderRadius: '20px',
    border: '1px solid var(--border-color)',
    padding: '32px',
    width: '100%',
    maxWidth: '440px',
    boxShadow: 'var(--shadow-modal)',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    backgroundColor: 'var(--bg-section)',
    border: '1px solid var(--border-color)',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-main)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  iconBg: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: 'var(--very-light-blue)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 12px auto',
  },
  title: {
    fontSize: '1.35rem',
    fontWeight: 800,
    color: 'var(--text-main)',
    marginBottom: '4px',
  },
  subtitle: {
    fontSize: '0.85rem',
    color: 'var(--text-sub)',
  },
  roleSelector: {
    marginBottom: '20px',
    backgroundColor: 'var(--bg-section)',
    padding: '12px',
    borderRadius: '12px',
    border: '1px solid var(--border-color)',
  },
  selectorLabel: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: 'var(--text-sub)',
    display: 'block',
    marginBottom: '8px',
    textTransform: 'uppercase',
  },
  roleGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '6px',
  },
  roleBtn: {
    padding: '6px 4px',
    fontSize: '0.75rem',
    fontWeight: 700,
    borderRadius: '6px',
    border: '1px solid var(--border-color)',
    textAlign: 'center',
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 14px',
    backgroundColor: '#FEF2F2',
    border: '1px solid #FCA5A5',
    borderRadius: '8px',
    color: '#DC2626',
    fontSize: '0.85rem',
    marginBottom: '16px',
  },
  successBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 14px',
    backgroundColor: '#F0FDF4',
    border: '1px solid #BBF7D0',
    borderRadius: '8px',
    color: '#16A34A',
    fontSize: '0.85rem',
    marginBottom: '16px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'var(--text-main)',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
  },
  input: {
    width: '100%',
    padding: '11px 40px 11px 40px',
    backgroundColor: 'var(--bg-main)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    fontSize: '0.9rem',
    color: 'var(--text-main)',
    outline: 'none',
  },
  eyeBtn: {
    position: 'absolute',
    right: '12px',
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
  },
  formOptions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.85rem',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: 'var(--text-sub)',
    cursor: 'pointer',
  },
  checkbox: {
    accentColor: '#5B90E5',
  },
  forgotLink: {
    color: '#5B90E5',
    fontWeight: 600,
    textDecoration: 'none',
  },
  submitBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '13px',
    backgroundColor: '#5B90E5',
    color: '#FFFFFF',
    fontSize: '0.95rem',
    fontWeight: 700,
    borderRadius: '8px',
    marginTop: '6px',
    boxShadow: '0 4px 12px rgba(91, 144, 229, 0.3)',
  },
  footerNote: {
    textAlign: 'center',
    marginTop: '16px',
    fontSize: '0.75rem',
    color: 'var(--text-muted-dynamic)',
    fontWeight: 500,
  },
};
