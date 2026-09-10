'use client';

import React from 'react';
import { ShieldCheck, Smartphone, Bell, Laptop, Trash2, Key, AlertTriangle, Download } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { exportTransactionsToCsv } from '@/lib/portfolio-store';
import { Transaction } from '@/lib/types';

interface SecuritySettingsProps {
  transactions: Transaction[];
}

export default function SecuritySettings({ transactions }: SecuritySettingsProps) {
  const { user, sessions, toggle2FA, toggleLoginAlerts, revokeSession } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '900px' }}>
      <div>
        <h2 style={{ fontSize: '1.45rem', fontWeight: 800 }}>Security &amp; Account Controls</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Manage your authentication factors, session credentials, and data privacy.
        </p>
      </div>

      {/* 2FA & Login Alerts Controls */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>
          Authentication Safeguards
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Two Factor Authentication Switch */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.85rem' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '0.5rem',
                  background: user?.twoFactorEnabled ? 'var(--brand-success-bg)' : 'var(--bg-surface-elevated)',
                  color: user?.twoFactorEnabled ? 'var(--brand-success)' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Smartphone size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                  Two-Factor Authentication (TOTP / Authenticator App)
                </div>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  Requires a dynamic 6-digit code from Google Authenticator or hardware key upon every login.
                </p>
              </div>
            </div>

            <button
              onClick={toggle2FA}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                background: user?.twoFactorEnabled ? 'var(--brand-success)' : 'var(--bg-surface-elevated)',
                color: user?.twoFactorEnabled ? '#ffffff' : 'var(--text-muted)',
                border: '1px solid var(--border-subtle)',
                transition: 'all 0.2s ease',
              }}
            >
              {user?.twoFactorEnabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)' }} />

          {/* Login Alerts Switch */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.85rem' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '0.5rem',
                  background: user?.loginAlertsEnabled ? 'rgba(59, 130, 246, 0.12)' : 'var(--bg-surface-elevated)',
                  color: user?.loginAlertsEnabled ? 'var(--brand-info)' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Bell size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                  Suspicious Activity &amp; Login Alerts
                </div>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  Receive immediate notifications when your account is accessed from an unrecognized IP address or browser.
                </p>
              </div>
            </div>

            <button
              onClick={toggleLoginAlerts}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                background: user?.loginAlertsEnabled ? 'var(--brand-info)' : 'var(--bg-surface-elevated)',
                color: user?.loginAlertsEnabled ? '#ffffff' : 'var(--text-muted)',
                border: '1px solid var(--border-subtle)',
                transition: 'all 0.2s ease',
              }}
            >
              {user?.loginAlertsEnabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>
      </div>

      {/* Active Device Sessions */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Active Sessions &amp; Authorized Devices
        </h3>
        <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Devices currently logged into your BitcoinPro account. Revoke any unrecognized sessions immediately.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {sessions.map((ses) => (
            <div
              key={ses.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem 1.25rem',
                borderRadius: '0.65rem',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <Laptop size={20} style={{ color: ses.isCurrent ? 'var(--brand-success)' : 'var(--text-muted)' }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>{ses.device} &bull; {ses.browser}</span>
                    {ses.isCurrent && (
                      <span className="pill pill-success" style={{ fontSize: '0.65rem' }}>Current Session</span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    IP: {ses.ipAddress} &bull; {ses.lastActive}
                  </div>
                </div>
              </div>

              {!ses.isCurrent && (
                <button
                  onClick={() => revokeSession(ses.id)}
                  style={{
                    padding: '0.4rem 0.75rem',
                    borderRadius: '0.4rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'var(--brand-danger)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    background: 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Data Export & Privacy */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Data Portability &amp; Backup
        </h3>
        <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Download a verified CSV statement of all your historical purchases and cost-basis logs for your tax reports.
        </p>

        <button
          onClick={() => exportTransactionsToCsv(transactions)}
          className="btn btn-secondary"
          style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}
        >
          <Download size={15} />
          <span>Export All Data as CSV</span>
        </button>
      </div>
    </div>
  );
}
