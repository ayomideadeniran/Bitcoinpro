'use client';

import React, { useState } from 'react';
import { BookOpen, ShieldAlert, Target, TrendingUp, CheckCircle, ArrowRight, ShieldCheck, Lock } from 'lucide-react';

const STEPS = [
  {
    id: 1,
    title: '1. Learn the Fundamentals',
    subtitle: 'Master the Basics First',
    icon: BookOpen,
    color: 'var(--brand-info)',
    summary: 'Never invest in what you do not understand. Learn why Bitcoin has a 21 Million supply cap, how cryptographic keys work, and why decentralization prevents arbitrary inflation.',
    highlights: [
      'Understand the 21M hard cap and why no authority can print more',
      'Learn the difference between a public address and a private seed phrase',
      'Why self-custody gives you sovereign ownership of your wealth'
    ],
    actionText: 'Explore Knowledge Hub',
    actionHref: '#education'
  },
  {
    id: 2,
    title: '2. Understand the Risks',
    subtitle: 'Respect the Volatility',
    icon: ShieldAlert,
    color: 'var(--brand-danger)',
    summary: 'Bitcoin is a high-volatility asset that regularly sees 30% to 50%+ drawdowns. Only allocate capital you can comfortably hold for multi-year horizons without emotional stress.',
    highlights: [
      'Maintain an emergency cash reserve before buying any crypto',
      'Never invest borrowed money or funds needed for short-term bills',
      'Ignore get-rich-quick schemes and unrealistic yield promises'
    ],
    actionText: 'Read Full Risk Disclosure',
    actionHref: '#risks'
  },
  {
    id: 3,
    title: '3. Set a Personal Goal',
    subtitle: 'Define Your Milestone',
    icon: Target,
    color: 'var(--brand-btc)',
    summary: 'Instead of speculating on short-term candles, set a measurable, achievable milestone — like stacking 1,000,000 Satoshis or saving $25/week over 12 months.',
    highlights: [
      'Break your goal into affordable weekly or monthly recurring bites',
      'Focus on accumulated satoshis rather than daily price fluctuations',
      'Track your progress transparently without speculative pressure'
    ],
    actionText: 'Model Your DCA Goal',
    actionHref: '#calculator'
  },
  {
    id: 4,
    title: '4. Execute & Custody Securely',
    subtitle: 'Radical Safety & Transparency',
    icon: ShieldCheck,
    color: 'var(--brand-success)',
    summary: 'Use fully regulated on-ramp partners with transparent fees, zero hidden spreads, and transfer your Bitcoin to cold storage for maximum peace of mind.',
    highlights: [
      'See total fee breakdowns upfront before confirming any trade',
      'Direct on-chain withdrawals to your personal hardware wallet',
      'Set up App-based Two-Factor Authentication (TOTP) from day one'
    ],
    actionText: 'View Fee Breakdown',
    actionHref: '#fees'
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
            <span>The Trust Pathway</span>
          </div>
          <h2 className="section-title">A Responsible, 4-Step Approach</h2>
          <p className="section-subtitle">
            We reject the frantic "buy now before it’s too late" mentality. Here is the proven path to confident, secure Bitcoin ownership.
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
