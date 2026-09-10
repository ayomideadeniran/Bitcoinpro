'use client';

import React, { useState } from 'react';
import { FileSpreadsheet, Download, AlertCircle, CheckCircle2, Calculator, Calendar, HelpCircle, ShieldCheck } from 'lucide-react';
import { Transaction } from '@/lib/types';
import { generateTaxReport, exportTaxReportCsv } from '@/lib/tax-engine';
import { formatUsd, formatBtc } from '@/lib/btc-calc';

interface TaxReportsProps {
  transactions: Transaction[];
  satsMode: boolean;
}

export default function TaxReports({ transactions, satsMode }: TaxReportsProps) {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  const report = generateTaxReport(transactions, selectedYear);

  const handleDownloadCsv = () => {
    exportTaxReportCsv(report.items, selectedYear);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '0.5rem',
                background: 'rgba(59, 130, 246, 0.15)',
                color: 'var(--brand-info)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FileSpreadsheet size={18} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Capital Gains & Tax Reports</h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Automated FIFO cost-basis calculations, IRS Form 8949 itemization, and tax-loss harvesting records.
          </p>
        </div>

        {/* Action buttons & year selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            style={{
              padding: '0.55rem 1rem',
              borderRadius: '0.5rem',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-surface-elevated)',
              fontSize: '0.875rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {[currentYear, currentYear - 1, currentYear - 2].map((yr) => (
              <option key={yr} value={yr}>
                Tax Year {yr}
              </option>
            ))}
          </select>

          <button
            onClick={handleDownloadCsv}
            disabled={report.items.length === 0}
            className="btn btn-primary"
            style={{
              padding: '0.55rem 1.15rem',
              fontSize: '0.875rem',
              opacity: report.items.length === 0 ? 0.6 : 1,
              cursor: report.items.length === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            <Download size={16} />
            <span>Download Form 8949 CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {/* Proceeds */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Total Proceeds</span>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, margin: '0.35rem 0' }}>
            {formatUsd(report.totalProceedsUsd)}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Gross disposition volume</span>
        </div>

        {/* Cost Basis */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Cost Basis (FIFO)</span>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, margin: '0.35rem 0' }}>
            {formatUsd(report.totalCostBasisUsd)}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Original capital outlay</span>
        </div>

        {/* Net Gain/Loss */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Net Capital Gain / (Loss)</span>
          <div
            style={{
              fontSize: '1.65rem',
              fontWeight: 800,
              margin: '0.35rem 0',
              color: report.netGainLossUsd >= 0 ? 'var(--brand-success)' : 'var(--brand-danger)',
            }}
          >
            {report.netGainLossUsd >= 0 ? '+' : ''}{formatUsd(report.netGainLossUsd)}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {report.netGainLossUsd >= 0 ? 'Taxable taxable gain' : 'Potential tax write-off'}
          </span>
        </div>

        {/* Short-Term vs Long-Term */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Short vs Long Term</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.35rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Short-Term (≤1yr):</span>
              <strong style={{ color: report.shortTermGainUsd >= 0 ? 'var(--text-main)' : 'var(--brand-danger)' }}>
                {formatUsd(report.shortTermGainUsd)}
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Long-Term (&gt;1yr):</span>
              <strong style={{ color: report.longTermGainUsd >= 0 ? 'var(--brand-success)' : 'var(--brand-danger)' }}>
                {formatUsd(report.longTermGainUsd)}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Dispositions Table */}
      <div className="glass-card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Itemized Form 8949 Dispositions ({selectedYear})</h3>
            <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
              Complies with IRS Part I (Short-Term) and Part II (Long-Term) reporting rules.
            </span>
          </div>
        </div>

        {report.items.length === 0 ? (
          <div
            style={{
              padding: '3rem 1.5rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px dashed var(--border-subtle)',
              borderRadius: '0.75rem',
            }}
          >
            <CheckCircle2 size={36} color="var(--brand-success)" style={{ marginBottom: '0.75rem' }} />
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }}>
              No Taxable Dispositions in {selectedYear}
            </h4>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', maxWidth: '420px', lineHeight: 1.5 }}>
              All your Bitcoin transactions for this period were purchases or self-custody transfers. Simply buying and holding Bitcoin is never a taxable event under IRS guidelines.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Asset</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Acquired</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Disposed</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Proceeds (USD)</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Cost Basis (USD)</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Gain / (Loss)</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Term</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: '0.85rem' }}>
                {report.items.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0.85rem 0.5rem', fontWeight: 600 }}>
                      {item.amountBtc.toFixed(6)} BTC
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem', color: 'var(--text-muted)' }}>
                      {item.dateAcquired}
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem', color: 'var(--text-muted)' }}>
                      {item.dateSold}
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem', fontWeight: 600 }}>
                      {formatUsd(item.proceedsUsd)}
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem', color: 'var(--text-muted)' }}>
                      {formatUsd(item.costBasisUsd)}
                    </td>
                    <td
                      style={{
                        padding: '0.85rem 0.5rem',
                        fontWeight: 700,
                        color: item.gainLossUsd >= 0 ? 'var(--brand-success)' : 'var(--brand-danger)',
                      }}
                    >
                      {item.gainLossUsd >= 0 ? '+' : ''}{formatUsd(item.gainLossUsd)}
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem' }}>
                      <span
                        style={{
                          padding: '0.2rem 0.5rem',
                          borderRadius: '0.3rem',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          background: item.holdingPeriod === 'long_term' ? 'var(--brand-success-bg)' : 'var(--bg-surface-elevated)',
                          color: item.holdingPeriod === 'long_term' ? 'var(--brand-success)' : 'var(--text-muted)',
                        }}
                      >
                        {item.holdingPeriod === 'long_term' ? 'Long-Term' : 'Short-Term'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Tax Guidance & Legal Notice */}
      <div
        style={{
          padding: '1.25rem 1.5rem',
          borderRadius: '0.75rem',
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          gap: '1rem',
          alignItems: 'flex-start',
        }}
      >
        <AlertCircle size={20} color="var(--brand-btc)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          <strong style={{ color: 'var(--text-main)' }}>Tax Disclaimer & Methodology:</strong> BitcoinPro generates reports using the First-In, First-Out (FIFO) universal accounting method for digital assets. Transferring Bitcoin to a self-custody wallet is not a taxable disposition under current federal guidelines. This summary is intended for record-keeping and estimation purposes and does not constitute formal tax or legal advice. Please review your filing with a certified tax professional.
        </div>
      </div>
    </div>
  );
}
