'use client';

import React from 'react';
import { Target, Plus, CheckCircle, Clock, Trash2, AlertCircle, Award } from 'lucide-react';
import { InvestmentGoal } from '@/lib/types';
import { formatUsd, formatBtc, formatSats, btcToSats } from '@/lib/btc-calc';

interface InvestmentGoalsProps {
  goals: InvestmentGoal[];
  totalBtc: number;
  totalInvestedUsd: number;
  currentBtcPrice: number;
  satsMode: boolean;
  onOpenGoalModal: () => void;
  onDeleteGoal: (id: string) => void;
}

export default function InvestmentGoals({
  goals,
  totalBtc,
  totalInvestedUsd,
  currentBtcPrice,
  satsMode,
  onOpenGoalModal,
  onDeleteGoal,
}: InvestmentGoalsProps) {
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
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800 }}>Investment Goals &amp; Milestones</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Set realistic accumulation targets to stay disciplined without succumbing to short-term volatility.
          </p>
        </div>

        <button
          onClick={onOpenGoalModal}
          className="btn btn-primary"
          style={{ padding: '0.55rem 1.15rem', fontSize: '0.85rem' }}
        >
          <Plus size={16} />
          <span>New Goal</span>
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
          <strong>Goal Reminder:</strong> Progress is measured by your own recurring accumulation and savings consistency. We never guarantee future Bitcoin prices, yields, or projected returns.
        </p>
      </div>

      {/* Goals Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
          gap: '1.5rem',
        }}
      >
        {goals.length === 0 ? (
          <div className="glass-card" style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center' }}>
            <Target size={40} style={{ color: 'var(--brand-btc)', margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Active Goals Yet</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Create your first accumulation target, like stacking 1,000,000 sats over the next year.
            </p>
            <button onClick={onOpenGoalModal} className="btn btn-primary">
              <Plus size={16} />
              <span>Create Your First Goal</span>
            </button>
          </div>
        ) : (
          goals.map((goal) => {
            let progress = 0;
            let currentValDisplay = '';
            let targetValDisplay = '';
            let remainingDisplay = '';

            if (goal.category === 'sats_target') {
              progress = goal.targetBtc > 0 ? Math.min(100, Math.round((totalBtc / goal.targetBtc) * 100)) : 0;
              const currentSats = btcToSats(totalBtc);
              const targetSats = btcToSats(goal.targetBtc);
              const remainingSats = Math.max(0, targetSats - currentSats);

              currentValDisplay = `${formatSats(currentSats)} sats`;
              targetValDisplay = `${formatSats(targetSats)} sats`;
              remainingDisplay = `${formatSats(remainingSats)} sats remaining`;
            } else {
              progress = goal.targetAmountUsd > 0 ? Math.min(100, Math.round((totalInvestedUsd / goal.targetAmountUsd) * 100)) : 0;
              const remainingUsd = Math.max(0, goal.targetAmountUsd - totalInvestedUsd);

              currentValDisplay = formatUsd(totalInvestedUsd, 0);
              targetValDisplay = formatUsd(goal.targetAmountUsd, 0);
              remainingDisplay = `${formatUsd(remainingUsd, 0)} remaining`;
            }

            const isCompleted = progress >= 100;

            return (
              <div
                key={goal.id}
                className="glass-card"
                style={{
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderTop: isCompleted ? '4px solid var(--brand-success)' : '4px solid var(--brand-btc)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <span
                      className="pill"
                      style={{
                        background: isCompleted ? 'var(--brand-success-bg)' : 'rgba(236, 121, 107, 0.12)',
                        color: isCompleted ? 'var(--brand-success)' : 'var(--brand-btc)',
                        fontSize: '0.725rem',
                      }}
                    >
                      {isCompleted ? '🎉 Goal Achieved!' : `${goal.durationMonths} Months Horizon`}
                    </span>
                    <button
                      onClick={() => onDeleteGoal(goal.id)}
                      title="Delete goal"
                      style={{ color: 'var(--text-muted)', background: 'transparent', padding: '0.2rem', cursor: 'pointer' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                    {goal.title}
                  </h3>
                  {goal.notes && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: 1.4 }}>
                      {goal.notes}
                    </p>
                  )}

                  {/* Progress Stats */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                    <span className="mono" style={{ fontSize: '1.35rem', fontWeight: 800, color: isCompleted ? 'var(--brand-success)' : 'var(--text-main)' }}>
                      {currentValDisplay}
                    </span>
                    <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                      of {targetValDisplay}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ height: '8px', borderRadius: '4px', background: 'var(--bg-surface-elevated)', overflow: 'hidden', marginBottom: '0.75rem' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${progress}%`,
                        background: isCompleted ? 'var(--brand-success)' : 'linear-gradient(90deg, #ec796b, #10b981)',
                        borderRadius: '4px',
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                    <span>{progress}% Completed</span>
                    <span>{remainingDisplay}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', marginTop: '1.5rem', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                  <Clock size={14} />
                  <span>Started: {new Date(goal.startDate).toLocaleDateString()}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
