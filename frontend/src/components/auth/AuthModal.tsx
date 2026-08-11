import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building2,
  LogIn,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Send,
  Loader2,
} from 'lucide-react';
import { axiosClient } from '../../api/axiosClient';
import { useAuth } from '../../auth/authContext';
import { ROLE_DASHBOARD_ROUTES } from '../../auth/permissions';
import { useNavigate } from 'react-router-dom';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRoleKey?: string;
}

const PRESET_ACCOUNTS = {
  ADMIN: { email: 'admin@example.com', password: 'Password@123', label: 'Administrator', role: 'ADMIN' },
  WAREHOUSE: { email: 'warehouse@example.com', password: 'Password@123', label: 'Manager', role: 'WAREHOUSE' },
  SALES: { email: 'sales@example.com', password: 'Password@123', label: 'Sales', role: 'SALES' },
  ACCOUNTS: { email: 'accounts@example.com', password: 'Password@123', label: 'Employee', role: 'ACCOUNTS' },
};

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultRoleKey = 'ADMIN',
}) => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [viewState, setViewState] = useState<'login' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('ADMIN');

  // Field validation states
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const presetKey = (defaultRoleKey.toUpperCase() in PRESET_ACCOUNTS
        ? defaultRoleKey.toUpperCase()
        : 'ADMIN') as keyof typeof PRESET_ACCOUNTS;

      fillAccount(presetKey);
      setViewState('login');

      // Focus email input on modal open
      setTimeout(() => emailInputRef.current?.focus(), 100);
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
    setEmailTouched(true);
    setPasswordTouched(true);
  };

  const isEmailValid = email.trim() !== '' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = password.length >= 6;

  if (!isOpen) return null;

  const handleSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailTouched(true);
    setPasswordTouched(true);

    if (!isEmailValid || !isPasswordValid) {
      setError('Please fill in valid email address and password');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axiosClient.post('/auth/login', {
        email: email.trim(),
        password: password.trim(),
      });

      const { user, token } = response.data;
      login(user, token);

      setSuccess(`Authenticated successfully as ${user.role}! Redirecting...`);

      setTimeout(() => {
        onClose();
        const targetRoute = ROLE_DASHBOARD_ROUTES[user.role] || '/dashboard/employee';
        navigate(targetRoute);
      }, 700);
    } catch (err: any) {
      const serverMsg = err.response?.data?.message;
      if (err.code === 'ERR_NETWORK') {
        setError('Unable to connect to the server. Please check your backend server connection.');
      } else {
        setError(serverMsg || 'Invalid email or password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForgot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmailValid) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setLoading(false);
      setSuccess('Reset link sent! Please check your email inbox.');
    }, 1000);
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        {/* Close Button */}
        <button onClick={onClose} style={styles.closeBtn} aria-label="Close modal">
          <X size={20} color="#2E4162" />
        </button>

        {/* Modal Header */}
        <div style={styles.header}>
          <div style={styles.logoRow}>
            <div style={styles.logoIconBg}>
              <Building2 size={22} color="#5B90E5" />
            </div>
            <span style={styles.logoText}>
              Mini<span style={{ color: '#5B90E5' }}>ERP</span>
            </span>
          </div>

          <h3 style={styles.title}>
            {viewState === 'login' ? 'Welcome Back' : 'Reset Your Password'}
          </h3>
          <p style={styles.subtitle}>
            {viewState === 'login'
              ? 'Sign in to access your business operations workspace.'
              : "Enter your email address and we'll help you recover access to your account."}
          </p>
        </div>

        {/* Feedback Alert Messages */}
        {error && (
          <div style={styles.errorAlert}>
            <AlertCircle size={16} color="#E76576" style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div style={styles.successAlert}>
            <CheckCircle2 size={16} color="#45C98A" style={{ flexShrink: 0 }} />
            <span>{success}</span>
          </div>
        )}

        {/* View State: Login Form */}
        {viewState === 'login' ? (
          <>
            {/* Demo / Development Presets */}
            <div style={styles.demoSection}>
              <div style={styles.demoHeader}>
                <span style={styles.demoTitle}>Demo Access</span>
                <span style={styles.demoSubtitle}>Select role preset:</span>
              </div>
              <div style={styles.demoGrid}>
                {(Object.keys(PRESET_ACCOUNTS) as Array<keyof typeof PRESET_ACCOUNTS>).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => fillAccount(key)}
                    style={{
                      ...styles.demoBtn,
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

            <form onSubmit={handleSubmitLogin} style={styles.form} noValidate>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Email Address</label>
                <div style={styles.inputWrapper}>
                  <Mail size={18} color="#64748B" style={styles.inputIcon} />
                  <input
                    ref={emailInputRef}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setEmailTouched(true)}
                    placeholder="Enter your email address"
                    disabled={loading}
                    style={{
                      ...styles.input,
                      borderColor:
                        emailTouched && !isEmailValid
                          ? '#E76576'
                          : emailTouched && isEmailValid
                          ? '#45C98A'
                          : 'var(--border-color)',
                    }}
                  />
                </div>
                {emailTouched && !isEmailValid && (
                  <span style={styles.fieldError}>Please enter a valid email address.</span>
                )}
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Password</label>
                <div style={styles.inputWrapper}>
                  <Lock size={18} color="#64748B" style={styles.inputIcon} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => setPasswordTouched(true)}
                    placeholder="Enter your password"
                    disabled={loading}
                    style={{
                      ...styles.input,
                      borderColor:
                        passwordTouched && !isPasswordValid
                          ? '#E76576'
                          : passwordTouched && isPasswordValid
                          ? '#45C98A'
                          : 'var(--border-color)',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={styles.eyeBtn}
                    tabIndex={-1}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={18} color="#64748B" /> : <Eye size={18} color="#64748B" />}
                  </button>
                </div>
                {passwordTouched && !isPasswordValid && (
                  <span style={styles.fieldError}>Password is required (min 6 characters).</span>
                )}
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
                <button
                  type="button"
                  onClick={() => {
                    setViewState('forgot');
                    setError(null);
                    setSuccess(null);
                  }}
                  style={styles.forgotBtn}
                >
                  Forgot password?
                </button>
              </div>

              <button type="submit" disabled={loading} style={styles.submitBtn}>
                {loading ? (
                  <>
                    <Loader2 size={18} className="spin" style={styles.spinner} />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          /* View State: Forgot Password Form */
          <form onSubmit={handleSubmitForgot} style={styles.form} noValidate>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <div style={styles.inputWrapper}>
                <Mail size={18} color="#64748B" style={styles.inputIcon} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  disabled={loading}
                  style={styles.input}
                />
              </div>
            </div>

            <button type="submit" disabled={loading} style={styles.submitBtn}>
              {loading ? (
                <span>Sending Reset Link...</span>
              ) : (
                <>
                  <Send size={16} />
                  <span>Send Reset Link</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setViewState('login');
                setError(null);
                setSuccess(null);
              }}
              style={styles.backBtn}
            >
              <ArrowLeft size={16} />
              <span>Back to Sign In</span>
            </button>
          </form>
        )}

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
    backdropFilter: 'blur(6px)',
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
    padding: '36px',
    width: '100%',
    maxWidth: '460px',
    boxShadow: 'var(--shadow-modal)',
    position: 'relative',
    transition: 'all 0.2s ease',
  },
  closeBtn: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    backgroundColor: 'var(--very-light-blue)',
    border: '1px solid var(--border-color)',
    borderRadius: '50%',
    width: '34px',
    height: '34px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '14px',
  },
  logoIconBg: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    backgroundColor: 'var(--very-light-blue)',
    border: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: '1.35rem',
    fontWeight: 800,
    color: 'var(--text-main)',
  },
  title: {
    fontSize: '1.45rem',
    fontWeight: 800,
    color: 'var(--text-main)',
    marginBottom: '4px',
  },
  subtitle: {
    fontSize: '0.875rem',
    color: 'var(--text-sub)',
    lineHeight: 1.4,
  },
  demoSection: {
    marginBottom: '20px',
    backgroundColor: 'var(--bg-section)',
    padding: '12px',
    borderRadius: '12px',
    border: '1px solid var(--border-color)',
  },
  demoHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  demoTitle: {
    fontSize: '0.75rem',
    fontWeight: 800,
    color: '#5B90E5',
    textTransform: 'uppercase',
  },
  demoSubtitle: {
    fontSize: '0.7rem',
    color: 'var(--text-sub)',
  },
  demoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '6px',
  },
  demoBtn: {
    padding: '7px 4px',
    fontSize: '0.75rem',
    fontWeight: 700,
    borderRadius: '6px',
    border: '1px solid var(--border-color)',
    textAlign: 'center',
  },
  errorAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 14px',
    backgroundColor: '#FEF2F2',
    border: '1px solid #FCA5A5',
    borderRadius: '10px',
    color: '#DC2626',
    fontSize: '0.85rem',
    marginBottom: '16px',
  },
  successAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 14px',
    backgroundColor: '#F0FDF4',
    border: '1px solid #BBF7D0',
    borderRadius: '10px',
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
    fontWeight: 700,
    color: 'var(--text-main)',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '14px',
  },
  input: {
    width: '100%',
    height: '48px',
    padding: '0 40px 0 44px',
    backgroundColor: 'var(--bg-main)',
    border: '1px solid var(--border-color)',
    borderRadius: '10px',
    fontSize: '0.9rem',
    color: 'var(--text-main)',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  },
  eyeBtn: {
    position: 'absolute',
    right: '12px',
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  fieldError: {
    fontSize: '0.75rem',
    color: '#E76576',
    fontWeight: 600,
    marginTop: '2px',
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
    width: '16px',
    height: '16px',
  },
  forgotBtn: {
    backgroundColor: 'transparent',
    color: '#446091',
    fontSize: '0.85rem',
    fontWeight: 600,
  },
  submitBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    height: '50px',
    backgroundColor: '#5B90E5',
    color: '#FFFFFF',
    fontSize: '0.95rem',
    fontWeight: 700,
    borderRadius: '10px',
    marginTop: '6px',
    boxShadow: '0 4px 12px rgba(91, 144, 229, 0.3)',
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    height: '44px',
    backgroundColor: 'transparent',
    color: 'var(--text-sub)',
    border: '1px solid var(--border-color)',
    borderRadius: '10px',
    fontSize: '0.9rem',
    fontWeight: 600,
  },
  spinner: {
    animation: 'spin 1s linear infinite',
  },
  footerNote: {
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '0.75rem',
    color: 'var(--text-muted-dynamic)',
    fontWeight: 500,
  },
};
