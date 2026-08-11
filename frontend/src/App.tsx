import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/authContext';
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
import { AuthModal } from './components/auth/AuthModal';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminDashboard } from './pages/dashboard/AdminDashboard';
import { ManagerDashboard } from './pages/dashboard/ManagerDashboard';
import { SalesDashboard } from './pages/dashboard/SalesDashboard';
import { EmployeeDashboard } from './pages/dashboard/EmployeeDashboard';
import { UnauthorizedPage } from './pages/UnauthorizedPage';

const LandingPage: React.FC = () => {
  const { openAuthModal, user, getDashboardRoute } = useAuth();
  const navigate = useNavigate();

  return (
    <main>
      {user && (
        <div className="container" style={styles.userBanner}>
          <span>
            Logged in as <strong>{user.name || user.email}</strong> ({user.role})
          </span>
          <button onClick={() => navigate(getDashboardRoute())} style={styles.dashboardBtn}>
            Go to Role Dashboard ({user.role}) →
          </button>
        </div>
      )}

      <HeroSection onOpenAuth={() => openAuthModal('ADMIN')} />
      <TrustStrip />
      <FeaturesSection />
      <ModulesSection />
      <HowItWorks />
      <RoleAccessSection onOpenAuth={(roleKey) => openAuthModal(roleKey)} />
      <SecuritySection />
      <FinalCTA onOpenAuth={() => openAuthModal('ADMIN')} />
    </main>
  );
};

const MainLayout: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const { isAuthModalOpen, closeAuthModal, defaultRoleKey, openAuthModal, user, logout } = useAuth();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div style={styles.appContainer}>
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenAuth={(roleKey) => openAuthModal(roleKey)}
        user={user}
        onLogout={logout}
      />

      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/* Protected RBAC Dashboard Routes */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'WAREHOUSE']} />}>
          <Route path="/dashboard/manager" element={<ManagerDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'SALES']} />}>
          <Route path="/dashboard/sales" element={<SalesDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS']} />}>
          <Route path="/dashboard/employee" element={<EmployeeDashboard />} />
        </Route>

        {/* Catch-all unauthorized page */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<UnauthorizedPage />} />
      </Routes>

      <Footer />

      {/* Floating Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        defaultRoleKey={defaultRoleKey}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <MainLayout />
      </Router>
    </AuthProvider>
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
  userBanner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 24px',
    backgroundColor: 'var(--bg-section)',
    borderBottom: '1px solid var(--border-color)',
    fontSize: '0.85rem',
  },
  dashboardBtn: {
    padding: '6px 14px',
    backgroundColor: '#5B90E5',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 700,
    fontSize: '0.85rem',
  },
};

export default App;
