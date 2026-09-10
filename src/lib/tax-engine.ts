import { Transaction, TaxReportItem } from './types';

/**
 * Calculates FIFO (First In, First Out) Capital Gains & Losses based on transaction history.
 */
export function generateTaxReport(transactions: Transaction[], taxYear: number): {
  items: TaxReportItem[];
  totalProceedsUsd: number;
  totalCostBasisUsd: number;
  netGainLossUsd: number;
  shortTermGainUsd: number;
  longTermGainUsd: number;
} {
  // Sort chronological
  const sorted = [...transactions]
    .filter((t) => t.status === 'completed')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Inventory pool for FIFO
  const buyPool: Array<{
    id: string;
    date: string;
    btcRemaining: number;
    pricePerBtc: number;
  }> = [];

  const items: TaxReportItem[] = [];

  let totalProceedsUsd = 0;
  let totalCostBasisUsd = 0;
  let shortTermGainUsd = 0;
  let longTermGainUsd = 0;

  for (const tx of sorted) {
    if (tx.type === 'spot_buy' || tx.type === 'recurring_buy' || tx.type === 'transfer_in') {
      buyPool.push({
        id: tx.id,
        date: tx.date,
        btcRemaining: tx.amountBtc,
        pricePerBtc: tx.pricePerBtc,
      });
    } else if (tx.type === 'sell' || tx.type === 'withdrawal') {
      // Dispositions
      let btcToMatch = tx.amountBtc;
      const saleDate = new Date(tx.date);
      const saleYear = saleDate.getFullYear();

      // Only include dispositions from the selected tax year
      const isTargetYear = saleYear === taxYear;

      while (btcToMatch > 0.00000001 && buyPool.length > 0) {
        const earliestBuy = buyPool[0];
        const matchedBtc = Math.min(btcToMatch, earliestBuy.btcRemaining);

        const buyDate = new Date(earliestBuy.date);
        const daysHeld = (saleDate.getTime() - buyDate.getTime()) / (1000 * 60 * 60 * 24);
        const holdingPeriod: 'short_term' | 'long_term' = daysHeld > 365 ? 'long_term' : 'short_term';

        const proceeds = matchedBtc * tx.pricePerBtc;
        const costBasis = matchedBtc * earliestBuy.pricePerBtc;
        const gainLoss = proceeds - costBasis;

        if (isTargetYear) {
          totalProceedsUsd += proceeds;
          totalCostBasisUsd += costBasis;
          if (holdingPeriod === 'short_term') {
            shortTermGainUsd += gainLoss;
          } else {
            longTermGainUsd += gainLoss;
          }

          items.push({
            id: `tax-${items.length + 1}`,
            asset: 'Bitcoin (BTC)',
            dateAcquired: earliestBuy.date.split('T')[0],
            dateSold: tx.date.split('T')[0],
            amountBtc: matchedBtc,
            proceedsUsd: proceeds,
            costBasisUsd: costBasis,
            gainLossUsd: gainLoss,
            holdingPeriod,
          });
        }

        earliestBuy.btcRemaining -= matchedBtc;
        btcToMatch -= matchedBtc;

        if (earliestBuy.btcRemaining <= 0.00000001) {
          buyPool.shift();
        }
      }
    }
  }

  return {
    items,
    totalProceedsUsd,
    totalCostBasisUsd,
    netGainLossUsd: totalProceedsUsd - totalCostBasisUsd,
    shortTermGainUsd,
    longTermGainUsd,
  };
}

/**
 * Exports IRS Form 8949 formatted CSV statement.
 */
export function exportTaxReportCsv(items: TaxReportItem[], year: number): void {
  if (typeof window === 'undefined') return;

  const headers = [
    'Description of Property',
    'Date Acquired',
    'Date Sold or Disposed',
    'Proceeds (Sales Price)',
    'Cost or Other Basis',
    'Gain or (Loss)',
    'Holding Period',
  ];

  const rows = items.map((i) => [
    `"${i.amountBtc.toFixed(6)} BTC"`,
    i.dateAcquired,
    i.dateSold,
    i.proceedsUsd.toFixed(2),
    i.costBasisUsd.toFixed(2),
    i.gainLossUsd.toFixed(2),
    i.holdingPeriod === 'long_term' ? 'Long-Term (>1 yr)' : 'Short-Term (<=1 yr)',
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `bitcoinpro_tax_report_${year}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
