import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { TrustStrip } from './components/TrustStrip';
import { FeaturesSection } from './components/FeaturesSection';
import { ModulesSection } from './components/ModulesSection';
import { HowItWorks } from './components/HowItWorks';
import { RoleAccessSection } from './components/RoleAccessSection';
import { SecuritySection } from './components/SecuritySection';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { DashboardView } from './components/DashboardView';

export const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [defaultRoleKey, setDefaultRoleKey] = useState<string>('ADMIN');
  const [user, setUser] = useState<any>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [viewMode, setViewMode] = useState<'landing' | 'workspace'>(() => (user ? 'workspace' : 'landing'));

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleOpenAuth = (roleKey: string = 'ADMIN') => {
    setDefaultRoleKey(roleKey);
    setAuthModalOpen(true);
  };

  const handleLoginSuccess = (loggedInUser: any, _token: string) => {
    setUser(loggedInUser);
    setViewMode('workspace');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setViewMode('landing');
  };

  return (
    <div style={styles.appContainer}>
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenAuth={handleOpenAuth}
        user={user}
        onLogout={handleLogout}
      />

      {/* Switch between Landing Page and Logged-in Workspace Dashboard */}
      {user && viewMode === 'workspace' ? (
        <div>
          <div className="container" style={styles.viewToggleBar}>
            <button onClick={() => setViewMode('landing')} style={styles.viewToggleBtn}>
              ← View SaaS Landing Page
            </button>
            <span style={styles.viewToggleText}>
              Viewing Live Workspace for <strong>{user.name || user.email}</strong> ({user.role})
            </span>
          </div>
          <DashboardView user={user} onLogout={handleLogout} />
        </div>
      ) : (
        <main>
          {user && (
            <div className="container" style={styles.viewToggleBar}>
              <span style={styles.viewToggleText}>
                Logged in as <strong>{user.name || user.email}</strong> ({user.role})
              </span>
              <button onClick={() => setViewMode('workspace')} style={styles.viewToggleBtnActive}>
                Go to Active Workspace →
              </button>
            </div>
          )}

          <HeroSection onOpenAuth={() => handleOpenAuth('ADMIN')} />
          <TrustStrip />
          <FeaturesSection />
          <ModulesSection />
          <HowItWorks />
          <RoleAccessSection onOpenAuth={handleOpenAuth} />
          <SecuritySection />
          <FinalCTA onOpenAuth={() => handleOpenAuth('ADMIN')} />
        </main>
      )}

      <Footer />

      {/* Floating Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultRoleKey={defaultRoleKey}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  appContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'var(--bg-main)',
    color: 'var(--text-main)',
    transition: 'background-color 0.25s ease',
  },
  viewToggleBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 24px',
    backgroundColor: 'var(--bg-section)',
    borderBottom: '1px solid var(--border-color)',
    fontSize: '0.85rem',
  },
  viewToggleBtn: {
    padding: '6px 14px',
    backgroundColor: 'var(--bg-card)',
    color: 'var(--text-main)',
    border: '1px solid var(--border-color)',
    borderRadius: '6px',
    fontWeight: 600,
    fontSize: '0.85rem',
  },
  viewToggleBtnActive: {
    padding: '6px 14px',
    backgroundColor: '#5B90E5',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 700,
    fontSize: '0.85rem',
  },
  viewToggleText: {
    color: 'var(--text-sub)',
  },
};

export default App;
