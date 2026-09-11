'use client';

import React from 'react';
import { Wallet, Coins, TrendingUp, TrendingDown, Target, Plus, ArrowUpRight, ShieldCheck, Clock, Download } from 'lucide-react';
import { Transaction, InvestmentGoal, BtcMarketData } from '@/lib/types';
import { formatUsd, formatBtc, formatSats, btcToSats } from '@/lib/btc-calc';
import { exportTransactionsToCsv } from '@/lib/portfolio-store';

interface PortfolioOverviewProps {
  summary: {
    totalBtc: number;
    totalSats: number;
    totalInvestedUsd: number;
    totalFeesUsd: number;
    currentValueUsd: number;
    unrealizedProfitLossUsd: number;
    unrealizedProfitLossPercent: number;
    averagePurchasePriceUsd: number;
  };
  transactions: Transaction[];
  goals: InvestmentGoal[];
  marketData: BtcMarketData;
  satsMode: boolean;
  onOpenBuyModal: () => void;
  onOpenWithdrawModal: () => void;
  onOpenKycModal: () => void;
  onOpenGoalModal: () => void;
  onViewAllTransactions: () => void;
  onViewAllGoals: () => void;
  onInspectTx: (tx: Transaction) => void;
}

export default function PortfolioOverview({
  summary,
  transactions,
  goals,
  marketData,
  satsMode,
  onOpenBuyModal,
  onOpenWithdrawModal,
  onOpenKycModal,
  onOpenGoalModal,
  onViewAllTransactions,
  onViewAllGoals,
  onInspectTx,
}: PortfolioOverviewProps) {
  const isProfitable = summary.unrealizedProfitLossUsd >= 0;
  const recentTxs = transactions.slice(0, 4);
  const primaryGoal = goals[0];

  let primaryGoalProgress = 0;
  if (primaryGoal) {
    if (primaryGoal.category === 'sats_target') {
      primaryGoalProgress = Math.min(100, Math.round((summary.totalBtc / primaryGoal.targetBtc) * 100));
    } else {
      primaryGoalProgress = Math.min(100, Math.round((summary.totalInvestedUsd / primaryGoal.targetAmountUsd) * 100));
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Welcome & Quick Actions Bar */}
      <div className="portfolio-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.65rem', marginBottom: '0.25rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Portfolio Dashboard
            </h2>
            <button
              onClick={onOpenKycModal}
              className="pill pill-success"
              style={{ cursor: 'pointer', border: 'none' }}
              title="Click to view KYC Limits & Verification"
            >
              Tier 2 Verified ($10k/day)
            </button>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Real-time tracking of your accumulated Bitcoin, cost basis, and milestone goals.
          </p>
        </div>

        <div className="portfolio-actions">
          <button
            onClick={() => exportTransactionsToCsv(transactions)}
            className="btn btn-secondary"
            style={{ padding: '0.55rem 0.95rem', fontSize: '0.85rem' }}
          >
            <Download size={14} />
            <span>CSV</span>
          </button>
          <button
            onClick={onOpenWithdrawModal}
            className="btn btn-secondary"
            style={{ padding: '0.55rem 1.1rem', fontSize: '0.85rem' }}
          >
            <ArrowUpRight size={15} />
            <span>Withdraw</span>
          </button>
          <button
            onClick={onOpenBuyModal}
            className="btn btn-primary"
            style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem' }}
          >
            <Plus size={15} />
            <span>Buy Bitcoin</span>
          </button>
        </div>
      </div>

      {/* 4 Core Financial Metric Cards */}
      <div className="stat-cards-grid">
        {/* Card 1: Total Portfolio Value */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Total Portfolio Value
            </span>
            <Wallet size={18} style={{ color: 'var(--brand-btc)' }} />
          </div>
          <div className="mono stat-card-value" style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {formatUsd(summary.currentValueUsd, 2)}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Total Invested: <strong className="mono" style={{ color: 'var(--text-main)' }}>{formatUsd(summary.totalInvestedUsd, 0)}</strong>
          </div>
        </div>

        {/* Card 2: Total Bitcoin Holdings */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Bitcoin Holdings
            </span>
            <Coins size={18} style={{ color: 'var(--brand-btc)' }} />
          </div>
          <div className="mono stat-card-value" style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--brand-btc)' }}>
            {satsMode ? `${formatSats(summary.totalSats)} sats` : `${formatBtc(summary.totalBtc, 6)} BTC`}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {satsMode ? `${formatBtc(summary.totalBtc, 4)} BTC` : `${formatSats(summary.totalSats)} Satoshis`}
          </div>
        </div>

        {/* Card 3: Average Purchase Price */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Average Cost Basis
            </span>
            <Target size={18} style={{ color: 'var(--brand-info)' }} />
          </div>
          <div className="mono stat-card-value" style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {formatUsd(summary.averagePurchasePriceUsd, 0)}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Live Spot: <strong className="mono" style={{ color: 'var(--text-main)' }}>{formatUsd(marketData.priceUsd, 0)}</strong>
          </div>
        </div>

        {/* Card 4: Unrealized Profit / Loss */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Unrealized Profit / Loss
            </span>
            {isProfitable ? (
              <TrendingUp size={18} style={{ color: 'var(--brand-success)' }} />
            ) : (
              <TrendingDown size={18} style={{ color: 'var(--brand-danger)' }} />
            )}
          </div>
          <div
            className="mono stat-card-value"
            style={{
              fontSize: '1.85rem',
              fontWeight: 800,
              color: isProfitable ? 'var(--brand-success)' : 'var(--brand-danger)',
            }}
          >
            {isProfitable ? '+' : ''}{formatUsd(summary.unrealizedProfitLossUsd, 2)}
          </div>
          <div style={{ fontSize: '0.8rem', color: isProfitable ? 'var(--brand-success)' : 'var(--brand-danger)', fontWeight: 600 }}>
            {isProfitable ? '+' : ''}{summary.unrealizedProfitLossPercent.toFixed(2)}% all-time return
          </div>
        </div>
      </div>

      {/* Middle Grid: Goal Progress & Market Overview */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
          gap: '1.5rem',
        }}
      >
        {/* Goal Tracker Spotlight Card */}
        {primaryGoal && (
          <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                <span className="pill pill-btc">Active Milestone</span>
                <button onClick={onViewAllGoals} style={{ fontSize: '0.8rem', color: 'var(--brand-btc)', fontWeight: 600 }}>
                  View All ({goals.length})
                </button>
              </div>

              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                {primaryGoal.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                Target: <strong>{primaryGoal.targetBtc ? `${primaryGoal.targetBtc} BTC (${(primaryGoal.targetBtc * 100_000_000).toLocaleString()} sats)` : formatUsd(primaryGoal.targetAmountUsd, 0)}</strong>
              </p>

              {/* Progress Bar */}
              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.35rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Progress: {primaryGoalProgress}%</span>
                  <span className="mono" style={{ fontWeight: 700 }}>
                    {satsMode ? `${formatSats(summary.totalSats)} sats` : `${formatBtc(summary.totalBtc, 4)} BTC`}
                  </span>
                </div>
                <div style={{ height: '8px', borderRadius: '4px', background: 'var(--bg-surface-elevated)', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${primaryGoalProgress}%`,
                      background: 'linear-gradient(90deg, #f7931a, #10b981)',
                      borderRadius: '4px',
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', marginTop: '1rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Target Timeline: {primaryGoal.durationMonths} Months
              </span>
              <button onClick={onOpenGoalModal} className="btn btn-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}>
                <Plus size={14} />
                <span>New Goal</span>
              </button>
            </div>
          </div>
        )}

        {/* Market Context & Risk Reminders */}
        <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
              <span className="pill" style={{ background: 'rgba(59, 130, 246, 0.12)', color: 'var(--brand-info)' }}>
                Market Overview
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Live Feed</span>
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Bitcoin Market Conditions
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1rem' }}>
              Current spot rate is <strong className="mono" style={{ color: 'var(--text-main)' }}>{formatUsd(marketData.priceUsd, 0)}</strong> ({marketData.change24h >= 0 ? '+' : ''}{marketData.change24h.toFixed(2)}% in 24h). Network mempool congestion is low ({marketData.mempoolFeeSatPerVb} sat/vB).
            </p>

            <div
              style={{
                padding: '0.85rem 1rem',
                borderRadius: '0.5rem',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
              }}
            >
              <ShieldCheck size={18} style={{ color: 'var(--brand-success)', flexShrink: 0 }} />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Your average purchase price ({formatUsd(summary.averagePurchasePriceUsd, 0)}) is favorable relative to current spot price.
              </span>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', marginTop: '1rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>
              Note: Cryptocurrencies are volatile. Holding a multi-year horizon reduces emotional trading mistakes.
            </span>
          </div>
        </div>
      </div>

      {/* Recent Activity Table Preview */}
      <div className="glass-card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ flex: '1 1 200px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Recent Transactions</h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              Latest purchases and recurring dollar-cost averaging deposits.
            </p>
          </div>
          <button onClick={onViewAllTransactions} style={{ fontSize: '0.85rem', color: 'var(--brand-btc)', fontWeight: 600 }}>
            View All ({transactions.length}) &rarr;
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.775rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.75rem 0.5rem' }}>Date</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Type</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Amount</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Execution Price</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>USD Total</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentTtxsRows(recentTxs, satsMode, onInspectTx)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function recentTtxsRows(txs: Transaction[], satsMode: boolean, onInspectTx: (tx: Transaction) => void) {
  if (txs.length === 0) {
    return (
      <tr>
        <td colSpan={6} style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)' }}>
          No transactions recorded yet. Click "Buy Bitcoin" to add your first entry!
        </td>
      </tr>
    );
  }

  return txs.map((t) => (
    <tr
      key={t.id}
      onClick={() => onInspectTx(t)}
      style={{ borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer' }}
      title="Click to inspect on-chain settlement details"
    >
      <td style={{ padding: '0.85rem 0.5rem', color: 'var(--text-muted)' }}>
        {new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
      </td>
      <td style={{ padding: '0.85rem 0.5rem' }}>
        <span
          className="pill"
          style={{
            background:
              t.type === 'recurring_buy'
                ? 'rgba(247, 147, 26, 0.12)'
                : t.type === 'withdrawal'
                ? 'var(--brand-danger-bg)'
                : 'rgba(59, 130, 246, 0.12)',
            color:
              t.type === 'recurring_buy'
                ? 'var(--brand-btc)'
                : t.type === 'withdrawal'
                ? 'var(--brand-danger)'
                : 'var(--brand-info)',
            fontSize: '0.725rem',
            textTransform: 'capitalize',
          }}
        >
          {t.type.replace('_', ' ')}
        </span>
      </td>
      <td className="mono" style={{ padding: '0.85rem 0.5rem', fontWeight: 700, color: 'var(--text-main)' }}>
        {t.type === 'withdrawal' ? '-' : '+'}
        {satsMode ? `${formatSats(btcToSats(t.amountBtc))} sats` : `${formatBtc(t.amountBtc, 6)} BTC`}
      </td>
      <td className="mono" style={{ padding: '0.85rem 0.5rem' }}>
        {formatUsd(t.pricePerBtc, 0)}
      </td>
      <td className="mono" style={{ padding: '0.85rem 0.5rem', fontWeight: 600 }}>
        {formatUsd(t.amountUsd, 2)}
      </td>
      <td style={{ padding: '0.85rem 0.5rem' }}>
        <span className="pill pill-success" style={{ fontSize: '0.725rem' }}>
          {t.status}
        </span>
      </td>
    </tr>
  ));
}
