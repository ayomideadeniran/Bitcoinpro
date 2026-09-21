'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, TrendingUp, TrendingDown, Menu, X, ArrowRight, Zap, Sparkles } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { formatUsd } from '@/lib/btc-calc';
import { BtcMarketData } from '@/lib/types';
import { DEFAULT_MARKET_DATA } from '@/lib/btc-calc';
import { useAuth } from '@/lib/auth-context';

interface NavbarProps {
  satsMode: boolean;
  onToggleSatsMode: () => void;
}

export default function Navbar({ satsMode, onToggleSatsMode }: NavbarProps) {
  const { isAuthenticated, user, logout } = useAuth();
  const [marketData, setMarketData] = useState<BtcMarketData>(DEFAULT_MARKET_DATA);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Fetch live market data
    fetch('/api/btc-price')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.priceUsd) setMarketData(data);
      })
      .catch(() => {});
  }, []);

  const isPositive = marketData.change24h >= 0;

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        backgroundColor: isScrolled ? 'var(--bg-glass)' : 'transparent',
        borderBottom: isScrolled ? '1px solid var(--border-subtle)' : '1px solid transparent',
        transition: 'all 0.25s ease',
        width: '100%',
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
        {/* Brand Logo */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          <img
            src="/icon.png"
            alt="Starknet Logo"
            width={38}
            height={38}
            style={{
              borderRadius: '50%',
              objectFit: 'contain',
              boxShadow: '0 4px 14px rgba(236, 121, 107, 0.35)',
              flexShrink: 0,
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '1.3rem', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--text-main)', whiteSpace: 'nowrap' }}>
                Stark<span style={{ color: '#ec796b' }}>net</span>
              </span>
              <span
                className="brand-trust-badge"
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  padding: '0.1rem 0.4rem',
                  borderRadius: '0.25rem',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-muted)',
                  whiteSpace: 'nowrap',
                }}
              >
                Trust First
              </span>
            </div>
          </div>
        </Link>

        {/* Live Market Price Pill & Sats Toggle (Large Desktop >= 1240px) */}
        <div
          style={{
            alignItems: 'center',
            gap: '0.75rem',
            flexShrink: 0,
          }}
          className="desktop-live-ticker"
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.85rem',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>BTC:</span>
            <span className="mono" style={{ fontWeight: 700, color: 'var(--text-main)' }}>
              {formatUsd(marketData.priceUsd, 0)}
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.15rem',
                fontSize: '0.775rem',
                fontWeight: 600,
                color: isPositive ? 'var(--brand-success)' : 'var(--brand-danger)',
              }}
            >
              {isPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
              {isPositive ? '+' : ''}
              {marketData.change24h.toFixed(2)}%
            </span>
          </div>

          {/* Satoshis Mode Toggle Button */}
          <button
            onClick={onToggleSatsMode}
            title="Toggle between BTC and Satoshi units"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.35rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.775rem',
              fontWeight: 600,
              background: satsMode ? 'rgba(236, 121, 107, 0.15)' : 'var(--bg-surface-elevated)',
              border: satsMode ? '1px solid var(--brand-btc)' : '1px solid var(--border-subtle)',
              color: satsMode ? 'var(--brand-btc)' : 'var(--text-muted)',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
            }}
          >
            <Zap size={13} />
            {satsMode ? 'Sats Mode: ON' : 'Show Sats'}
          </button>
        </div>

        {/* Desktop Navigation Links (>= 1024px) */}
        <nav className="desktop-nav">
          <a href="#how-it-works" className="nav-link">
            How It Works
          </a>
          <a href="#calculator" className="nav-link">
            Projected Yield
          </a>
          <a href="#tiers" className="nav-link">
            Vault Tiers ($200+)
          </a>
          <a href="#fees" className="nav-link">
            Fees
          </a>
          <a href="#risks" className="nav-link">
            Risks
          </a>
          <a href="#faq" className="nav-link">
            FAQ
          </a>
        </nav>

        {/* Right Actions: Theme Toggle, Auth Actions & Mobile Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          <ThemeToggle />
          
          {isAuthenticated ? (
            <>
              <div
                style={{
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.35rem 0.65rem',
                  borderRadius: '9999px',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                }}
                className="desktop-user-pill"
              >
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', flexShrink: 0 }} />
                <span style={{ fontWeight: 600, color: 'var(--text-main)', maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.name || 'Investor'}
                </span>
              </div>
              <Link
                href="/dashboard"
                className="btn btn-primary nav-btn-desktop"
                style={{
                  padding: '0.55rem 1.15rem',
                  fontSize: '0.875rem',
                }}
                id="nav-cta-desktop"
              >
                <span>Dashboard</span>
                <ArrowRight size={15} />
              </Link>
              <button
                onClick={logout}
                style={{
                  padding: '0.45rem 0.75rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  background: 'transparent',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                }}
                className="nav-btn-desktop"
                id="nav-logout-desktop"
                title="Sign out of your account"
              >
                Sign Out
              </button>
              <Link
                href="/dashboard"
                className="btn btn-primary mobile-auth-quick"
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  padding: '0.4rem 0.85rem',
                }}
              >
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/register"
                className="btn btn-primary nav-btn-desktop"
                style={{
                  padding: '0.55rem 1.35rem',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #ec796b 0%, #ff8c7e 100%)',
                  boxShadow: '0 4px 16px rgba(236, 121, 107, 0.4)',
                  border: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
                id="nav-cta-desktop"
              >
                <Sparkles size={14} style={{ color: '#ffffff' }} />
                <span style={{ color: '#ffffff' }}>Grand Opening VIP Wishlist</span>
              </Link>
              <Link
                href="/register"
                className="btn btn-primary mobile-auth-quick"
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  padding: '0.4rem 0.85rem',
                  background: 'linear-gradient(135deg, #ec796b 0%, #ff8c7e 100%)',
                  color: '#ffffff',
                  border: 'none',
                }}
              >
                VIP Wishlist
              </Link>
            </>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '0.5rem',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-main)',
              flexShrink: 0,
            }}
            className="mobile-menu-btn"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="mobile-nav-drawer"
          style={{
            background: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>BTC Price:</span>
            <span className="mono" style={{ fontWeight: 700 }}>{formatUsd(marketData.priceUsd, 0)}</span>
          </div>

          <button
            onClick={() => {
              onToggleSatsMode();
              setMobileMenuOpen(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.65rem',
              borderRadius: '0.5rem',
              background: satsMode ? 'rgba(236, 121, 107, 0.15)' : 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              color: satsMode ? 'var(--brand-btc)' : 'var(--text-main)',
              fontWeight: 600,
              fontSize: '0.875rem',
            }}
          >
            <Zap size={15} />
            {satsMode ? 'Satoshis Mode Active' : 'Switch to Sats Mode'}
          </button>

          <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600 }}>How It Works</a>
          <a href="#calculator" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600 }}>Projected Yield</a>
          <a href="#tiers" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600 }}>Vault Tiers ($200+)</a>
          <a href="#fees" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600 }}>Fee Transparency</a>
          <a href="#risks" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600 }}>Risk Disclosure</a>
          <a href="#faq" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600 }}>FAQ</a>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="btn btn-primary"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ flex: 1, padding: '0.75rem' }}
                >
                  <span>Dashboard</span>
                  <ArrowRight size={15} />
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="btn btn-secondary"
                  style={{ flex: 1, padding: '0.75rem' }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/register"
                className="btn btn-primary"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  textAlign: 'center',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #ec796b 0%, #ff8c7e 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  border: 'none',
                }}
              >
                <Sparkles size={16} />
                <span>Join Grand Opening Wishlist</span>
                <ArrowRight size={15} />
              </Link>
            )}
          </div>
        </div>
      )}

    </header>
  );
}
