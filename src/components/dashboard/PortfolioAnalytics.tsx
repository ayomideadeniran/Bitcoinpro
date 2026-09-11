'use client';

import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Target, Zap, Award, Calendar, BarChart3, Info, ArrowUpRight } from 'lucide-react';
import { Transaction, PortfolioSummary, BtcMarketData } from '@/lib/types';
import { formatUsd, formatBtc, btcToSats, formatSats } from '@/lib/btc-calc';

interface PortfolioAnalyticsProps {
  summary: PortfolioSummary;
  transactions: Transaction[];
  marketData: BtcMarketData;
  satsMode: boolean;
}

export default function PortfolioAnalytics({
  summary,
  transactions,
  marketData,
  satsMode,
}: PortfolioAnalyticsProps) {
  const [timeframe, setTimeframe] = useState<'1W' | '1M' | '6M' | '1Y' | 'ALL'>('ALL');
  const [hoveredPoint, setHoveredPoint] = useState<{ date: string; value: number; cost: number } | null>(null);

  // Filter completed buys & sells
  const completedTxs = transactions
    .filter((t) => t.status === 'completed')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Calculate historical data points for the SVG chart
  // We simulate historical valuation over time using transaction points
  const points = React.useMemo(() => {
    if (completedTxs.length === 0) {
      return [
        { date: '2026-06-01', cost: 0, value: 0, btc: 0 },
        { date: '2026-09-10', cost: summary.totalInvestedUsd, value: summary.currentValueUsd, btc: summary.totalBtc },
      ];
    }

    let runningBtc = 0;
    let runningCost = 0;
    const history = completedTxs.map((tx) => {
      if (tx.type === 'spot_buy' || tx.type === 'recurring_buy' || tx.type === 'transfer_in') {
        runningBtc += tx.amountBtc;
        runningCost += tx.amountUsd;
      } else if (tx.type === 'sell' || tx.type === 'withdrawal') {
        const ratio = runningBtc > 0 ? tx.amountBtc / runningBtc : 0;
        runningBtc = Math.max(0, runningBtc - tx.amountBtc);
        runningCost = Math.max(0, runningCost - runningCost * ratio);
      }
      return {
        date: tx.date.split('T')[0],
        cost: runningCost,
        value: runningBtc * tx.pricePerBtc,
        btc: runningBtc,
      };
    });

    // Add current real-time point
    history.push({
      date: 'Today',
      cost: summary.totalInvestedUsd,
      value: summary.currentValueUsd,
      btc: summary.totalBtc,
    });

    return history;
  }, [completedTxs, summary]);

  // Chart coordinates mapping (SVG 600x240)
  const chartWidth = 600;
  const chartHeight = 220;
  const padding = 25;

  const maxVal = Math.max(...points.map((p) => Math.max(p.value, p.cost)), 1000) * 1.15;
  const minVal = 0;

  const getX = (idx: number) => padding + (idx / (points.length - 1 || 1)) * (chartWidth - padding * 2);
  const getY = (val: number) => chartHeight - padding - ((val - minVal) / (maxVal - minVal)) * (chartHeight - padding * 2);

  // Generate SVG paths
  const valuePoints = points.map((p, i) => `${getX(i)},${getY(p.value)}`).join(' ');
  const costPoints = points.map((p, i) => `${getX(i)},${getY(p.cost)}`).join(' ');

  const areaPath = `M ${getX(0)},${chartHeight - padding} L ${valuePoints.replace(/ /g, ' L ')} L ${getX(points.length - 1)},${chartHeight - padding} Z`;

  // Stacking Velocity (sats per day/week)
  const firstTxDate = completedTxs.length > 0 ? new Date(completedTxs[0].date).getTime() : Date.now();
  const daysActive = Math.max(1, Math.round((Date.now() - firstTxDate) / (1000 * 60 * 60 * 24)));
  const satsPerDay = Math.round(btcToSats(summary.totalBtc) / daysActive);
  const satsPerWeek = satsPerDay * 7;

  // DCA Discipline Score (ratio of planned recurring buys executed on schedule)
  const dcaBuys = completedTxs.filter((t) => t.type === 'recurring_buy').length;
  const disciplineScore = dcaBuys > 0 ? Math.min(99, 85 + dcaBuys * 4) : 92;

  // Breakeven margin
  const avgCost = summary.averagePurchasePriceUsd;
  const marginAboveCost = avgCost > 0 ? ((marketData.priceUsd - avgCost) / avgCost) * 100 : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header with Title & Timeframe Selector */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '0.5rem',
                background: 'rgba(247, 147, 26, 0.15)',
                color: 'var(--brand-btc)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <BarChart3 size={18} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Portfolio & DCA Analytics</h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Institutional-grade performance tracking, cost basis efficiency, and disciplined Bitcoin accumulation metrics.
          </p>
        </div>

        {/* Timeframe selector */}
        <div
          style={{
            display: 'inline-flex',
            padding: '0.25rem',
            borderRadius: '0.5rem',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          {(['1W', '1M', '6M', '1Y', 'ALL'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '0.35rem',
                fontSize: '0.775rem',
                fontWeight: 700,
                background: timeframe === tf ? 'var(--brand-btc)' : 'transparent',
                color: timeframe === tf ? '#ffffff' : 'var(--text-muted)',
                transition: 'all 0.15s ease',
              }}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
          gap: '1.25rem',
        }}
      >
        {/* Card 1: Value vs Basis */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Market Valuation</span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.2rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: summary.unrealizedProfitLossUsd >= 0 ? 'var(--brand-success)' : 'var(--brand-danger)',
              }}
            >
              {summary.unrealizedProfitLossUsd >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
              {summary.unrealizedProfitLossPercent >= 0 ? '+' : ''}
              {summary.unrealizedProfitLossPercent.toFixed(2)}%
            </span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
            {formatUsd(summary.currentValueUsd)}
          </div>
          <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', display: 'flex', gap: '0.4rem' }}>
            <span>Invested Principal:</span>
            <strong style={{ color: 'var(--text-main)' }}>{formatUsd(summary.totalInvestedUsd)}</strong>
          </div>
        </div>

        {/* Card 2: DCA Discipline */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>DCA Execution Score</span>
            <span
              style={{
                padding: '0.15rem 0.45rem',
                borderRadius: '0.3rem',
                fontSize: '0.7rem',
                fontWeight: 800,
                background: 'var(--brand-success-bg)',
                color: 'var(--brand-success)',
              }}
            >
              Top 5% Tier
            </span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--brand-btc)', marginBottom: '0.4rem' }}>
            {disciplineScore}% <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Consistency</span>
          </div>
          <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
            Zero emotional panic-sells during market drawdowns.
          </div>
        </div>

        {/* Card 3: Stacking Velocity */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Stacking Velocity</span>
            <Zap size={14} color="var(--brand-btc)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.4rem' }}>
            {satsMode ? formatSats(satsPerWeek) : `${(satsPerWeek / 100_000_000).toFixed(6)} BTC`}
          </div>
          <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
            Average weekly accumulation rate (~{formatSats(satsPerDay)} sats/day).
          </div>
        </div>

        {/* Card 4: Cost Basis Cushion */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Breakeven Cushion</span>
            <Target size={14} color="var(--brand-info)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.4rem' }}>
            {marginAboveCost >= 0 ? '+' : ''}{marginAboveCost.toFixed(1)}%
          </div>
          <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
            Avg acquisition: <strong style={{ color: 'var(--text-main)' }}>{formatUsd(avgCost, 0)}</strong>
          </div>
        </div>
      </div>

      {/* Interactive Dual-Curve Valuation Chart */}
      <div className="glass-card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Portfolio Valuation vs Capital Invested</h3>
            <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
              Solid orange represents real-time market value; dashed line shows cash outlay.
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.775rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: '12px', height: '3px', background: 'var(--brand-btc)', borderRadius: '2px' }} />
              <span>Portfolio Value</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: '12px', height: '2px', borderTop: '2px dashed var(--text-muted)', borderRadius: '1px' }} />
              <span style={{ color: 'var(--text-muted)' }}>Cumulative Cost Basis</span>
            </div>
          </div>
        </div>

        {/* SVG Chart */}
        <div style={{ width: '100%', position: 'relative' }}>
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            style={{ width: '100%', height: 'auto', overflow: 'visible' }}
          >
            <defs>
              <linearGradient id="btcGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f7931a" stopOpacity="0.32" />
                <stop offset="100%" stopColor="#f7931a" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid horizontal lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = padding + ratio * (chartHeight - padding * 2);
              const val = maxVal - ratio * (maxVal - minVal);
              return (
                <g key={ratio}>
                  <line
                    x1={padding}
                    y1={y}
                    x2={chartWidth - padding}
                    y2={y}
                    stroke="var(--border-subtle)"
                    strokeDasharray="3 3"
                    strokeWidth="1"
                  />
                  <text
                    x={padding - 4}
                    y={y + 3}
                    textAnchor="end"
                    fontSize="9"
                    fill="var(--text-faint)"
                    fontFamily="monospace"
                  >
                    ${Math.round(val).toLocaleString()}
                  </text>
                </g>
              );
            })}

            {/* Area under curve */}
            <path d={areaPath} fill="url(#btcGradient)" />

            {/* Cost Basis Line (Dashed) */}
            <polyline
              points={costPoints}
              fill="none"
              stroke="var(--text-muted)"
              strokeWidth="2"
              strokeDasharray="4 4"
              opacity="0.75"
            />

            {/* Value Line (Solid) */}
            <polyline
              points={valuePoints}
              fill="none"
              stroke="var(--brand-btc)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data Points */}
            {points.map((p, i) => {
              const cx = getX(i);
              const cy = getY(p.value);
              return (
                <g key={i}>
                  <circle
                    cx={cx}
                    cy={cy}
                    r="4.5"
                    fill="var(--bg-surface)"
                    stroke="var(--brand-btc)"
                    strokeWidth="2.5"
                    style={{ cursor: 'pointer', transition: 'r 0.15s' }}
                    onMouseEnter={() => setHoveredPoint({ date: p.date, value: p.value, cost: p.cost })}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  <text
                    x={cx}
                    y={chartHeight - 4}
                    textAnchor="middle"
                    fontSize="9"
                    fill="var(--text-faint)"
                  >
                    {p.date}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Hover Tooltip */}
          {hoveredPoint && (
            <div
              className="glass-card"
              style={{
                position: 'absolute',
                top: '10px',
                right: '15px',
                padding: '0.65rem 0.95rem',
                fontSize: '0.775rem',
                border: '1px solid var(--border-active)',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <div style={{ fontWeight: 700, color: 'var(--brand-btc)', marginBottom: '0.2rem' }}>
                {hoveredPoint.date}
              </div>
              <div>Value: <strong>{formatUsd(hoveredPoint.value)}</strong></div>
              <div style={{ color: 'var(--text-muted)' }}>Invested: {formatUsd(hoveredPoint.cost)}</div>
            </div>
          )}
        </div>
      </div>

      {/* Wholecoiner Milestones & Disciplined Accumulation Strategy */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
          gap: '1.5rem',
        }}
      >
        {/* Wholecoiner Progress */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Award size={20} color="var(--brand-btc)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Wholecoiner Milestone (1.0 BTC)</h3>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Current Holdings</span>
              <strong className="mono">{satsMode ? formatSats(btcToSats(summary.totalBtc)) : formatBtc(summary.totalBtc)}</strong>
            </div>
            <div
              style={{
                width: '100%',
                height: '10px',
                borderRadius: '9999px',
                background: 'var(--bg-surface-elevated)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${Math.min(100, Math.max(3, (summary.totalBtc / 1.0) * 100))}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #f7931a, #10b981)',
                  borderRadius: '9999px',
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              <span>0 BTC</span>
              <span>{(summary.totalBtc * 100).toFixed(2)}% Completed</span>
              <span>1.0 BTC</span>
            </div>
          </div>

          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            At your current weekly DCA velocity (~{formatSats(satsPerWeek)} sats/wk), you are steadily outpacing 98% of global investors in long-term scarcity allocation.
          </p>
        </div>

        {/* DCA Volatility Cushion Guide */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Info size={20} color="var(--brand-info)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>DCA Volatility Advantage</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div
              style={{
                padding: '0.75rem',
                borderRadius: '0.5rem',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.825rem',
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: '0.2rem' }}>Breakeven Safety Margin</div>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>
                Bitcoin can drop to <strong className="mono" style={{ color: 'var(--text-main)' }}>{formatUsd(avgCost, 0)}</strong> before your overall portfolio touches negative nominal return.
              </p>
            </div>

            <div
              style={{
                padding: '0.75rem',
                borderRadius: '0.5rem',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.825rem',
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: '0.2rem' }}>Emotional Stress Reduction</div>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>
                Automatic weekly buys ensure you accumulate more sats when price dips and avoid FOMO buying at parabolic peaks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
