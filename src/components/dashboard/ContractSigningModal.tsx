'use client';

import React, { useState } from 'react';
import { X, FileText, CheckCircle2, ShieldCheck } from 'lucide-react';

interface ContractSigningModalProps {
  userName: string;
  userEmail: string;
  onClose: () => void;
  onSigned: () => void;
}

export default function ContractSigningModal({ userName, userEmail, onClose, onSigned }: ContractSigningModalProps) {
  const [agreed, setAgreed] = useState(false);
  const [signing, setSigning] = useState(false);

  const handleSign = () => {
    if (!agreed) return;
    setSigning(true);
    setTimeout(() => {
      onSigned();
      onClose();
    }, 800);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 400,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        backdropFilter: 'blur(8px)',
      }}
      onClick={onClose}
    >
      <div
        className="glass-card"
        style={{
          maxWidth: '640px',
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
                background: 'var(--brand-info)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
              }}
            >
              <FileText size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Investment &amp; Compliance Agreement</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Required before investing</span>
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

        {/* Contract Content */}
        <div
          style={{
            padding: '1.25rem',
            borderRadius: '0.75rem',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '1.5rem',
            fontSize: '0.85rem',
            lineHeight: 1.6,
            color: 'var(--text-main)',
          }}
        >
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem' }}>BitcoinPro Investment Agreement v1.0</h4>
          <p style={{ marginBottom: '0.75rem' }}>
            This agreement is entered into between <strong>{userName || 'the Investor'}</strong> ({userEmail}) and BitcoinPro Global (&quot;Platform&quot;).
          </p>
          <p style={{ marginBottom: '0.75rem' }}>
            <strong>1. Purpose:</strong> The Investor acknowledges that BitcoinPro provides access to Bitcoin investment tools, portfolio tracking, and on-chain transaction management for informational and execution purposes only.
          </p>
          <p style={{ marginBottom: '0.75rem' }}>
            <strong>2. KYC &amp; AML Compliance:</strong> The Investor agrees to complete identity verification (KYC) before any withdrawal or regulated investment activity. False information may result in account suspension.
          </p>
          <p style={{ marginBottom: '0.75rem' }}>
            <strong>3. Risk Disclosure:</strong> Bitcoin and digital assets are volatile. Past performance does not guarantee future results. The Investor is solely responsible for their investment decisions.
          </p>
          <p style={{ marginBottom: '0.75rem' }}>
            <strong>4. Regulatory:</strong> The Investor confirms they are not located in a restricted jurisdiction and will comply with all applicable laws including FinCEN and MiCA guidelines.
          </p>
          <p>
            <strong>5. Agreement:</strong> By signing below, the Investor accepts these terms and authorizes BitcoinPro to process investments and withdrawals subject to compliance checks.
          </p>
        </div>

        {/* Agreement Checkbox */}
        <div
          style={{
            padding: '1rem',
            borderRadius: '0.65rem',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '1.25rem',
          }}
        >
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              style={{ marginTop: '0.25rem', width: '18px', height: '18px', accentColor: 'var(--brand-btc)' }}
            />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
              I have read and agree to the BitcoinPro Investment Agreement, Risk Disclosure, and KYC/AML Compliance terms. I understand that withdrawal and investment features are subject to identity verification.
            </span>
          </label>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            style={{ flex: 1, padding: '0.75rem' }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSign}
            disabled={!agreed || signing}
            className="btn btn-primary"
            style={{ flex: 2, padding: '0.75rem', opacity: !agreed || signing ? 0.6 : 1 }}
          >
            {signing ? (
              <span>Signing Agreement...</span>
            ) : (
              <>
                <ShieldCheck size={16} />
                <span>Sign &amp; Accept Agreement</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}