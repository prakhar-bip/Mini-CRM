import React, { useState } from 'react';
import { Building2, Sun, Moon, Menu, X, LogIn, UserCheck, LogOut } from 'lucide-react';

interface NavbarProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onOpenAuth: (defaultRole?: string) => void;
  user: any;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  toggleTheme,
  onOpenAuth,
  user,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header style={styles.header}>
      <div className="container" style={styles.navContainer}>
        {/* Brand Logo */}
        <a href="#home" style={styles.logo}>
          <div style={styles.logoIconBg}>
            <Building2 size={22} color="#5B90E5" />
          </div>
          <span style={styles.logoText}>
            Mini<span style={{ color: '#5B90E5' }}>ERP</span>
          </span>
        </a>

        {/* Navigation Links (Desktop) */}
        <nav style={styles.desktopNav}>
          <a href="#home" style={styles.navLink}>Home</a>
          <a href="#features" style={styles.navLink}>Features</a>
          <a href="#modules" style={styles.navLink}>Modules</a>
          <a href="#rbac" style={styles.navLink}>Security & RBAC</a>
        </nav>

        {/* Action Controls & Auth Buttons */}
        <div style={styles.rightActions}>
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            style={styles.themeBtn}
            title={`Switch to ${theme === 'light' ? 'Semi-Dark' : 'Light'} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} color="#9DC0F7" />}
          </button>

          {user ? (
            <div style={styles.userControls}>
              <div style={styles.userBadge}>
                <UserCheck size={16} color="#45C98A" />
                <span style={styles.userName}>{user.name || user.email}</span>
                <span style={styles.rolePill}>{user.role}</span>
              </div>
              <button onClick={onLogout} style={styles.logoutBtn} title="Sign Out">
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <>
              <button onClick={() => onOpenAuth()} style={styles.signInBtn}>
                <LogIn size={16} />
                <span>Sign In</span>
              </button>
              <button onClick={() => onOpenAuth()} style={styles.getStartedBtn}>
                Get Started
              </button>
            </>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={styles.hamburgerBtn}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={styles.mobileDrawer}>
          <a href="#home" onClick={() => setMobileMenuOpen(false)} style={styles.mobileNavLink}>Home</a>
          <a href="#features" onClick={() => setMobileMenuOpen(false)} style={styles.mobileNavLink}>Features</a>
          <a href="#modules" onClick={() => setMobileMenuOpen(false)} style={styles.mobileNavLink}>Modules</a>
          <a href="#rbac" onClick={() => setMobileMenuOpen(false)} style={styles.mobileNavLink}>Security & RBAC</a>
          <div style={styles.mobileDrawerActions}>
            {!user ? (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth();
                  }}
                  style={{ ...styles.signInBtn, width: '100%', justifyContent: 'center' }}
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth();
                  }}
                  style={{ ...styles.getStartedBtn, width: '100%' }}
                >
                  Get Started
                </button>
              </>
            ) : (
              <button onClick={onLogout} style={{ ...styles.logoutBtn, width: '100%', justifyContent: 'center' }}>
                <LogOut size={16} />
                <span>Logout ({user.role})</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    backgroundColor: 'var(--navbar-bg)',
    backdropFilter: 'blur(8px)',
    borderBottom: '1px solid var(--border-color)',
    transition: 'all 0.25s ease',
  },
  navContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '72px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
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
    letterSpacing: '-0.03em',
  },
  desktopNav: {
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
  },
  navLink: {
    color: 'var(--text-sub)',
    fontSize: '0.95rem',
    fontWeight: 600,
    textDecoration: 'none',
    transition: 'color 0.2s ease',
  },
  rightActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  themeBtn: {
    width: '38px',
    height: '38px',
    borderRadius: '8px',
    backgroundColor: 'var(--bg-section)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-main)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '9px 18px',
    backgroundColor: 'transparent',
    color: 'var(--text-main)',
    fontSize: '0.9rem',
    fontWeight: 600,
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
  },
  getStartedBtn: {
    padding: '9px 20px',
    backgroundColor: '#5B90E5',
    color: '#FFFFFF',
    fontSize: '0.9rem',
    fontWeight: 700,
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(91, 144, 229, 0.25)',
  },
  userControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  userBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 12px',
    backgroundColor: 'var(--bg-section)',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
  },
  userName: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'var(--text-main)',
  },
  rolePill: {
    fontSize: '0.7rem',
    fontWeight: 700,
    backgroundColor: '#5B90E5',
    color: '#FFFFFF',
    padding: '2px 8px',
    borderRadius: '10px',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    backgroundColor: 'transparent',
    color: '#E76576',
    fontSize: '0.85rem',
    fontWeight: 600,
    borderRadius: '8px',
    border: '1px solid #E76576',
  },
  hamburgerBtn: {
    display: 'none',
    width: '40px',
    height: '40px',
    backgroundColor: 'transparent',
    color: 'var(--text-main)',
  },
  mobileDrawer: {
    display: 'flex',
    flexDirection: 'column',
    padding: '20px 24px',
    backgroundColor: 'var(--bg-card)',
    borderBottom: '1px solid var(--border-color)',
    gap: '16px',
  },
  mobileNavLink: {
    fontSize: '1.05rem',
    fontWeight: 600,
    color: 'var(--text-main)',
  },
  mobileDrawerActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: '10px',
  },
};
