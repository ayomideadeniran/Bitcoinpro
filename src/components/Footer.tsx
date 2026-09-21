'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, ExternalLink, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      style={{
        background: 'var(--bg-primary)',
        borderTop: '1px solid var(--border-subtle)',
        padding: '4.5rem 0 2.5rem',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '3rem',
            marginBottom: '3.5rem',
          }}
        >
          {/* Col 1: Brand & Mission */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <img
                src="/icon.png"
                alt="Starknet Logo"
                width={34}
                height={34}
                style={{
                  borderRadius: '50%',
                  objectFit: 'contain',
                  boxShadow: '0 4px 12px rgba(236, 121, 107, 0.35)',
                }}
              />
              <span style={{ fontSize: '1.3rem', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
                Stark<span style={{ color: '#ec796b' }}>net</span>
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              A modern, trusted platform empowering everyday individuals to understand Bitcoin, practice disciplined recurring investing, and protect their sovereign financial future.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
              <Lock size={14} style={{ color: 'var(--brand-success)' }} />
              <span>TLS 1.3 256-bit Encrypted Platform</span>
            </div>
          </div>

          {/* Col 2: Education & Tools */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '1.25rem' }}>
              Education &amp; Tools
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <li><a href="#how-it-works" style={{ transition: 'color 0.15s' }}>How Expert Trading Works</a></li>
              <li><a href="#calculator" style={{ transition: 'color 0.15s' }}>Projected Yield Calculator</a></li>
              <li><a href="#mining" style={{ transition: 'color 0.15s' }}>Mining Operations</a></li>
              <li><a href="#education" style={{ transition: 'color 0.15s' }}>Interactive Knowledge Quiz</a></li>
              <li><a href="#fees" style={{ transition: 'color 0.15s' }}>Mempool Fee Tracker</a></li>
            </ul>
          </div>

          {/* Col 3: Security & Governance */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '1.25rem' }}>
              Security &amp; Policy
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <li><a href="#risks" style={{ transition: 'color 0.15s' }}>Risk Disclosure Statement</a></li>
              <li><a href="#fees" style={{ transition: 'color 0.15s' }}>Fee Schedule &amp; Spreads</a></li>
              <li><a href="#risks" style={{ transition: 'color 0.15s' }}>Custody &amp; Key Management</a></li>
              <li><a href="#faq" style={{ transition: 'color 0.15s' }}>Anti-Phishing Guide</a></li>
              <li><Link href="/support" style={{ transition: 'color 0.15s' }}>Help &amp; Support Center</Link></li>
            </ul>
          </div>

          {/* Col 4: Trust Commitment */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '1.25rem' }}>
              Our Trust Commitment
            </h4>
            <div
              style={{
                padding: '1rem',
                borderRadius: '0.65rem',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.825rem',
                color: 'var(--text-muted)',
                lineHeight: 1.5,
              }}
            >
              We do not provide investment advice, promise fixed yields, or sell predatory trading signals. Our objective is educational empowerment and financial resilience.
            </div>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div
          style={{
            padding: '1.25rem',
            borderRadius: '0.75rem',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.775rem',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            marginBottom: '2rem',
          }}
        >
          <strong style={{ color: 'var(--text-main)' }}>Regulatory Disclaimer:</strong> Bitcoin is not legal tender in most jurisdictions and is not backed by any government or central authority. The value of cryptocurrency can decrease as well as increase, and you could lose all of the capital you invest. Performance data and calculator simulations are provided for educational and illustrative purposes only and do not constitute investment, financial, tax, or legal advice.
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.825rem',
            color: 'var(--text-muted)',
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} Starknet Protocol. Built for cryptographic security and financial sovereignty.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#risks">Terms</a>
            <a href="#risks">Privacy</a>
            <a href="#risks">Disclosures</a>
            <a href="#fees">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
