'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ArrowRight, Lock, Mail, User, AlertCircle, Eye, EyeOff, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import ThemeToggle from '@/components/ThemeToggle';

function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [riskAcknowledged, setRiskAcknowledged] = useState(false);
  const [custodyAcknowledged, setCustodyAcknowledged] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Password strength calculation
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);
  const isStrong = hasMinLength && hasNumber && hasLetter;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!riskAcknowledged || !custodyAcknowledged) {
      setError('Please acknowledge all risk disclosures and custody guidelines before continuing.');
      return;
    }

    if (!hasMinLength) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);

    try {
      const res = await register(name, email, password);
      if (!res.success) {
        setError(res.error || 'Failed to create account.');
        setLoading(false);
        return;
      }
      router.push('/dashboard');
    } catch {
      setError('An error occurred during account registration.');
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      {/* Top Header */}
      <div className="container" style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '0.6rem',
              background: 'linear-gradient(135deg, #f7931a 0%, #e08213 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(247, 147, 26, 0.35)',
            }}
          >
            <ShieldCheck size={18} />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-main)' }}>
            Bitcoin<span style={{ color: 'var(--brand-btc)' }}>Pro</span>
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <ThemeToggle />
          <Link href="/" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            &larr; Back to Website
          </Link>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem' }}>
        <div className="glass-card" style={{ maxWidth: '500px', width: '100%', padding: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '0.75rem',
                background: 'rgba(247, 147, 26, 0.15)',
                color: 'var(--brand-btc)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
              }}
            >
              <User size={22} />
            </div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, marginBottom: '0.4rem' }}>
              Create Investor Account
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Get started with institutional-grade portfolio tracking, automated DCA, and self-custody.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                background: 'var(--brand-danger-bg)',
                border: '1px solid var(--brand-danger)',
                color: 'var(--brand-danger)',
                fontSize: '0.825rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1.25rem',
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            {/* Full Name */}
            <div>
              <label htmlFor="reg-name" style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Full Legal Name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="reg-name"
                  type="text"
                  placeholder="e.g. Jordan Miller"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.25rem',
                    borderRadius: '0.5rem',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-surface-elevated)',
                    fontSize: '0.9rem',
                    color: 'var(--text-main)',
                  }}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="reg-email"
                  type="email"
                  placeholder="jordan.miller@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.25rem',
                    borderRadius: '0.5rem',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-surface-elevated)',
                    fontSize: '0.9rem',
                    color: 'var(--text-main)',
                  }}
                  required
                />
              </div>
              <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
                We will dispatch your welcome credentials and security disclosure to this address.
              </span>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="reg-password" style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Security Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 2.5rem 0.75rem 2.25rem',
                    borderRadius: '0.5rem',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-surface-elevated)',
                    fontSize: '0.9rem',
                    color: 'var(--text-main)',
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password Quality Indicator */}
              {password.length > 0 && (
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.725rem' }}>
                  <span style={{ color: hasMinLength ? 'var(--brand-success)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <CheckCircle2 size={12} /> 8+ chars
                  </span>
                  <span style={{ color: hasNumber ? 'var(--brand-success)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <CheckCircle2 size={12} /> Numbers
                  </span>
                  <span style={{ color: hasLetter ? 'var(--brand-success)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <CheckCircle2 size={12} /> Letters
                  </span>
                </div>
              )}
            </div>

            {/* Disclosure Checkboxes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '0.25rem' }}>
              <div
                style={{
                  padding: '0.75rem 0.9rem',
                  borderRadius: '0.5rem',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.65rem',
                }}
              >
                <input
                  id="risk-check"
                  type="checkbox"
                  checked={riskAcknowledged}
                  onChange={(e) => setRiskAcknowledged(e.target.checked)}
                  style={{ marginTop: '3px', accentColor: 'var(--brand-btc)', width: '16px', height: '16px' }}
                  required
                />
                <label htmlFor="risk-check" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                  <strong style={{ color: 'var(--text-main)' }}>Volatile Asset Risk Disclosure:</strong> I acknowledge that Bitcoin is subject to market fluctuation and capital risk. BitcoinPro never guarantees investment returns.
                </label>
              </div>

              <div
                style={{
                  padding: '0.75rem 0.9rem',
                  borderRadius: '0.5rem',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.65rem',
                }}
              >
                <input
                  id="custody-check"
                  type="checkbox"
                  checked={custodyAcknowledged}
                  onChange={(e) => setCustodyAcknowledged(e.target.checked)}
                  style={{ marginTop: '3px', accentColor: 'var(--brand-btc)', width: '16px', height: '16px' }}
                  required
                />
                <label htmlFor="custody-check" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                  <strong style={{ color: 'var(--text-main)' }}>Self-Custody Policy:</strong> I understand that I am encouraged to withdraw Bitcoin to my own hardware wallet for sovereign self-custody.
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !riskAcknowledged || !custodyAcknowledged}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.85rem',
                marginTop: '0.5rem',
                opacity: !riskAcknowledged || !custodyAcknowledged ? 0.6 : 1,
              }}
            >
              <span>{loading ? 'Registering Account...' : 'Create Account & Send Welcome Confirmation'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--brand-btc)', fontWeight: 700 }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return <RegisterForm />;
}
