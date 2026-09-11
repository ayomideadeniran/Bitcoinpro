'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Zap,
  LogOut,
  LayoutDashboard,
  History,
  Target,
  Shield,
  RefreshCw,
  BarChart3,
  FileSpreadsheet,
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import NotificationDrawer from '@/components/dashboard/NotificationDrawer';
import { useAuth } from '@/lib/auth-context';
import { formatUsd } from '@/lib/btc-calc';
import { BtcMarketData, AppNotification } from '@/lib/types';

export type DashboardTab =
  | 'overview'
  | 'analytics'
  | 'transactions'
  | 'recurring'
  | 'goals'
  | 'tax'
  | 'security';

interface DashboardNavProps {
  marketData: BtcMarketData;
  satsMode: boolean;
  onToggleSatsMode: () => void;
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  onOpenKycModal: () => void;
  notifications: AppNotification[];
  onMarkAllRead: () => void;
  onOpenPriceAlerts: () => void;
}

const TABS: { id: DashboardTab; label: string; icon: React.ElementType }[] = [
  { id: 'overview',      label: 'Overview',  icon: LayoutDashboard },
  { id: 'analytics',    label: 'Analytics', icon: BarChart3 },
  { id: 'transactions', label: 'Ledger',    icon: History },
  { id: 'recurring',    label: 'DCA Plans', icon: RefreshCw },
  { id: 'goals',        label: 'Goals',     icon: Target },
  { id: 'tax',          label: 'Taxes',     icon: FileSpreadsheet },
  { id: 'security',     label: 'Security',  icon: Shield },
];

export default function DashboardNav({
  marketData,
  satsMode,
  onToggleSatsMode,
  activeTab,
  onSelectTab,
  notifications,
  onMarkAllRead,
  onOpenPriceAlerts,
}: DashboardNavProps) {
  const { user, logout } = useAuth();
  const isPositive = marketData.change24h >= 0;

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        backgroundColor: 'var(--bg-glass)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      {/* ── Row 1: Brand + Right Actions ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '60px',
          padding: '0 1rem',
          maxWidth: '1240px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        {/* Brand Logo */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '0.6rem',
              background: 'linear-gradient(135deg, #f7931a 0%, #e08213 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(247, 147, 26, 0.35)',
              flexShrink: 0,
            }}
          >
            <ShieldCheck size={18} />
          </div>
          <span
            className="dashboard-brand-text"
            style={{
              fontSize: '1.1rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--text-main)',
            }}
          >
            Bitcoin<span style={{ color: 'var(--brand-btc)' }}>Pro</span>
          </span>
        </Link>

        {/* Right: Live price + tools + user */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Live Price Pill — hidden on mobile */}
          <div
            className="dash-price-pill"
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.3rem 0.7rem',
              borderRadius: '9999px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.78rem',
              flexShrink: 0,
            }}
          >
            <span className="mono" style={{ fontWeight: 700 }}>
              {formatUsd(marketData.priceUsd, 0)}
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.1rem',
                fontSize: '0.72rem',
                fontWeight: 600,
                color: isPositive ? 'var(--brand-success)' : 'var(--brand-danger)',
              }}
            >
              {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              {isPositive ? '+' : ''}{marketData.change24h.toFixed(2)}%
            </span>
          </div>

          {/* Sats/BTC Toggle */}
          <button
            onClick={onToggleSatsMode}
            title="Toggle BTC / Sats units"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              padding: '0.3rem 0.6rem',
              borderRadius: '9999px',
              fontSize: '0.72rem',
              fontWeight: 600,
              flexShrink: 0,
              background: satsMode ? 'rgba(247, 147, 26, 0.15)' : 'var(--bg-surface-elevated)',
              border: satsMode ? '1px solid var(--brand-btc)' : '1px solid var(--border-subtle)',
              color: satsMode ? 'var(--brand-btc)' : 'var(--text-muted)',
            }}
          >
            <Zap size={11} />
            <span>{satsMode ? 'Sats' : 'BTC'}</span>
          </button>

          {/* Notification Bell */}
          <NotificationDrawer
            notifications={notifications}
            onMarkAllRead={onMarkAllRead}
            onOpenPriceAlerts={onOpenPriceAlerts}
          />

          <ThemeToggle />

          {/* User Avatar + Logout */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              paddingLeft: '0.5rem',
              borderLeft: '1px solid var(--border-subtle)',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--brand-btc)',
                fontWeight: 700,
                fontSize: '0.82rem',
                flexShrink: 0,
              }}
            >
              {user ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>

            {/* User name — hidden on mobile */}
            <div
              className="dash-user-name"
              style={{ display: 'none', flexDirection: 'column' }}
            >
              <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{user?.name || 'Investor'}</span>
              <span style={{ fontSize: '0.68rem', color: 'var(--brand-success)' }}>2FA Active</span>
            </div>

            <button
              onClick={logout}
              title="Sign Out"
              style={{
                padding: '0.4rem',
                borderRadius: '0.4rem',
                background: 'transparent',
                color: 'var(--text-muted)',
                transition: 'color 0.15s ease',
                flexShrink: 0,
              }}
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Row 2: Tab Strip (full-width, horizontally scrollable) ── */}
      <div
        style={{
          borderTop: '1px solid var(--border-subtle)',
          overflowX: 'auto',
          overflowY: 'hidden',
          WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'],
          scrollbarWidth: 'none' as React.CSSProperties['scrollbarWidth'],
        }}
        className="dash-tab-strip"
      >
        <div
          style={{
            display: 'flex',
            gap: '0.15rem',
            padding: '0.4rem 1rem',
            maxWidth: '1240px',
            margin: '0 auto',
            minWidth: 'max-content',
          }}
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                  background: isActive ? 'var(--bg-surface-elevated)' : 'transparent',
                  color: isActive ? 'var(--brand-btc)' : 'var(--text-muted)',
                  border: '1px solid',
                  borderColor: isActive ? 'var(--border-active)' : 'transparent',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
