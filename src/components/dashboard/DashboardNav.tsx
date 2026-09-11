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

export default function DashboardNav({
  marketData,
  satsMode,
  onToggleSatsMode,
  activeTab,
  onSelectTab,
  onOpenKycModal,
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
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '72px',
        }}
      >
        {/* Brand & App Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              textDecoration: 'none',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '0.6rem',
                background: 'linear-gradient(135deg, #f7931a 0%, #e08213 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(247, 147, 26, 0.35)',
              }}
            >
              <ShieldCheck size={20} />
            </div>
            <span className="dashboard-brand-text" style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-main)' }}>
              Bitcoin<span style={{ color: 'var(--brand-btc)' }}>Pro</span>
            </span>
          </Link>

          {/* Tab Navigation */}
          <nav style={{ display: 'flex', gap: '0.35rem' }} className="dashboard-tabs">
            {[
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'transactions', label: 'Ledger', icon: History },
              { id: 'recurring', label: 'DCA Plans', icon: RefreshCw },
              { id: 'goals', label: 'Goals', icon: Target },
              { id: 'tax', label: 'Taxes', icon: FileSpreadsheet },
              { id: 'security', label: 'Security', icon: Shield },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id as DashboardTab)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.45rem 0.8rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.825rem',
                    fontWeight: 600,
                    transition: 'all 0.15s ease',
                    background: isActive ? 'var(--bg-surface-elevated)' : 'transparent',
                    color: isActive ? 'var(--brand-btc)' : 'var(--text-muted)',
                    border: '1px solid',
                    borderColor: isActive ? 'var(--border-active)' : 'transparent',
                  }}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Tools & User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Live Price Pill */}
          <div
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.75rem',
              borderRadius: '9999px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.8rem',
            }}
            className="desktop-live-ticker"
          >
            <span className="mono" style={{ fontWeight: 700 }}>
              {formatUsd(marketData.priceUsd, 0)}
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.15rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: isPositive ? 'var(--brand-success)' : 'var(--brand-danger)',
              }}
            >
              {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {isPositive ? '+' : ''}{marketData.change24h.toFixed(2)}%
            </span>
          </div>

          {/* Sats Mode Toggle */}
          <button
            onClick={onToggleSatsMode}
            title="Toggle between BTC and Satoshi units"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.35rem 0.65rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 600,
              background: satsMode ? 'rgba(247, 147, 26, 0.15)' : 'var(--bg-surface-elevated)',
              border: satsMode ? '1px solid var(--brand-btc)' : '1px solid var(--border-subtle)',
              color: satsMode ? 'var(--brand-btc)' : 'var(--text-muted)',
            }}
          >
            <Zap size={12} />
            <span>{satsMode ? 'Sats' : 'BTC'}</span>
          </button>

          {/* Notification Bell Drawer */}
          <NotificationDrawer
            notifications={notifications}
            onMarkAllRead={onMarkAllRead}
            onOpenPriceAlerts={onOpenPriceAlerts}
          />

          <ThemeToggle />

          {/* User Profile Card & Sign Out */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              paddingLeft: '0.5rem',
              borderLeft: '1px solid var(--border-subtle)',
            }}
          >
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--brand-btc)',
                fontWeight: 700,
                fontSize: '0.85rem',
              }}
            >
              {user ? user.name.charAt(0) : 'U'}
            </div>

            <div style={{ display: 'none', flexDirection: 'column' }} className="desktop-user-name">
              <span style={{ fontSize: '0.825rem', fontWeight: 700 }}>{user?.name || 'Investor'}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--brand-success)' }}>2FA Active</span>
            </div>

            <button
              onClick={logout}
              title="Sign Out"
              style={{
                padding: '0.45rem',
                borderRadius: '0.4rem',
                background: 'transparent',
                color: 'var(--text-muted)',
                transition: 'color 0.15s ease',
              }}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (min-width: 990px) {
          .desktop-live-ticker {
            display: flex !important;
          }
          .desktop-user-name {
            display: flex !important;
          }
        }
        @media (max-width: 768px) {
          .dashboard-tabs {
            overflow-x: auto;
          }
        }
      `}</style>
    </header>
  );
}
