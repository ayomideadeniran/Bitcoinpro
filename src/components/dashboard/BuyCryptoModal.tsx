'use client';

import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, CreditCard, Building2, Smartphone, ArrowRight, Check, AlertCircle, Clock, Lock, FileText } from 'lucide-react';
import { Transaction, PaymentMethodType } from '@/lib/types';
import { formatUsd, formatBtc, formatSats, btcToSats } from '@/lib/btc-calc';

interface BuyCryptoModalProps {
  currentBtcPrice: number;
  satsMode: boolean;
  onClose: () => void;
  onSuccess: (tx: Transaction) => void;
  contractSigned: boolean;
  onOpenContractModal: () => void;
}

export default function BuyCryptoModal({
  currentBtcPrice,
  satsMode,
  onClose,
  onSuccess,
  contractSigned,
  onOpenContractModal,
}: BuyCryptoModalProps) {
  const [step, setStep] = useState<'configure' | 'review' | 'processing' | 'success' | 'blocked'>('configure');
  const [amountUsd, setAmountUsd] = useState<number>(100);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('ach_bank');
  const [rateLockSeconds, setRateLockSeconds] = useState<number>(60);
  const [lockedPrice, setLockedPrice] = useState<number>(currentBtcPrice);
  const [completedTx, setCompletedTx] = useState<Transaction | null>(null);

  // Rate Lock Timer
  useEffect(() => {
    if (step === 'processing' || step === 'success') return;
    const timer = setInterval(() => {
      setRateLockSeconds((prev) => {
        if (prev <= 1) {
          setLockedPrice(currentBtcPrice);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentBtcPrice, step]);

  const feeRate = paymentMethod === 'ach_bank' ? 0.0049 : 0.0149;
  const platformFee = amountUsd * feeRate;
  const networkMinerFee = 1.75;
  const totalCharged = amountUsd + platformFee + networkMinerFee;
  const btcReceived = lockedPrice > 0 ? amountUsd / lockedPrice : 0;
  const satsReceived = btcToSats(btcReceived);

  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (amountUsd <= 0) return;
    if (!contractSigned) {
      setStep('blocked');
      return;
    }
    setStep('review');
  };

  const handleConfirmPurchase = () => {
    if (!contractSigned) {
      setStep('blocked');
      return;
    }
    setStep('processing');

    setTimeout(() => {
      const newTx: Transaction = {
        id: `tx-${Date.now().toString(36)}`,
        date: new Date().toISOString(),
        type: 'spot_buy',
        amountBtc: btcReceived,
        amountUsd: amountUsd,
        pricePerBtc: lockedPrice,
        feeUsd: platformFee + networkMinerFee,
        status: 'completed',
        notes: `Bought via ${paymentMethod === 'ach_bank' ? 'Bank ACH' : 'Card'}`,
        txHash: `bc1p${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 6)}`,
      };

      setCompletedTx(newTx);
      setStep('success');
      onSuccess(newTx);
    }, 1500);
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
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Buy Bitcoin</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Regulated On-Ramp Checkout</span>
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

        {/* STEP 1: CONFIGURE */}
        {step === 'configure' && (
          <form onSubmit={handleProceedToReview} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Rate Lock Badge */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.65rem 1rem',
                borderRadius: '0.5rem',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.8rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
                <Clock size={14} />
                <span>Price Locked: <strong>{formatUsd(lockedPrice, 0)}</strong></span>
              </div>
              <span className="pill pill-btc" style={{ fontSize: '0.7rem' }}>
                Refreshes in {rateLockSeconds}s
              </span>
            </div>

            {/* Amount Input */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <label htmlFor="buy-usd-amount" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Amount to Spend</label>
                <span className="mono" style={{ fontWeight: 700, color: 'var(--brand-btc)' }}>
                  {satsMode ? `~${formatSats(satsReceived)} sats` : `~${formatBtc(btcReceived, 6)} BTC`}
                </span>
              </div>
              <input
                id="buy-usd-amount"
                type="number"
                min="10"
                max="10000"
                step="25"
                value={amountUsd}
                onChange={(e) => setAmountUsd(Math.max(1, Number(e.target.value)))}
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-surface-elevated)',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                }}
                required
              />
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                {[25, 50, 100, 250, 500, 1000].map((v) => (
                  <button
                    type="button"
                    key={v}
                    onClick={() => setAmountUsd(v)}
                    style={{
                      padding: '0.25rem 0.55rem',
                      borderRadius: '0.35rem',
                      fontSize: '0.775rem',
                      fontWeight: 600,
                      background: amountUsd === v ? 'var(--brand-btc)' : 'var(--bg-surface-elevated)',
                      color: amountUsd === v ? '#ffffff' : 'var(--text-muted)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    ${v}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                Payment Method
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {[
                  {
                    id: 'ach_bank',
                    title: 'Bank ACH Transfer (Recommended)',
                    feeText: '0.49% Fee &bull; 1-2 min verification',
                    icon: Building2,
                  },
                  {
                    id: 'debit_card',
                    title: 'Debit / Credit Card',
                    feeText: '1.49% Fee &bull; Instant execution',
                    icon: CreditCard,
                  },
                  {
                    id: 'apple_pay',
                    title: 'Apple Pay / Google Pay',
                    feeText: '1.49% Fee &bull; 1-Tap checkout',
                    icon: Smartphone,
                  },
                ].map((p) => {
                  const Icon = p.icon;
                  const isSelected = paymentMethod === p.id;
                  return (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => setPaymentMethod(p.id as any)}
                      style={{
                        padding: '0.85rem 1rem',
                        borderRadius: '0.6rem',
                        border: '1px solid',
                        borderColor: isSelected ? 'var(--brand-btc)' : 'var(--border-subtle)',
                        background: isSelected ? 'var(--bg-surface-elevated)' : 'var(--bg-surface)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '0.4rem',
                            background: isSelected ? 'var(--brand-btc)' : 'var(--bg-surface-elevated)',
                            color: isSelected ? '#ffffff' : 'var(--text-muted)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Icon size={16} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
                            {p.title}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {p.feeText}
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          border: '2px solid',
                          borderColor: isSelected ? 'var(--brand-btc)' : 'var(--border-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {isSelected && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--brand-btc)' }} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem', width: '100%' }}>
              <span>Review Order Details</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* CONTRACT BLOCKED STATE */}
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
              <FileText size={32} />
            </div>
            <h4 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Investment Agreement Required
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              You must review and sign the BitcoinPro Investment Agreement before purchasing Bitcoin. This is a one-time requirement.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => setStep('configure')} className="btn btn-secondary" style={{ flex: 1, padding: '0.75rem' }}>
                Back
              </button>
              <button onClick={onOpenContractModal} className="btn btn-primary" style={{ flex: 2, padding: '0.75rem' }}>
                <FileText size={16} />
                <span>Sign Investment Agreement</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: REVIEW & RATE LOCK CONFIRMATION */}
        {step === 'review' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div
              style={{
                padding: '1rem',
                borderRadius: '0.65rem',
                background: 'rgba(236, 121, 107, 0.08)',
                border: '1px solid rgba(236, 121, 107, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Estimated Delivery</span>
                <div className="mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--brand-btc)' }}>
                  {satsMode ? `${formatSats(satsReceived)} sats` : `${formatBtc(btcReceived, 6)} BTC`}
                </div>
              </div>
              <div className="pill pill-btc" style={{ fontSize: '0.75rem' }}>
                Rate Lock: {rateLockSeconds}s
              </div>
            </div>

            {/* Complete Itemized Transparency Receipt */}
            <div
              style={{
                background: 'var(--bg-surface-elevated)',
                borderRadius: '0.75rem',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                fontSize: '0.875rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Purchase Principal</span>
                <span className="mono" style={{ fontWeight: 600 }}>{formatUsd(amountUsd, 2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Locked BTC Price</span>
                <span className="mono" style={{ fontWeight: 600 }}>{formatUsd(lockedPrice, 0)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Payment Provider Fee ({(feeRate * 100).toFixed(2)}%)</span>
                <span className="mono" style={{ fontWeight: 600 }}>{formatUsd(platformFee, 2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Bitcoin Miner Network Fee</span>
                <span className="mono" style={{ fontWeight: 600 }}>{formatUsd(networkMinerFee, 2)}</span>
              </div>
              <div
                style={{
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '0.75rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: 700,
                  fontSize: '1rem',
                }}
              >
                <span>Total Amount Charged</span>
                <span className="mono" style={{ color: 'var(--text-main)' }}>{formatUsd(totalCharged, 2)}</span>
              </div>
            </div>

            {/* Compliance Guarantee */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.775rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
              <Lock size={14} style={{ color: 'var(--brand-success)', flexShrink: 0, marginTop: '2px' }} />
              <span>
                Regulated execution. Transactions are legally protected and immediately credited to your self-directed portfolio ledger.
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setStep('configure')}
                className="btn btn-secondary"
                style={{ flex: 1, padding: '0.75rem' }}
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleConfirmPurchase}
                className="btn btn-primary"
                style={{ flex: 2, padding: '0.75rem' }}
              >
                <span>Authorize &amp; Execute</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PROCESSING ANIMATION */}
        {step === 'processing' && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <div
              className="floating-element"
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'var(--brand-btc)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                margin: '0 auto 1.5rem',
              }}
            >
              <ShieldCheck size={32} />
            </div>
            <h4 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Authorizing Regulated Order...
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Locking quote and broadcasting on-chain delivery allocation.
            </p>
          </div>
        )}

        {/* STEP 4: SUCCESS CONFIRMATION */}
        {step === 'success' && completedTx && (
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
            <h4 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.25rem' }}>
              Purchase Successful!
            </h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Your Bitcoin allocation has been added to your portfolio balance.
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
                gap: '0.4rem',
                fontSize: '0.85rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Acquired:</span>
                <span className="mono" style={{ fontWeight: 700, color: 'var(--brand-btc)' }}>
                  {satsMode ? `${formatSats(btcToSats(completedTx.amountBtc))} sats` : `${formatBtc(completedTx.amountBtc, 6)} BTC`}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Total Charged:</span>
                <span className="mono" style={{ fontWeight: 600 }}>{formatUsd(totalCharged, 2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Tx Reference:</span>
                <span className="mono" style={{ fontSize: '0.75rem' }}>{completedTx.txHash}</span>
              </div>
            </div>

            <button onClick={onClose} className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
              <span>Return to Portfolio</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
