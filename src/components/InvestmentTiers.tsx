'use client';

import React from 'react';
import { Shield, Zap, Crown, Check } from 'lucide-react';
import Link from 'next/link';

export default function InvestmentTiers() {
  const tiers = [
    {
      name: 'Silver Tier',
      startingAmount: '$5,000',
      icon: <Shield size={24} style={{ color: '#a0aec0' }} />,
      glowColor: 'rgba(160, 174, 192, 0.4)',
      borderColor: '#a0aec0',
      features: [
        'Expected Interest: $3,000 - $4,000',
        'Core Portfolio Management',
        'Weekly Market Insights',
        'Standard Support',
      ],
      buttonText: 'Start with Silver',
    },
    {
      name: 'Gold Tier',
      startingAmount: '$25,000',
      icon: <Zap size={24} style={{ color: 'var(--brand-btc)' }} />,
      glowColor: 'var(--brand-btc-glow)',
      borderColor: 'var(--brand-btc)',
      isPopular: true,
      features: [
        'Expected Interest: $15,000 - $20,000',
        'Dedicated Account Manager',
        'Reduced Platform Fees (0.5%)',
        'VIP Educational Webinars',
        'Priority Support',
      ],
      buttonText: 'Go for Gold',
    },
    {
      name: 'Platinum Tier',
      startingAmount: '$100,000+',
      icon: <Crown size={24} style={{ color: '#9f7aea' }} />,
      glowColor: 'rgba(159, 122, 234, 0.4)',
      borderColor: '#9f7aea',
      features: [
        'Expected Interest: $60,000 - $80,000+',
        'Zero Platform Fees',
        'Institutional Execution Routing',
        'Private Wealth Consultations',
        'Custom Tax Reporting',
      ],
      buttonText: 'Become Platinum',
    },
  ];

  return (
    <section className="section-wrapper" style={{ background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative Background Glows */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '300px',
          height: '300px',
          background: 'var(--brand-btc-glow)',
          filter: 'blur(120px)',
          opacity: 0.3,
          borderRadius: '50%',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '5%',
          width: '400px',
          height: '400px',
          background: 'rgba(159, 122, 234, 0.2)',
          filter: 'blur(140px)',
          opacity: 0.3,
          borderRadius: '50%',
          zIndex: 0,
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="section-header" style={{ marginBottom: '3rem' }}>
          <div className="section-badge">
            <Crown size={14} />
            <span>Investment Tiers</span>
          </div>
          <h2 className="section-title">Elevate Your Bitcoin Strategy</h2>
          <p className="section-subtitle">
            Unlock exclusive advantages and tailored benefits based on your capital commitment.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
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
                padding: '2rem',
                border: tier.isPopular ? `1px solid ${tier.borderColor}` : undefined,
                transform: tier.isPopular ? 'scale(1.02)' : 'none',
                boxShadow: tier.isPopular ? `0 8px 32px ${tier.glowColor}` : undefined,
                zIndex: tier.isPopular ? 2 : 1,
              }}
            >
              {tier.isPopular && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: tier.borderColor,
                    color: '#1a1b23',
                    padding: '0.25rem 1rem',
                    borderRadius: '1rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Most Popular
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'var(--bg-surface-elevated)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 0 20px ${tier.glowColor}`,
                  }}
                >
                  {tier.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>{tier.name}</h3>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Starting at</div>
                </div>
              </div>

              <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem', fontFamily: 'var(--font-mono)' }}>
                {tier.startingAmount}
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {tier.features.map((feature, fIdx) => (
                  <li key={fIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.9rem' }}>
                    <div style={{ marginTop: '0.15rem' }}>
                      <Check size={16} style={{ color: tier.borderColor }} />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/register"
                className="btn"
                style={{
                  marginTop: '2.5rem',
                  width: '100%',
                  textAlign: 'center',
                  background: tier.isPopular ? tier.borderColor : 'var(--bg-surface-elevated)',
                  color: tier.isPopular ? '#1a1b23' : 'var(--text-primary)',
                  border: tier.isPopular ? 'none' : '1px solid var(--border-subtle)',
                }}
              >
                {tier.buttonText}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
