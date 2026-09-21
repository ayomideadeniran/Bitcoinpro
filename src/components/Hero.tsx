'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, BookOpen, Calculator, AlertTriangle, ArrowRight, Lock, Award, Sparkles } from 'lucide-react';
import { formatUsd } from '@/lib/btc-calc';
import { BtcMarketData } from '@/lib/types';
import { calculateCurrentWaitlistBase, useCountUp } from '@/lib/waitlist-utils';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

interface HeroProps {
  marketData: BtcMarketData;
  satsMode: boolean;
}

export default function Hero({ marketData, satsMode }: HeroProps) {
  const { isAuthenticated } = useAuth();
  const initialBase = calculateCurrentWaitlistBase();
  const [targetWaitlistCount, setTargetWaitlistCount] = useState(initialBase);
  const animatedHeroCount = useCountUp(targetWaitlistCount, 1800);

  useEffect(() => {
    fetch('/api/wishlist')
      .then((res) => res.json())
      .then((data) => {
        if (data.totalWaitlistCount) setTargetWaitlistCount(data.totalWaitlistCount);
      })
      .catch(() => {});
  }, []);

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
          background: 'radial-gradient(ellipse at center, rgba(236, 121, 107, 0.14) 0%, rgba(236, 121, 107, 0) 70%)',
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
            <span>Bitcoin &bull; Starknet ZK-Rollups &bull; Institutional Vault Yield</span>
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
            Scale Your <span style={{ color: 'var(--brand-btc)' }}>Bitcoin</span> With <span style={{ textDecoration: 'underline', textDecorationColor: 'var(--brand-btc)' }}>Starknet Speed &amp; Yield</span>.
          </h1>
          <p
            style={{
              fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              maxWidth: '740px',
              margin: '0 auto',
            }}
          >
            Unlock institutional-grade Bitcoin yields, Layer-2 ZK-rollup execution, and algorithmic vaults starting from $200. Enjoy automated multi-sig security and high-efficiency daily earnings.
          </p>
        </div>

        {/* Primary Main Page Grand Opening VIP Action Hub */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.25rem',
            marginBottom: '3.5rem',
          }}
        >
          {/* Main Action Button */}
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
                  boxShadow: '0 8px 24px rgba(236, 121, 107, 0.4)',
                }}
                id="hero-dashboard-btn"
              >
                <span>Access Investor Dashboard</span>
                <ArrowRight size={18} />
              </Link>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.9rem' }}>
                <Link
                  href="/register"
                  className="btn btn-primary"
                  style={{
                    padding: '1rem 2.75rem',
                    fontSize: '1.125rem',
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #ec796b 0%, #ff8c7e 100%)',
                    color: '#ffffff',
                    border: 'none',
                    boxShadow: '0 10px 30px rgba(236, 121, 107, 0.45)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    borderRadius: '0.75rem',
                    letterSpacing: '-0.01em',
                  }}
                  id="hero-register-btn"
                >
                  <Sparkles size={20} />
                  <span>Join Grand Opening VIP Wishlist</span>
                  <ArrowRight size={20} />
                </Link>

                {/* Urgency & Social Proof Badge */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    padding: '0.4rem 0.9rem',
                    borderRadius: '9999px',
                  }}
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--brand-success)', display: 'inline-block' }} />
                  <span>
                    <strong style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--text-main)' }}>
                      {animatedHeroCount.toLocaleString()}
                    </strong>{' '}
                    {animatedHeroCount === 1 ? 'Investor Registered' : 'Investors Registered'} • Priority Allocation Open
                  </span>
                </div>
              </div>
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
              <span>Projected Yield Calculator &darr;</span>
            </a>
            <a
              href="#tiers"
              style={{
                color: 'var(--text-muted)',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                textDecoration: 'none',
              }}
            >
              <Award size={15} style={{ color: 'var(--brand-btc)' }} />
              <span>Allocation Tiers ($200+) &darr;</span>
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
          {/* Card 1: Quantitative ZK-Vaults */}
          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Quantitative ZK-Vaults</span>
              <Award size={18} style={{ color: 'var(--brand-btc)' }} />
            </div>
            <div className="mono" style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Algorithmic Yield
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Proprietary Cairo smart vaults and delta-neutral strategies harvest consistent Bitcoin yields across market cycles.
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
              {satsMode ? `$1 buys ~${Math.round(100_000_000 / marketData.priceUsd)} satoshis today.` : 'Live transparent market pricing via decentralized Starknet liquidity.'}
            </p>
          </div>

          {/* Card 3: Starknet Layer-2 */}
          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Starknet Layer-2</span>
              <Lock size={18} style={{ color: 'var(--brand-success)' }} />
            </div>
            <div className="mono" style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Sub-Cent Fees
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              STARK zero-knowledge validity proofs bundle thousands of transactions off-chain, cutting gas overhead by over 95%.
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
