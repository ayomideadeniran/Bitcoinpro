'use client';

import React, { useState } from 'react';
import { X, Target, ArrowRight } from 'lucide-react';
import { InvestmentGoal } from '@/lib/types';
import { satsToBtc } from '@/lib/btc-calc';

interface AddGoalModalProps {
  currentBtcPrice: number;
  onClose: () => void;
  onAddGoal: (goal: InvestmentGoal) => void;
}

export default function AddGoalModal({ currentBtcPrice, onClose, onAddGoal }: AddGoalModalProps) {
  const [goalType, setGoalType] = useState<'sats_target' | 'usd_target'>('sats_target');
  const [title, setTitle] = useState('');
  const [targetSats, setTargetSats] = useState<number>(2500000);
  const [targetUsd, setTargetUsd] = useState<number>(2000);
  const [durationMonths, setDurationMonths] = useState<number>(12);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let computedTargetUsd = targetUsd;
    let computedTargetBtc = 0;

    if (goalType === 'sats_target') {
      computedTargetBtc = satsToBtc(targetSats);
      computedTargetUsd = computedTargetBtc * currentBtcPrice;
    } else {
      computedTargetBtc = currentBtcPrice > 0 ? targetUsd / currentBtcPrice : 0;
    }

    const defaultTitle = goalType === 'sats_target'
      ? `Stack ${targetSats.toLocaleString()} Sats`
      : `Invest $${targetUsd.toLocaleString()} in Bitcoin`;

    const newGoal: InvestmentGoal = {
      id: `goal-${Date.now().toString(36)}`,
      title: title.trim() || defaultTitle,
      category: goalType,
      targetAmountUsd: computedTargetUsd,
      targetBtc: computedTargetBtc,
      durationMonths,
      startDate: new Date().toISOString().split('T')[0],
      notes: notes.trim() || undefined,
    };

    onAddGoal(newGoal);
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
          maxWidth: '520px',
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
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Create Investment Goal</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Define a disciplined milestone to keep you focused on accumulation.
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
          {/* Target Type */}
          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Goal Type
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setGoalType('sats_target')}
                style={{
                  padding: '0.65rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  background: goalType === 'sats_target' ? 'var(--brand-btc)' : 'var(--bg-surface-elevated)',
                  color: goalType === 'sats_target' ? '#ffffff' : 'var(--text-muted)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                Satoshis Target (Sats)
              </button>
              <button
                type="button"
                onClick={() => setGoalType('usd_target')}
                style={{
                  padding: '0.65rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  background: goalType === 'usd_target' ? 'var(--brand-btc)' : 'var(--bg-surface-elevated)',
                  color: goalType === 'usd_target' ? '#ffffff' : 'var(--text-muted)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                Total Capital (USD)
              </button>
            </div>
          </div>

          {/* Goal Title */}
          <div>
            <label htmlFor="goal-title" style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Goal Title (Optional)
            </label>
            <input
              id="goal-title"
              type="text"
              placeholder={goalType === 'sats_target' ? 'e.g. Join the 5M Sats Club' : 'e.g. Invest $2,000 in 2026'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-surface-elevated)',
                fontSize: '0.95rem',
              }}
            />
          </div>

          {/* Target Amount */}
          {goalType === 'sats_target' ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <label htmlFor="target-sats" style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Target Satoshis
                </label>
                <span className="mono" style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--brand-btc)' }}>
                  {(targetSats / 100_000_000).toFixed(4)} BTC
                </span>
              </div>
              <input
                id="target-sats"
                type="number"
                min="100000"
                step="500000"
                value={targetSats}
                onChange={(e) => setTargetSats(Math.max(10000, Number(e.target.value)))}
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
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                {[1000000, 2500000, 5000000, 10000000, 21000000].map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setTargetSats(s)}
                    style={{
                      padding: '0.2rem 0.45rem',
                      borderRadius: '0.35rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: targetSats === s ? 'var(--brand-btc)' : 'var(--bg-surface-elevated)',
                      color: targetSats === s ? '#ffffff' : 'var(--text-muted)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    {s >= 1000000 ? `${s / 1000000}M` : `${s / 1000}k`}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <label htmlFor="target-usd" style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Target Investment (USD)
              </label>
              <input
                id="target-usd"
                type="number"
                min="100"
                step="250"
                value={targetUsd}
                onChange={(e) => setTargetUsd(Math.max(50, Number(e.target.value)))}
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
          )}

          {/* Horizon Months */}
          <div>
            <label htmlFor="goal-duration" style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Time Horizon: {durationMonths} Months
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
              {[6, 12, 24, 36].map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setDurationMonths(m)}
                  style={{
                    padding: '0.6rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.825rem',
                    fontWeight: 600,
                    background: durationMonths === m ? 'var(--bg-surface-elevated)' : 'transparent',
                    color: durationMonths === m ? 'var(--brand-btc)' : 'var(--text-muted)',
                    border: '1px solid',
                    borderColor: durationMonths === m ? 'var(--brand-btc)' : 'var(--border-subtle)',
                  }}
                >
                  {m} Months
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem', width: '100%', marginTop: '0.5rem' }}>
            <span>Establish Investment Goal</span>
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
