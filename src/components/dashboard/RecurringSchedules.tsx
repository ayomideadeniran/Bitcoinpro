'use client';

import React, { useState } from 'react';
import { RefreshCw, Play, Pause, XCircle, Plus, Calendar, ShieldCheck, AlertCircle } from 'lucide-react';
import { RecurringSchedule, PaymentMethodType } from '@/lib/types';
import { formatUsd } from '@/lib/btc-calc';

interface RecurringSchedulesProps {
  schedules: RecurringSchedule[];
  onToggleSchedule: (id: string) => void;
  onCancelSchedule: (id: string) => void;
  onAddSchedule: (schedule: RecurringSchedule) => void;
}

export default function RecurringSchedules({
  schedules,
  onToggleSchedule,
  onCancelSchedule,
  onAddSchedule,
}: RecurringSchedulesProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [amountUsd, setAmountUsd] = useState(25);
  const [frequency, setFrequency] = useState<'weekly' | 'biweekly' | 'monthly'>('weekly');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('ach_bank');

  const handleCreateSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (amountUsd <= 0) return;

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + (frequency === 'weekly' ? 7 : frequency === 'biweekly' ? 14 : 30));

    const newSchedule: RecurringSchedule = {
      id: `rec-${Date.now().toString(36)}`,
      amountUsd,
      frequency,
      paymentMethod,
      startDate: new Date().toISOString().split('T')[0],
      nextRunDate: nextDate.toISOString().split('T')[0],
      status: 'active',
      totalInvestedUsd: 0,
      executionCount: 0,
    };

    onAddSchedule(newSchedule);
    setIsCreating(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800 }}>Automated Recurring DCA</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Disciplined, hands-off dollar-cost averaging directly from your bank or card.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="btn btn-primary"
          style={{ padding: '0.55rem 1.15rem', fontSize: '0.85rem' }}
        >
          <Plus size={16} />
          <span>New Recurring Plan</span>
        </button>
      </div>

      {/* Mandatory Disclaimer */}
      <div
        style={{
          padding: '0.85rem 1.25rem',
          borderRadius: '0.65rem',
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
        }}
      >
        <AlertCircle size={18} style={{ color: 'var(--brand-btc)', flexShrink: 0 }} />
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
          <strong>DCA Notice:</strong> Automated recurring purchases do not eliminate market risk. Prices fluctuate dynamically with every execution. You can pause or cancel recurring orders at any time without penalty.
        </p>
      </div>

      {/* Inline Create Form */}
      {isCreating && (
        <div className="glass-card" style={{ padding: '2rem', border: '1px solid var(--brand-btc)' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>
            Configure New Recurring Plan
          </h3>
          <form onSubmit={handleCreateSchedule} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Recurring Amount (USD)
                </label>
                <input
                  type="number"
                  min="5"
                  step="5"
                  value={amountUsd}
                  onChange={(e) => setAmountUsd(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '0.5rem',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-surface-elevated)',
                    fontSize: '1rem',
                    fontWeight: 700,
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Cadence
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '0.5rem',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-surface-elevated)',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                  }}
                >
                  <option value="weekly">Every Week (Recommended)</option>
                  <option value="biweekly">Every 2 Weeks</option>
                  <option value="monthly">Every Month</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '0.5rem',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-surface-elevated)',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                  }}
                >
                  <option value="ach_bank">Bank ACH (0.49% Fee)</option>
                  <option value="debit_card">Debit Card (1.49% Fee)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="btn btn-secondary"
                style={{ padding: '0.6rem 1.25rem' }}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 1.25rem' }}>
                <span>Activate Schedule</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Schedules List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {schedules.map((sch) => {
          const isActive = sch.status === 'active';
          return (
            <div
              key={sch.id}
              className="glass-card"
              style={{
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                borderLeft: isActive ? '4px solid var(--brand-success)' : '4px solid var(--text-faint)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '0.5rem',
                    background: isActive ? 'var(--brand-success-bg)' : 'var(--bg-surface-elevated)',
                    color: isActive ? 'var(--brand-success)' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <RefreshCw size={20} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <span className="mono" style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                      {formatUsd(sch.amountUsd, 0)}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      every {sch.frequency}
                    </span>
                    <span
                      className="pill"
                      style={{
                        background: isActive ? 'var(--brand-success-bg)' : 'var(--bg-surface-elevated)',
                        color: isActive ? 'var(--brand-success)' : 'var(--text-muted)',
                        fontSize: '0.7rem',
                        textTransform: 'capitalize',
                      }}
                    >
                      {sch.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                    Payment: {sch.paymentMethod === 'ach_bank' ? 'Bank ACH (***4920)' : 'Card (***1140)'} &bull; Next Execution: <strong>{new Date(sch.nextRunDate).toLocaleDateString()}</strong> &bull; Total Contributed: {formatUsd(sch.totalInvestedUsd, 0)} ({sch.executionCount} buys)
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={() => onToggleSchedule(sch.id)}
                  className="btn btn-secondary"
                  style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
                >
                  {isActive ? <Pause size={14} /> : <Play size={14} />}
                  <span>{isActive ? 'Pause' : 'Resume'}</span>
                </button>
                <button
                  onClick={() => onCancelSchedule(sch.id)}
                  title="Cancel schedule"
                  style={{ padding: '0.45rem', color: 'var(--brand-danger)', background: 'transparent', cursor: 'pointer' }}
                >
                  <XCircle size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
