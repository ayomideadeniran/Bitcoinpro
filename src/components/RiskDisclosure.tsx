'use client';

import React from 'react';
import { AlertOctagon, CheckCircle2, XCircle, ShieldCheck, Lock, Smartphone, Key } from 'lucide-react';

export default function RiskDisclosure() {
  return (
    <section id="risks" className="section-wrapper" style={{ background: 'var(--bg-primary)' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge" style={{ color: 'var(--brand-danger)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
            <AlertOctagon size={14} />
            <span>Consumer Protection &amp; Risk Notice</span>
          </div>
          <h2 className="section-title">Honest Risk Disclosure</h2>
          <p className="section-subtitle">
            Most crypto marketing creates unrealistic euphoria. We believe an informed investor who respects the downside makes the best long-term decisions.
          </p>
        </div>

        {/* What Bitcoin Is vs What Bitcoin Is NOT */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
            maxWidth: '1080px',
            margin: '0 auto 3rem',
          }}
        >
          {/* Card 1: What Bitcoin IS */}
          <div
            className="glass-card"
            style={{
              padding: '2rem',
              borderTop: '4px solid var(--brand-success)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <CheckCircle2 size={22} style={{ color: 'var(--brand-success)' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>What Bitcoin Is</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                <strong style={{ color: 'var(--text-main)' }}>A Scarcity-Capped Digital Commodity:</strong> A decentralized store of value with a hard ceiling of 21,000,000 units.
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                <strong style={{ color: 'var(--text-main)' }}>A Volatile, Emerging Asset:</strong> Prone to rapid double-digit fluctuations and multi-year market cycles.
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                <strong style={{ color: 'var(--text-main)' }}>Sovereign Bearer Asset:</strong> When held in self-custody, nobody can freeze or confiscate your transactions.
              </div>
            </div>
          </div>

          {/* Card 2: What Bitcoin IS NOT */}
          <div
            className="glass-card"
            style={{
              padding: '2rem',
              borderTop: '4px solid var(--brand-danger)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <XCircle size={22} style={{ color: 'var(--brand-danger)' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>What Bitcoin Is NOT</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                <strong style={{ color: 'var(--text-main)' }}>NOT a Guaranteed Profit Machine:</strong> Anyone claiming "daily 2% gains" or "guaranteed monthly return" is running a scam.
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                <strong style={{ color: 'var(--text-main)' }}>NOT Government-Insured:</strong> Bitcoin balances are not insured by the FDIC, FSCS, or SIPC against market loss.
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                <strong style={{ color: 'var(--text-main)' }}>NOT a Substitute for Emergency Cash:</strong> You should never allocate living expenses or debt payments into crypto.
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars of Account & Asset Security */}
        <div
          className="glass-card"
          style={{
            maxWidth: '1080px',
            margin: '0 auto',
            padding: '2.5rem',
            background: 'var(--bg-surface-elevated)',
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 2.5rem' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Security Best Practices to Protect Your Holdings
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Follow these foundational principles to defend against account takeover and social engineering.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '0.5rem', background: 'rgba(247, 147, 26, 0.1)', color: 'var(--brand-btc)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Smartphone size={18} />
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>App-Based 2FA</h4>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Use Google Authenticator or YubiKey. Avoid SMS 2FA, which is vulnerable to SIM-swap attacks.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '0.5rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--brand-info)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Key size={18} />
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Protect Recovery Seed</h4>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Never type your 12 or 24-word recovery phrase into a website, cloud note, or photograph it.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--brand-success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Lock size={18} />
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Cold Storage First</h4>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Keep only what you actively trade on exchanges. Transfer significant savings to offline hardware wallets.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--brand-danger)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={18} />
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Verify URLs</h4>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Bookmark your exchange and verify the SSL domain. Never click on sponsored ads promising bonuses.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
