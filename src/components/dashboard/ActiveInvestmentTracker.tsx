'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Plus, 
  ArrowUpRight, 
  CheckCircle2, 
  RefreshCw, 
  Zap,
  Lock,
  ChevronRight
} from 'lucide-react';
import { ActiveInvestment } from '@/lib/types';
import { 
  calculateInvestmentGrowth, 
  formatCountdownParts, 
  INVESTMENT_PLANS 
} from '@/lib/investment-store';
import { formatUsd } from '@/lib/btc-calc';

interface ActiveInvestmentTrackerProps {
  investments: ActiveInvestment[];
  onOpenPlanModal: () => void;
  onClaimInvestment?: (investmentId: string) => void;
  userEmail?: string;
}

export default function ActiveInvestmentTracker({
  investments,
  onOpenPlanModal,
  onClaimInvestment,
  userEmail,
}: ActiveInvestmentTrackerProps) {
  // Current time state updating every 1000ms for continuous live ticker
  const [nowMs, setNowMs] = useState<number>(() => Date.now());
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [claimingId, setClaimingId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setNowMs(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const activeInvestments = investments.filter((i) => i.status !== 'claimed');
  const activeOrRecent = activeInvestments.length > 0 ? activeInvestments : investments;
  const currentInvestment = activeOrRecent[selectedIdx] || activeOrRecent[0];

  if (!currentInvestment) {
    // Empty state: Institutional Invite Banner to Choose Investment Plan
    return (
      <div
        style={{
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(236, 121, 107, 0.12) 0%, rgba(14, 16, 43, 0.95) 100%)',
          border: '1px solid rgba(236, 121, 107, 0.3)',
          padding: '2rem',
          boxShadow: '0 10px 30px -10px rgba(236, 121, 107, 0.15)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(236, 121, 107, 0.15) 0%, rgba(0,0,0,0) 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <span
                style={{
                  background: 'rgba(236, 121, 107, 0.2)',
                  color: 'var(--brand-primary)',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                <Zap size={13} fill="currentColor" />
                Institutional Growth Engine
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Up to +120% Lockup Return
              </span>
            </div>

            <h3 style={{ fontSize: '1.65rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
              Choose Your Investment & Watch It Grow Live
            </h3>
            <p style={{ fontSize: '0.925rem', color: 'var(--text-muted)', marginTop: '0.35rem', lineHeight: 1.5 }}>
              Lock in institutional Bitcoin strategies (Silver, Gold, Platinum, or Diamond). Watch your capital accrue second-by-second with real-time countdown timers and automated multi-sig custody.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#CBD5E1' }}>
                <CheckCircle2 size={16} color="var(--brand-success)" />
                <span>Second-by-second yield growth</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#CBD5E1' }}>
                <Clock size={16} color="var(--brand-primary)" />
                <span>Real-time duration countdown</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#CBD5E1' }}>
                <ShieldCheck size={16} color="var(--brand-secondary)" />
                <span>Guaranteed maturity payout</span>
              </div>
            </div>
          </div>

          <div>
            <button
              onClick={onOpenPlanModal}
              className="btn btn-primary"
              style={{
                padding: '0.9rem 1.85rem',
                fontSize: '1rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                boxShadow: '0 0 35px rgba(236, 121, 107, 0.45)',
                whiteSpace: 'nowrap',
              }}
            >
              <Sparkles size={18} />
              <span>Choose Investment Plan</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active investment continuous metrics
  const metrics = calculateInvestmentGrowth(currentInvestment, nowMs);
  const countdown = formatCountdownParts(metrics.remainingMs);
  const planConfig = INVESTMENT_PLANS.find((p) => p.id === currentInvestment.planId) || INVESTMENT_PLANS[0];

  const handleClaim = async () => {
    if (!onClaimInvestment) return;
    setClaimingId(currentInvestment.id);
    try {
      await onClaimInvestment(currentInvestment.id);
    } finally {
      setClaimingId(null);
    }
  };

  return (
    <div
      style={{
        borderRadius: '16px',
        background: 'linear-gradient(135deg, rgba(14, 16, 43, 0.95) 0%, rgba(8, 9, 26, 0.98) 100%)',
        border: '1px solid rgba(236, 121, 107, 0.35)',
        padding: '1.75rem',
        boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.7), 0 0 30px rgba(236, 121, 107, 0.1)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background ambient glow */}
      <div
        style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '250px',
          height: '250px',
          background: `radial-gradient(circle, ${planConfig.color}25 0%, rgba(0,0,0,0) 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Header bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '1.25rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <span
              style={{
                background: `${planConfig.color}22`,
                color: planConfig.color,
                border: `1px solid ${planConfig.color}44`,
                padding: '0.2rem 0.65rem',
                borderRadius: '999px',
                fontSize: '0.75rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              <Sparkles size={12} />
              {currentInvestment.tier} Tier Active
            </span>

            {metrics.isMatured ? (
              <span
                style={{
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: 'var(--brand-success)',
                  padding: '0.2rem 0.65rem',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}
              >
                Matured • Ready to Claim
              </span>
            ) : (
              <span
                style={{
                  background: 'rgba(56, 189, 248, 0.15)',
                  color: '#38BDF8',
                  padding: '0.2rem 0.65rem',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: '#38BDF8',
                    display: 'inline-block',
                    animation: 'pulse 1.5s infinite',
                  }}
                />
                Live Yield Accruing
              </span>
            )}

            {investments.length > 1 && (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                ({selectedIdx + 1} of {investments.length} Investments)
              </span>
            )}
          </div>

          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, marginTop: '0.4rem', color: '#fff', letterSpacing: '-0.02em' }}>
            {currentInvestment.planName}
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {investments.length > 1 && (
            <div style={{ display: 'flex', gap: '0.3rem' }}>
              {investments.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedIdx(idx)}
                  style={{
                    padding: '0.25rem 0.6rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: selectedIdx === idx ? 'var(--brand-primary)' : 'rgba(255, 255, 255, 0.05)',
                    color: selectedIdx === idx ? '#000' : 'var(--text-muted)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    cursor: 'pointer',
                  }}
                >
                  #{idx + 1}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={onOpenPlanModal}
            className="btn btn-secondary"
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Plus size={14} />
            <span>New Plan</span>
          </button>
        </div>
      </div>

      {/* Main Real-time Metrics Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginTop: '1.5rem',
        }}
      >
        {/* Principal Deposit */}
        <div
          style={{
            padding: '1.25rem',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Lock size={13} />
            Initial Locked Capital
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, marginTop: '0.35rem', color: '#fff' }}>
            {formatUsd(currentInvestment.amountInvestedUsd)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            {currentInvestment.durationDays}-Day Fixed Lockup
          </div>
        </div>

        {/* Live Accrued Profit Ticker */}
        <div
          style={{
            padding: '1.25rem',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0.02) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            boxShadow: '0 0 25px rgba(16, 185, 129, 0.08)',
          }}
        >
          <div style={{ fontSize: '0.8rem', color: 'var(--brand-success)', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700 }}>
            <TrendingUp size={14} />
            Accrued Profit (Live Ticker)
          </div>
          <div
            style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              marginTop: '0.35rem',
              color: 'var(--brand-success)',
              letterSpacing: '-0.02em',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            +{formatUsd(metrics.accruedProfitUsd)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#A7F3D0', marginTop: '0.25rem', fontWeight: 600 }}>
            Target: +{formatUsd(metrics.totalProfitUsd)} (+{currentInvestment.expectedRoiPercent}% ROI)
          </div>
        </div>

        {/* Current Total Value */}
        <div
          style={{
            padding: '1.25rem',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Current Cumulative Value
          </div>
          <div
            style={{
              fontSize: '1.65rem',
              fontWeight: 800,
              marginTop: '0.35rem',
              color: '#fff',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {formatUsd(metrics.currentTotalValueUsd)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--brand-primary)', marginTop: '0.25rem', fontWeight: 600 }}>
            Guaranteed Payout: {formatUsd(currentInvestment.targetPayoutUsd)}
          </div>
        </div>
      </div>

      {/* Live Duration Countdown Timer & Progress Bar Section */}
      <div
        style={{
          marginTop: '1.5rem',
          padding: '1.25rem',
          borderRadius: '12px',
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.07)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Clock size={14} color="var(--brand-primary)" />
              <span style={{ fontWeight: 700, color: '#fff' }}>Duration Countdown to Maturity</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Maturing on {new Date(currentInvestment.maturityDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>

          {/* Digital Timer Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontVariantNumeric: 'tabular-nums' }}>
            <div style={{ padding: '0.4rem 0.65rem', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', textAlign: 'center', minWidth: '45px' }}>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>{String(countdown.days).padStart(2, '0')}</div>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Days</div>
            </div>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-muted)' }}>:</span>
            <div style={{ padding: '0.4rem 0.65rem', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', textAlign: 'center', minWidth: '45px' }}>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>{String(countdown.hours).padStart(2, '0')}</div>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Hrs</div>
            </div>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-muted)' }}>:</span>
            <div style={{ padding: '0.4rem 0.65rem', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', textAlign: 'center', minWidth: '45px' }}>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>{String(countdown.minutes).padStart(2, '0')}</div>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Min</div>
            </div>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-muted)' }}>:</span>
            <div style={{ padding: '0.4rem 0.65rem', borderRadius: '8px', background: 'rgba(236, 121, 107, 0.15)', border: '1px solid rgba(236, 121, 107, 0.3)', textAlign: 'center', minWidth: '45px' }}>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--brand-primary)' }}>{String(countdown.seconds).padStart(2, '0')}</div>
              <div style={{ fontSize: '0.6rem', color: 'var(--brand-primary)', textTransform: 'uppercase' }}>Sec</div>
            </div>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem', color: 'var(--text-muted)' }}>
            <span>Lockup Progress ({metrics.progressPercent.toFixed(1)}%)</span>
            <span>{metrics.isMatured ? '100% Completed' : `${metrics.progressPercent.toFixed(2)}% Accrued`}</span>
          </div>
          <div
            style={{
              width: '100%',
              height: '8px',
              borderRadius: '999px',
              background: 'rgba(255, 255, 255, 0.08)',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div
              style={{
                width: `${metrics.progressPercent}%`,
                height: '100%',
                borderRadius: '999px',
                background: 'linear-gradient(90deg, #ec796b 0%, #10B981 100%)',
                boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        </div>

        {/* Claim / Reinvest Footer Actions */}
        <div
          style={{
            marginTop: '1.25rem',
            paddingTop: '1rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={16} color="var(--brand-success)" />
            <span>
              Multi-Sig Custody Verified • Auto-compounding is{' '}
              <strong style={{ color: currentInvestment.autoReinvest ? 'var(--brand-success)' : 'var(--text-muted)' }}>
                {currentInvestment.autoReinvest ? 'ACTIVE' : 'OFF'}
              </strong>
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {metrics.isMatured && (
              <button
                onClick={handleClaim}
                disabled={claimingId === currentInvestment.id}
                className="btn btn-primary"
                style={{
                  padding: '0.55rem 1.25rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  background: 'var(--brand-success)',
                  borderColor: 'var(--brand-success)',
                }}
              >
                {claimingId === currentInvestment.id ? (
                  <span>Processing Payout...</span>
                ) : (
                  <>
                    <ArrowUpRight size={15} />
                    <span>Claim {formatUsd(currentInvestment.targetPayoutUsd)}</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={onOpenPlanModal}
              className="btn btn-secondary"
              style={{ padding: '0.55rem 1.1rem', fontSize: '0.85rem' }}
            >
              <span>Explore Plans</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
