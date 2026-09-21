'use client';

import React, { useState } from 'react';
import { Target, TrendingUp, CheckCircle, ArrowRight, Lock, CreditCard, Sparkles, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

const STEPS = [
  {
    id: 1,
    title: '1. Join VIP Wishlist & Secure Priority Queue',
    subtitle: 'Pre-Launch Whitelist',
    icon: Sparkles,
    color: 'var(--brand-btc)',
    summary: 'Reserve your vault allocation tier starting from just $200. Wishlist members receive guaranteed vault access, 0% platform fees during launch week, and early onboarding passes.',
    highlights: [
      'Accessible entry points from $200 up to $250,000+ institutional allocations',
      'Instant minting of your unique Grand Opening VIP Priority Pass',
      'Zero upfront commitment required during pre-launch'
    ],
    actionText: 'Claim Your VIP Wishlist Ticket',
    actionHref: '/register'
  },
  {
    id: 2,
    title: '2. Select Preferred Funding & Payment Method',
    subtitle: 'Flexible Multi-Asset Deposits',
    icon: CreditCard,
    color: '#38bdf8',
    summary: 'Fund your allocation in whatever currency suits your workflow. We support direct stablecoins, native Bitcoin, Starknet Layer-2 tokens, institutional bank wires, and card on-ramps.',
    highlights: [
      'USDT & USDC multi-chain settlement for zero volatility',
      'Native Bitcoin (BTC / Lightning) & Starknet (STRK / ETH)',
      'Institutional FedWire, SWIFT, SEPA & instant card checkout'
    ],
    actionText: 'View Payment & Allocation Tiers',
    actionHref: '#tiers'
  },
  {
    id: 3,
    title: '3. Starknet Bitcoin ZK-Vault Execution',
    subtitle: 'High-Efficiency ZK-Yield',
    icon: ShieldCheck,
    color: '#10b981',
    summary: 'Your capital is anchored into institutional cold-storage multi-sig vaults and deployed into audited delta-neutral algorithmic strategies and Starknet Layer-2 scaling pools.',
    highlights: [
      'Target 12.4% APY institutional vault yields with automated risk limits',
      'Zero-knowledge proof verification ensuring mathematical execution safety',
      'Non-commingled segregated accounts and institutional legal frameworks'
    ],
    actionText: 'Calculate Projected Yield',
    actionHref: '#calculator'
  },
  {
    id: 4,
    title: '4. Daily Compound Earnings & Full Liquidity',
    subtitle: 'Real-Time Yield Payouts',
    icon: TrendingUp,
    color: '#a855f7',
    summary: 'Watch your portfolio grow live in your dedicated dashboard. Accrued yield is credited automatically with flexible reinvestment and priority multi-sig withdrawal routing.',
    highlights: [
      'Daily automated interest payouts credited directly to your balance',
      'Optional 1-click automatic compound reinvestment for exponential returns',
      'Transparent on-chain accounting with zero hidden spreads or exit penalties'
    ],
    actionText: 'Join Grand Opening Priority Queue',
    actionHref: '/register'
  }
];

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(1);
  const currentStep = STEPS.find((s) => s.id === activeStep) || STEPS[0];
  const StepIcon = currentStep.icon;

  return (
    <section id="how-it-works" className="section-wrapper" style={{ background: 'var(--bg-surface)' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge">
            <CheckCircle size={14} style={{ color: 'var(--brand-btc)' }} />
            <span>The Bitcoin &amp; Starknet Pathway</span>
          </div>
          <h2 className="section-title">How Our ZK-Vault Ecosystem Works</h2>
          <p className="section-subtitle">
            A seamless 4-step workflow uniting Bitcoin scarcity with Starknet Layer-2 scaling, automated yield generation, and institutional custody.
          </p>
        </div>

        {/* Interactive Step Navigator */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            marginBottom: '2.5rem',
          }}
        >
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isActive = step.id === activeStep;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                style={{
                  padding: '1.25rem',
                  borderRadius: '0.85rem',
                  background: isActive ? 'var(--bg-surface-elevated)' : 'var(--bg-primary)',
                  border: '1px solid',
                  borderColor: isActive ? 'var(--brand-btc)' : 'var(--border-subtle)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? 'var(--shadow-md)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '0.5rem',
                      background: isActive ? 'var(--brand-btc)' : 'var(--bg-surface)',
                      color: isActive ? '#ffffff' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={16} />
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: isActive ? 'var(--brand-btc)' : 'var(--text-muted)' }}>
                    Phase 0{step.id}
                  </span>
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {step.subtitle}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Step Showcase Card */}
        <div
          className="glass-card"
          style={{
            padding: '2.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2.5rem',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '0.65rem',
                  background: currentStep.color,
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <StepIcon size={22} />
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--brand-btc)' }}>
                  Phase 0{currentStep.id} of 04
                </span>
                <h3 style={{ fontSize: '1.45rem', fontWeight: 800 }}>{currentStep.title}</h3>
              </div>
            </div>

            <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {currentStep.summary}
            </p>

            <Link
              href={currentStep.actionHref}
              className="btn btn-primary"
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '0.9rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #ec796b 0%, #ff8c7e 100%)',
                color: '#ffffff',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                border: 'none',
                boxShadow: '0 8px 24px rgba(236, 121, 107, 0.4)',
              }}
            >
              <span>{currentStep.actionText}</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div
            style={{
              background: 'var(--bg-surface-elevated)',
              borderRadius: '0.85rem',
              padding: '1.75rem',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--brand-btc)', marginBottom: '1rem' }}>
              Core Key Takeaways
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {currentStep.highlights.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                  <CheckCircle size={18} style={{ color: 'var(--brand-success)', flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.45 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
