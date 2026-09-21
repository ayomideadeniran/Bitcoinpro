'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  ArrowRight,
  Mail,
  User,
  Phone,
  Globe,
  Sparkles,
  Award,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  Copy,
  Check,
  Calendar,
  Layers,
  TrendingUp,
  Lock,
  MessageSquare,
  CreditCard,
  ArrowLeft,
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import { calculateCurrentWaitlistBase, useCountUp } from '@/lib/waitlist-utils';

import { ALL_COUNTRIES_DATA } from '@/lib/countries-data';

const INVESTMENT_TIERS = [
  {
    id: 'starter',
    label: '$200 – $10,000',
    subtitle: 'Private Starter Allocation',
    badge: 'Standard Access',
  },
  {
    id: 'growth',
    label: '$10,000 – $50,000',
    subtitle: 'High-Yield Wealth Builder',
    badge: 'Most Popular',
  },
  {
    id: 'institutional',
    label: '$50,000 – $250,000',
    subtitle: 'Institutional Custody Tier',
    badge: 'Priority VIP',
  },
  {
    id: 'whale',
    label: '$250,000+',
    subtitle: 'Private Office / OTC Execution',
    badge: 'Executive White-Glove',
  },
];

const STRATEGY_INTERESTS = [
  'Starknet Bitcoin ZK-Vault & 12.4% APY Yield',
  'Bitcoin Layer-2 ZK-Rollup Scaling & Settlement',
  'Institutional Multi-Sig Cold Custody (BTC & Starknet)',
  'Automated Bitcoin Dollar-Cost Averaging (DCA)',
  'Algorithmic Arbitrage & Delta-Neutral Growth',
  'OTC High-Volume Liquidity & Private Vaults',
];

const INVESTOR_TYPES = [
  'Individual / Private Investor ($200+ Starter)',
  'Active Bitcoin & Web3 Trader',
  'Accredited / High-Net-Worth Individual',
  'Family Office / Private Wealth Manager',
  'Corporate Treasury / DAO Balance Sheet',
  'Institutional Fund & Asset Manager',
];

const PAYMENT_METHODS = [
  {
    id: 'usdt_usdc',
    label: 'USDT / USDC (Stablecoins)',
    badge: 'Fastest Settlement',
    subtitle: 'Zero volatility, instant on-chain multi-chain deposit',
    icon: '🪙',
  },
  {
    id: 'btc',
    label: 'Bitcoin (BTC / Lightning)',
    badge: 'Native Crypto',
    subtitle: 'On-chain cold storage or instant Lightning L2',
    icon: '⚡',
  },
  {
    id: 'eth',
    label: 'Ethereum (ETH / ERC-20)',
    badge: 'Smart Contract',
    subtitle: 'Direct Web3 wallet or exchange transfer',
    icon: '🔷',
  },
  {
    id: 'starknet',
    label: 'Starknet (STRK / ETH)',
    badge: 'ZK-Rollup L2',
    subtitle: 'Braavos / Argent X native Starknet layer 2',
    icon: '🌟',
  },
  {
    id: 'wire',
    label: 'Bank Wire Transfer (USD / EUR / GBP)',
    badge: 'Institutional',
    subtitle: 'FedWire, SWIFT, SEPA corporate custody execution',
    icon: '🏦',
  },
  {
    id: 'card',
    label: 'Credit / Debit Card (Apple / Google Pay)',
    badge: 'Instant On-Ramp',
    subtitle: 'Direct card checkout via regulated fiat gateway',
    icon: '💳',
  },
];

