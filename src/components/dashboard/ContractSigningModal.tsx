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
  const [showSim, setShowSim] = useState(false);
  const [simStep, setSimStep] = useState(0); // 0: Review, 1: Sign, 2: Done
  const [signature, setSignature] = useState('');

  const handleStartSim = () => {
    if (!agreed) return;
    setShowSim(true);
    setSimStep(0);
  };

  const handleAdoptSignature = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signature) return;
    setSimStep(2);
    setTimeout(() => {
      onSigned();
      onClose();
    }, 2000);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 400,
        background: showSim ? 'var(--bg-primary)' : 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: showSim ? '0' : '1.5rem',
        backdropFilter: showSim ? 'none' : 'blur(8px)',
      }}
      onClick={showSim ? undefined : onClose}
    >
      {showSim ? (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-surface)' }}>
          <div style={{ width: '100%', maxWidth: '800px', background: '#fff', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            
            {/* Header */}
            <div style={{ background: '#1c3664', padding: '1.25rem', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FileText size={24} />
                <span style={{ fontWeight: 600 }}>Please Review & Act on These Documents</span>
              </div>
              <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>Powered by eSignature Provider</span>
            </div>

            {/* Document Body */}
            <div style={{ padding: '3rem', color: '#333', background: '#fff', minHeight: '400px' }}>
              {simStep === 0 && (
                <>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem', borderBottom: '2px solid #eee', paddingBottom: '1rem' }}>BitcoinPro Investment Contract</h2>
                  <p style={{ marginBottom: '1rem', lineHeight: 1.6 }}>This binding agreement is between BitcoinPro and <strong>{userName}</strong> ({userEmail}).</p>
                  <p style={{ marginBottom: '1rem', lineHeight: 1.6 }}>By signing below, you agree to the Terms of Service, acknowledge the risks of digital asset trading, and authorize BitcoinPro to manage algorithmic trading on your behalf.</p>
                  
                  <div style={{ marginTop: '4rem', padding: '1rem', border: '2px dashed #ccc', background: '#f9f9f9', display: 'inline-block', cursor: 'pointer' }} onClick={() => setSimStep(1)}>
                    <div style={{ color: '#005cb9', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ background: '#ffcc22', color: '#000', padding: '0.2rem 0.5rem', fontSize: '0.75rem', fontWeight: 700 }}>SIGN</span>
                      Click to sign
                    </div>
                  </div>
                </>
              )}

              {simStep === 1 && (
                <form onSubmit={handleAdoptSignature}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Adopt Your Signature</h2>
                  <p style={{ marginBottom: '2rem', color: '#666' }}>Confirm your name and initials to adopt a signature.</p>
                  
                  <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Full Name</label>
                    <input 
                      type="text" 
                      value={signature}
                      onChange={(e) => setSignature(e.target.value)}
                      placeholder={userName}
                      style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem' }}
                      autoFocus
                      required
                    />
                  </div>

                  <div style={{ padding: '2rem', background: '#f4f4f4', border: '1px solid #ddd', textAlign: 'center', marginBottom: '2rem' }}>
                    <span style={{ fontFamily: '"Brush Script MT", cursive', fontSize: '3rem', color: '#000' }}>
                      {signature || userName}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <button type="button" onClick={() => setSimStep(0)} style={{ padding: '0.75rem 1.5rem', background: 'transparent', border: 'none', color: '#005cb9', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                    <button type="submit" style={{ padding: '0.75rem 1.5rem', background: '#ffcc22', border: 'none', color: '#000', fontWeight: 700, cursor: 'pointer', borderRadius: '2px' }}>Adopt and Sign</button>
                  </div>
                </form>
              )}

              {simStep === 2 && (
                <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                  <CheckCircle2 size={64} style={{ color: '#22c55e', margin: '0 auto 1.5rem' }} />
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>You&apos;re Done!</h2>
                  <p style={{ color: '#666' }}>A copy of this document has been saved to your vault.</p>
                  <p style={{ color: '#999', fontSize: '0.85rem', marginTop: '2rem' }}>Redirecting to dashboard...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
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
            onClick={handleStartSim}
            disabled={!agreed}
            className="btn btn-primary"
            style={{ flex: 2, padding: '0.75rem', opacity: !agreed ? 0.6 : 1 }}
          >
            <ShieldCheck size={16} />
            <span>Sign securely via eSignature</span>
          </button>
        </div>
      </div>
      )}
    </div>
  );
}