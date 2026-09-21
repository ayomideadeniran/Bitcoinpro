'use client';

import React, { useState } from 'react';
import { X, Bell, Plus, Trash2, ArrowRight } from 'lucide-react';
import { PriceAlert } from '@/lib/types';
import { formatUsd } from '@/lib/btc-calc';

interface PriceAlertModalProps {
  currentBtcPrice: number;
  alerts: PriceAlert[];
  onClose: () => void;
  onAddAlert: (alert: PriceAlert) => void;
  onDeleteAlert: (id: string) => void;
}

export default function PriceAlertModal({
  currentBtcPrice,
  alerts,
  onClose,
  onAddAlert,
  onDeleteAlert,
}: PriceAlertModalProps) {
  const [targetPrice, setTargetPrice] = useState<number>(Math.round(currentBtcPrice * 1.05));
  const [condition, setCondition] = useState<'above' | 'below'>('above');
  const [notes, setNotes] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (targetPrice <= 0) return;

    const newAlert: PriceAlert = {
      id: `pa-${Date.now().toString(36)}`,
      targetPriceUsd: targetPrice,
      condition,
      createdAt: new Date().toISOString().split('T')[0],
      triggered: false,
      notes: notes.trim() || undefined,
    };

    onAddAlert(newAlert);
    setNotes('');
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '0.5rem',
                background: 'rgba(236, 121, 107, 0.15)',
                color: 'var(--brand-btc)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Bell size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Custom Price Alerts</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Spot Rate: {formatUsd(currentBtcPrice, 0)}</span>
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

        {/* Create Alert Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => {
                setCondition('above');
                setTargetPrice(Math.round(currentBtcPrice * 1.05));
              }}
              style={{
                padding: '0.65rem',
                borderRadius: '0.5rem',
                fontSize: '0.825rem',
                fontWeight: 600,
                background: condition === 'above' ? 'var(--brand-btc)' : 'var(--bg-surface-elevated)',
                color: condition === 'above' ? '#ffffff' : 'var(--text-muted)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              Rises Above Target
            </button>
            <button
              type="button"
              onClick={() => {
                setCondition('below');
                setTargetPrice(Math.round(currentBtcPrice * 0.95));
              }}
              style={{
                padding: '0.65rem',
                borderRadius: '0.5rem',
                fontSize: '0.825rem',
                fontWeight: 600,
                background: condition === 'below' ? 'var(--brand-btc)' : 'var(--bg-surface-elevated)',
                color: condition === 'below' ? '#ffffff' : 'var(--text-muted)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              Drops Below Target
            </button>
          </div>

          <div>
            <label htmlFor="price-trigger" style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Target Price (USD)
            </label>
            <input
              id="price-trigger"
              type="number"
              min="1000"
              step="500"
              value={targetPrice}
              onChange={(e) => setTargetPrice(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
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
            <input
              type="text"
              placeholder="Note (e.g. Consider increasing monthly DCA)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-surface-elevated)',
                fontSize: '0.85rem',
              }}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem' }}>
            <Plus size={16} />
            <span>Set Price Alert</span>
          </button>
        </form>

        {/* Existing Alerts */}
        <div>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            Active Price Alerts ({alerts.length})
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {alerts.length === 0 ? (
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>
                No active alerts. Add one above!
              </p>
            ) : (
              alerts.map((al) => (
                <div
                  key={al.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span>BTC {al.condition === 'above' ? '≥' : '≤'}</span>
                      <span className="mono" style={{ color: 'var(--brand-btc)' }}>{formatUsd(al.targetPriceUsd, 0)}</span>
                    </div>
                    {al.notes && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{al.notes}</div>
                    )}
                  </div>

                  <button
                    onClick={() => onDeleteAlert(al.id)}
                    title="Remove alert"
                    style={{ padding: '0.35rem', color: 'var(--brand-danger)', background: 'transparent', cursor: 'pointer' }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
