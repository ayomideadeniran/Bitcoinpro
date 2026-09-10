'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, TrendingUp, TrendingDown, Menu, X, ArrowRight, Zap } from 'lucide-react';
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
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '0.65rem',
              background: 'linear-gradient(135deg, #f7931a 0%, #e08213 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(247, 147, 26, 0.35)',
            }}
          >
            <ShieldCheck size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-main)' }}>
                Bitcoin<span style={{ color: 'var(--brand-btc)' }}>Pro</span>
              </span>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  padding: '0.1rem 0.4rem',
                  borderRadius: '0.25rem',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-muted)',
                }}
              >
                Trust First
              </span>
            </div>
          </div>
        </Link>

        {/* Live Market Price Pill & Sats Toggle */}
        <div
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '0.75rem',
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
              background: satsMode ? 'rgba(247, 147, 26, 0.15)' : 'var(--bg-surface-elevated)',
              border: satsMode ? '1px solid var(--brand-btc)' : '1px solid var(--border-subtle)',
              color: satsMode ? 'var(--brand-btc)' : 'var(--text-muted)',
              transition: 'all 0.2s ease',
            }}
          >
            <Zap size={13} />
            {satsMode ? 'Sats Mode: ON' : 'Show Sats'}
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '1.75rem',
          }}
          className="desktop-nav"
        >
          <a href="#how-it-works" style={{ fontSize: '0.925rem', fontWeight: 500, color: 'var(--text-muted)', transition: 'color 0.15s' }}>
            How It Works
          </a>
          <a href="#calculator" style={{ fontSize: '0.925rem', fontWeight: 500, color: 'var(--text-muted)', transition: 'color 0.15s' }}>
            DCA Calculator
          </a>
          <a href="#education" style={{ fontSize: '0.925rem', fontWeight: 500, color: 'var(--text-muted)', transition: 'color 0.15s' }}>
            Learn
          </a>
          <a href="#fees" style={{ fontSize: '0.925rem', fontWeight: 500, color: 'var(--text-muted)', transition: 'color 0.15s' }}>
            Fees
          </a>
          <a href="#risks" style={{ fontSize: '0.925rem', fontWeight: 500, color: 'var(--text-muted)', transition: 'color 0.15s' }}>
            Risks
          </a>
          <a href="#faq" style={{ fontSize: '0.925rem', fontWeight: 500, color: 'var(--text-muted)', transition: 'color 0.15s' }}>
            FAQ
          </a>
        </nav>

        {/* Right Actions: Theme Toggle & Auth State */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <ThemeToggle />
          
          {isAuthenticated ? (
            <>
              <div
                style={{
                  display: 'none',
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
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981' }} />
                <span style={{ fontWeight: 600, color: 'var(--text-main)', maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.name || 'Investor'}
                </span>
              </div>
              <Link
                href="/dashboard"
                className="btn btn-primary"
                style={{
                  padding: '0.55rem 1.15rem',
                  fontSize: '0.875rem',
                  display: 'none',
                }}
                id="nav-cta-desktop"
              >
                <span>Dashboard</span>
                <ArrowRight size={15} />
              </Link>
              <button
                onClick={logout}
                style={{
                  display: 'none',
                  padding: '0.45rem 0.75rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  background: 'transparent',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                }}
                id="nav-logout-desktop"
                title="Sign out of your account"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="btn btn-secondary"
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  display: 'none',
                  padding: '0.5rem 1.1rem',
                  border: '1px solid var(--border-subtle)',
                }}
                id="nav-signin-desktop"
              >
                Login / Sign In
              </Link>
              <Link
                href="/register"
                className="btn btn-primary"
                style={{
                  padding: '0.55rem 1.25rem',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  display: 'none',
                }}
                id="nav-cta-desktop"
              >
                <span>Sign Up</span>
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/login"
                className="btn btn-secondary mobile-login-quick"
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  padding: '0.4rem 0.85rem',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                Login
              </Link>
            </>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '0.5rem',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-main)',
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
              background: satsMode ? 'rgba(247, 147, 26, 0.15)' : 'var(--bg-surface-elevated)',
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
          <a href="#calculator" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600 }}>DCA Calculator</a>
          <a href="#education" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600 }}>Bitcoin Education</a>
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
              <>
                <Link
                  href="/login"
                  className="btn btn-secondary"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ flex: 1, padding: '0.75rem', textAlign: 'center', fontWeight: 700 }}
                >
                  Login / Sign In
                </Link>
                <Link
                  href="/register"
                  className="btn btn-primary"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ flex: 1, padding: '0.75rem', textAlign: 'center', fontWeight: 700 }}
                >
                  <span>Sign Up</span>
                  <ArrowRight size={15} />
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @media (min-width: 900px) {
          .desktop-nav {
            display: flex !important;
          }
          .desktop-live-ticker {
            display: flex !important;
          }
          #nav-signin-desktop {
            display: inline-flex !important;
          }
          #nav-cta-desktop {
            display: inline-flex !important;
          }
          #nav-logout-desktop {
            display: inline-flex !important;
          }
          .desktop-user-pill {
            display: flex !important;
          }
          .mobile-login-quick {
            display: none !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
