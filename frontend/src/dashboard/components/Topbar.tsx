import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  HelpCircle,
  User as UserIcon,
  LogOut,
  ChevronDown,
  AlertTriangle,
  CheckCircle2,
  Package,
} from 'lucide-react';
import { useAuth } from '../../auth/authContext';

interface TopbarProps {
  onToggleMobileSidebar: () => void;
  onSearchChange?: (term: string) => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  onToggleMobileSidebar,
  onSearchChange,
}) => {
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifications = [
    { id: '1', title: 'Low inventory alert: Solar Panel 300W', time: '10m ago', icon: <AlertTriangle size={14} color="#E76576" /> },
    { id: '2', title: 'Order #CH-20260811-3938 confirmed', time: '25m ago', icon: <CheckCircle2 size={14} color="#45C98A" /> },
    { id: '3', title: 'New customer Sharma Electronics added', time: '1h ago', icon: <Package size={14} color="#5B90E5" /> },
  ];

  return (
    <header style={styles.topbar}>
      {/* Left: Mobile Menu Toggle & Page Context */}
      <div style={styles.leftSection}>
        <button onClick={onToggleMobileSidebar} style={styles.mobileMenuBtn} aria-label="Toggle Mobile Menu">
          <Menu size={20} />
        </button>
        <div style={styles.pageContext}>
          <span style={styles.breadCrumb}>Dashboard</span>
          <span style={styles.breadSep}>/</span>
          <span style={styles.currentNav}>Overview</span>
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div style={styles.centerSection}>
        <div style={styles.searchWrapper}>
          <Search size={16} color="#64748B" style={styles.searchIcon} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (onSearchChange) onSearchChange(e.target.value);
            }}
            placeholder="Search customers, orders, products..."
            style={styles.searchInput}
          />
        </div>
      </div>

      {/* Right Side Actions */}
      <div style={styles.rightSection}>
        {/* Notification Bell Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            style={styles.iconBtn}
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span style={styles.notifDot} />
          </button>

          {showNotifications && (
            <div style={styles.notifDropdown}>
              <div style={styles.dropdownHeader}>
                <span style={styles.dropdownTitle}>Notifications</span>
                <span style={styles.badgeCount}>3 New</span>
              </div>
              <div style={styles.notifList}>
                {notifications.map((n) => (
                  <div key={n.id} style={styles.notifItem}>
                    {n.icon}
                    <div style={styles.notifText}>
                      <span>{n.title}</span>
                      <small style={{ color: '#64748B' }}>{n.time}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Help Button */}
        <button
          onClick={() => alert('MiniERP System Guide: FundsRoom Case Study Support')}
          style={styles.iconBtn}
          aria-label="Help"
        >
          <HelpCircle size={18} />
        </button>

        {/* Profile Avatar & Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            style={styles.profileBtn}
          >
            <div style={styles.avatar}>
              <UserIcon size={16} color="#5B90E5" />
            </div>
            <div style={styles.userInfo}>
              <span style={styles.userName}>{user?.name || 'Admin User'}</span>
              <span style={styles.userRole}>{user?.role || 'ADMIN'}</span>
            </div>
            <ChevronDown size={14} color="#64748B" />
          </button>

          {showProfileMenu && (
            <div style={styles.profileDropdown}>
              <div style={styles.profileHeader}>
                <strong>{user?.name || 'Administrator'}</strong>
                <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>{user?.email}</p>
              </div>
              <div style={styles.dropdownDivider} />
              <button onClick={() => alert(`Logged in as ${user?.role}`)} style={styles.dropdownItem}>
                User Profile
              </button>
              <button onClick={() => alert('Account Settings')} style={styles.dropdownItem}>
                Account Settings
              </button>
              <div style={styles.dropdownDivider} />
              <button onClick={logout} style={{ ...styles.dropdownItem, color: '#E76576' }}>
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  topbar: {
    height: '64px',
    backgroundColor: 'var(--bg-card)',
    borderBottom: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    transition: 'background-color 0.25s ease',
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  mobileMenuBtn: {
    display: 'none',
    backgroundColor: 'transparent',
    color: 'var(--text-main)',
  },
  pageContext: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.9rem',
  },
  breadCrumb: {
    fontWeight: 700,
    color: 'var(--text-main)',
  },
  breadSep: {
    color: 'var(--text-muted-dynamic)',
  },
  currentNav: {
    color: '#5B90E5',
    fontWeight: 600,
  },
  centerSection: {
    flex: 1,
    maxWidth: '360px',
    margin: '0 24px',
  },
  searchWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
  },
  searchInput: {
    width: '100%',
    height: '38px',
    padding: '0 12px 0 38px',
    backgroundColor: 'var(--bg-section)',
    border: '1px solid var(--border-color)',
    borderRadius: '10px',
    fontSize: '0.85rem',
    color: 'var(--text-main)',
    outline: 'none',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  iconBtn: {
    width: '38px',
    height: '38px',
    borderRadius: '8px',
    backgroundColor: 'var(--bg-section)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-main)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifDot: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#E76576',
  },
  notifDropdown: {
    position: 'absolute',
    top: '48px',
    right: 0,
    width: '300px',
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    boxShadow: 'var(--shadow-modal)',
    padding: '12px',
    zIndex: 1200,
  },
  dropdownHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
    paddingBottom: '8px',
    borderBottom: '1px solid var(--border-color)',
  },
  dropdownTitle: {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: 'var(--text-main)',
  },
  badgeCount: {
    fontSize: '0.7rem',
    fontWeight: 700,
    backgroundColor: '#5B90E5',
    color: '#FFFFFF',
    padding: '2px 6px',
    borderRadius: '8px',
  },
  notifList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  notifItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    fontSize: '0.8rem',
    padding: '6px',
    borderRadius: '6px',
    backgroundColor: 'var(--bg-section)',
  },
  notifText: {
    display: 'flex',
    flexDirection: 'column',
    color: 'var(--text-main)',
  },
  profileBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '4px 8px 4px 4px',
    backgroundColor: 'var(--bg-section)',
    border: '1px solid var(--border-color)',
    borderRadius: '20px',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'var(--very-light-blue)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    lineHeight: 1.2,
  },
  userName: {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: 'var(--text-main)',
  },
  userRole: {
    fontSize: '0.65rem',
    color: '#5B90E5',
    fontWeight: 600,
  },
  profileDropdown: {
    position: 'absolute',
    top: '48px',
    right: 0,
    width: '180px',
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    boxShadow: 'var(--shadow-modal)',
    padding: '8px',
    zIndex: 1200,
    display: 'flex',
    flexDirection: 'column',
  },
  profileHeader: {
    padding: '8px',
    fontSize: '0.85rem',
  },
  dropdownDivider: {
    height: '1px',
    backgroundColor: 'var(--border-color)',
    margin: '4px 0',
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 10px',
    backgroundColor: 'transparent',
    color: 'var(--text-main)',
    fontSize: '0.85rem',
    fontWeight: 600,
    borderRadius: '6px',
    textAlign: 'left',
    width: '100%',
  },
};
