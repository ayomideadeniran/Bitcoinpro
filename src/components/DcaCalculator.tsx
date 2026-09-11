'use client';

import React, { useState, useMemo } from 'react';
import { Calculator, Calendar, ArrowRight, RefreshCw, AlertCircle, Zap, Shield, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { calculateDca, calculateLumpSum, formatBtc, formatSats, formatUsd } from '@/lib/btc-calc';
import { BtcMarketData } from '@/lib/types';

interface DcaCalculatorProps {
  marketData: BtcMarketData;
  satsMode: boolean;
  onToggleSatsMode: () => void;
}

export default function DcaCalculator({ marketData, satsMode, onToggleSatsMode }: DcaCalculatorProps) {
  const [calculatorMode, setCalculatorMode] = useState<'dca' | 'lumpsum'>('dca');

  // DCA State
  const [dcaAmount, setDcaAmount] = useState<number>(5000);
  const [dcaFrequency, setDcaFrequency] = useState<'daily' | 'weekly' | 'biweekly' | 'monthly'>('weekly');
  const [dcaDurationMonths, setDcaDurationMonths] = useState<number>(24);

  // Lump Sum State
  const [lumpSumInvested, setLumpSumInvested] = useState<number>(5000);
  const [lumpSumPurchasePrice, setLumpSumPurchasePrice] = useState<number>(55000);

  // Quick Preset Handlers
  const setPreset = (amount: number, freq: 'daily' | 'weekly' | 'biweekly' | 'monthly', months: number) => {
    setDcaAmount(amount);
    setDcaFrequency(freq);
    setDcaDurationMonths(months);
  };

  // Calculations
  const dcaResult = useMemo(() => {
    return calculateDca({
      amountUsd: Number(dcaAmount) || 0,
      frequency: dcaFrequency,
      durationMonths: Number(dcaDurationMonths) || 12,
      customBtcPrice: marketData.priceUsd,
    });
  }, [dcaAmount, dcaFrequency, dcaDurationMonths, marketData.priceUsd]);

  const lumpSumResult = useMemo(() => {
    return calculateLumpSum({
      amountInvestedUsd: Number(lumpSumInvested) || 0,
      purchasePriceUsd: Number(lumpSumPurchasePrice) || 1,
      currentPriceUsd: marketData.priceUsd,
    });
  }, [lumpSumInvested, lumpSumPurchasePrice, marketData.priceUsd]);

  const isDcaProfitable = dcaResult.unrealizedProfitLossUsd >= 0;
  const isLumpSumProfitable = lumpSumResult.unrealizedProfitLossUsd >= 0;

  return (
    <section id="calculator" className="section-wrapper" style={{ background: 'var(--bg-primary)' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge">
            <Calculator size={14} />
            <span>Interactive Simulator</span>
          </div>
          <h2 className="section-title">Test Your Strategy with Real Numbers</h2>
          <p className="section-subtitle">
            Explore how disciplined recurring purchases (Dollar-Cost Averaging) smooth market volatility compared to lump-sum timing.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            marginBottom: '2.5rem',
          }}
        >
          <button
            onClick={() => setCalculatorMode('dca')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.75rem',
              fontWeight: 700,
              fontSize: '0.95rem',
              transition: 'all 0.2s ease',
              background: calculatorMode === 'dca' ? 'var(--brand-btc)' : 'var(--bg-surface)',
              color: calculatorMode === 'dca' ? '#ffffff' : 'var(--text-muted)',
              border: '1px solid',
              borderColor: calculatorMode === 'dca' ? 'var(--brand-btc)' : 'var(--border-subtle)',
              boxShadow: calculatorMode === 'dca' ? '0 4px 12px var(--brand-btc-glow)' : 'none',
            }}
          >
            <RefreshCw size={16} />
            <span>Recurring Investment (DCA)</span>
          </button>

          <button
            onClick={() => setCalculatorMode('lumpsum')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.75rem',
              fontWeight: 700,
              fontSize: '0.95rem',
              transition: 'all 0.2s ease',
              background: calculatorMode === 'lumpsum' ? 'var(--brand-btc)' : 'var(--bg-surface)',
              color: calculatorMode === 'lumpsum' ? '#ffffff' : 'var(--text-muted)',
              border: '1px solid',
              borderColor: calculatorMode === 'lumpsum' ? 'var(--brand-btc)' : 'var(--border-subtle)',
              boxShadow: calculatorMode === 'lumpsum' ? '0 4px 12px var(--brand-btc-glow)' : 'none',
            }}
          >
            <DollarSign size={16} />
            <span>Lump-Sum Calculator</span>
          </button>
        </div>

        {/* Calculator Main Panel */}
        <div
          className="glass-card"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            padding: '2.5rem',
            maxWidth: '1080px',
            margin: '0 auto',
          }}
        >
          {/* Controls Column */}
          {calculatorMode === 'dca' ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Recurring Parameters</h3>
                <span className="pill pill-btc">Automated Stacking</span>
              </div>

              {/* Amount Input */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label htmlFor="dca-amount" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                    Recurring Amount (USD)
                  </label>
                  <span className="mono" style={{ fontWeight: 700, color: 'var(--brand-btc)' }}>
                    ${dcaAmount}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <input
                    id="dca-amount"
                    type="number"
                    min="5000"
                    max="1000000"
                    step="500"
                    value={dcaAmount}
                    onChange={(e) => setDcaAmount(Math.max(5000, Number(e.target.value)))}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '0.5rem',
                      border: '1px solid var(--border-subtle)',
                      background: 'var(--bg-surface-elevated)',
                      fontSize: '1rem',
                      fontWeight: 600,
                    }}
                  />
                </div>
                {/* Preset Chips */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {[5000, 10000, 25000, 50000, 100000].map((val) => (
                    <button
                      key={val}
                      onClick={() => setDcaAmount(val)}
                      style={{
                        padding: '0.25rem 0.65rem',
                        borderRadius: '0.35rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: dcaAmount === val ? 'var(--brand-btc)' : 'var(--bg-surface-elevated)',
                        color: dcaAmount === val ? '#ffffff' : 'var(--text-muted)',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      ${val.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Frequency Selector */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  Investment Frequency
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                  {(['daily', 'weekly', 'biweekly', 'monthly'] as const).map((freq) => (
                    <button
                      key={freq}
                      onClick={() => setDcaFrequency(freq)}
                      style={{
                        padding: '0.65rem 0.5rem',
                        borderRadius: '0.5rem',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        textTransform: 'capitalize',
                        background: dcaFrequency === freq ? 'var(--bg-surface-elevated)' : 'transparent',
                        color: dcaFrequency === freq ? 'var(--brand-btc)' : 'var(--text-muted)',
                        border: '1px solid',
                        borderColor: dcaFrequency === freq ? 'var(--brand-btc)' : 'var(--border-subtle)',
                      }}
                    >
                      {freq === 'biweekly' ? 'Bi-wkly' : freq}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration Slider */}
              <div style={{ marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label htmlFor="duration-slider" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                    Duration: {dcaDurationMonths} Months ({Math.round(dcaDurationMonths / 12 * 10) / 10} yrs)
                  </label>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>1 to 48 months</span>
                </div>
                <input
                  id="duration-slider"
                  type="range"
                  min="6"
                  max="48"
                  step="6"
                  value={dcaDurationMonths}
                  onChange={(e) => setDcaDurationMonths(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--brand-btc)' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.35rem' }}>
                  {[6, 12, 24, 36, 48].map((m) => (
                    <button
                      key={m}
                      onClick={() => setDcaDurationMonths(m)}
                      style={{
                        fontSize: '0.725rem',
                        fontWeight: 600,
                        color: dcaDurationMonths === m ? 'var(--brand-btc)' : 'var(--text-faint)',
                      }}
                    >
                      {m}mo
                    </button>
                  ))}
                </div>
              </div>

              {/* Fast Presets Box */}
              <div
                style={{
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ fontSize: '0.775rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  Popular Beginner Presets
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setPreset(5000, 'weekly', 12)}
                    className="pill"
                    style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}
                  >
                    🌱 $5k / wk for 1 Year
                  </button>
                  <button
                    onClick={() => setPreset(10000, 'weekly', 24)}
                    className="pill"
                    style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}
                  >
                    ⚡ $10k / wk for 2 Years
                  </button>
                  <button
                    onClick={() => setPreset(50000, 'monthly', 36)}
                    className="pill"
                    style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}
                  >
                    🎯 $50k / mo for 3 Years
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Lump-Sum Parameters</h3>
                <span className="pill pill-btc">Single Purchase</span>
              </div>

              {/* Amount Invested */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="lumpsum-amount" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  Total Capital Invested (USD)
                </label>
                <input
                  id="lumpsum-amount"
                  type="number"
                  min="5000"
                  step="500"
                  value={lumpSumInvested}
                  onChange={(e) => setLumpSumInvested(Math.max(5000, Number(e.target.value)))}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-surface-elevated)',
                    fontSize: '1rem',
                    fontWeight: 600,
                  }}
                />
              </div>

              {/* Purchase Price */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="lumpsum-price" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  Bitcoin Purchase Price (USD)
                </label>
                <input
                  id="lumpsum-price"
                  type="number"
                  min="1000"
                  step="500"
                  value={lumpSumPurchasePrice}
                  onChange={(e) => setLumpSumPurchasePrice(Math.max(1, Number(e.target.value)))}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-surface-elevated)',
                    fontSize: '1rem',
                    fontWeight: 600,
                  }}
                />
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button
                    onClick={() => setLumpSumPurchasePrice(Math.round(marketData.priceUsd * 0.7))}
                    style={{ fontSize: '0.75rem', color: 'var(--brand-info)' }}
                  >
                    30% Dip (${Math.round(marketData.priceUsd * 0.7).toLocaleString()})
                  </button>
                  <button
                    onClick={() => setLumpSumPurchasePrice(Math.round(marketData.priceUsd))}
                    style={{ fontSize: '0.75rem', color: 'var(--brand-btc)' }}
                  >
                    Current Rate (${Math.round(marketData.priceUsd).toLocaleString()})
                  </button>
                </div>
              </div>

              {/* Current Market Price Reference */}
              <div
                style={{
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  Current Market Benchmark
                </div>
                <div className="mono" style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                  {formatUsd(marketData.priceUsd, 0)} / BTC
                </div>
              </div>
            </div>
          )}

          {/* Results Summary Column */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: 'var(--bg-surface-elevated)',
              padding: '2rem',
              borderRadius: '0.85rem',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)' }}>
                  Estimated Simulation Results
                </span>
                <button
                  onClick={onToggleSatsMode}
                  className="pill pill-btc"
                  style={{ cursor: 'pointer', border: 'none' }}
                  title="Toggle Satoshis display"
                >
                  <Zap size={12} />
                  <span>{satsMode ? 'Displaying Sats' : 'Displaying BTC'}</span>
                </button>
              </div>

              {/* Main Portfolio Value Output */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  Current Portfolio Value
                </div>
                <div
                  className="mono"
                  style={{
                    fontSize: '2.25rem',
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    color: 'var(--text-main)',
                  }}
                >
                  {formatUsd(calculatorMode === 'dca' ? dcaResult.currentPortfolioValueUsd : lumpSumResult.currentValueUsd, 2)}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.35rem' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.2rem',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: (calculatorMode === 'dca' ? isDcaProfitable : isLumpSumProfitable) ? 'var(--brand-success)' : 'var(--brand-danger)',
                    }}
                  >
                    {(calculatorMode === 'dca' ? isDcaProfitable : isLumpSumProfitable) ? <TrendingUp size={15} /> : <TrendingDown size={15} />}
                    {(calculatorMode === 'dca' ? isDcaProfitable : isLumpSumProfitable) ? '+' : ''}
                    {formatUsd(calculatorMode === 'dca' ? dcaResult.unrealizedProfitLossUsd : lumpSumResult.unrealizedProfitLossUsd, 2)}
                    {' '}({(calculatorMode === 'dca' ? dcaResult.unrealizedProfitLossPercent : lumpSumResult.unrealizedProfitLossPercent).toFixed(1)}%)
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>unrealized P&amp;L</span>
                </div>
              </div>

              {/* Metric Breakdown Rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Total Capital Invested</span>
                  <span className="mono" style={{ fontWeight: 700 }}>
                    {formatUsd(calculatorMode === 'dca' ? dcaResult.totalInvestedUsd : lumpSumInvested, 0)}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Total Bitcoin Stacked</span>
                  <span className="mono" style={{ fontWeight: 700, color: 'var(--brand-btc)' }}>
                    {satsMode
                      ? `${formatSats(calculatorMode === 'dca' ? dcaResult.totalSatsAccumulated : lumpSumResult.satsReceived)} sats`
                      : `${formatBtc(calculatorMode === 'dca' ? dcaResult.totalBtcAccumulated : lumpSumResult.btcReceived, 6)} BTC`}
                  </span>
                </div>

                {calculatorMode === 'dca' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Average Purchase Price</span>
                    <span className="mono" style={{ fontWeight: 700 }}>
                      {formatUsd(dcaResult.averagePurchasePriceUsd, 0)} / BTC
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Disclaimer Footer Note */}
            <div
              style={{
                marginTop: '1.75rem',
                paddingTop: '1rem',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem',
              }}
            >
              <AlertCircle size={15} style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: '2px' }} />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                <strong>Educational Simulation:</strong> Assumes historical price modeling over the selected horizon. Bitcoin prices fluctuate dynamically. Future results may differ significantly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
