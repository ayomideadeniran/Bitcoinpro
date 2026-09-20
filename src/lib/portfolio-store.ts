import { Transaction, InvestmentGoal } from './types';
import { btcToSats } from './btc-calc';

export const SEED_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-101',
    date: '2026-08-15T14:30:00Z',
    type: 'spot_buy',
    amountBtc: 0.015,
    amountUsd: 1200,
    pricePerBtc: 80000,
    feeUsd: 5.88,
    status: 'completed',
    notes: 'Initial starter allocation',
    txHash: '3a4b89f21c...99e1',
  },
  {
    id: 'tx-102',
    date: '2026-08-22T09:15:00Z',
    type: 'recurring_buy',
    amountBtc: 0.005,
    amountUsd: 415,
    pricePerBtc: 83000,
    feeUsd: 2.03,
    status: 'completed',
    notes: 'Weekly automated DCA',
    txHash: '7f12e8412b...4a20',
  },
  {
    id: 'tx-103',
    date: '2026-08-29T09:15:00Z',
    type: 'recurring_buy',
    amountBtc: 0.005,
    amountUsd: 435,
    pricePerBtc: 87000,
    feeUsd: 2.13,
    status: 'completed',
    notes: 'Weekly automated DCA',
    txHash: 'c992015df3...18b7',
  },
];

export const SEED_GOALS: InvestmentGoal[] = [
  {
    id: 'goal-1',
    title: 'Stack 5,000,000 Satoshis (0.05 BTC)',
    category: 'sats_target',
    targetAmountUsd: 4500,
    targetBtc: 0.05,
    durationMonths: 12,
    startDate: '2026-08-01',
    notes: 'Long-term savings milestone for sovereign reserve',
  },
  {
    id: 'goal-2',
    title: 'Invest $1,000 in Bitcoin Over 12 Months',
    category: 'usd_target',
    targetAmountUsd: 1000,
    targetBtc: 0.012,
    durationMonths: 12,
    startDate: '2026-07-01',
    notes: 'Initial beginner habit building goal',
  },
];

function getTxKey(userEmail?: string): string {
  if (userEmail && userEmail.trim()) {
    return `bitcoinpro_portfolio_tx_${userEmail.trim().toLowerCase()}`;
  }
  return 'bitcoinpro_portfolio_tx';
}

function getGoalsKey(userEmail?: string): string {
  if (userEmail && userEmail.trim()) {
    return `bitcoinpro_portfolio_goals_${userEmail.trim().toLowerCase()}`;
  }
  return 'bitcoinpro_portfolio_goals';
}

export function getStoredTransactions(userEmail?: string): Transaction[] {
  if (typeof window === 'undefined') return userEmail ? [] : SEED_TRANSACTIONS;
  try {
    const key = getTxKey(userEmail);
    const item = localStorage.getItem(key);
    if (item) return JSON.parse(item);

    // If it's a specific registered user with no previous tx, start fresh with empty portfolio
    if (userEmail && userEmail.trim()) {
      return [];
    }
    return SEED_TRANSACTIONS;
  } catch {
    return userEmail ? [] : SEED_TRANSACTIONS;
  }
}

export function saveStoredTransactions(txs: Transaction[], userEmail?: string): void {
  if (typeof window === 'undefined') return;
  try {
    const key = getTxKey(userEmail);
    localStorage.setItem(key, JSON.stringify(txs));
  } catch (err) {
    console.error('Failed to save transactions to localStorage', err);
  }
}

export function getStoredGoals(userEmail?: string): InvestmentGoal[] {
  if (typeof window === 'undefined') return userEmail ? [] : SEED_GOALS;
  try {
    const key = getGoalsKey(userEmail);
    const item = localStorage.getItem(key);
    if (item) return JSON.parse(item);

    if (userEmail && userEmail.trim()) {
      return [];
    }
    return SEED_GOALS;
  } catch {
    return userEmail ? [] : SEED_GOALS;
  }
}

export function saveStoredGoals(goals: InvestmentGoal[], userEmail?: string): void {
  if (typeof window === 'undefined') return;
  try {
    const key = getGoalsKey(userEmail);
    localStorage.setItem(key, JSON.stringify(goals));
  } catch (err) {
    console.error('Failed to save goals to localStorage', err);
  }
}

/**
 * Calculates current portfolio metrics from a list of transactions and live BTC price.
 */
export function calculatePortfolioSummary(transactions: Transaction[], currentBtcPrice: number) {
  let totalBtc = 0;
  let totalInvestedUsd = 0;
  let totalFeesUsd = 0;

  for (const tx of transactions) {
    if (tx.status !== 'completed') continue;

    if (tx.type === 'spot_buy' || tx.type === 'recurring_buy' || tx.type === 'transfer_in') {
      totalBtc += tx.amountBtc;
      totalInvestedUsd += tx.amountUsd;
      totalFeesUsd += tx.feeUsd;
    } else if (tx.type === 'sell') {
      totalBtc = Math.max(0, totalBtc - tx.amountBtc);
      totalInvestedUsd = Math.max(0, totalInvestedUsd - tx.amountUsd);
      totalFeesUsd += tx.feeUsd;
    }
  }

  const currentValueUsd = totalBtc * currentBtcPrice;
  const unrealizedProfitLossUsd = currentValueUsd - totalInvestedUsd;
  const unrealizedProfitLossPercent = totalInvestedUsd > 0 ? (unrealizedProfitLossUsd / totalInvestedUsd) * 100 : 0;
  const averagePurchasePriceUsd = totalBtc > 0 ? totalInvestedUsd / totalBtc : 0;
  const totalSats = btcToSats(totalBtc);

  return {
    totalBtc,
    totalSats,
    totalInvestedUsd,
    totalFeesUsd,
    currentValueUsd,
    unrealizedProfitLossUsd,
    unrealizedProfitLossPercent,
    averagePurchasePriceUsd,
  };
}

/**
 * Generates and downloads a CSV export of transactions.
 */
export function exportTransactionsToCsv(transactions: Transaction[]): void {
  if (typeof window === 'undefined') return;

  const headers = ['Transaction ID', 'Date', 'Type', 'BTC Amount', 'USD Amount', 'Price Per BTC', 'Fee USD', 'Status', 'Notes'];
  const rows = transactions.map((t) => [
    t.id,
    new Date(t.date).toLocaleDateString(),
    t.type,
    t.amountBtc.toFixed(8),
    t.amountUsd.toFixed(2),
    t.pricePerBtc.toFixed(2),
    t.feeUsd.toFixed(2),
    t.status,
    `"${(t.notes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `bitcoinpro_transactions_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
