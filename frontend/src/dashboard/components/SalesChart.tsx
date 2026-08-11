import React, { useState } from 'react';
import type { ChartDataPoint } from '../types/dashboard.types';

interface SalesChartProps {
  data?: ChartDataPoint[];
  loading?: boolean;
}

export const SalesChart: React.FC<SalesChartProps> = ({ data = [], loading }) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '3m' | '12m'>('30d');
  const [activeTooltip, setActiveTooltip] = useState<ChartDataPoint | null>(null);

  if (loading || data.length === 0) {
    return (
      <div style={styles.card}>
        <div style={styles.header}>
          <div>
            <div style={styles.skeletonTitle} />
            <div style={styles.skeletonSub} />
          </div>
        </div>
        <div style={styles.skeletonChart} />
      </div>
    );
  }

  const maxRevenue = Math.max(...data.map((d) => d.revenue)) * 1.15 || 3000000;

  return (
    <div style={styles.card} className="card-hover-effect">
      <div style={styles.header}>
        <div>
          <h3 style={styles.title}>Sales Overview</h3>
          <p style={styles.subtitle}>Revenue performance over time</p>
        </div>

        {/* Time Range Selector */}
        <div style={styles.rangeSelector}>
          <button
            onClick={() => setTimeRange('7d')}
            style={{
              ...styles.rangeBtn,
              backgroundColor: timeRange === '7d' ? '#5B90E5' : 'transparent',
              color: timeRange === '7d' ? '#FFFFFF' : 'var(--text-sub)',
            }}
          >
            7 Days
          </button>
          <button
            onClick={() => setTimeRange('30d')}
            style={{
              ...styles.rangeBtn,
              backgroundColor: timeRange === '30d' ? '#5B90E5' : 'transparent',
              color: timeRange === '30d' ? '#FFFFFF' : 'var(--text-sub)',
            }}
          >
            30 Days
          </button>
          <button
            onClick={() => setTimeRange('3m')}
            style={{
              ...styles.rangeBtn,
              backgroundColor: timeRange === '3m' ? '#5B90E5' : 'transparent',
              color: timeRange === '3m' ? '#FFFFFF' : 'var(--text-sub)',
            }}
          >
            3 Months
          </button>
          <button
            onClick={() => setTimeRange('12m')}
            style={{
              ...styles.rangeBtn,
              backgroundColor: timeRange === '12m' ? '#5B90E5' : 'transparent',
              color: timeRange === '12m' ? '#FFFFFF' : 'var(--text-sub)',
            }}
          >
            12 Months
          </button>
        </div>
      </div>

      {/* SVG Vector Chart View */}
      <div style={styles.chartWrapper}>
        <svg width="100%" height="220" viewBox="0 0 500 220" preserveAspectRatio="none">
          {/* Horizontal Background Grid Lines */}
          <line x1="0" y1="40" x2="500" y2="40" stroke="var(--border-color)" strokeDasharray="4 4" opacity="0.6" />
          <line x1="0" y1="90" x2="500" y2="90" stroke="var(--border-color)" strokeDasharray="4 4" opacity="0.6" />
          <line x1="0" y1="140" x2="500" y2="140" stroke="var(--border-color)" strokeDasharray="4 4" opacity="0.6" />
          <line x1="0" y1="190" x2="500" y2="190" stroke="var(--border-color)" opacity="0.8" />

          {/* Area Gradient Path */}
          <path
            d={`M 20 190 ${data
              .map((d, idx) => {
                const x = 20 + idx * 90;
                const y = 190 - (d.revenue / maxRevenue) * 150;
                return `L ${x} ${y}`;
              })
              .join(' ')} L 470 190 Z`}
            fill="url(#salesAreaGrad)"
          />

          {/* Line Path */}
          <path
            d={`M ${data
              .map((d, idx) => {
                const x = 20 + idx * 90;
                const y = 190 - (d.revenue / maxRevenue) * 150;
                return `${x} ${y}`;
              })
              .join(' L ')}`}
            stroke="#5B90E5"
            strokeWidth="3"
            fill="none"
          />

          {/* Data Nodes */}
          {data.map((d, idx) => {
            const x = 20 + idx * 90;
            const y = 190 - (d.revenue / maxRevenue) * 150;
            return (
              <circle
                key={idx}
                cx={x}
                cy={y}
                r="5"
                fill="#5B90E5"
                stroke="#FFFFFF"
                strokeWidth="2"
                onMouseEnter={() => setActiveTooltip(d)}
                onMouseLeave={() => setActiveTooltip(null)}
                style={{ cursor: 'pointer' }}
              />
            );
          })}

          <defs>
            <linearGradient id="salesAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#5B90E5" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#5B90E5" stopOpacity="0.0" />
            </linearGradient>
          </defs>
        </svg>

        {/* X-Axis Month Labels */}
        <div style={styles.labelsRow}>
          {data.map((d, idx) => (
            <span key={idx} style={styles.monthLabel}>
              {d.label}
            </span>
          ))}
        </div>

        {/* Interactive Tooltip Overlay */}
        {activeTooltip && (
          <div style={styles.tooltip}>
            <strong>{activeTooltip.label} Performance</strong>
            <p style={{ margin: '2px 0 0 0', color: '#5B90E5' }}>
              Revenue: ₹{(activeTooltip.revenue / 100000).toFixed(2)}L
            </p>
            <p style={{ margin: '2px 0 0 0', color: 'var(--text-sub)' }}>
              Orders: {activeTooltip.orders}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  card: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: 'var(--shadow-card)',
    position: 'relative',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  title: {
    fontSize: '1.15rem',
    fontWeight: 800,
    color: 'var(--text-main)',
  },
  subtitle: {
    fontSize: '0.85rem',
    color: 'var(--text-sub)',
  },
  rangeSelector: {
    display: 'flex',
    backgroundColor: 'var(--bg-section)',
    padding: '3px',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
  },
  rangeBtn: {
    padding: '5px 12px',
    fontSize: '0.75rem',
    fontWeight: 700,
    borderRadius: '6px',
  },
  chartWrapper: {
    position: 'relative',
    height: '240px',
  },
  labelsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0 20px',
    marginTop: '-10px',
  },
  monthLabel: {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: 'var(--text-sub)',
  },
  tooltip: {
    position: 'absolute',
    top: '10px',
    right: '20px',
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    padding: '8px 12px',
    boxShadow: 'var(--shadow-modal)',
    fontSize: '0.8rem',
  },
  skeletonTitle: {
    height: '18px',
    width: '140px',
    backgroundColor: 'var(--bg-section)',
    borderRadius: '4px',
    marginBottom: '6px',
  },
  skeletonSub: {
    height: '14px',
    width: '200px',
    backgroundColor: 'var(--bg-section)',
    borderRadius: '4px',
  },
  skeletonChart: {
    height: '200px',
    backgroundColor: 'var(--bg-section)',
    borderRadius: '12px',
    marginTop: '16px',
  },
};