export default function GrandOpeningWishlistPage() {
  // Form input states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phonePrefix, setPhonePrefix] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country, setCountry] = useState('United States');
  const [investmentTier, setInvestmentTier] = useState('$10,000 – $50,000');
  const [paymentMethod, setPaymentMethod] = useState('USDT / USDC (Stablecoins)');
  const [investorType, setInvestorType] = useState('Individual / Private Investor ($200+ Starter)');
  const [primaryInterest, setPrimaryInterest] = useState(STRATEGY_INTERESTS[0]);
  const [telegramHandle, setTelegramHandle] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [notes, setNotes] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(false);

  // Status & loading
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Real-time email validation
  const [emailStatus, setEmailStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle');
  const [emailFeedback, setEmailFeedback] = useState<string | null>(null);

  // Dynamic baseline count (+20 each day) and animated count-up from 1
  const initialBase = calculateCurrentWaitlistBase();
  const [targetWaitlistCount, setTargetWaitlistCount] = useState(initialBase);
  const animatedDisplayCount = useCountUp(targetWaitlistCount, 1800);

  // Issued ticket pass upon submission
  const [ticket, setTicket] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  // Check for existing ticket in localStorage on load or fetch stats
  useEffect(() => {
    try {
      const savedTicket = localStorage.getItem('bpro_grand_opening_ticket');
      if (savedTicket) {
        setTicket(JSON.parse(savedTicket));
      }
    } catch {}

    const fetchStats = async () => {
      try {
        const res = await fetch('/api/wishlist');
        const data = await res.json();
        if (data.totalWaitlistCount) {
          setTargetWaitlistCount(data.totalWaitlistCount);
        }
      } catch {}
    };

    fetchStats();
  }, []);

  // Real-time Email check
  const handleEmailBlur = async () => {
    const clean = email.trim().toLowerCase();
    if (!clean || clean.indexOf('@') === -1 || clean.indexOf('.') === -1) {
      if (clean.length > 0) {
        setEmailStatus('invalid');
        setEmailFeedback('Please enter a valid email format.');
      }
      return;
    }

    setEmailStatus('checking');
    setEmailFeedback(null);

    try {
      const res = await fetch('/api/auth/validate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: clean }),
      });
      const data = await res.json();

      if (!data.valid) {
        setEmailStatus('invalid');
        setEmailFeedback(data.error || 'This email domain does not have active mail servers.');
      } else {
        setEmailStatus('valid');
        setEmailFeedback('Verified institutional / corporate mail domain.');
      }
    } catch {
      setEmailStatus('idle');
    }
  };

  // Submit Grand Opening VIP Registration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!termsAgreed) {
      setError('Please acknowledge the Grand Opening Early Access Terms.');
      return;
    }

    if (!fullName.trim() || !email.trim() || !phoneNumber.trim()) {
      setError('Please provide your name, email, and phone number.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: `${phonePrefix} ${phoneNumber.trim()}`,
        country,
        investmentTier,
        paymentMethod,
        investorType,
        primaryInterest,
        telegramHandle: telegramHandle.trim() || undefined,
        referralCode: referralCode.trim() || undefined,
        notes: notes.trim() || undefined,
      };

      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'Failed to submit registration. Please try again.');
        setLoading(false);
        return;
      }

      setTicket(data.ticket);
      try {
        localStorage.setItem('bpro_grand_opening_ticket', JSON.stringify(data.ticket));
      } catch {}

      setTargetWaitlistCount((prev: number) => prev + 1);
      setLoading(false);
    } catch (err: any) {
      setError('An error occurred while submitting your registration. Please try again.');
      setLoading(false);
    }
  };

  const handleCopyTicket = () => {
    if (!ticket) return;
    navigator.clipboard.writeText(ticket.ticketId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      {/* Premium Sticky Glass Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          backgroundColor: 'var(--bg-glass)',
          borderBottom: '1px solid var(--border-subtle)',
          width: '100%',
          transition: 'all 0.25s ease',
        }}
      >
        <div
          className="container"
          style={{
            height: '70px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          {/* Left: Brand Identity */}
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            <img
              src="/icon.png"
              alt="Starknet Logo"
              width={36}
              height={36}
              style={{
                borderRadius: '50%',
                objectFit: 'contain',
                boxShadow: '0 4px 14px rgba(236, 121, 107, 0.35)',
                flexShrink: 0,
              }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span
                style={{
                  fontWeight: 900,
                  fontSize: '1.28rem',
                  letterSpacing: '-0.02em',
                  color: 'var(--text-main)',
                  whiteSpace: 'nowrap',
                }}
              >
                Stark<span style={{ color: '#ec796b' }}>net</span>
              </span>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '9999px',
                  background: 'rgba(236, 121, 107, 0.12)',
                  border: '1px solid rgba(236, 121, 107, 0.3)',
                  color: '#ec796b',
                  letterSpacing: '0.04em',
                }}
                className="desktop-only"
              >
                VIP Portal
              </span>
            </div>
          </Link>

          {/* Center: Security Trust Pill (Desktop >= 1024px) */}
          <div
            className="desktop-only"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
            }}
          >
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
            <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>256-Bit Encrypted Portal</span>
            <span>•</span>
            <span>Priority Queue Active</span>
          </div>

          {/* Right: Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
            <ThemeToggle />
            <Link href="/" className="nav-back-btn" title="Return to Starknet Protocol Homepage">
              <ArrowLeft size={15} />
              <span>Back to Protocol</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem 1.25rem 3.5rem' }}>
        <div style={{ maxWidth: '780px', width: '100%' }}>
          {/* Header Banner */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(236, 121, 107, 0.12)',
                border: '1px solid rgba(236, 121, 107, 0.35)',
                color: '#ec796b',
                padding: '0.45rem 1.1rem',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                fontWeight: 700,
                marginBottom: '1rem',
              }}
            >
              <Sparkles size={16} />
              <span>Starknet Grand Opening Allocation • Limited VIP Registry</span>
            </div>

            <h1 style={{ fontSize: 'clamp(1.85rem, 4vw, 2.65rem)', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '0.65rem', lineHeight: 1.2 }}>
              Starknet <span style={{ color: '#ec796b' }}>VIP Wishlist</span>
            </h1>
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', maxWidth: '620px', margin: '0 auto', lineHeight: 1.55 }}>
              Register for exclusive pre-launch priority on the Starknet Bitcoin Ecosystem. Wishlist participants receive guaranteed capital allocation, zero fees during launch week, and access to the 12.4% APY institutional vault.
            </p>

            {/* Live Queue Counter */}
            <div
              style={{
                marginTop: '1.25rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.5rem 1rem',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '0.75rem',
                fontSize: '0.85rem',
              }}
            >
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 8px #22c55e' }} />
              <span>
                <strong style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--text-main)', fontSize: '0.95rem' }}>
                  {animatedDisplayCount.toLocaleString()}
                </strong>{' '}
                Investors & Treasuries On Wishlist
              </span>
              <span style={{ color: 'var(--text-muted)' }}>•</span>
              <span style={{ color: 'var(--brand-btc)', fontWeight: 700 }}>Priority Queue Active</span>
            </div>
          </div>

          {/* Conditional Display: VIP Ticket Pass OR Registration Form */}
          {ticket ? (
            /* ISSUED VIP TICKET PASS CARD */
            <div className="glass-card" style={{ padding: '2.5rem', borderRadius: '1.25rem', position: 'relative', overflow: 'hidden' }}>
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '6px',
                  background: 'linear-gradient(90deg, #ec796b, #ff8c7e, #ec796b)',
                }}
              />

              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '1rem',
                    background: 'rgba(34, 197, 94, 0.12)',
                    color: '#22c55e',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem',
                  }}
                >
                  <CheckCircle2 size={32} />
                </div>
                <h2 style={{ fontSize: '1.65rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                  You Are On The VIP Wishlist!
                </h2>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  Your official Grand Opening Priority Pass has been minted and secured.
                </p>
              </div>

              {/* Holographic VIP Ticket Box */}
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(236, 121, 107, 0.15) 0%, rgba(14, 16, 43, 0.95) 100%)',
                  border: '2px solid rgba(236, 121, 107, 0.45)',
                  borderRadius: '1rem',
                  padding: '1.75rem',
                  boxShadow: '0 12px 36px rgba(0, 0, 0, 0.35)',
                  marginBottom: '2rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed rgba(236, 121, 107, 0.3)', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--brand-btc)', fontWeight: 800 }}>
                      Grand Opening Priority Pass
                    </div>
                    <div style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '0.04em' }}>
                      {ticket.ticketId}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Queue Position</div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#22c55e' }}>
                      #{ticket.queueNumber}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', fontSize: '0.85rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>Registrant</span>
                    <strong style={{ color: 'var(--text-main)' }}>{ticket.fullName}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>Verified Email</span>
                    <strong style={{ color: 'var(--text-main)', wordBreak: 'break-all' }}>{ticket.email}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>Allocation Tier</span>
                    <strong style={{ color: 'var(--brand-btc)' }}>{ticket.investmentTier}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>Payment Method</span>
                    <strong style={{ color: 'var(--text-main)' }}>{ticket.paymentMethod || 'USDT / USDC'}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>Priority Class</span>
                    <span
                      style={{
                        display: 'inline-block',
                        background: 'rgba(236, 121, 107, 0.2)',
                        color: 'var(--brand-btc)',
                        padding: '0.15rem 0.55rem',
                        borderRadius: '4px',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                      }}
                    >
                      {ticket.priorityStatus || 'VIP Priority'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
                <button
                  onClick={handleCopyTicket}
                  className="btn btn-secondary"
                  style={{ flex: 1, minWidth: '180px', padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 700 }}
                >
                  {copied ? <Check size={16} color="#22c55e" /> : <Copy size={16} />}
                  <span>{copied ? 'Ticket ID Copied!' : 'Copy Ticket ID'}</span>
                </button>

                <a
                  href={`https://t.me/${(process.env.NEXT_PUBLIC_TELEGRAM_SUPPORT_USERNAME || 'AtechAtech').replace('@', '').trim()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{
                    flex: 1,
                    minWidth: '200px',
                    padding: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    background: '#0088cc',
                    borderColor: '#0088cc',
                    color: '#fff',
                    fontWeight: 700,
                  }}
                >
                  <Send size={16} />
                  <span>Join VIP Telegram Lounge</span>
                </a>
              </div>

              <div style={{ textAlign: 'center', marginTop: '1.75rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
                <button
                  onClick={() => {
                    localStorage.removeItem('bpro_grand_opening_ticket');
                    setTicket(null);
                  }}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Register another attendee or update details
                </button>
              </div>
            </div>
          ) : (
            /* GRAND OPENING REGISTRATION FORM */
            <div className="glass-card" style={{ padding: 'clamp(1.5rem, 4vw, 2.75rem)', borderRadius: '1.25rem' }}>
              {error && (
                <div
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#ef4444',
                    padding: '0.85rem 1rem',
                    borderRadius: '0.75rem',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    fontSize: '0.875rem',
                  }}
                >
                  <AlertCircle size={18} style={{ flexShrink: 0 }} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* SECTION 1: IDENTITY & CONTACT */}
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <User size={18} style={{ color: 'var(--brand-btc)' }} />
                    <span>1. Identity & Contact Details</span>
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    We will dispatch your official Grand Opening allocation pass and private access link here.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                    {/* Full Name */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                        Full Legal / Entity Name <span style={{ color: 'var(--brand-btc)' }}>*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alex Rivers or Rivers Capital LLC"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          borderRadius: '0.65rem',
                          background: 'var(--bg-surface)',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--text-main)',
                          fontSize: '0.9rem',
                        }}
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                        Corporate / Personal Email <span style={{ color: 'var(--brand-btc)' }}>*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. alex@riverscapital.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setEmailStatus('idle');
                          setEmailFeedback(null);
                        }}
                        onBlur={handleEmailBlur}
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          borderRadius: '0.65rem',
                          background: 'var(--bg-surface)',
                          border: `1px solid ${emailStatus === 'valid' ? '#22c55e' : emailStatus === 'invalid' ? '#ef4444' : 'var(--border-subtle)'}`,
                          color: 'var(--text-main)',
                          fontSize: '0.9rem',
                        }}
                      />
                      {emailFeedback && (
                        <div style={{ fontSize: '0.75rem', marginTop: '0.35rem', color: emailStatus === 'valid' ? '#22c55e' : '#ef4444' }}>
                          {emailFeedback}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Phone & Country */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                    {/* Phone / WhatsApp */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                        Phone / WhatsApp (for Launch Day SMS/Alerts) <span style={{ color: 'var(--brand-btc)' }}>*</span>
                      </label>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <select
                          value={phonePrefix}
                          onChange={(e) => setPhonePrefix(e.target.value)}
                          style={{
                            width: '140px',
                            padding: '0.75rem 0.5rem',
                            borderRadius: '0.65rem',
                            background: 'var(--bg-surface)',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--text-main)',
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                          }}
                        >
                          {ALL_COUNTRIES_DATA.map((c) => (
                            <option key={`${c.iso}-${c.code}`} value={c.code}>
                              {c.flag} {c.code} — {c.name}
                            </option>
                          ))}
                        </select>
                        <input
                          type="tel"
                          required
                          placeholder="(555) 000-0000"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          style={{
                            flex: 1,
                            padding: '0.75rem 1rem',
                            borderRadius: '0.65rem',
                            background: 'var(--bg-surface)',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--text-main)',
                            fontSize: '0.9rem',
                          }}
                        />
                      </div>
                    </div>

                    {/* Country of Residence */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                        Country of Residence / Jurisdiction <span style={{ color: 'var(--brand-btc)' }}>*</span>
                      </label>
                      <select
                        value={country}
                        onChange={(e) => {
                          const selected = e.target.value;
                          setCountry(selected);
                          const matched = ALL_COUNTRIES_DATA.find((c) => c.name === selected);
                          if (matched) {
                            setPhonePrefix(matched.code);
                          }
                        }}
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          borderRadius: '0.65rem',
                          background: 'var(--bg-surface)',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--text-main)',
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                        }}
                      >
                        {ALL_COUNTRIES_DATA.map((c) => (
                          <option key={c.iso} value={c.name}>
                            {c.flag} {c.name} ({c.code})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* SECTION 2: CAPITAL ALLOCATION & STRATEGY */}
                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <TrendingUp size={18} style={{ color: 'var(--brand-btc)' }} />
                    <span>2. Allocation Tier & Investment Profile</span>
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    Select your planned initial capital allocation to secure appropriate vault capacity.
                  </p>

                  {/* Tier Selection Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    {INVESTMENT_TIERS.map((tier) => {
                      const selected = investmentTier === tier.label;
                      return (
                        <div
                          key={tier.id}
                          onClick={() => setInvestmentTier(tier.label)}
                          style={{
                            padding: '1rem 0.85rem',
                            borderRadius: '0.75rem',
                            border: `2px solid ${selected ? 'var(--brand-btc)' : 'var(--border-subtle)'}`,
                            background: selected ? 'rgba(236, 121, 107, 0.08)' : 'var(--bg-surface)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            position: 'relative',
                          }}
                        >
                          <span
                            style={{
                              display: 'inline-block',
                              fontSize: '0.68rem',
                              fontWeight: 800,
                              textTransform: 'uppercase',
                              padding: '0.15rem 0.4rem',
                              borderRadius: '4px',
                              background: selected ? 'var(--brand-btc)' : 'var(--bg-surface-elevated)',
                              color: selected ? '#000' : 'var(--text-muted)',
                              marginBottom: '0.4rem',
                            }}
                          >
                            {tier.badge}
                          </span>
                          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: selected ? 'var(--brand-btc)' : 'var(--text-main)' }}>
                            {tier.label}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                            {tier.subtitle}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                    {/* Investor Classification */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                        Investor Classification
                      </label>
                      <select
                        value={investorType}
                        onChange={(e) => setInvestorType(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          borderRadius: '0.65rem',
                          background: 'var(--bg-surface)',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--text-main)',
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                        }}
                      >
                        {INVESTOR_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Primary Strategy Interest */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                        Primary Strategy of Interest
                      </label>
                      <select
                        value={primaryInterest}
                        onChange={(e) => setPrimaryInterest(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          borderRadius: '0.65rem',
                          background: 'var(--bg-surface)',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--text-main)',
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                        }}
                      >
                        {STRATEGY_INTERESTS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* SECTION 3: PREFERRED PAYMENT & FUNDING METHOD */}
                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CreditCard size={18} style={{ color: 'var(--brand-btc)' }} />
                    <span>3. Preferred Payment & Funding Method</span>
                  </h3>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    Select how you intend to deposit capital when your allocation opens.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                    {PAYMENT_METHODS.map((method) => {
                      const selected = paymentMethod === method.label;
                      return (
                        <div
                          key={method.id}
                          onClick={() => setPaymentMethod(method.label)}
                          style={{
                            padding: '0.9rem 0.85rem',
                            borderRadius: '0.75rem',
                            border: `2px solid ${selected ? 'var(--brand-btc)' : 'var(--border-subtle)'}`,
                            background: selected ? 'rgba(236, 121, 107, 0.08)' : 'var(--bg-surface)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            position: 'relative',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                            <span style={{ fontSize: '1.25rem' }}>{method.icon}</span>
                            <span
                              style={{
                                fontSize: '0.65rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                padding: '0.15rem 0.45rem',
                                borderRadius: '4px',
                                background: selected ? 'var(--brand-btc)' : 'var(--bg-surface-elevated)',
                                color: selected ? '#ffffff' : 'var(--text-muted)',
                              }}
                            >
                              {method.badge}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.875rem', fontWeight: 800, color: selected ? 'var(--brand-btc)' : 'var(--text-main)', marginBottom: '0.2rem' }}>
                            {method.label}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.35 }}>
                            {method.subtitle}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* SECTION 4: OPTIONAL DETAILS & VIP LOUNGE */}
                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MessageSquare size={18} style={{ color: 'var(--brand-btc)' }} />
                    <span>4. VIP Lounge & Preferences (Optional)</span>
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                        Telegram Username (for Private VIP Group)
                      </label>
                      <input
                        type="text"
                        placeholder="@username"
                        value={telegramHandle}
                        onChange={(e) => setTelegramHandle(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          borderRadius: '0.65rem',
                          background: 'var(--bg-surface)',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--text-main)',
                          fontSize: '0.9rem',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                        Referral / Partner Invitation Code
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. VIP-PARTNER-77"
                        value={referralCode}
                        onChange={(e) => setReferralCode(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          borderRadius: '0.65rem',
                          background: 'var(--bg-surface)',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--text-main)',
                          fontSize: '0.9rem',
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                      Special Custody Notes or Inquiries
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Any specific institutional requirements, multi-sig signer arrangements, or timeline considerations..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '0.65rem',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-main)',
                        fontSize: '0.875rem',
                        resize: 'vertical',
                      }}
                    />
                  </div>
                </div>

                {/* TERMS CHECKBOX */}
                <div
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    padding: '0.85rem 1rem',
                    borderRadius: '0.75rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.65rem',
                  }}
                >
                  <input
                    id="vip-terms"
                    type="checkbox"
                    checked={termsAgreed}
                    onChange={(e) => setTermsAgreed(e.target.checked)}
                    style={{ marginTop: '3px', width: '17px', height: '17px', accentColor: 'var(--brand-btc)' }}
                  />
                  <label htmlFor="vip-terms" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.45, cursor: 'pointer' }}>
                    <strong style={{ color: 'var(--text-main)' }}>Grand Opening Terms:</strong> I consent to receiving my official VIP Priority Ticket, launch notifications, and pre-allocation invitations via email and WhatsApp/SMS. No public capital commitments are binding until contract signing upon launch.
                  </label>
                </div>

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  disabled={loading || !termsAgreed}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #ec796b 0%, #ff8c7e 100%)',
                    color: '#ffffff',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.6rem',
                    boxShadow: '0 8px 24px rgba(236, 121, 107, 0.4)',
                    cursor: loading || !termsAgreed ? 'not-allowed' : 'pointer',
                    opacity: loading || !termsAgreed ? 0.6 : 1,
                  }}
                >
                  <Sparkles size={18} />
                  <span>{loading ? 'Securing Priority Queue Position...' : 'Claim Grand Opening VIP Ticket'}</span>
                  <ArrowRight size={18} />
                </button>
              </form>

              {/* Security Badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.25rem', marginTop: '1.75rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Lock size={14} style={{ color: 'var(--brand-btc)' }} />
                  256-bit Institutional Encryption
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <ShieldCheck size={14} style={{ color: 'var(--brand-btc)' }} />
                  SOC 2 Security Protocols
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Award size={14} style={{ color: 'var(--brand-btc)' }} />
                  Zero Spam • 100% Confidential
                </span>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
