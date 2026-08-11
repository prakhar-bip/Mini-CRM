import React, { useState, useEffect } from 'react';
import { axiosClient } from '../../api/axiosClient';
import { Settings, Server, CheckCircle2, ShieldAlert } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient
      .get('/health')
      .then((res) => setHealth(res.data))
      .catch((err) => setHealth({ status: 'ERROR', error: err.message }))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <div>
          <h2 style={styles.heading}>System Settings & Backend Health</h2>
          <p style={styles.subheading}>Configure system parameters, API base URL, and database connectivity.</p>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <Server size={18} color="#5B90E5" />
          <h3 style={styles.cardTitle}>Backend Server & Database Status</h3>
        </div>
        <div style={styles.cardBody}>
          {loading ? (
            <span>Checking server health...</span>
          ) : health?.status === 'OK' || health?.status === 'ok' ? (
            <div style={styles.healthOk}>
              <CheckCircle2 size={20} color="#45C98A" />
              <div>
                <strong>REST API Status: ONLINE (HTTP 200 OK)</strong>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-sub)' }}>
                  Database connection: PostgreSQL Active • Timestamp: {health.timestamp || new Date().toISOString()}
                </div>
              </div>
            </div>
          ) : (
            <div style={styles.healthErr}>
              <ShieldAlert size={20} color="#E76576" />
              <div>
                <strong>REST API Status: UNHEALTHY</strong>
                <div style={{ fontSize: '0.8rem', color: '#E76576' }}>
                  {health?.error || 'Unable to connect to backend server'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <Settings size={18} color="#5B90E5" />
          <h3 style={styles.cardTitle}>Environment Configuration</h3>
        </div>
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
          <div><strong>Frontend API Base URL:</strong> <code>{import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}</code></div>
          <div><strong>Theme System:</strong> Dual Persistent Mode (Semi-Dark Navy default & Light mode)</div>
          <div><strong>Session Auth:</strong> Bearer JWT Token stored in LocalStorage with Auto-Expiration</div>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heading: {
    fontSize: '1.5rem',
    fontWeight: 800,
    color: 'var(--text-main)',
    margin: 0,
  },
  subheading: {
    fontSize: '0.85rem',
    color: 'var(--text-sub)',
    margin: '4px 0 0 0',
  },
  card: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '14px 18px',
    backgroundColor: 'var(--bg-section)',
    borderBottom: '1px solid var(--border-color)',
  },
  cardTitle: {
    fontSize: '0.95rem',
    fontWeight: 700,
    margin: 0,
    color: 'var(--text-main)',
  },
  cardBody: {
    padding: '18px',
  },
  healthOk: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    backgroundColor: '#F0FDF4',
    border: '1px solid #BBF7D0',
    borderRadius: '8px',
  },
  healthErr: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    backgroundColor: '#FEF2F2',
    border: '1px solid #FCA5A5',
    borderRadius: '8px',
  },
};
