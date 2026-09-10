'use client';

import React, { useState } from 'react';
import { X, DollarSign, Fuel, Shield, CheckCircle, ArrowRight } from 'lucide-react';
import { Transaction } from '@/lib/types';
import { formatUsd, formatBtc, formatSats, btcToSats } from '@/lib/btc-calc';

interface AddTransactionModalProps {
  currentBtcPrice: number;
  satsMode: boolean;
  onClose: () => void;
  onAddTransaction: (tx: Transaction) => void;
}

export default function AddTransactionModal({
  currentBtcPrice,
  satsMode,
  onClose,
  onAddTransaction,
}: AddTransactionModalProps) {
  const [txType, setTxType] = useState<'spot_buy' | 'recurring_buy' | 'transfer_in' | 'sell'>('spot_buy');
  const [amountUsd, setAmountUsd] = useState<number>(250);
  const [customPrice, setCustomPrice] = useState<number>(Math.round(currentBtcPrice));
  const [notes, setNotes] = useState<string>('');

  const effectivePrice = Number(customPrice) || currentBtcPrice;
  const platformFee = txType === 'transfer_in' ? 0 : amountUsd * 0.0049;
  const networkFee = txType === 'transfer_in' ? 0 : 1.85;
  const totalCharged = amountUsd + platformFee + networkFee;
  const btcAmount = effectivePrice > 0 ? amountUsd / effectivePrice : 0;
  const satsAmount = btcToSats(btcAmount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amountUsd <= 0 || effectivePrice <= 0) return;

    const newTx: Transaction = {
      id: `tx-${Date.now().toString(36)}`,
      date: new Date().toISOString(),
      type: txType,
      amountBtc: btcAmount,
      amountUsd: amountUsd,
      pricePerBtc: effectivePrice,
      feeUsd: platformFee + networkFee,
      status: 'completed',
      notes: notes.trim() || (txType === 'recurring_buy' ? 'Automated DCA buy' : 'Spot purchase'),
      txHash: `${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 6)}`,
    };

    onAddTransaction(newTx);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 250,
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
          padding: '2.25rem',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Record / Simulate Purchase</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Add a new transaction to update your live portfolio balance.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '0.4rem',
              borderRadius: '0.4rem',
              background: 'var(--bg-surface-elevated)',
              color: 'var(--text-main)',
            }}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Type Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Transaction Type
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {[
                { id: 'spot_buy', label: 'Spot Buy' },
                { id: 'recurring_buy', label: 'DCA Buy' },
                { id: 'transfer_in', label: 'Transfer In' },
              ].map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setTxType(t.id as any)}
                  style={{
                    padding: '0.6rem 0.5rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    background: txType === t.id ? 'var(--brand-btc)' : 'var(--bg-surface-elevated)',
                    color: txType === t.id ? '#ffffff' : 'var(--text-muted)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <label htmlFor="modal-amount" style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                Amount (USD)
              </label>
              <span className="mono" style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--brand-btc)' }}>
                ${amountUsd}
              </span>
            </div>
            <input
              id="modal-amount"
              type="number"
              min="5"
              step="10"
              value={amountUsd}
              onChange={(e) => setAmountUsd(Math.max(1, Number(e.target.value)))}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-surface-elevated)',
                fontSize: '1rem',
                fontWeight: 600,
              }}
              required
            />
            {/* Quick chips */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              {[50, 100, 250, 500, 1000].map((v) => (
                <button
                  type="button"
                  key={v}
                  onClick={() => setAmountUsd(v)}
                  style={{
                    padding: '0.2rem 0.5rem',
                    borderRadius: '0.35rem',
                    fontSize: '0.75rem',
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

          {/* Execution Price */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <label htmlFor="modal-price" style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                Bitcoin Purchase Price (USD)
              </label>
              <button
                type="button"
                onClick={() => setCustomPrice(Math.round(currentBtcPrice))}
                style={{ fontSize: '0.75rem', color: 'var(--brand-btc)', fontWeight: 600 }}
              >
                Use Live Rate (${Math.round(currentBtcPrice).toLocaleString()})
              </button>
            </div>
            <input
              id="modal-price"
              type="number"
              min="1000"
              step="100"
              value={customPrice}
              onChange={(e) => setCustomPrice(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-surface-elevated)',
                fontSize: '1rem',
                fontWeight: 600,
              }}
              required
            />
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="modal-notes" style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Personal Notes (Optional)
            </label>
            <input
              id="modal-notes"
              type="text"
              placeholder="e.g. End of month savings"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 1rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-surface-elevated)',
                fontSize: '0.9rem',
              }}
            />
          </div>

          {/* Summary Box */}
          <div
            style={{
              padding: '1rem 1.25rem',
              borderRadius: '0.65rem',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Estimated Bitcoin Acquired:</span>
              <span className="mono" style={{ fontWeight: 700, color: 'var(--brand-btc)' }}>
                {satsMode ? `${formatSats(satsAmount)} sats` : `${formatBtc(btcAmount, 6)} BTC`}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Fees (Platform + Network):</span>
              <span className="mono" style={{ fontWeight: 600 }}>{formatUsd(platformFee + networkFee, 2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', fontWeight: 700, borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem' }}>
              <span>Total Capital Charged:</span>
              <span className="mono">{formatUsd(totalCharged, 2)}</span>
            </div>
          </div>

          {/* Submit Action */}
          <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem', width: '100%' }}>
            <span>Confirm &amp; Record Transaction</span>
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
