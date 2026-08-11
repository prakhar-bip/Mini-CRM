import React from 'react';
import {
  BarChart3,
  Users,
  Package,
  FileSpreadsheet,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowUpRight,
} from 'lucide-react';

export const HeroVisual: React.FC = () => {
  return (
    <div style={styles.dashboardContainer}>
      {/* Sidebar Mockup */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <div style={styles.sidebarDot} />
          <span style={styles.sidebarTitle}>Workspace</span>
        </div>
        <div style={styles.sidebarMenu}>
          <div style={{ ...styles.sidebarItem, ...styles.sidebarItemActive }}>
            <BarChart3 size={15} />
            <span>Overview</span>
          </div>
          <div style={styles.sidebarItem}>
            <Users size={15} />
            <span>CRM & Leads</span>
          </div>
          <div style={styles.sidebarItem}>
            <Package size={15} />
            <span>Inventory</span>
          </div>
          <div style={styles.sidebarItem}>
            <FileSpreadsheet size={15} />
            <span>Challans</span>
          </div>
        </div>
      </div>

      {/* Main Content Area Mockup */}
      <div style={styles.mainContent}>
        {/* Header Bar */}
        <div style={styles.headerBar}>
          <div>
            <h4 style={styles.headerTitle}>Operations Dashboard</h4>
            <p style={styles.headerSubtitle}>Real-time Wholesale ERP & CRM Activity</p>
          </div>
          <div style={styles.statusPill}>
            <span style={styles.statusDot} />
            <span>System Active</span>
          </div>
        </div>

        {/* KPI Grid (4 Cards) */}
        <div style={styles.kpiGrid}>
          <div style={styles.kpiCard}>
            <div style={styles.kpiHeader}>
              <span style={styles.kpiLabel}>Total Revenue</span>
              <div style={{ ...styles.iconBox, backgroundColor: '#E9EFF9' }}>
                <TrendingUp size={14} color="#5B90E5" />
              </div>
            </div>
            <div style={styles.kpiValue}>₹14,85,200</div>
            <div style={styles.kpiTrend}>
              <ArrowUpRight size={12} color="#45C98A" />
              <span style={{ color: '#45C98A', fontWeight: 600 }}>+18.4%</span> vs last month
            </div>
          </div>

          <div style={styles.kpiCard}>
            <div style={styles.kpiHeader}>
              <span style={styles.kpiLabel}>Active Customers</span>
              <div style={{ ...styles.iconBox, backgroundColor: '#E9EFF9' }}>
                <Users size={14} color="#5B90E5" />
              </div>
            </div>
            <div style={styles.kpiValue}>1,284</div>
            <div style={styles.kpiTrend}>
              <span style={{ color: '#5B90E5', fontWeight: 600 }}>+85</span> new this month
            </div>
          </div>

          <div style={styles.kpiCard}>
            <div style={styles.kpiHeader}>
              <span style={styles.kpiLabel}>Sales Challans</span>
              <div style={{ ...styles.iconBox, backgroundColor: '#E9EFF9' }}>
                <FileSpreadsheet size={14} color="#5B90E5" />
              </div>
            </div>
            <div style={styles.kpiValue}>462</div>
            <div style={styles.kpiTrend}>
              <span style={{ color: '#2E4162', fontWeight: 600 }}>38 Pending Confirm</span>
            </div>
          </div>

          <div style={styles.kpiCard}>
            <div style={styles.kpiHeader}>
              <span style={styles.kpiLabel}>Inventory Units</span>
              <div style={{ ...styles.iconBox, backgroundColor: '#E9EFF9' }}>
                <Package size={14} color="#5B90E5" />
              </div>
            </div>
            <div style={styles.kpiValue}>18,450</div>
            <div style={styles.kpiTrend}>
              <span style={{ color: '#E76576', fontWeight: 600 }}>4 Low Stock Alert</span>
            </div>
          </div>
        </div>

        {/* Charts & Activity Split */}
        <div style={styles.splitRow}>
          {/* Chart Card */}
          <div style={styles.chartCard}>
            <div style={styles.cardHeader}>
              <span style={styles.cardTitle}>Sales Volume</span>
              <span style={styles.cardBadge}>2026 Q1</span>
            </div>
            <div style={styles.barChartContainer}>
              <div style={styles.barCol}>
                <div style={{ ...styles.bar, height: '45%' }} />
                <span style={styles.barLabel}>Jan</span>
              </div>
              <div style={styles.barCol}>
                <div style={{ ...styles.bar, height: '65%' }} />
                <span style={styles.barLabel}>Feb</span>
              </div>
              <div style={styles.barCol}>
                <div style={{ ...styles.bar, height: '85%', backgroundColor: '#5B90E5' }} />
                <span style={styles.barLabel}>Mar</span>
              </div>
              <div style={styles.barCol}>
                <div style={{ ...styles.bar, height: '55%' }} />
                <span style={styles.barLabel}>Apr</span>
              </div>
              <div style={styles.barCol}>
                <div style={{ ...styles.bar, height: '90%', backgroundColor: '#5B90E5' }} />
                <span style={styles.barLabel}>May</span>
              </div>
            </div>
          </div>

          {/* Recent Activity Card */}
          <div style={styles.activityCard}>
            <div style={styles.cardHeader}>
              <span style={styles.cardTitle}>Recent Operations</span>
            </div>
            <div style={styles.activityList}>
              <div style={styles.activityItem}>
                <CheckCircle2 size={14} color="#45C98A" />
                <div style={styles.activityText}>
                  <strong>Challan #CH-20260811</strong> confirmed
                  <span style={styles.activityTime}>2 mins ago</span>
                </div>
              </div>
              <div style={styles.activityItem}>
                <Clock size={14} color="#5B90E5" />
                <div style={styles.activityText}>
                  Stock IN (+50 Copper Wire) logged
                  <span style={styles.activityTime}>14 mins ago</span>
                </div>
              </div>
              <div style={styles.activityItem}>
                <ShieldCheck size={14} color="#2E4162" />
                <div style={styles.activityText}>
                  Sharma Electronics added as Client
                  <span style={styles.activityTime}>1 hr ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Table Preview */}
        <div style={styles.tableCard}>
          <div style={styles.cardHeader}>
            <span style={styles.cardTitle}>Recent Customer Orders</span>
          </div>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Customer</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Challan #</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={styles.td}>Sharma Electronics</td>
                <td style={styles.td}>WHOLESALE</td>
                <td style={styles.td}>#CH-20260811-3938</td>
                <td style={styles.td}><span style={styles.badgeSuccess}>CONFIRMED</span></td>
              </tr>
              <tr>
                <td style={styles.td}>Apex Hardware Mart</td>
                <td style={styles.td}>DISTRIBUTOR</td>
                <td style={styles.td}>#CH-20260811-4012</td>
                <td style={styles.td}><span style={styles.badgeDraft}>DRAFT</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  dashboardContainer: {
    display: 'flex',
    backgroundColor: '#E9EFF9',
    borderRadius: '16px',
    border: '1px solid #DFE3EC',
    boxShadow: '0 20px 40px rgba(46, 65, 98, 0.08), 0 4px 12px rgba(46, 65, 98, 0.04)',
    overflow: 'hidden',
    fontSize: '0.8rem',
  },
  sidebar: {
    width: '140px',
    backgroundColor: '#FFFFFF',
    borderRight: '1px solid #DFE3EC',
    padding: '16px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  sidebarHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  sidebarDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: '#5B90E5',
  },
  sidebarTitle: {
    fontWeight: 700,
    fontSize: '0.75rem',
    color: '#2E4162',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  sidebarMenu: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  sidebarItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 10px',
    borderRadius: '6px',
    color: '#446091',
    fontWeight: 600,
    fontSize: '0.75rem',
    cursor: 'pointer',
  },
  sidebarItemActive: {
    backgroundColor: '#E9EFF9',
    color: '#5B90E5',
  },
  mainContent: {
    flex: 1,
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  headerBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1px solid #DFE3EC',
  },
  headerTitle: {
    fontSize: '0.9rem',
    fontWeight: 700,
    color: '#2E4162',
  },
  headerSubtitle: {
    fontSize: '0.7rem',
    color: '#64748B',
  },
  statusPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.7rem',
    fontWeight: 600,
    color: '#45C98A',
    backgroundColor: '#F0FDF4',
    padding: '4px 10px',
    borderRadius: '12px',
    border: '1px solid #BBF7D0',
  },
  statusDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#45C98A',
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '10px',
  },
  kpiCard: {
    backgroundColor: '#FFFFFF',
    padding: '10px',
    borderRadius: '10px',
    border: '1px solid #DFE3EC',
  },
  kpiHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px',
  },
  kpiLabel: {
    fontSize: '0.65rem',
    color: '#64748B',
    fontWeight: 600,
  },
  iconBox: {
    width: '22px',
    height: '22px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiValue: {
    fontSize: '1rem',
    fontWeight: 800,
    color: '#2E4162',
  },
  kpiTrend: {
    fontSize: '0.65rem',
    color: '#64748B',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    marginTop: '2px',
  },
  splitRow: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr',
    gap: '10px',
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    padding: '12px',
    borderRadius: '10px',
    border: '1px solid #DFE3EC',
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    padding: '12px',
    borderRadius: '10px',
    border: '1px solid #DFE3EC',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  cardTitle: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#2E4162',
  },
  cardBadge: {
    fontSize: '0.65rem',
    color: '#5B90E5',
    backgroundColor: '#E9EFF9',
    padding: '2px 6px',
    borderRadius: '4px',
    fontWeight: 600,
  },
  barChartContainer: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '70px',
    paddingTop: '10px',
  },
  barCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    width: '18%',
  },
  bar: {
    width: '100%',
    backgroundColor: '#D2D9E7',
    borderRadius: '4px 4px 0 0',
  },
  barLabel: {
    fontSize: '0.6rem',
    color: '#64748B',
  },
  activityList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  activityItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    fontSize: '0.7rem',
  },
  activityText: {
    color: '#2E4162',
    display: 'flex',
    flexDirection: 'column',
  },
  activityTime: {
    fontSize: '0.6rem',
    color: '#94A3B8',
  },
  tableCard: {
    backgroundColor: '#FFFFFF',
    padding: '10px 12px',
    borderRadius: '10px',
    border: '1px solid #DFE3EC',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.7rem',
  },
  th: {
    textAlign: 'left',
    padding: '4px 8px',
    color: '#64748B',
    borderBottom: '1px solid #DFE3EC',
    fontWeight: 600,
  },
  td: {
    padding: '6px 8px',
    color: '#2E4162',
    borderBottom: '1px solid #F1F5F9',
  },
  badgeSuccess: {
    backgroundColor: '#F0FDF4',
    color: '#45C98A',
    padding: '2px 6px',
    borderRadius: '4px',
    fontWeight: 700,
    fontSize: '0.6rem',
  },
  badgeDraft: {
    backgroundColor: '#EFF6FF',
    color: '#5B90E5',
    padding: '2px 6px',
    borderRadius: '4px',
    fontWeight: 700,
    fontSize: '0.6rem',
  },
};
