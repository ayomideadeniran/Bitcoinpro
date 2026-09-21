import { InvestmentPlan, ActiveInvestment } from './types';

export const INVESTMENT_PLANS: InvestmentPlan[] = [
  {
    id: 'silver-growth',
    name: 'Silver Growth',
    tier: 'Silver',
    minAmountUsd: 200,
    maxAmountUsd: 4999,
    durationDays: 7,
    expectedRoiPercent: 2.5,
    dailyYieldPercent: 0.36,
    color: '#94A3B8',
    features: [
      'Real-time automated yield settlement',
      'Audited multi-sig cold vault custody',
      'Automated maturity return guarantee',
      'Zero management or maintenance fees',
    ],
  },
  {
    id: 'gold-institutional',
    name: 'Gold Institutional Alpha',
    tier: 'Gold',
    minAmountUsd: 5000,
    maxAmountUsd: 24999,
    durationDays: 14,
    expectedRoiPercent: 5.6,
    dailyYieldPercent: 0.40,
    recommended: true,
    color: '#F59E0B',
    features: [
      'Priority algorithmic arbitrage yield engine',
      'Dedicated institutional portfolio desk',
      '24/7 expedited withdrawal priority',
      'Full capital loss protection reserve',
    ],
  },
  {
    id: 'platinum-sovereign',
    name: 'Platinum Sovereign Vault',
    tier: 'Platinum',
    minAmountUsd: 25000,
    maxAmountUsd: 99999,
    durationDays: 30,
    expectedRoiPercent: 11.4,
    dailyYieldPercent: 0.38,
    color: '#38BDF8',
    features: [
      'Direct segregated multi-sig Bitcoin reserve',
      'VIP deep liquidity OTC block routing',
      'Real-time cryptographic audit trail',
      'Certified institutional tax reports',
    ],
  },
  {
    id: 'diamond-whale',
    name: 'Diamond Whale Reserve',
    tier: 'Diamond',
    minAmountUsd: 100000,
    maxAmountUsd: 1000000,
    durationDays: 60,
    expectedRoiPercent: 22.8,
    dailyYieldPercent: 0.38,
    color: '#A855F7',
    features: [
      'Bespoke institutional high-frequency desk',
      'Zero slippage private liquidity pool',
      'Personal crypto wealth manager & hotline',
      'Instantaneous maximum-limit settlement',
    ],
  },
];

// Helper to sanitize and get user partition key
function getUserPartitionKey(email?: string): string {
  if (!email || typeof email !== 'string' || !email.trim()) {
    return 'guest';
  }
  return email.trim().toLowerCase().replace(/[^a-z0-9_.-]/g, '_');
}

export function getInvestmentsStorageKey(userEmail?: string): string {
  return `bitcoin_pro_investments_${getUserPartitionKey(userEmail)}`;
}

// Read investments isolated per user
export function getStoredInvestments(userEmail?: string): ActiveInvestment[] {
  if (typeof window === 'undefined') return [];
  try {
    const key = getInvestmentsStorageKey(userEmail);
    const data = localStorage.getItem(key);
    if (!data) return [];
    return JSON.parse(data) as ActiveInvestment[];
  } catch (err) {
    console.error('[InvestmentStore] Failed to read user investments:', err);
    return [];
  }
}

// Save investments isolated per user
export function saveStoredInvestments(investments: ActiveInvestment[], userEmail?: string): void {
  if (typeof window === 'undefined') return;
  try {
    const key = getInvestmentsStorageKey(userEmail);
    localStorage.setItem(key, JSON.stringify(investments));
  } catch (err) {
    console.error('[InvestmentStore] Failed to save user investments:', err);
  }
}

// Add a new active investment isolated per user
export function addStoredInvestment(investment: ActiveInvestment, userEmail?: string): ActiveInvestment[] {
  const current = getStoredInvestments(userEmail);
  const updated = [investment, ...current];
  saveStoredInvestments(updated, userEmail);
  return updated;
}

// Claim an active or matured investment
export function claimStoredInvestment(investmentId: string, userEmail?: string): ActiveInvestment[] {
  const current = getStoredInvestments(userEmail);
  const updated = current.map((inv) => {
    if (inv.id === investmentId) {
      return { ...inv, status: 'claimed' as const };
    }
    return inv;
  });
  saveStoredInvestments(updated, userEmail);
  return updated;
}

export interface InvestmentGrowthMetrics {
  totalProfitUsd: number;
  accruedProfitUsd: number;
  currentTotalValueUsd: number;
  progressFraction: number; // 0 to 1
  progressPercent: number; // 0 to 100
  elapsedMs: number;
  remainingMs: number;
  isMatured: boolean;
  dailyYieldUsd: number;
  secondYieldUsd: number;
}

// Calculate real-time continuous growth and ticking profit
export function calculateInvestmentGrowth(
  investment: ActiveInvestment,
  nowMs: number = Date.now()
): InvestmentGrowthMetrics {
  const startMs = new Date(investment.startDate).getTime();
  const maturityMs = new Date(investment.maturityDate).getTime();
  const totalDurationMs = Math.max(1000, maturityMs - startMs);
  const elapsedMs = Math.max(0, nowMs - startMs);

  const totalProfitUsd = investment.amountInvestedUsd * (investment.expectedRoiPercent / 100);
  const dailyYieldUsd = totalProfitUsd / Math.max(1, investment.durationDays);
  const secondYieldUsd = totalProfitUsd / (totalDurationMs / 1000);

  const isMatured = elapsedMs >= totalDurationMs || investment.status === 'matured' || investment.status === 'claimed';
  const progressFraction = isMatured ? 1 : Math.min(1, elapsedMs / totalDurationMs);
  const progressPercent = Math.min(100, progressFraction * 100);

  const accruedProfitUsd = isMatured ? totalProfitUsd : totalProfitUsd * progressFraction;
  const currentTotalValueUsd = investment.amountInvestedUsd + accruedProfitUsd;
  const remainingMs = isMatured ? 0 : Math.max(0, maturityMs - nowMs);

  return {
    totalProfitUsd,
    accruedProfitUsd,
    currentTotalValueUsd,
    progressFraction,
    progressPercent,
    elapsedMs,
    remainingMs,
    isMatured,
    dailyYieldUsd,
    secondYieldUsd,
  };
}

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  formatted: string;
}

// Format countdown ms into precise human-readable segments
export function formatCountdownParts(ms: number): CountdownParts {
  if (ms <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, formatted: '00d 00h 00m 00s (Matured)' };
  }

  const totalSecs = Math.floor(ms / 1000);
  const days = Math.floor(totalSecs / 86400);
  const hours = Math.floor((totalSecs % 86400) / 3600);
  const minutes = Math.floor((totalSecs % 3600) / 60);
  const seconds = totalSecs % 60;

  const pad = (n: number) => String(n).padStart(2, '0');
  const formatted = `${days}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;

  return {
    days,
    hours,
    minutes,
    seconds,
    formatted,
  };
}
