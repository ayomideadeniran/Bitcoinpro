'use client';

import React, { useState } from 'react';
import { BookOpen, ShieldAlert, Target, TrendingUp, CheckCircle, ArrowRight, ShieldCheck, Lock } from 'lucide-react';

const STEPS = [
  {
    id: 1,
    title: '1. Fund Your Account',
    subtitle: 'Secure Deposits',
    icon: Lock,
    color: 'var(--brand-info)',
    summary: 'Deposit USD, EUR, or crypto directly into your secure wallet. Your funds are protected by bank-grade security and institutional custodians.',
    highlights: [
      'Instant deposits via wire transfer, ACH, or crypto',
      'No hidden deposit fees or spread markups',
      'Fully compliant and insured custodian partners'
    ],
    actionText: 'View Deposit Options',
    actionHref: '#calculator'
  },
  {
    id: 2,
    title: '2. Experts Deploy Capital',
    subtitle: 'Algorithmic Trading',
    icon: Target,
    color: 'var(--brand-btc)',
    summary: 'Our seasoned quantitative traders and proprietary algorithms deploy your capital across high-liquidity markets to safely capture yield.',
    highlights: [
      'Strategies designed to mitigate downside risk',
      'Execution on top-tier global exchanges',
      '24/7 autonomous risk-management engines'
    ],
    actionText: 'See Trading Stats',
    actionHref: '#mining'
  },
  {
    id: 3,
    title: '3. Institutional Mining',
    subtitle: 'Generate Block Rewards',
    icon: ShieldCheck,
    color: 'var(--brand-success)',
    summary: 'A portion of your portfolio is allocated directly into high-efficiency Bitcoin mining farms, generating consistent daily block rewards.',
    highlights: [
      'Direct exposure to global hash rate',
      'Eco-friendly mining operations',
      'Zero maintenance or hardware costs for you'
    ],
    actionText: 'Explore Mining Operations',
    actionHref: '#mining'
  },
  {
    id: 4,
    title: '4. Receive Payouts',
    subtitle: 'Passive Daily Yield',
    icon: TrendingUp,
    color: 'var(--brand-btc)',
    summary: 'Sit back and watch your dashboard as your earned interest is automatically deposited into your account. Withdraw your principal or profits at any time.',
    highlights: [
      'Interest accrued and paid out automatically',
      'Compound your yield for exponential growth',
      'No lock-up periods or withdrawal penalties'
    ],
    actionText: 'Calculate Projected Yield',
    actionHref: '#calculator'
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
            <CheckCircle size={14} />
            <span>The Wealth Pathway</span>
          </div>
          <h2 className="section-title">A Simple, 4-Step Process</h2>
          <p className="section-subtitle">
            We handle the complexities of the crypto market. Just deposit your capital, and let our experts go to work.
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
                    Step 0{step.id}
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
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{currentStep.title}</h3>
              </div>
            </div>

            <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {currentStep.summary}
            </p>

            <a href={currentStep.actionHref} className="btn btn-primary" style={{ padding: '0.65rem 1.35rem' }}>
              <span>{currentStep.actionText}</span>
              <ArrowRight size={16} />
            </a>
          </div>

          <div
            style={{
              background: 'var(--bg-surface-elevated)',
              borderRadius: '0.85rem',
              padding: '1.75rem',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Core Takeaways for this Step
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {currentStep.highlights.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                  <CheckCircle size={18} style={{ color: 'var(--brand-success)', flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.4 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
