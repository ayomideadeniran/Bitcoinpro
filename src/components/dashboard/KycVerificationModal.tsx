'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, Lock, UserCheck, FileText, ArrowRight } from 'lucide-react';
import { KycProfile } from '@/lib/types';
import { formatUsd } from '@/lib/btc-calc';
import { saveStoredKycProfile } from '@/lib/kyc-store';

interface KycVerificationModalProps {
  kycProfile: KycProfile;
  onClose: () => void;
  onVerified?: (profile: KycProfile) => void;
}

export default function KycVerificationModal({ kycProfile, onClose, onVerified }: KycVerificationModalProps) {
  const percentUsed = Math.round(((kycProfile.dailyLimitUsd - kycProfile.remainingDailyUsd) / kycProfile.dailyLimitUsd) * 100);
  const isVerified = kycProfile.status === 'verified';
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [documentType, setDocumentType] = useState<'passport' | 'drivers_license' | 'national_id'>('passport');
  const [documentNumber, setDocumentNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !dob || !address || !documentNumber) return;

    setSubmitting(true);

    setTimeout(() => {
      const updated: KycProfile = {
        ...kycProfile,
        tier: 2,
        status: 'verified',
        documentType,
        verifiedAt: new Date().toISOString(),
      };

      saveStoredKycProfile(updated);
      setSubmitted(true);
      onVerified?.(updated);
    }, 1200);
  };

  const resetForm = () => {
    setShowForm(false);
    setSubmitted(false);
    setSubmitting(false);
    setFullName('');
    setDob('');
    setAddress('');
    setDocumentNumber('');
    setDocumentType('passport');
  };

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

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: 'var(--brand-success-bg)',
                color: 'var(--brand-success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
              }}
            >
              <CheckCircle2 size={32} />
            </div>
            <h4 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Verification Submitted
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Your KYC details have been received. Your account will be upgraded to Tier 2 Standard Investor access.
            </p>
            <button onClick={resetForm} className="btn btn-secondary" style={{ padding: '0.75rem 1.25rem' }}>
              Close
            </button>
          </div>
        ) : showForm || !isVerified ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div
              style={{
                padding: '1rem',
                borderRadius: '0.65rem',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                lineHeight: 1.5,
              }}
            >
              {isVerified
                ? 'Your current verification is active. You can update your details below.'
                : 'Complete the form below to verify your identity and unlock higher limits.'}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Full Legal Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-surface-elevated)',
                  fontSize: '0.9rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-surface-elevated)',
                  fontSize: '0.9rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Residential Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-surface-elevated)',
                  fontSize: '0.9rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Document Type</label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-surface-elevated)',
                  fontSize: '0.9rem',
                }}
              >
                <option value="passport">Passport</option>
                <option value="drivers_license">Driver&apos;s License</option>
                <option value="national_id">National ID</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Document Number</label>
              <input
                type="text"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-surface-elevated)',
                  fontSize: '0.9rem',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{ padding: '0.85rem', width: '100%', opacity: submitting ? 0.7 : 1 }}
            >
              <span>{submitting ? 'Submitting...' : 'Submit Verification'}</span>
            </button>
          </form>
        ) : (
          <>
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

            {!isVerified && (
              <button onClick={() => setShowForm(true)} className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', marginBottom: '0.75rem' }}>
                <span>Start Verification</span>
                <ArrowRight size={16} />
              </button>
            )}

            <button onClick={onClose} className="btn btn-secondary" style={{ width: '100%', padding: '0.75rem' }}>
              <span>Close Compliance Center</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}