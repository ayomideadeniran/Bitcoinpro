'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  Menu,
  X,
  Zap,
  ArrowRight,
  Compass,
  Calculator,
  Layers,
  ShieldCheck,
  HelpCircle,
  LogOut,
  User as UserIcon,
  Fuel,
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { formatUsd, formatSats } from '@/lib/btc-calc';
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

  // Scroll detection for frosted glass intensity
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lock body scroll when mobile menu is active
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Fetch live market data
  useEffect(() => {
    fetch('/api/btc-price')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.priceUsd) setMarketData(data);
      })
      .catch(() => {});
  }, []);

  const isPositive = marketData.change24h >= 0;
  const satsPerDollar = marketData.priceUsd > 0 ? Math.round(100_000_000 / marketData.priceUsd) : 0;

  const navLinks = [
    { label: 'How It Works', href: '#how-it-works', icon: Compass },
    { label: 'Yield Calculator', href: '#calculator', icon: Calculator },
    { label: 'Vault Tiers ($200+)', href: '#tiers', icon: Layers },
    { label: 'Fees & Gas', href: '#fees', icon: Zap },
    { label: 'Risks', href: '#risks', icon: ShieldCheck },
    { label: 'FAQ', href: '#faq', icon: HelpCircle },
  ];

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          backgroundColor: isScrolled
            ? 'var(--bg-glass)'
            : 'rgba(8, 9, 26, 0.4)',
          borderBottom: isScrolled
            ? '1px solid var(--border-subtle)'
            : '1px solid rgba(255, 255, 255, 0.05)',
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
            height: '70px',
            gap: '1rem',
          }}
        >
          {/* 1. Left Zone: Brand */}
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
              width={36}
              height={36}
              style={{
                borderRadius: '50%',
                objectFit: 'contain',
                boxShadow: '0 4px 14px rgba(236, 121, 107, 0.35)',
                flexShrink: 0,
              }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span
                style={{
                  fontSize: '1.28rem',
                  fontWeight: 900,
                  letterSpacing: '-0.02em',
                  color: 'var(--text-main)',
                  whiteSpace: 'nowrap',
                }}
              >
                Stark<span style={{ color: '#ec796b' }}>net</span>
              </span>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '9999px',
                  background: 'rgba(236, 121, 107, 0.12)',
                  border: '1px solid rgba(236, 121, 107, 0.3)',
                  color: '#ec796b',
                  letterSpacing: '0.04em',
                }}
                className="desktop-only"
              >
                L2 ZK
              </span>
            </div>
          </Link>

          {/* 2. Center Zone: Desktop Nav Island (>= 1024px) */}
          <nav className="nav-island desktop-only" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="nav-island-link"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* 3. Right Zone: Utilities, Ticker & CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
            {/* Live Interactive BTC / Sats Chip (Desktop >= 1024px) */}
            <button
              onClick={onToggleSatsMode}
              title={satsMode ? 'Click to show in USD' : 'Click to toggle Satoshis view'}
              className="nav-ticker-chip desktop-only"
            >
              <span style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.75rem' }}>
                {satsMode ? 'SATS:' : 'BTC:'}
              </span>
              <span className="mono" style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                {satsMode ? `${formatSats(satsPerDollar)}/s` : formatUsd(marketData.priceUsd, 0)}
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.1rem',
                  fontSize: '0.725rem',
                  fontWeight: 700,
                  color: isPositive ? 'var(--brand-success)' : 'var(--brand-danger)',
                }}
              >
                {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {isPositive ? '+' : ''}{marketData.change24h.toFixed(1)}%
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.1rem 0.3rem',
                  borderRadius: '0.25rem',
                  background: satsMode ? 'rgba(236, 121, 107, 0.25)' : 'var(--bg-surface-elevated)',
                  fontSize: '0.65rem',
                  color: satsMode ? '#ec796b' : 'var(--text-muted)',
                  fontWeight: 700,
                }}
              >
                <Zap size={10} style={{ marginRight: '2px' }} />
                {satsMode ? 'SATS' : 'USD'}
              </span>
            </button>

            {/* Theme Toggle Button */}
            <ThemeToggle />

            {/* Desktop Auth / VIP Actions (>= 1024px) */}
            <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    className="btn btn-primary"
                    style={{
                      padding: '0.42rem 0.95rem',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      borderRadius: '9999px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                    }}
                  >
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', flexShrink: 0 }} />
                    <span>Dashboard</span>
                    <ArrowRight size={13} />
                  </Link>

                  <button
                    onClick={logout}
                    title="Sign out of account"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '34px',
                      height: '34px',
                      borderRadius: '0.5rem',
                      background: 'transparent',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--brand-danger)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                  >
                    <LogOut size={15} />
                  </button>
                </>
              ) : (
                <Link
                  href="/register"
                  className="nav-cta-gradient"
                  id="nav-wishlist-cta"
                >
                  <Sparkles size={14} />
                  <span>Join VIP Wishlist</span>
                </Link>
              )}
            </div>

            {/* Mobile Hamburger Menu Toggle (< 1024px) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-only"
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '0.65rem',
                background: mobileMenuOpen ? 'rgba(236, 121, 107, 0.15)' : 'var(--bg-surface)',
                border: '1px solid',
                borderColor: mobileMenuOpen ? 'rgba(236, 121, 107, 0.4)' : 'var(--border-subtle)',
                color: mobileMenuOpen ? '#ec796b' : 'var(--text-main)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Modern Mobile Navigation Sheet Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-nav-overlay">
          {/* Top Live Stats & Sats Card */}
          <div
            style={{
              padding: '1rem',
              borderRadius: '0.85rem',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Bitcoin Spot Price
              </div>
              <div className="mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {formatUsd(marketData.priceUsd, 0)}
              </div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: isPositive ? 'var(--brand-success)' : 'var(--brand-danger)',
                }}
              >
                {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {isPositive ? '+' : ''}{marketData.change24h.toFixed(2)}% (24h)
              </div>
            </div>

            <button
              onClick={onToggleSatsMode}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.5rem 0.85rem',
                borderRadius: '0.65rem',
                background: satsMode ? 'rgba(236, 121, 107, 0.15)' : 'var(--bg-surface-elevated)',
                border: satsMode ? '1px solid var(--brand-btc)' : '1px solid var(--border-subtle)',
                color: satsMode ? 'var(--brand-btc)' : 'var(--text-main)',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Zap size={16} />
              <span>{satsMode ? 'Sats ON' : 'Show Sats'}</span>
            </button>
          </div>

          {/* Navigation Links with Icons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="mobile-nav-item"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '0.5rem',
                        background: 'rgba(236, 121, 107, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ec796b',
                      }}
                    >
                      <Icon size={16} />
                    </div>
                    <span>{link.label}</span>
                  </div>
                  <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
                </a>
              );
            })}
          </div>

          {/* Bottom Call to Action */}
          <div style={{ marginTop: 'auto', paddingTop: '0.75rem' }}>
            {isAuthenticated ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    textAlign: 'center',
                    fontWeight: 700,
                    borderRadius: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <UserIcon size={18} />
                  <span>Go to Investor Dashboard</span>
                  <ArrowRight size={16} />
                </Link>

                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="btn btn-secondary"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.75rem',
                    fontWeight: 600,
                  }}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '0.85rem',
                  background: 'linear-gradient(135deg, #ec796b 0%, #ff8c7e 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  textDecoration: 'none',
                  boxShadow: '0 6px 20px rgba(236, 121, 107, 0.45)',
                }}
              >
                <Sparkles size={18} />
                <span>Join Grand Opening VIP Wishlist</span>
                <ArrowRight size={18} />
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
