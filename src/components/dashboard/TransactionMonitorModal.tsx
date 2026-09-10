'use client';

import React from 'react';
import { X, CheckCircle2, Clock, Layers, ArrowUpRight, Copy, ShieldCheck } from 'lucide-react';
import { Transaction } from '@/lib/types';
import { formatUsd, formatBtc, formatSats, btcToSats } from '@/lib/btc-calc';

interface TransactionMonitorModalProps {
  transaction: Transaction;
  satsMode: boolean;
  onClose: () => void;
}

export default function TransactionMonitorModal({
  transaction,
  satsMode,
  onClose,
}: TransactionMonitorModalProps) {
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
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--brand-btc)',
              }}
            >
              <Layers size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>On-Chain Monitor</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mempool &amp; Block Verification</span>
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

        {/* 4-Stage Blockchain Pipeline Visualizer */}
        <div
          style={{
            padding: '1.5rem 1.25rem',
            borderRadius: '0.75rem',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1rem', fontWeight: 700 }}>
            Settlement Lifecycle
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
            {[
              { label: 'Authorized', done: true },
              { label: 'Broadcasting', done: true },
              { label: 'In Mempool', done: true },
              { label: 'Confirmed', done: transaction.status === 'completed' },
            ].map((st, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: st.done ? 'var(--brand-success)' : 'var(--border-subtle)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                  }}
                >
                  ✓
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 600, color: st.done ? 'var(--text-main)' : 'var(--text-muted)' }}>
                  {st.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Itemized Tx Ledger Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Transaction ID</span>
            <span className="mono" style={{ fontSize: '0.75rem' }}>{transaction.id}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Type</span>
            <span className="pill pill-btc" style={{ textTransform: 'capitalize', fontSize: '0.7rem' }}>
              {transaction.type.replace('_', ' ')}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Amount</span>
            <span className="mono" style={{ fontWeight: 700, color: 'var(--brand-btc)' }}>
              {satsMode ? `${formatSats(btcToSats(transaction.amountBtc))} sats` : `${formatBtc(transaction.amountBtc, 6)} BTC`}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Fiat Equivalent</span>
            <span className="mono" style={{ fontWeight: 600 }}>{formatUsd(transaction.amountUsd, 2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Fees Paid</span>
            <span className="mono">{formatUsd(transaction.feeUsd, 2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Network Hash</span>
            <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--brand-info)' }}>
              {transaction.txHash || 'Pending'}
            </span>
          </div>
        </div>

        <button onClick={onClose} className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
          <span>Done</span>
        </button>
      </div>
    </div>
  );
}
