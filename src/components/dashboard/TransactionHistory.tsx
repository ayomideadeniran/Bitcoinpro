'use client';

import React, { useState } from 'react';
import { Download, Plus, Search, Filter, Trash2, ExternalLink } from 'lucide-react';
import { Transaction } from '@/lib/types';
import { formatUsd, formatBtc, formatSats, btcToSats } from '@/lib/btc-calc';
import { exportTransactionsToCsv } from '@/lib/portfolio-store';

interface TransactionHistoryProps {
  transactions: Transaction[];
  satsMode: boolean;
  onOpenBuyModal: () => void;
  onDeleteTransaction: (id: string) => void;
  onInspectTx: (tx: Transaction) => void;
}

export default function TransactionHistory({
  transactions,
  satsMode,
  onOpenBuyModal,
  onDeleteTransaction,
  onInspectTx,
}: TransactionHistoryProps) {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filtered = transactions.filter((t) => {
    const matchesType = filterType === 'all' || t.type === filterType;
    const matchesSearch =
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.notes && t.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
      t.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="glass-card" style={{ padding: '2rem' }}>
      {/* Header with Search & Actions */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.75rem',
        }}
      >
        <div style={{ flex: '1 1 200px' }}>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800 }}>Transaction Ledger</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Complete historical record of all Bitcoin purchases, transfers, and recurring orders.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => exportTransactionsToCsv(transactions)}
            className="btn btn-secondary"
            style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}
          >
            <Download size={15} />
            <span>Download CSV</span>
          </button>
          <button
            onClick={onOpenBuyModal}
            className="btn btn-primary"
            style={{ padding: '0.55rem 1.15rem', fontSize: '0.85rem' }}
          >
            <Plus size={16} />
            <span>Record Buy</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        {/* Type Filter Buttons */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Activity' },
            { id: 'spot_buy', label: 'Spot Buys' },
            { id: 'recurring_buy', label: 'Recurring DCA' },
            { id: 'transfer_in', label: 'Transfers' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterType(cat.id)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: '0.5rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                background: filterType === cat.id ? 'var(--brand-btc)' : 'var(--bg-surface-elevated)',
                color: filterType === cat.id ? '#ffffff' : 'var(--text-muted)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="search-input-wrap" style={{ position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search notes or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.45rem 0.75rem 0.45rem 2rem',
              borderRadius: '0.5rem',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-surface-elevated)',
              fontSize: '0.85rem',
            }}
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="desktop-table-container">
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '0.75rem 0.5rem' }}>Tx ID</th>
              <th style={{ padding: '0.75rem 0.5rem' }}>Date &amp; Time</th>
              <th style={{ padding: '0.75rem 0.5rem' }}>Type</th>
              <th style={{ padding: '0.75rem 0.5rem' }}>Bitcoin Amount</th>
              <th style={{ padding: '0.75rem 0.5rem' }}>BTC Price</th>
              <th style={{ padding: '0.75rem 0.5rem' }}>Capital Charged</th>
              <th style={{ padding: '0.75rem 0.5rem' }}>Fees</th>
              <th style={{ padding: '0.75rem 0.5rem' }}>Notes</th>
              <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                  No matching transactions found.
                </td>
              </tr>
            ) : (
              filtered.map((t) => (
                <tr
                  key={t.id}
                  style={{ borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer' }}
                  onClick={() => onInspectTx(t)}
                  title="Click to view on-chain lifecycle details"
                >
                  <td className="mono" style={{ padding: '0.85rem 0.5rem', fontSize: '0.775rem', color: 'var(--brand-info)' }}>
                    {t.id}
                  </td>
                  <td style={{ padding: '0.85rem 0.5rem', color: 'var(--text-muted)' }}>
                    {new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td style={{ padding: '0.85rem 0.5rem' }}>
                    <span
                      className="pill"
                      style={{
                        background:
                          t.type === 'recurring_buy'
                            ? 'rgba(236, 121, 107, 0.12)'
                            : t.type === 'withdrawal'
                            ? 'var(--brand-danger-bg)'
                            : 'rgba(59, 130, 246, 0.12)',
                        color:
                          t.type === 'recurring_buy'
                            ? 'var(--brand-btc)'
                            : t.type === 'withdrawal'
                            ? 'var(--brand-danger)'
                            : 'var(--brand-info)',
                        fontSize: '0.725rem',
                        textTransform: 'capitalize',
                      }}
                    >
                      {t.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="mono" style={{ padding: '0.85rem 0.5rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {t.type === 'withdrawal' ? '-' : '+'}
                    {satsMode ? `${formatSats(btcToSats(t.amountBtc))} sats` : `${formatBtc(t.amountBtc, 6)} BTC`}
                  </td>
                  <td className="mono" style={{ padding: '0.85rem 0.5rem' }}>
                    {formatUsd(t.pricePerBtc, 0)}
                  </td>
                  <td className="mono" style={{ padding: '0.85rem 0.5rem', fontWeight: 600 }}>
                    {formatUsd(t.amountUsd, 2)}
                  </td>
                  <td className="mono" style={{ padding: '0.85rem 0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {formatUsd(t.feeUsd, 2)}
                  </td>
                  <td style={{ padding: '0.85rem 0.5rem', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                    {t.notes || '—'}
                  </td>
                  <td style={{ padding: '0.85rem 0.5rem', textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onDeleteTransaction(t.id)}
                      title="Remove transaction"
                      style={{
                        padding: '0.35rem',
                        borderRadius: '0.35rem',
                        color: 'var(--brand-danger)',
                        background: 'transparent',
                        cursor: 'pointer',
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mobile-cards-container">
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)' }}>
            No matching transactions found.
          </div>
        ) : (
          filtered.map((t) => (
            <div key={t.id} className="mobile-tx-card" onClick={() => onInspectTx(t)}>
              <div className="mobile-tx-card-header">
                <div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                    {new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--brand-info)' }}>{t.id.substring(0, 8)}...</span>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <span
                    className="pill"
                    style={{
                      background: t.type === 'recurring_buy' ? 'rgba(236, 121, 107, 0.12)' : t.type === 'withdrawal' ? 'var(--brand-danger-bg)' : 'rgba(59, 130, 246, 0.12)',
                      color: t.type === 'recurring_buy' ? 'var(--brand-btc)' : t.type === 'withdrawal' ? 'var(--brand-danger)' : 'var(--brand-info)',
                      fontSize: '0.7rem',
                      textTransform: 'capitalize',
                      padding: '0.2rem 0.5rem'
                    }}
                  >
                    {t.type.replace('_', ' ')}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDeleteTransaction(t.id); }}
                    style={{ background: 'transparent', color: 'var(--brand-danger)', padding: '0.2rem' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="mobile-tx-card-row">
                <span style={{ color: 'var(--text-muted)' }}>Amount:</span>
                <span className="mono" style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                  {t.type === 'withdrawal' ? '-' : '+'}
                  {satsMode ? `${formatSats(btcToSats(t.amountBtc))} sats` : `${formatBtc(t.amountBtc, 6)} BTC`}
                </span>
              </div>
              <div className="mobile-tx-card-row">
                <span style={{ color: 'var(--text-muted)' }}>Price/Fee:</span>
                <span className="mono" style={{ fontSize: '0.8rem' }}>
                  {formatUsd(t.pricePerBtc, 0)} / {formatUsd(t.feeUsd, 2)}
                </span>
              </div>
              <div className="mobile-tx-card-row">
                <span style={{ color: 'var(--text-muted)' }}>Total USD:</span>
                <span className="mono" style={{ fontWeight: 600 }}>{formatUsd(t.amountUsd, 2)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
