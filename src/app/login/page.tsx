'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ArrowRight, Lock, Mail, Smartphone, AlertCircle, Eye, EyeOff, Check } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import ThemeToggle from '@/components/ThemeToggle';

function LoginForm() {
  const router = useRouter();
  const { login, guestLogin } = useAuth();
  const [email, setEmail] = useState('alex.rivers@example.com');
  const [password, setPassword] = useState('BitcoinPro2026!');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await login(email, password, twoFactorCode);
      if (!res.success) {
        setError(res.error || 'Authentication failed. Please check your credentials.');
        setLoading(false);
        return;
      }
      router.push('/dashboard');
    } catch {
      setError('An error occurred during authentication. Please try again.');
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setError(null);
    setEmail('alex.rivers@example.com');
    setPassword('BitcoinPro2026!');
    setTwoFactorCode('');
  };

  const handleGuestLogin = () => {
    guestLogin();
    router.push('/dashboard');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      {/* Top Header Link */}
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
        <div className="glass-card" style={{ maxWidth: '460px', width: '100%', padding: '2.5rem' }}>
          {/* Pre-Launch Grand Opening VIP Announcement */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(247, 147, 26, 0.12) 0%, rgba(247, 147, 26, 0.05) 100%)',
              border: '1px solid rgba(247, 147, 26, 0.3)',
              borderRadius: '0.85rem',
              padding: '1rem 1.15rem',
              marginBottom: '1.75rem',
              textAlign: 'center',
            }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', fontWeight: 800, color: 'var(--brand-btc)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
              <span>🚀 Grand Opening In Progress</span>
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-main)', marginBottom: '0.75rem', lineHeight: 1.45 }}>
              Public sign-in is currently reserved for VIP Wishlist members. Secure your priority allocation and launch perks today!
            </p>
            <Link
              href="/register"
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.55rem 1rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #f7931a 0%, #ffaa33 100%)',
                color: '#000',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
              }}
            >
              <span>Join Grand Opening VIP Wishlist</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.25rem' }}>
              Authorized Beta & Team Access
            </h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Sign in with your approved credentials to access internal systems.
            </p>
          </div>

          {/* Quick Fill Demo Badges */}
          <div
            style={{
              padding: '0.85rem',
              borderRadius: '0.6rem',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '1.5rem',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              Quick Select Demo Credentials:
            </div>
            <div style={{ marginTop: '0.65rem' }}>
              <button
                type="button"
                onClick={handleFillDemo}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.4rem',
                  border: '1px solid var(--border-subtle)',
                  background: email === 'alex.rivers@example.com' ? 'rgba(247, 147, 26, 0.15)' : 'var(--bg-surface)',
                  color: email === 'alex.rivers@example.com' ? 'var(--brand-btc)' : 'var(--text-main)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                  cursor: 'pointer',
                }}
              >
                <ShieldCheck size={14} />
                <span>Quick-Fill Investor Demo Account</span>
              </button>
            </div>
          </div>

          {/* Error Message */}
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

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Email */}
            <div>
              <label htmlFor="login-email" style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
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

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <label htmlFor="login-password" style={{ fontSize: '0.825rem', fontWeight: 600 }}>
                  Password
                </label>
                <span style={{ fontSize: '0.75rem', color: 'var(--brand-btc)', cursor: 'pointer' }}>
                  Forgot password?
                </span>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter account password"
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
            </div>

            {/* 2FA Token (Optional for demo) */}
            <div>
              <label htmlFor="login-2fa" style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Authenticator 2FA Code (Optional)
              </label>
              <div style={{ position: 'relative' }}>
                <Smartphone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="login-2fa"
                  type="text"
                  placeholder="6-digit code (e.g. 123456)"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  maxLength={6}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.25rem',
                    borderRadius: '0.5rem',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-surface-elevated)',
                    fontSize: '0.9rem',
                    color: 'var(--text-main)',
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem', marginTop: '0.25rem' }}
            >
              <span>{loading ? 'Authenticating...' : 'Sign In & Verify Session'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick guest button */}
          <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
            <button
              type="button"
              onClick={handleGuestLogin}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Skip credentials with 1-Click Instant Demo
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            New to BitcoinPro?{' '}
            <Link href="/register" style={{ color: 'var(--brand-btc)', fontWeight: 700 }}>
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <LoginForm />;
}
