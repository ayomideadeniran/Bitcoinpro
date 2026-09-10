'use client';

import React, { useState } from 'react';
import { DollarSign, Shield, CheckCircle, HelpCircle, Fuel, ArrowRight, Zap, Info } from 'lucide-react';
import { formatUsd, formatBtc, formatSats, btcToSats } from '@/lib/btc-calc';
import { BtcMarketData } from '@/lib/types';

interface FeeTransparencyProps {
  marketData: BtcMarketData;
  satsMode: boolean;
}

export default function FeeTransparency({ marketData, satsMode }: FeeTransparencyProps) {
  const [purchaseAmount, setPurchaseAmount] = useState<number>(100);

  // Platform fee percentage (0.49%)
  const platformFeeRate = 0.0049;
  const platformFeeUsd = purchaseAmount * platformFeeRate;

  // Typical standard SegWit/Taproot transaction is ~140 vBytes
  const txVBytes = 140;
  const minerFeeSats = txVBytes * marketData.mempoolFeeSatPerVb;
  const minerFeeUsd = (minerFeeSats / 100_000_000) * marketData.priceUsd;

  const totalChargedUsd = purchaseAmount + platformFeeUsd + minerFeeUsd;
  const netBtcReceived = purchaseAmount / marketData.priceUsd;
  const netSatsReceived = btcToSats(netBtcReceived);

  return (
    <section id="fees" className="section-wrapper" style={{ background: 'var(--bg-surface)' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge">
            <DollarSign size={14} />
            <span>Radical Transparency</span>
          </div>
          <h2 className="section-title">No Hidden Spreads. Ever.</h2>
          <p className="section-subtitle">
            Most exchanges advertise "zero fee" while secretly marking up the Bitcoin price by 2% to 4%. We show you every single cent before you execute.
          </p>
        </div>

        {/* Side-by-Side Comparison & Interactive Breakdown */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            alignItems: 'start',
            maxWidth: '1080px',
            margin: '0 auto',
          }}
        >
          {/* Interactive Live Fee Breakdown Box */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Live Purchase Fee Estimator
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Test how transparent fees scale with purchase sizes.
            </p>

            {/* Input Slider & Quick Presets */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <label htmlFor="purchase-amount-input" style={{ fontSize: '0.875rem', fontWeight: 600 }}>Purchase Amount</label>
                <span className="mono" style={{ fontWeight: 700, color: 'var(--brand-btc)' }}>
                  {formatUsd(purchaseAmount, 0)}
                </span>
              </div>
              <input
                id="purchase-amount-input"
                type="range"
                min="25"
                max="2500"
                step="25"
                value={purchaseAmount}
                onChange={(e) => setPurchaseAmount(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--brand-btc)', marginBottom: '0.75rem' }}
              />
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {[25, 50, 100, 250, 500, 1000].map((val) => (
                  <button
                    key={val}
                    onClick={() => setPurchaseAmount(val)}
                    style={{
                      padding: '0.2rem 0.5rem',
                      borderRadius: '0.35rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: purchaseAmount === val ? 'var(--brand-btc)' : 'var(--bg-surface-elevated)',
                      color: purchaseAmount === val ? '#ffffff' : 'var(--text-muted)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    ${val}
                  </button>
                ))}
              </div>
            </div>

            {/* Itemized Receipt */}
            <div
              style={{
                background: 'var(--bg-surface-elevated)',
                borderRadius: '0.75rem',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
                border: '1px solid var(--border-subtle)',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Amount Being Purchased</span>
                <span className="mono" style={{ fontWeight: 600 }}>{formatUsd(purchaseAmount, 2)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Platform Fee (0.49%)</span>
                  <span className="pill pill-btc" style={{ fontSize: '0.65rem' }}>Direct</span>
                </div>
                <span className="mono" style={{ fontWeight: 600 }}>{formatUsd(platformFeeUsd, 2)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Network Miner Fee</span>
                  <span className="pill pill-success" style={{ fontSize: '0.65rem' }}>{marketData.mempoolFeeSatPerVb} sat/vB</span>
                </div>
                <span className="mono" style={{ fontWeight: 600 }}>{formatUsd(minerFeeUsd, 2)}</span>
              </div>

              <div
                style={{
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '0.75rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '1rem',
                  fontWeight: 700,
                }}
              >
                <span>Total Charged</span>
                <span className="mono" style={{ color: 'var(--text-main)' }}>{formatUsd(totalChargedUsd, 2)}</span>
              </div>

              <div
                style={{
                  background: 'rgba(247, 147, 26, 0.08)',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--brand-btc)' }}>
                  Estimated Bitcoin Received:
                </span>
                <span className="mono" style={{ fontWeight: 800, color: 'var(--brand-btc)' }}>
                  {satsMode ? `${formatSats(netSatsReceived)} sats` : `${formatBtc(netBtcReceived, 6)} BTC`}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={16} style={{ color: 'var(--brand-success)' }} />
              <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                Guaranteed rate lock for 60 seconds during checkout review.
              </span>
            </div>
          </div>

          {/* Educational Comparison Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Mempool Traffic Gauge */}
            <div className="glass-card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Fuel size={18} style={{ color: 'var(--brand-warning)' }} />
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Live Mempool Traffic Gauge</h4>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1rem' }}>
                Bitcoin network fees are not determined by how many dollars you send. They depend on how crowded the queue (mempool) is.
              </p>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--brand-success)' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Current Condition: Optimal Low Congestion ({marketData.mempoolFeeSatPerVb} sat/vB)</span>
              </div>
            </div>

            {/* Why Hidden Spreads Hurt Beginners */}
            <div className="glass-card" style={{ padding: '1.75rem' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                Why "Zero Commission" Is Often a Lie
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                Platforms that advertise "0% trading fees" often inflate the price you pay. If BTC is trading at $90,000, they might charge you $92,500 without warning.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                  <CheckCircle size={15} style={{ color: 'var(--brand-success)' }} />
                  <span>Real spot market price execution</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                  <CheckCircle size={15} style={{ color: 'var(--brand-success)' }} />
                  <span>Transparent 0.49% platform fee</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                  <CheckCircle size={15} style={{ color: 'var(--brand-success)' }} />
                  <span>Direct network miner fee pass-through</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
