'use client';

import React from 'react';
import { ShieldCheck, BookOpen, Calculator, AlertTriangle, ArrowRight, Lock, Award } from 'lucide-react';
import { formatUsd } from '@/lib/btc-calc';
import { BtcMarketData } from '@/lib/types';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

interface HeroProps {
  marketData: BtcMarketData;
  satsMode: boolean;
}

export default function Hero({ marketData, satsMode }: HeroProps) {
  const { isAuthenticated } = useAuth();

  return (
    <section
      style={{
        position: 'relative',
        padding: '4.5rem 0 5rem',
        overflow: 'hidden',
      }}
    >
      {/* Background Subtle Gradient Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '750px',
          height: '450px',
          background: 'radial-gradient(ellipse at center, rgba(247, 147, 26, 0.12) 0%, rgba(247, 147, 26, 0) 70%)',
          filter: 'blur(50px)',
          zIndex: -1,
          pointerEvents: 'none',
        }}
      />

      <div className="container">
        {/* Anti-Hype Reassurance Badge */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 1rem',
              borderRadius: '9999px',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--text-main)',
            }}
          >
            <ShieldCheck size={16} style={{ color: 'var(--brand-btc)' }} />
            <span>Education First &bull; Zero Guaranteed Return Promises &bull; Radical Transparency</span>
          </div>
        </div>

        {/* Hero Title & Subtitle */}
        <div style={{ textAlign: 'center', maxWidth: '860px', margin: '0 auto 2.5rem' }}>
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              marginBottom: '1.25rem',
            }}
          >
            Bitcoin Investing, Built on <span style={{ color: 'var(--brand-btc)' }}>Education</span> &amp; <span style={{ textDecoration: 'underline', textDecorationColor: 'var(--brand-btc)' }}>Trust</span>.
          </h1>
          <p
            style={{
              fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              maxWidth: '720px',
              margin: '0 auto',
            }}
          >
            Understand the technology, grasp the volatility, and practice disciplined recurring investing. No gimmicks, no get-rich-quick illusions.
          </p>
        </div>

        {/* Primary Main Page Login & Sign In Action Hub */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.25rem',
            marginBottom: '3.5rem',
          }}
        >
          {/* Main Auth Buttons */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
            }}
          >
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="btn btn-primary"
                style={{
                  padding: '0.9rem 2.25rem',
                  fontSize: '1.075rem',
                  fontWeight: 700,
                  boxShadow: '0 8px 24px rgba(247, 147, 26, 0.4)',
                }}
                id="hero-dashboard-btn"
              >
                <span>Access Investor Dashboard</span>
                <ArrowRight size={18} />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="btn btn-secondary"
                  style={{
                    padding: '0.85rem 2rem',
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    border: '1.5px solid var(--border-subtle)',
                    background: 'var(--bg-surface-elevated)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                  }}
                  id="hero-login-btn"
                >
                  <Lock size={18} style={{ color: 'var(--brand-btc)' }} />
                  <span>Login / Sign In</span>
                </Link>

                <Link
                  href="/register"
                  className="btn btn-primary"
                  style={{
                    padding: '0.85rem 2rem',
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    boxShadow: '0 8px 24px rgba(247, 147, 26, 0.35)',
                  }}
                  id="hero-register-btn"
                >
                  <span>Sign Up / Get Started</span>
                  <ArrowRight size={18} />
                </Link>
              </>
            )}
          </div>

          {/* Secondary Educational Tools Quick Links */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.5rem',
              fontSize: '0.9rem',
            }}
          >
            <a
              href="#calculator"
              style={{
                color: 'var(--text-muted)',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                textDecoration: 'none',
              }}
            >
              <Calculator size={15} style={{ color: 'var(--brand-btc)' }} />
              <span>Interactive DCA Simulator &darr;</span>
            </a>
            <a
              href="#education"
              style={{
                color: 'var(--text-muted)',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                textDecoration: 'none',
              }}
            >
              <BookOpen size={15} style={{ color: 'var(--brand-btc)' }} />
              <span>Free Knowledge Base &darr;</span>
            </a>
          </div>
        </div>

        {/* Hero Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.25rem',
            maxWidth: '1100px',
            margin: '0 auto',
          }}
        >
          {/* Card 1: Fixed Scarcity */}
          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Hard Capped Supply</span>
              <Award size={18} style={{ color: 'var(--brand-btc)' }} />
            </div>
            <div className="mono" style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)' }}>
              21,000,000 BTC
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Mathematically fixed limit. No authority can create more coins or inflate your purchasing power away.
            </p>
          </div>

          {/* Card 2: Live Market Price */}
          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Current Market Rate</span>
              <span className="pill pill-btc">{marketData.change24h >= 0 ? '+' : ''}{marketData.change24h.toFixed(2)}% (24h)</span>
            </div>
            <div className="mono" style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {formatUsd(marketData.priceUsd, 0)}
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {satsMode ? `$1 buys ~${Math.round(100_000_000 / marketData.priceUsd)} satoshis today.` : 'Live transparent market pricing via decentralized order books.'}
            </p>
          </div>

          {/* Card 3: Security & Self-Custody */}
          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Cryptographic Custody</span>
              <Lock size={18} style={{ color: 'var(--brand-success)' }} />
            </div>
            <div className="mono" style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Self-Sovereign
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Learn how to control your private keys offline. Your money, mathematically secured by cryptography.
            </p>
          </div>
        </div>

        {/* Mandatory Regulatory & Risk Disclosure Banner */}
        <div
          style={{
            marginTop: '2.5rem',
            padding: '0.85rem 1.25rem',
            borderRadius: '0.75rem',
            background: 'var(--brand-danger-bg)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            maxWidth: '1000px',
            margin: '2.5rem auto 0',
          }}
        >
          <AlertTriangle size={20} style={{ color: 'var(--brand-danger)', flexShrink: 0 }} />
          <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
            <strong>Risk Warning:</strong> Bitcoin is a volatile digital asset subject to significant market swings. It does not carry government deposit insurance (e.g. FDIC/FSCS). Past performance is not indicative of future results. Only invest what you can afford to hold long term.
          </p>
        </div>
      </div>
    </section>
  );
}
