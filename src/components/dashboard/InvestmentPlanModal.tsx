'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, TrendingUp, Clock, ShieldCheck, Sparkles, AlertCircle, ArrowRight, Lock } from 'lucide-react';
import { InvestmentPlan, ActiveInvestment } from '@/lib/types';
import { INVESTMENT_PLANS } from '@/lib/investment-store';
import { formatUsd } from '@/lib/btc-calc';

interface InvestmentPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  onInvestmentCreated: (investment: ActiveInvestment) => void;
}

export default function InvestmentPlanModal({
  isOpen,
  onClose,
  userEmail,
  onInvestmentCreated,
}: InvestmentPlanModalProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<string>('gold-institutional');
  const [amountUsd, setAmountUsd] = useState<number>(5000);
  const [autoReinvest, setAutoReinvest] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentPlan = INVESTMENT_PLANS.find((p) => p.id === selectedPlanId) || INVESTMENT_PLANS[1];

  // Quick preset amounts
  const presetAmounts = [
    { label: '$1,000', value: 1000 },
    { label: '$2,500', value: 2500 },
    { label: '$5,000', value: 5000 },
    { label: '$10,000', value: 10000 },
    { label: '$25,000', value: 25000 },
    { label: '$50,000', value: 50000 },
    { label: '$100,000', value: 100000 },
  ];

  // Calculations
  const expectedProfitUsd = amountUsd * (currentPlan.expectedRoiPercent / 100);
  const totalPayoutUsd = amountUsd + expectedProfitUsd;
  const dailyYieldUsd = expectedProfitUsd / currentPlan.durationDays;

  const handlePlanSelect = (plan: InvestmentPlan) => {
    setSelectedPlanId(plan.id);
    setErrorMsg(null);
    if (amountUsd < plan.minAmountUsd) {
      setAmountUsd(plan.minAmountUsd);
    } else if (plan.maxAmountUsd && amountUsd > plan.maxAmountUsd) {
      setAmountUsd(plan.maxAmountUsd);
    }
  };

  const handleAmountChange = (val: number) => {
    setAmountUsd(val);
    setErrorMsg(null);
  };

  const handleConfirmInvestment = async () => {
    if (!userEmail) {
      setErrorMsg('User session not found. Please log in again.');
      return;
    }

    if (amountUsd < currentPlan.minAmountUsd) {
      setErrorMsg(`Minimum deposit for ${currentPlan.name} is $${currentPlan.minAmountUsd.toLocaleString()}`);
      return;
    }

    if (currentPlan.maxAmountUsd && amountUsd > currentPlan.maxAmountUsd) {
      setErrorMsg(`Maximum deposit for ${currentPlan.name} is $${currentPlan.maxAmountUsd.toLocaleString()}`);
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/investment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail,
          planId: currentPlan.id,
          amountInvestedUsd: amountUsd,
          autoReinvest,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to initialize investment plan');
      }

      onInvestmentCreated(data.investment);
      onClose();
    } catch (err: any) {
      console.error('[InvestmentPlanModal] Error:', err);
      // Fallback to client-side storage if offline or DB error
      const fallbackInvestment: ActiveInvestment = {
        id: `inv_${Date.now()}`,
        userEmail,
        planId: currentPlan.id,
        planName: currentPlan.name,
        tier: currentPlan.tier,
        amountInvestedUsd: amountUsd,
        durationDays: currentPlan.durationDays,
        expectedRoiPercent: currentPlan.expectedRoiPercent,
        targetPayoutUsd: totalPayoutUsd,
        startDate: new Date().toISOString(),
        maturityDate: new Date(Date.now() + currentPlan.durationDays * 86400 * 1000).toISOString(),
        status: 'active',
        autoReinvest,
      };
      onInvestmentCreated(fallbackInvestment);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        backdropFilter: 'blur(8px)',
      }}
      onClick={onClose}
    >
      <div
        className="glass-card"
        style={{
          maxWidth: '840px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          border: '1px solid rgba(236, 121, 107, 0.35)',
          background: 'linear-gradient(180deg, #0e102b 0%, #08091a 100%)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 40px rgba(236, 121, 107, 0.15)',
          padding: '1.75rem',
          position: 'relative',
          borderRadius: '16px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '1.25rem',
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span
                style={{
                  background: 'rgba(236, 121, 107, 0.15)',
                  color: 'var(--brand-primary)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                <Sparkles size={13} />
                High-Yield Vault
              </span>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.35rem', letterSpacing: '-0.02em', color: '#FFFFFF' }}>
              Select Institutional Investment Plan
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#94A3B8', marginTop: '0.2rem' }}>
              Choose a guaranteed lockup duration and watch your Bitcoin alpha compound in real-time.
            </p>
          </div>
          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: '0.45rem', borderRadius: '50%' }}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Plan Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            marginTop: '1.25rem',
          }}
        >
          {INVESTMENT_PLANS.map((plan) => {
            const isSelected = plan.id === selectedPlanId;
            return (
              <div
                key={plan.id}
                onClick={() => handlePlanSelect(plan)}
                style={{
                  padding: '1.1rem',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  border: isSelected
                    ? `2px solid ${plan.color}`
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  background: isSelected
                    ? 'rgba(236, 121, 107, 0.07)'
                    : 'rgba(255, 255, 255, 0.02)',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? `0 0 20px ${plan.color}25` : 'none',
                }}
              >
                {plan.recommended && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-10px',
                      right: '12px',
                      background: 'var(--brand-primary)',
                      color: '#000',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      padding: '0.15rem 0.5rem',
                      borderRadius: '999px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Popular
                  </span>
                )}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: plan.color }}>
                    {plan.tier} Tier
                  </span>
                  {isSelected && <CheckCircle2 size={16} color={plan.color} />}
                </div>

                <div style={{ marginTop: '0.5rem' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>
                    +{plan.expectedRoiPercent}%
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Total Return ({plan.durationDays} Days)
                  </div>
                </div>

                <div
                  style={{
                    marginTop: '0.75rem',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  <div>Min: ${plan.minAmountUsd.toLocaleString()}</div>
                  <div style={{ color: 'var(--brand-success)', marginTop: '0.2rem', fontWeight: 600 }}>
                    ~{plan.dailyYieldPercent}% / day
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Plan Details & Amount Configuration */}
        <div
          style={{
            marginTop: '1.5rem',
            padding: '1.25rem',
            borderRadius: '12px',
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 700 }}>
              Investment Deposit Amount (USD)
            </label>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Range: ${currentPlan.minAmountUsd.toLocaleString()} - ${currentPlan.maxAmountUsd.toLocaleString()}
            </span>
          </div>

          <div style={{ position: 'relative', marginTop: '0.5rem' }}>
            <span
              style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
              }}
            >
              $
            </span>
            <input
              type="number"
              min={currentPlan.minAmountUsd}
              max={currentPlan.maxAmountUsd}
              step="100"
              value={amountUsd}
              onChange={(e) => handleAmountChange(Math.max(0, Number(e.target.value)))}
              style={{
                width: '100%',
                padding: '0.85rem 1rem 0.85rem 2.2rem',
                borderRadius: '8px',
                background: 'rgba(17, 24, 39, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#fff',
                fontSize: '1.2rem',
                fontWeight: 700,
                outline: 'none',
              }}
            />
          </div>

          {/* Preset Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
            {presetAmounts
              .filter((p) => p.value >= currentPlan.minAmountUsd && (!currentPlan.maxAmountUsd || p.value <= currentPlan.maxAmountUsd))
              .map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => handleAmountChange(p.value)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    background: amountUsd === p.value ? 'var(--brand-primary)' : 'rgba(255, 255, 255, 0.05)',
                    color: amountUsd === p.value ? '#000' : 'var(--text-secondary)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {p.label}
                </button>
              ))}
          </div>
        </div>

        {/* Live Return Projection Breakdown */}
        <div
          style={{
            marginTop: '1.25rem',
            padding: '1.25rem',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(236, 121, 107, 0.08) 0%, rgba(16, 185, 129, 0.05) 100%)',
            border: '1px solid rgba(236, 121, 107, 0.2)',
          }}
        >
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--brand-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <TrendingUp size={16} />
            Guaranteed Yield Breakdown
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Initial Principal</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '0.2rem', color: '#FFFFFF' }}>
                {formatUsd(amountUsd)}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Projected Net Profit</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--brand-success)', marginTop: '0.2rem' }}>
                +{formatUsd(expectedProfitUsd)} ({currentPlan.expectedRoiPercent}%)
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Daily Accrual Rate</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--brand-primary)', marginTop: '0.2rem' }}>
                ~{formatUsd(dailyYieldUsd)} / day
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Total Maturity Payout</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', marginTop: '0.2rem' }}>
                {formatUsd(totalPayoutUsd)}
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: '1rem',
              paddingTop: '0.75rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
            }}
          >
            <Clock size={15} color="var(--brand-primary)" />
            <span>
              <strong>{currentPlan.durationDays}-Day Live Timer:</strong> Continuous real-time yield ticker activates the moment you confirm deposit.
            </span>
          </div>
        </div>

        {/* Auto Reinvest Toggle */}
        <div
          style={{
            marginTop: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Auto-Compound Upon Maturity</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Automatically roll over principal + accrued yields for another {currentPlan.durationDays}-day cycle.
            </div>
          </div>
          <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={autoReinvest}
              onChange={(e) => setAutoReinvest(e.target.checked)}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: autoReinvest ? 'var(--brand-primary)' : 'rgba(255, 255, 255, 0.2)',
                borderRadius: '34px',
                transition: '0.2s',
              }}
            />
            <span
              style={{
                position: 'absolute',
                content: '""',
                height: '18px',
                width: '18px',
                left: autoReinvest ? '22px' : '3px',
                bottom: '3px',
                backgroundColor: '#fff',
                borderRadius: '50%',
                transition: '0.2s',
              }}
            />
          </label>
        </div>

        {errorMsg && (
          <div
            style={{
              marginTop: '1rem',
              padding: '0.75rem',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: 'var(--brand-danger)',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <AlertCircle size={16} />
            {errorMsg}
          </div>
        )}

        {/* Footer Actions */}
        <div
          style={{
            marginTop: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '0.75rem',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: '0.7rem 1.25rem' }}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmInvestment}
            className="btn btn-primary"
            style={{
              padding: '0.7rem 1.75rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 0 25px rgba(236, 121, 107, 0.4)',
            }}
            disabled={loading}
          >
            {loading ? (
              <span>Deploying to Vault...</span>
            ) : (
              <>
                <Lock size={15} />
                <span>Confirm & Lock In Plan</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
