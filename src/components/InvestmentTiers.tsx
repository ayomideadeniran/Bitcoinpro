'use client';

import React from 'react';
import { Shield, Zap, Crown, Check, Sparkles, Building2, Layers } from 'lucide-react';
import Link from 'next/link';

export default function InvestmentTiers() {
  const tiers = [
    {
      name: 'Private Starter',
      badge: 'Starter Allocation',
      startingAmount: '$200',
      range: '$200 – $1,000',
      icon: <Shield size={22} style={{ color: '#38bdf8' }} />,
      glowColor: 'rgba(56, 189, 248, 0.3)',
      borderColor: '#38bdf8',
      features: [
        'Direct Bitcoin & Starknet ZK-Vault Access',
        'Automated Daily Yield Accrual',
        '0% Deposit & Platform Fees During Launch Week',
        'Priority Wishlist Queue Ticket',
      ],
      buttonText: 'Claim Starter Pass',
    },
    {
      name: 'Standard Growth',
      badge: 'Wealth Builder',
      startingAmount: '$1,000',
      range: '$1,000 – $10,000',
      icon: <Layers size={22} style={{ color: '#10b981' }} />,
      glowColor: 'rgba(16, 185, 129, 0.3)',
      borderColor: '#10b981',
      features: [
        '12.4% APY Target Yield Strategy',
        'Automated DCA & Reinvestment Options',
        'Multi-Asset Funding (USDT, BTC, STRK, Wire)',
        'Standard Institutional Custody Routing',
      ],
      buttonText: 'Reserve Standard Allocation',
    },
    {
      name: 'Wealth Builder',
      badge: 'Most Popular',
      startingAmount: '$10,000',
      range: '$10,000 – $50,000',
      icon: <Zap size={22} style={{ color: 'var(--brand-btc)' }} />,
      glowColor: 'var(--brand-btc-glow)',
      borderColor: 'var(--brand-btc)',
      isPopular: true,
      features: [
        'Guaranteed Capacity in 12.4% APY Vault',
        'Dedicated Quantitative Portfolio Manager',
        '0.25% Reduced Spread Execution',
        'Daily Real-Time Telegram Yield Reports',
        'Priority Multi-Sig Withdrawal Access',
      ],
      buttonText: 'Secure VIP Allocation',
    },
    {
      name: 'Institutional Custody',
      badge: 'Priority VIP',
      startingAmount: '$50,000',
      range: '$50,000 – $250,000',
      icon: <Building2 size={22} style={{ color: '#a855f7' }} />,
      glowColor: 'rgba(168, 85, 247, 0.3)',
      borderColor: '#a855f7',
      features: [
        'Direct Cold-Vault Multisig Ledger Anchoring',
        'Segregated Non-Commingled Custodial Accounts',
        'Master Custody Legal Framework Included',
        'Institutional Prover Channel & Zero Gas Fees',
        '24/7 Dedicated Senior Account Director',
      ],
      buttonText: 'Apply for Institutional Tier',
    },
    {
      name: 'Executive White-Glove',
      badge: 'Private Office / OTC',
      startingAmount: '$250,000+',
      range: '$250,000+ Unlimited',
      icon: <Crown size={22} style={{ color: '#eab308' }} />,
      glowColor: 'rgba(234, 179, 8, 0.35)',
      borderColor: '#eab308',
      features: [
        'Tailored Delta-Neutral Arbitrage Vaults',
        'Direct Institutional OTC Desk Execution',
        'Bespoke Tax-Advantaged Reporting & Audits',
        'Full FinCEN & Global Regulatory Compliance',
        'Board-Level Private Office Briefings',
      ],
      buttonText: 'Request Private Office Access',
    },
  ];

  return (
    <section id="tiers" className="section-wrapper" style={{ background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative Ambient Background Glows */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          left: '5%',
          width: '350px',
          height: '350px',
          background: 'var(--brand-btc-glow)',
          filter: 'blur(130px)',
          opacity: 0.25,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '5%',
          width: '450px',
          height: '450px',
          background: 'rgba(168, 85, 247, 0.18)',
          filter: 'blur(150px)',
          opacity: 0.25,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="section-header" style={{ marginBottom: '3.5rem' }}>
          <div className="section-badge">
            <Crown size={14} style={{ color: 'var(--brand-btc)' }} />
            <span>Grand Opening Allocation Tiers</span>
          </div>
          <h2 className="section-title">Bitcoin &amp; Starknet Allocation Tiers</h2>
          <p className="section-subtitle">
            Capital tiers engineered for everyone from private starter investors ($200+) to institutional treasuries and family offices.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            alignItems: 'stretch',
          }}
        >
          {tiers.map((tier, idx) => (
            <div
              key={idx}
              className="glass-card"
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                padding: '1.75rem',
                borderRadius: '1rem',
                border: tier.isPopular ? `2px solid ${tier.borderColor}` : '1px solid var(--border-subtle)',
                transform: tier.isPopular ? 'scale(1.02)' : 'none',
                boxShadow: tier.isPopular ? `0 10px 36px ${tier.glowColor}` : undefined,
                background: tier.isPopular
                  ? 'linear-gradient(180deg, rgba(236, 121, 107, 0.08) 0%, var(--bg-surface) 100%)'
                  : 'var(--bg-surface)',
                zIndex: tier.isPopular ? 2 : 1,
              }}
            >
              {/* Popular / VIP Badge */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem',
                }}
              >
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '999px',
                    background: tier.isPopular ? 'var(--brand-btc)' : 'var(--bg-surface-elevated)',
                    color: tier.isPopular ? '#ffffff' : 'var(--text-muted)',
                  }}
                >
                  {tier.badge}
                </span>

                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'var(--bg-surface-elevated)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 0 16px ${tier.glowColor}`,
                  }}
                >
                  {tier.icon}
                </div>
              </div>

              {/* Title & Range */}
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.2rem', color: 'var(--text-main)' }}>
                {tier.name}
              </h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                Planned Capital: <strong style={{ color: 'var(--brand-btc)' }}>{tier.range}</strong>
              </div>

              {/* Starting Amount */}
              <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.15rem' }}>
                  Starting Allocation
                </span>
                <div style={{ fontSize: '2.1rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                  {tier.startingAmount}
                </div>
              </div>

              {/* Features List */}
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, flex: 1, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {tier.features.map((feature, fIdx) => (
                  <li key={fIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', fontSize: '0.85rem' }}>
                    <div style={{ marginTop: '0.15rem' }}>
                      <Check size={15} style={{ color: tier.borderColor }} />
                    </div>
                    <span style={{ color: 'var(--text-main)', lineHeight: 1.4 }}>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Action Button */}
              <Link
                href="/register"
                className="btn btn-primary"
                style={{
                  marginTop: '2rem',
                  width: '100%',
                  textAlign: 'center',
                  padding: '0.75rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  background: tier.isPopular
                    ? 'linear-gradient(135deg, #ec796b 0%, #ff8c7e 100%)'
                    : 'var(--bg-surface-elevated)',
                  color: tier.isPopular ? '#ffffff' : 'var(--text-main)',
                  border: tier.isPopular ? 'none' : '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  boxShadow: tier.isPopular ? '0 8px 24px rgba(236, 121, 107, 0.4)' : 'none',
                }}
              >
                <Sparkles size={15} />
                <span>{tier.buttonText}</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
