import React from 'react';
import {
  Building2,
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  FileBarChart,
  UserCog,
  Sun,
  Moon,
  HelpCircle,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../auth/authContext';

interface SidebarProps {
  activeNav: string;
  onNavSelect: (navKey: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeNav,
  onNavSelect,
  theme,
  toggleTheme,
  isOpenMobile,
  onCloseMobile,
}) => {
  const { logout, user } = useAuth();

  const userRole = (user?.role || 'ADMIN').toUpperCase();

  const allNavGroups = [
    {
      title: 'OVERVIEW',
      items: [
        { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} />, roles: ['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS'] },
      ],
    },
    {
      title: 'CRM',
      items: [
        { key: 'customers', label: 'Customers', icon: <Users size={18} />, roles: ['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS'] },
      ],
    },
    {
      title: 'SALES & ORDERS',
      items: [
        { key: 'orders', label: 'Sales Challans', icon: <ShoppingCart size={18} />, roles: ['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS'] },
      ],
    },
    {
      title: 'INVENTORY & PRODUCTS',
      items: [
        { key: 'products', label: 'Products & Inventory', icon: <Package size={18} />, roles: ['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS'] },
      ],
    },
    {
      title: 'ANALYTICS',
      items: [
        { key: 'reports', label: 'Reports & Audits', icon: <FileBarChart size={18} />, roles: ['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS'] },
      ],
    },
    {
      title: 'ADMINISTRATION',
      items: [
        { key: 'users', label: 'User Management', icon: <UserCog size={18} />, roles: ['ADMIN'] },
      ],
    },
  ];

  const navGroups = allNavGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.roles.includes(userRole)),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <aside
      style={{
        ...styles.sidebar,
        transform: isOpenMobile ? 'translateX(0)' : undefined,
      }}
    >
      {/* Sidebar Header */}
      <div style={styles.header}>
        <div style={styles.logoRow}>
          <div style={styles.logoIconBg}>
            <Building2 size={20} color="#5B90E5" />
          </div>
          <span style={styles.logoText}>
            Mini<span style={{ color: '#5B90E5' }}>ERP</span>
          </span>
        </div>
        <div style={styles.roleBadgeRow}>
          <span style={styles.roleBadge}>{user?.role || 'ADMIN'}</span>
          <span style={styles.roleLabel}>Workspace</span>
        </div>
      </div>

      {/* Nav Groups Scrollable Area */}
      <div style={styles.navContainer}>
        {navGroups.map((group, idx) => (
          <div key={idx} style={styles.group}>
            <span style={styles.groupTitle}>{group.title}</span>
            <div style={styles.itemList}>
              {group.items.map((item) => {
                const isActive = activeNav === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      onNavSelect(item.key);
                      if (onCloseMobile) onCloseMobile();
                    }}
                    style={{
                      ...styles.navItem,
                      backgroundColor: isActive ? 'var(--very-light-blue)' : 'transparent',
                      color: isActive ? '#5B90E5' : 'var(--text-sub)',
                      borderLeft: isActive ? '3px solid #5B90E5' : '3px solid transparent',
                      fontWeight: isActive ? 700 : 600,
                    }}
                  >
                    <span style={{ color: isActive ? '#5B90E5' : 'var(--text-sub)' }}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Bottom Controls */}
      <div style={styles.footer}>
        <button onClick={toggleTheme} style={styles.footerBtn}>
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} color="#9DC0F7" />}
          <span>{theme === 'light' ? 'Semi-Dark Mode' : 'Light Mode'}</span>
        </button>

        <button onClick={() => alert('Support Docs & Contact: prakhar@fundsroom.com')} style={styles.footerBtn}>
          <HelpCircle size={16} />
          <span>Help & Support</span>
        </button>

        <button onClick={logout} style={styles.logoutBtn}>
          <LogOut size={16} color="#E76576" />
          <span style={{ color: '#E76576' }}>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  sidebar: {
    width: '250px',
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
    backgroundColor: 'var(--bg-card)',
    borderRight: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1100,
    transition: 'transform 0.3s ease, background-color 0.25s ease',
  },
  header: {
    padding: '20px 20px 16px 20px',
    borderBottom: '1px solid var(--border-color)',
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '8px',
  },
  logoIconBg: {
    width: '34px',
    height: '34px',
    borderRadius: '8px',
    backgroundColor: 'var(--very-light-blue)',
    border: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: '1.3rem',
    fontWeight: 800,
    color: 'var(--text-main)',
  },
  roleBadgeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  roleBadge: {
    fontSize: '0.65rem',
    fontWeight: 800,
    color: '#FFFFFF',
    backgroundColor: '#5B90E5',
    padding: '2px 8px',
    borderRadius: '10px',
  },
  roleLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-sub)',
    fontWeight: 600,
  },
  navContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  group: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  groupTitle: {
    fontSize: '0.65rem',
    fontWeight: 800,
    color: 'var(--text-muted-dynamic)',
    letterSpacing: '0.08em',
    padding: '0 10px',
    marginBottom: '4px',
  },
  itemList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '9px 12px',
    borderRadius: '8px',
    fontSize: '0.85rem',
    textAlign: 'left',
    width: '100%',
    transition: 'all 0.15s ease',
  },
  footer: {
    padding: '12px',
    borderTop: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  footerBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 12px',
    backgroundColor: 'transparent',
    color: 'var(--text-sub)',
    fontSize: '0.85rem',
    fontWeight: 600,
    borderRadius: '6px',
    textAlign: 'left',
    width: '100%',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 12px',
    backgroundColor: 'transparent',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: 600,
    textAlign: 'left',
    width: '100%',
  },
};
