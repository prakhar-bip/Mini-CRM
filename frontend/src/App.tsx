import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { axiosClient } from './api/axiosClient';

interface HealthStatus {
  status: string;
  message: string;
  timestamp: string;
  environment: string;
}

const HomePage: React.FC = () => {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.get<HealthStatus>('/health');
      setHealth(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to connect to backend server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div style={styles.card}>
      <h2>Wholesale Mini ERP + CRM Portal</h2>
      <p style={styles.subtitle}>Phase 1 Foundation & System Status</p>

      <div style={styles.statusBox}>
        <h3>Backend API Connection Status</h3>
        {loading && <p>Checking backend health...</p>}
        {error && <p style={styles.errorText}>❌ Error: {error}</p>}
        {health && (
          <div style={styles.successBox}>
            <p><strong>Status:</strong> ✅ {health.status.toUpperCase()}</p>
            <p><strong>Message:</strong> {health.message}</p>
            <p><strong>Environment:</strong> {health.environment}</p>
            <p><strong>Timestamp:</strong> {new Date(health.timestamp).toLocaleString()}</p>
          </div>
        )}
        <button style={styles.button} onClick={checkHealth} disabled={loading}>
          {loading ? 'Testing...' : 'Re-test Health Check Endpoint'}
        </button>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>Mini ERP + CRM Operations Portal</h1>
          <nav>
            <Link to="/" style={styles.navLink}>Home</Link>
          </nav>
        </header>
        <main style={styles.main}>
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </main>
        <footer style={styles.footer}>
          <p>College Recruitment Placement Case Study — Phase 1 Initialized</p>
        </footer>
      </div>
    </Router>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f8fafc',
    color: '#0f172a',
    margin: 0,
    padding: 0,
  },
  header: {
    backgroundColor: '#1e293b',
    color: '#ffffff',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  title: {
    margin: 0,
    fontSize: '1.25rem',
    fontWeight: 600,
  },
  navLink: {
    color: '#38bdf8',
    textDecoration: 'none',
    fontWeight: 500,
  },
  main: {
    flex: 1,
    padding: '2rem',
    maxWidth: '800px',
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '2rem',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
  },
  subtitle: {
    color: '#64748b',
    marginTop: '-0.5rem',
    marginBottom: '1.5rem',
  },
  statusBox: {
    marginTop: '1.5rem',
    padding: '1rem',
    backgroundColor: '#f1f5f9',
    borderRadius: '6px',
  },
  successBox: {
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '6px',
    padding: '1rem',
    marginBottom: '1rem',
  },
  errorText: {
    color: '#dc2626',
    fontWeight: 500,
  },
  button: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    padding: '0.625rem 1.25rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: 500,
  },
  footer: {
    textAlign: 'center',
    padding: '1rem',
    fontSize: '0.875rem',
    color: '#94a3b8',
    borderTop: '1px solid #e2e8f0',
  },
};

export default App;
