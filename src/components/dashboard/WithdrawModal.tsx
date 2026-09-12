'use client';

import React, { useState } from 'react';
import { X, ArrowUpRight, ShieldAlert, Key, Check, Fuel, Smartphone, AlertCircle, Copy, ShieldCheck, Lock } from 'lucide-react';
import { Transaction } from '@/lib/types';
import { formatUsd, formatBtc, formatSats, btcToSats } from '@/lib/btc-calc';

interface WithdrawModalProps {
  totalBtc: number;
  currentBtcPrice: number;
  satsMode: boolean;
  onClose: () => void;
  onConfirmWithdrawal: (tx: Transaction) => void;
  kycStatus: 'verified' | 'pending' | 'unverified';
  onOpenKycModal: () => void;
}

export default function WithdrawModal({
  totalBtc,
  currentBtcPrice,
  satsMode,
  onClose,
  onConfirmWithdrawal,
  kycStatus,
  onOpenKycModal,
}: WithdrawModalProps) {
  const [step, setStep] = useState<'input' | '2fa' | 'success' | 'blocked'>('input');
  const [address, setAddress] = useState('');
  const [amountBtc, setAmountBtc] = useState<number>(Math.min(0.005, totalBtc));
  const [feeSpeed, setFeeSpeed] = useState<'fast' | 'standard' | 'economic'>('standard');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [broadcastTx, setBroadcastTx] = useState<Transaction | null>(null);

  const isKycVerified = kycStatus === 'verified';

  // Address validation: bc1q (Native SegWit), bc1p (Taproot), 1 (Legacy), 3 (Script)
  const isAddressValid =
    address.startsWith('bc1q') ||
    address.startsWith('bc1p') ||
    address.startsWith('1') ||
    address.startsWith('3') ||
    address.length >= 26;

  // Miner fee rates
  const minerFeeMap = {
    fast: { satPerVb: 22, usd: 2.35, minutes: '~10-20 mins' },
    standard: { satPerVb: 14, usd: 1.50, minutes: '~30-60 mins' },
    economic: { satPerVb: 8, usd: 0.85, minutes: '~2-4 hours' },
  };

  const selectedFee = minerFeeMap[feeSpeed];
  const minerFeeBtc = selectedFee.usd / currentBtcPrice;
  const netBtcReceived = Math.max(0, amountBtc - minerFeeBtc);

  const handleProceedTo2FA = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isKycVerified) {
      setStep('blocked');
      return;
    }
    if (!isAddressValid || amountBtc <= 0 || amountBtc > totalBtc) return;
    setStep('2fa');
  };

  const handleFinalBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (twoFactorCode.length < 6) return;

    const tx: Transaction = {
      id: `tx-wd-${Date.now().toString(36)}`,
      date: new Date().toISOString(),
      type: 'withdrawal',
      amountBtc: amountBtc,
      amountUsd: amountBtc * currentBtcPrice,
      pricePerBtc: currentBtcPrice,
      feeUsd: selectedFee.usd,
      status: 'completed',
      recipientAddress: address,
      notes: `Withdrawal to ${address.substring(0, 8)}...${address.substring(address.length - 4)}`,
      txHash: `tx_${Math.random().toString(36).substring(2, 12)}bc1q${Math.random().toString(36).substring(2, 10)}`,
      confirmations: 0,
    };

    setBroadcastTx(tx);
    setStep('success');
    onConfirmWithdrawal(tx);
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
          maxWidth: '540px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '2.5rem',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '0.5rem',
                background: 'var(--brand-btc)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
              }}
            >
              <ArrowUpRight size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Withdraw to Self-Custody</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Send to Hardware or Personal Wallet</span>
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

        {/* STEP 1: CONFIGURE WITHDRAWAL */}
        {step === 'input' && (
          <form onSubmit={handleProceedTo2FA} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Destination Address */}
            <div>
              <label htmlFor="btc-address" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Recipient Bitcoin Address
              </label>
              <input
                id="btc-address"
                type="text"
                placeholder="bc1q... or bc1p... or 3..."
                value={address}
                onChange={(e) => setAddress(e.target.value.trim())}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid',
                  borderColor: address && !isAddressValid ? 'var(--brand-danger)' : 'var(--border-subtle)',
                  background: 'var(--bg-surface-elevated)',
                  fontSize: '0.85rem',
                  fontFamily: 'monospace',
                }}
                required
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.35rem', fontSize: '0.75rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Supports SegWit, Taproot, and Legacy</span>
                <button
                  type="button"
                  onClick={() => setAddress('bc1q9v8k7y8u2p3x6m4a5z1w9t8s7r6q5p4e3d2c1')}
                  style={{ color: 'var(--brand-btc)', fontWeight: 600 }}
                >
                  Use Sample SegWit Address
                </button>
              </div>
            </div>

            {/* Withdrawal Amount */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <label htmlFor="withdraw-amount" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Amount to Withdraw</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Available: {formatBtc(totalBtc, 4)} BTC</span>
                  <button
                    type="button"
                    onClick={() => setAmountBtc(Number(totalBtc.toFixed(6)))}
                    style={{ color: 'var(--brand-btc)', fontWeight: 700 }}
                  >
                    MAX
                  </button>
                </div>
              </div>
              <input
                id="withdraw-amount"
                type="number"
                step="0.0001"
                min="0.0001"
                max={totalBtc}
                value={amountBtc}
                onChange={(e) => setAmountBtc(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-surface-elevated)',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                }}
                required
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.35rem', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>~{formatUsd(amountBtc * currentBtcPrice, 2)} USD</span>
                <span className="mono" style={{ color: 'var(--brand-btc)', fontWeight: 600 }}>
                  {formatSats(btcToSats(amountBtc))} Satoshis
                </span>
              </div>
            </div>

            {/* Miner Fee Speed Selector */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                Network Priority &amp; Miner Fee
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                {[
                  { id: 'fast', title: 'Priority', rate: '22 sat/vB', time: '~10-20 min', cost: '$2.35' },
                  { id: 'standard', title: 'Standard', rate: '14 sat/vB', time: '~30-60 min', cost: '$1.50' },
                  { id: 'economic', title: 'Economic', rate: '8 sat/vB', time: '~2-4 hrs', cost: '$0.85' },
                ].map((f) => {
                  const isSelected = feeSpeed === f.id;
                  return (
                    <button
                      type="button"
                      key={f.id}
                      onClick={() => setFeeSpeed(f.id as any)}
                      style={{
                        padding: '0.75rem 0.5rem',
                        borderRadius: '0.5rem',
                        border: '1px solid',
                        borderColor: isSelected ? 'var(--brand-btc)' : 'var(--border-subtle)',
                        background: isSelected ? 'var(--bg-surface-elevated)' : 'transparent',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: isSelected ? 'var(--brand-btc)' : 'var(--text-main)' }}>
                        {f.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{f.cost}</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-faint)' }}>{f.time}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Summary Box */}
            <div
              style={{
                background: 'var(--bg-surface-elevated)',
                borderRadius: '0.65rem',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                fontSize: '0.85rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Gross Withdrawal:</span>
                <span className="mono" style={{ fontWeight: 600 }}>{formatBtc(amountBtc, 6)} BTC</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Network Miner Fee:</span>
                <span className="mono" style={{ fontWeight: 600 }}>{formatUsd(selectedFee.usd, 2)} ({selectedFee.satPerVb} sat/vB)</span>
              </div>
              <div
                style={{
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '0.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: 700,
                }}
              >
                <span>Estimated Net to Wallet:</span>
                <span className="mono" style={{ color: 'var(--brand-btc)' }}>{formatBtc(netBtcReceived, 6)} BTC</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={!isAddressValid || amountBtc <= 0}
              className="btn btn-primary"
              style={{ padding: '0.85rem', width: '100%', opacity: !isAddressValid || amountBtc <= 0 ? 0.6 : 1 }}
            >
              <span>Continue to 2FA Confirmation</span>
            </button>
          </form>
        )}

        {/* KYC BLOCKED STATE */}
        {step === 'blocked' && (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: 'var(--brand-danger-bg)',
                color: 'var(--brand-danger)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
              }}
            >
              <Lock size={32} />
            </div>
            <h4 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              KYC Verification Required
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Withdrawals are restricted until identity verification is complete. Please complete KYC to unlock withdrawals.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => setStep('input')} className="btn btn-secondary" style={{ flex: 1, padding: '0.75rem' }}>
                Back
              </button>
              <button onClick={onOpenKycModal} className="btn btn-primary" style={{ flex: 2, padding: '0.75rem' }}>
                <ShieldCheck size={16} />
                <span>Complete KYC Verification</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: 2FA SECURITY CONFIRMATION */}
        {step === '2fa' && (
          <form onSubmit={handleFinalBroadcast} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div
              style={{
                padding: '1rem',
                borderRadius: '0.65rem',
                background: 'var(--brand-danger-bg)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.65rem',
              }}
            >
              <ShieldAlert size={20} style={{ color: 'var(--brand-danger)', flexShrink: 0, marginTop: '2px' }} />
              <p style={{ fontSize: '0.8rem', lineHeight: 1.4 }}>
                <strong>Irreversible Blockchain Action:</strong> Once confirmed, on-chain Bitcoin transactions cannot be cancelled or refunded. Ensure your destination address is correct.
              </p>
            </div>

            <div>
              <label htmlFor="2fa-token" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Enter Authenticator 2FA Code
              </label>
              <div style={{ position: 'relative' }}>
                <Smartphone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="2fa-token"
                  type="text"
                  placeholder="6-digit code (e.g. 849201)"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.25rem',
                    borderRadius: '0.5rem',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-surface-elevated)',
                    fontSize: '1rem',
                    fontFamily: 'monospace',
                    letterSpacing: '0.2em',
                  }}
                  required
                  maxLength={6}
                />
              </div>
              <div style={{ textAlign: 'right', marginTop: '0.35rem' }}>
                <button
                  type="button"
                  onClick={() => setTwoFactorCode('849201')}
                  style={{ fontSize: '0.75rem', color: 'var(--brand-btc)', fontWeight: 600 }}
                >
                  Quick Fill Demo Code (849201)
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setStep('input')}
                className="btn btn-secondary"
                style={{ flex: 1, padding: '0.75rem' }}
              >
                Back
              </button>
              <button
                type="submit"
                disabled={twoFactorCode.length < 6}
                className="btn btn-primary"
                style={{ flex: 2, padding: '0.75rem', opacity: twoFactorCode.length < 6 ? 0.6 : 1 }}
              >
                <span>Authorize &amp; Broadcast</span>
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: SUCCESSFUL BROADCAST */}
        {step === 'success' && broadcastTx && (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
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
              <Check size={32} />
            </div>
            <h4 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.25rem' }}>
              Withdrawal Broadcasted!
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Transaction published to the Bitcoin mempool and awaiting inclusion in the next block.
            </p>

            <div
              style={{
                background: 'var(--bg-surface-elevated)',
                borderRadius: '0.65rem',
                padding: '1rem 1.25rem',
                marginBottom: '1.5rem',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                fontSize: '0.85rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Amount Sent:</span>
                <span className="mono" style={{ fontWeight: 700, color: 'var(--brand-btc)' }}>
                  {formatBtc(broadcastTx.amountBtc, 6)} BTC
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Destination:</span>
                <span className="mono" style={{ fontSize: '0.75rem' }}>{broadcastTx.recipientAddress?.substring(0, 16)}...</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Transaction ID:</span>
                <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--brand-info)' }}>{broadcastTx.txHash}</span>
              </div>
            </div>

            <button onClick={onClose} className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
              <span>Done</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
