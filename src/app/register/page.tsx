'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ArrowRight, Lock, Mail, User, AlertCircle, Eye, EyeOff, CheckCircle2, ShieldAlert, RefreshCw } from 'lucide-react';
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

  // Email validation states
  const [emailStatus, setEmailStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle');
  const [emailFeedback, setEmailFeedback] = useState<string | null>(null);
  const [emailSuggestion, setEmailSuggestion] = useState<string | null>(null);

  // Password strength calculation
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);
  const isStrong = hasMinLength && hasNumber && hasLetter;

  // Validate email address and its DNS mail servers
  const checkEmailExistence = async (emailToTest: string): Promise<{ valid: boolean; error?: string }> => {
    const clean = emailToTest.trim().toLowerCase();
    if (!clean || clean.indexOf('@') === -1 || clean.indexOf('.') === -1) {
      setEmailStatus('invalid');
      const err = 'Please enter a complete email address (e.g. name@domain.com).';
      setEmailFeedback(err);
      setEmailSuggestion(null);
      return { valid: false, error: err };
    }

    setEmailStatus('checking');
    setEmailFeedback(null);
    setEmailSuggestion(null);

    try {
      const res = await fetch('/api/auth/validate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: clean }),
      });
      const data = await res.json();

      if (!data.valid) {
        setEmailStatus('invalid');
        const err = data.error || 'This email address is invalid or its domain does not exist.';
        setEmailFeedback(err);
        if (data.suggestion) {
          setEmailSuggestion(data.suggestion);
        }
        return { valid: false, error: err };
      } else {
        setEmailStatus('valid');
        setEmailFeedback('Email address & active mail server verified.');
        return { valid: true };
      }
    } catch {
      setEmailStatus('idle');
      return { valid: true }; // Network fallback
    }
  };

  const handleEmailBlur = () => {
    if (email.trim()) {
      checkEmailExistence(email);
    }
  };

  const handleApplySuggestion = (suggestion: string) => {
    setEmail(suggestion);
    setEmailSuggestion(null);
    checkEmailExistence(suggestion);
  };

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

    // 1. Rigorous email verification before account creation
    const emailCheck = await checkEmailExistence(email);
    if (!emailCheck.valid) {
      setError(emailCheck.error || emailFeedback || 'The email address provided is invalid or its domain does not exist. Please use a valid email.');
      setLoading(false);
      return;
    }

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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label htmlFor="reg-email" style={{ fontSize: '0.825rem', fontWeight: 600 }}>
                  Email Address
                </label>
                {emailStatus === 'checking' && (
                  <span style={{ fontSize: '0.725rem', color: 'var(--brand-btc)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <RefreshCw size={11} className="spin" /> Verifying mail server...
                  </span>
                )}
                {emailStatus === 'valid' && (
                  <span style={{ fontSize: '0.725rem', color: 'var(--brand-success)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                    <CheckCircle2 size={12} /> Active Domain Confirmed
                  </span>
                )}
              </div>

              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="reg-email"
                  type="email"
                  placeholder="jordan.miller@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailStatus !== 'idle') {
                      setEmailStatus('idle');
                      setEmailFeedback(null);
                      setEmailSuggestion(null);
                    }
                  }}
                  onBlur={handleEmailBlur}
                  style={{
                    width: '100%',
                    padding: '0.75rem 2.5rem 0.75rem 2.25rem',
                    borderRadius: '0.5rem',
                    border: '1px solid',
                    borderColor: emailStatus === 'valid'
                      ? 'var(--brand-success)'
                      : emailStatus === 'invalid'
                      ? 'var(--brand-danger)'
                      : 'var(--border-subtle)',
                    background: 'var(--bg-surface-elevated)',
                    fontSize: '0.9rem',
                    color: 'var(--text-main)',
                    transition: 'border-color 0.2s ease',
                  }}
                  required
                />

                <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center' }}>
                  {emailStatus === 'checking' && <RefreshCw size={15} className="spin" style={{ color: 'var(--brand-btc)' }} />}
                  {emailStatus === 'valid' && <CheckCircle2 size={16} style={{ color: 'var(--brand-success)' }} />}
                  {emailStatus === 'invalid' && <AlertCircle size={16} style={{ color: 'var(--brand-danger)' }} />}
                </div>
              </div>

              {/* Typo suggestion chip */}
              {emailSuggestion && (
                <div style={{ marginTop: '0.4rem', fontSize: '0.775rem', color: '#d97706', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>Did you mean:</span>
                  <button
                    type="button"
                    onClick={() => handleApplySuggestion(emailSuggestion)}
                    style={{
                      background: 'rgba(247, 147, 26, 0.15)',
                      border: '1px solid rgba(247, 147, 26, 0.4)',
                      color: 'var(--brand-btc)',
                      borderRadius: '4px',
                      padding: '0.15rem 0.45rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {emailSuggestion} (Click to fix)
                  </button>
                </div>
              )}

              {/* Error feedback */}
              {emailStatus === 'invalid' && emailFeedback && (
                <span style={{ fontSize: '0.75rem', color: 'var(--brand-danger)', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <AlertCircle size={12} style={{ flexShrink: 0 }} />
                  <span>{emailFeedback}</span>
                </span>
              )}

              {/* Normal helper note */}
              {emailStatus !== 'invalid' && !emailSuggestion && (
                <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
                  Must be an active, existing email. We verify mail server records (MX) before activation.
                </span>
              )}
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
