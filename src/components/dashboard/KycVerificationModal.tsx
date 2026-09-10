'use client';

import React from 'react';
import { X, ShieldCheck, CheckCircle2, Lock, UserCheck, FileText, ArrowRight } from 'lucide-react';
import { KycProfile } from '@/lib/types';
import { formatUsd } from '@/lib/btc-calc';

interface KycVerificationModalProps {
  kycProfile: KycProfile;
  onClose: () => void;
}

export default function KycVerificationModal({ kycProfile, onClose }: KycVerificationModalProps) {
  const percentUsed = Math.round(((kycProfile.dailyLimitUsd - kycProfile.remainingDailyUsd) / kycProfile.dailyLimitUsd) * 100);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 300,
        background: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        backdropFilter: 'blur(6px)',
      }}
      onClick={onClose}
    >
      <div
        className="glass-card"
        style={{
          maxWidth: '560px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '2.5rem',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '0.5rem',
                background: 'var(--brand-success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
              }}
            >
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Identity &amp; Limits Verification</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>KYC / AML Compliance Status</span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              padding: '0.4rem',
              borderRadius: '0.4rem',
              background: 'var(--bg-surface-elevated)',
              color: 'var(--text-main)',
            }}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Current Tier Overview */}
        <div
          style={{
            padding: '1.25rem',
            borderRadius: '0.75rem',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Current Verification</span>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--brand-success)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <UserCheck size={18} />
                <span>Tier 2: Standard Investor</span>
              </div>
            </div>
            <span className="pill pill-success">Verified Active</span>
          </div>

          {/* Daily Limit Progress */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.35rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Daily Available: {formatUsd(kycProfile.remainingDailyUsd, 0)}</span>
            <span className="mono" style={{ fontWeight: 600 }}>Limit: {formatUsd(kycProfile.dailyLimitUsd, 0)} / day</span>
          </div>
          <div style={{ height: '6px', borderRadius: '3px', background: 'var(--border-subtle)', overflow: 'hidden' }}>
            <div style={{ width: `${100 - percentUsed}%`, height: '100%', background: 'var(--brand-success)', borderRadius: '3px' }} />
          </div>
        </div>

        {/* Verification Tiers Comparison */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Compliance Tier Thresholds
          </h4>

          {/* Tier 1 */}
          <div style={{ padding: '0.85rem 1rem', borderRadius: '0.5rem', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>Tier 1: Starter</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verified Email &bull; Phone Number</div>
            </div>
            <div className="mono" style={{ fontWeight: 600, fontSize: '0.85rem' }}>$500 / day</div>
          </div>

          {/* Tier 2 (Current) */}
          <div style={{ padding: '0.85rem 1rem', borderRadius: '0.5rem', background: 'var(--brand-success-bg)', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--brand-success)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span>Tier 2: Standard (Your Level)</span>
                <CheckCircle2 size={14} />
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Passport / Gov ID Verified &bull; Liveness passed</div>
            </div>
            <div className="mono" style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--brand-success)' }}>$10,000 / day</div>
          </div>

          {/* Tier 3 */}
          <div style={{ padding: '0.85rem 1rem', borderRadius: '0.5rem', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>Tier 3: Enhanced Institutional</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Proof of Address &bull; Source of Wealth verification</div>
            </div>
            <div className="mono" style={{ fontWeight: 600, fontSize: '0.85rem' }}>$100,000 / day</div>
          </div>
        </div>

        {/* Security & Regulatory Note */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '1.5rem' }}>
          <Lock size={14} style={{ color: 'var(--brand-info)', flexShrink: 0, marginTop: '2px' }} />
          <span>
            Identity documents are encrypted and audited according to FinCEN and European MiCA regulatory frameworks. Personal data is never sold to third parties.
          </span>
        </div>

        <button onClick={onClose} className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
          <span>Close Compliance Center</span>
        </button>
      </div>
    </div>
  );
}
