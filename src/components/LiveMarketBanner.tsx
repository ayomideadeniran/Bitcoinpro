'use client';

import React from 'react';
import { Activity, Layers, Coins, Fuel, Clock } from 'lucide-react';
import { formatUsd, formatSats } from '@/lib/btc-calc';
import { BtcMarketData } from '@/lib/types';

interface LiveMarketBannerProps {
  marketData: BtcMarketData;
  satsMode: boolean;
}

export default function LiveMarketBanner({ marketData, satsMode }: LiveMarketBannerProps) {
  const satsPerDollar = marketData.priceUsd > 0 ? Math.round(100_000_000 / marketData.priceUsd) : 0;

  return (
    <section
      style={{
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--bg-surface)',
        padding: '1.25rem 0',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.25rem',
            alignItems: 'center',
          }}
        >
          {/* 24h Range */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '0.5rem',
                background: 'var(--bg-surface-elevated)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--brand-info)',
                flexShrink: 0,
              }}
            >
              <Activity size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                24h Low / High
              </div>
              <div className="mono" style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                {formatUsd(marketData.low24h, 0)} – {formatUsd(marketData.high24h, 0)}
              </div>
            </div>
          </div>

          {/* Market Cap */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '0.5rem',
                background: 'var(--bg-surface-elevated)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--brand-btc)',
                flexShrink: 0,
              }}
            >
              <Coins size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Market Capitalization
              </div>
              <div className="mono" style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                {formatUsd(marketData.marketCapUsd / 1_000_000_000, 1)} Billion
              </div>
            </div>
          </div>

          {/* Block Height */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '0.5rem',
                background: 'var(--bg-surface-elevated)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--brand-success)',
                flexShrink: 0,
              }}
            >
              <Layers size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Verified Block Height
              </div>
              <div className="mono" style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                #{marketData.blockHeight.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Mempool Network Fee */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '0.5rem',
                background: 'var(--bg-surface-elevated)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--brand-warning)',
                flexShrink: 0,
              }}
            >
              <Fuel size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Network Miner Fee
              </div>
              <div className="mono" style={{ fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span>{marketData.mempoolFeeSatPerVb} sat/vB</span>
                <span className="pill pill-success" style={{ padding: '0.1rem 0.35rem', fontSize: '0.65rem' }}>Low Congestion</span>
              </div>
            </div>
          </div>

          {/* Fractional Sats Purchasing Power */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '0.5rem',
                background: 'rgba(247, 147, 26, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--brand-btc)',
                flexShrink: 0,
              }}
            >
              <Clock size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Unit Purchasing Power
              </div>
              <div className="mono" style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--brand-btc)' }}>
                $1 = {formatSats(satsPerDollar)} sats
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
