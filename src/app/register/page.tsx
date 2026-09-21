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
  ChevronRight,
  Shield,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import { calculateCurrentWaitlistBase, useCountUp } from '@/lib/waitlist-utils';
import { ALL_COUNTRIES_DATA } from '@/lib/countries-data';

const INVESTMENT_TIERS = [
  {
    id: 'starter',
    label: '$200 – $1,000',
    subtitle: 'Private Starter Allocation',
    badge: 'Starter Access',
    desc: 'Accessible entry point with full Starknet ZK-vault yield privileges and zero launch fees.',
  },
  {
    id: 'standard',
    label: '$1,000 – $10,000',
    subtitle: 'Standard Growth Tier',
    badge: 'Growth Tier',
    desc: 'Automated DCA scheduling and institutional multi-sig custody routing.',
  },
  {
    id: 'growth',
    label: '$10,000 – $50,000',
    subtitle: 'High-Yield Wealth Builder',
    badge: 'Most Popular',
    desc: 'Guaranteed 12.4% APY vault allocation and dedicated quantitative manager.',
  },
  {
    id: 'institutional',
    label: '$50,000 – $250,000',
    subtitle: 'Institutional Custody Tier',
    badge: 'Priority VIP',
    desc: 'Segregated non-commingled accounts and master institutional custody framework.',
  },
  {
    id: 'whale',
    label: '$250,000+',
    subtitle: 'Private Office / OTC Execution',
    badge: 'Executive White-Glove',
    desc: 'Bespoke delta-neutral arbitrage vaults, private office briefings, and OTC desk.',
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
    subtitle: 'Instant multi-chain deposit (TRC20, ERC20, Polygon) with zero volatility.',
    icon: '🪙',
  },
  {
    id: 'btc',
    label: 'Bitcoin (BTC / Lightning)',
    badge: 'Native Crypto',
    subtitle: 'On-chain SegWit/Taproot or instant Lightning Layer-2 settlement.',
    icon: '⚡',
  },
  {
    id: 'eth',
    label: 'Ethereum (ETH / ERC-20)',
    badge: 'Smart Contract',
    subtitle: 'Direct Web3 wallet or exchange transfer to institutional vaults.',
    icon: '🔷',
  },
  {
    id: 'starknet',
    label: 'Starknet (STRK / ETH)',
    badge: 'ZK-Rollup L2',
    subtitle: 'Native Braavos / Argent X Starknet L2 transfer with near-zero gas.',
    icon: '🌟',
  },
  {
    id: 'wire',
    label: 'Bank Wire Transfer (USD / EUR / GBP)',
    badge: 'Institutional',
    subtitle: 'FedWire, SWIFT, SEPA corporate custody execution with dedicated IBAN.',
    icon: '🏦',
  },
  {
    id: 'card',
    label: 'Credit / Debit Card (Apple & Google Pay)',
    badge: 'Instant On-Ramp',
    subtitle: 'Direct checkout via regulated institutional fiat gateway with 0% platform fee.',
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
  const [ticket, setTicket] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // Email validation state
  const [emailStatus, setEmailStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [emailFeedback, setEmailFeedback] = useState<string | null>(null);

  // Waitlist counter
  const initialBase = calculateCurrentWaitlistBase();
  const [targetWaitlistCount, setTargetWaitlistCount] = useState(initialBase);
  const animatedDisplayCount = useCountUp(targetWaitlistCount, 2000);

  // Check existing session
  useEffect(() => {
    try {
      const existing = localStorage.getItem('bpro_grand_opening_ticket');
      if (existing) {
        setTicket(JSON.parse(existing));
      }
    } catch {}

    fetch('/api/wishlist')
      .then((res) => res.json())
      .then((data) => {
        if (data.totalWaitlistCount) {
          setTargetWaitlistCount(data.totalWaitlistCount);
        }
      })
      .catch(() => {});
  }, []);

  // Email blur validator
  const handleEmailBlur = async () => {
    if (!email || !email.includes('@')) {
      setEmailStatus('idle');
      setEmailFeedback(null);
      return;
    }
    try {
      const res = await fetch('/api/auth/validate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (!data.valid) {
        setEmailStatus('invalid');
        setEmailFeedback(data.error || 'This email domain does not have active mail servers.');
      } else {
        setEmailStatus('valid');
        setEmailFeedback('Verified email domain.');
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

      {/* Main Content Area: Spacious Container */}
      <main style={{ flex: 1, padding: '3rem 1.5rem 6rem' }}>
        <div className="container" style={{ maxWidth: '1180px', margin: '0 auto' }}>
          {/* Header Hero Banner with High-End Typography */}
          <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 3rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(236, 121, 107, 0.12)',
                border: '1px solid rgba(236, 121, 107, 0.35)',
                color: '#ec796b',
                padding: '0.45rem 1.25rem',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: 700,
                marginBottom: '1.25rem',
              }}
            >
              <Sparkles size={16} />
              <span>Starknet Grand Opening Allocation • Limited VIP Registry</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.1rem, 4.5vw, 3.25rem)',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                marginBottom: '1rem',
                lineHeight: 1.15,
                color: 'var(--text-main)',
              }}
            >
              Starknet <span style={{ color: '#ec796b' }}>VIP Allocation Registry</span>
            </h1>

            <p
              style={{
                fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
                color: 'var(--text-muted)',
                lineHeight: 1.65,
                maxWidth: '720px',
                margin: '0 auto 1.75rem',
              }}
            >
              Reserve priority on the Bitcoin &amp; Starknet Layer-2 Ecosystem. Registered participants secure guaranteed vault capacity starting from <strong style={{ color: 'var(--text-main)' }}>$200</strong>, complete platform fee waivers during launch week, and direct access to the 12.4% APY institutional vault.
            </p>

            {/* Privilege Feature Ribbons */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.65rem',
                flexWrap: 'wrap',
                marginBottom: '1.75rem',
              }}
            >
              {[
                { label: 'Entry From $200', icon: '🪙' },
                { label: '12.4% Target APY', icon: '⚡' },
                { label: 'Multi-Sig Cold Custody', icon: '🛡️' },
                { label: '0% Launch Fees', icon: '🎉' },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.35rem 0.85rem',
                    borderRadius: '9999px',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.825rem',
                    fontWeight: 600,
                    color: 'var(--text-main)',
                  }}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            {/* Live Queue Counter */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.85rem',
                padding: '0.55rem 1.25rem',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '9999px',
                fontSize: '0.875rem',
              }}
            >
              <span
                style={{
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  background: '#22c55e',
                  display: 'inline-block',
                  boxShadow: '0 0 10px #22c55e',
                }}
              />
              <span>
                <strong style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--text-main)', fontSize: '1rem' }}>
                  {animatedDisplayCount.toLocaleString()}+
                </strong>{' '}
                Investors &amp; Treasuries On Wishlist
              </span>
              <span style={{ color: 'var(--border-subtle)' }}>|</span>
              <span style={{ color: '#ec796b', fontWeight: 700 }}>Priority Queue Open</span>
            </div>
          </div>

          {/* Conditional Display: Issued Ticket OR Spacious 2-Column Form Layout */}
          {ticket ? (
            /* ISSUED VIP TICKET PASS CARD */
            <div
              className="glass-card"
              style={{
                maxWidth: '780px',
                margin: '0 auto',
                padding: 'clamp(2rem, 5vw, 3.5rem)',
                borderRadius: '1.5rem',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid rgba(236, 121, 107, 0.4)',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.25)',
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'rgba(34, 197, 94, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem',
                    color: '#22c55e',
                  }}
                >
                  <CheckCircle2 size={36} />
                </div>
                <h2 style={{ fontSize: '1.85rem', fontWeight: 900, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                  VIP Whitelist Allocation Confirmed
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '540px', margin: '0 auto', lineHeight: 1.6 }}>
                  Your allocation ticket has been anchored into the Starknet launch queue. Please retain your Ticket ID for verification upon platform opening.
                </p>
              </div>

              {/* Shimmer Ticket Box */}
              <div
                style={{
                  background: 'var(--bg-surface-elevated)',
                  border: '2px dashed rgba(236, 121, 107, 0.4)',
                  borderRadius: '1.25rem',
                  padding: '2rem',
                  marginBottom: '2rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.25rem' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#ec796b', letterSpacing: '0.05em' }}>
                      Grand Opening Priority Pass
                    </div>
                    <div className="mono" style={{ fontSize: '1.65rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '0.04em' }}>
                      {ticket.ticketId}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Queue Position</div>
                    <div className="mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#22c55e' }}>
                      #{ticket.queueNumber}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1.25rem', fontSize: '0.9rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block', marginBottom: '0.2rem' }}>Registrant</span>
                    <strong style={{ color: 'var(--text-main)' }}>{ticket.fullName}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block', marginBottom: '0.2rem' }}>Verified Email</span>
                    <strong style={{ color: 'var(--text-main)', wordBreak: 'break-all' }}>{ticket.email}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block', marginBottom: '0.2rem' }}>Allocation Tier</span>
                    <strong style={{ color: '#ec796b' }}>{ticket.investmentTier}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block', marginBottom: '0.2rem' }}>Payment Method</span>
                    <strong style={{ color: 'var(--text-main)' }}>{ticket.paymentMethod || 'USDT / USDC'}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block', marginBottom: '0.2rem' }}>Priority Status</span>
                    <span
                      style={{
                        display: 'inline-block',
                        background: 'rgba(236, 121, 107, 0.15)',
                        color: '#ec796b',
                        padding: '0.2rem 0.65rem',
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
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
                <button
                  onClick={handleCopyTicket}
                  className="btn btn-secondary"
                  style={{ flex: 1, minWidth: '200px', padding: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 700, borderRadius: '0.75rem' }}
                >
                  {copied ? <Check size={18} color="#22c55e" /> : <Copy size={18} />}
                  <span>{copied ? 'Ticket ID Copied!' : 'Copy Ticket ID'}</span>
                </button>

                <a
                  href={`https://t.me/${(process.env.NEXT_PUBLIC_TELEGRAM_SUPPORT_USERNAME || 'AtechAtech').replace('@', '').trim()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{
                    flex: 1,
                    minWidth: '220px',
                    padding: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    background: '#0088cc',
                    borderColor: '#0088cc',
                    color: '#fff',
                    fontWeight: 700,
                    borderRadius: '0.75rem',
                  }}
                >
                  <Send size={18} />
                  <span>Join VIP Telegram Lounge</span>
                </a>
              </div>

              <div style={{ textAlign: 'center', marginTop: '2rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
                <button
                  onClick={() => {
                    localStorage.removeItem('bpro_grand_opening_ticket');
                    setTicket(null);
                  }}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Register another allocation or edit details
                </button>
              </div>
            </div>
          ) : (
            /* 2-COLUMN SPACIOUS REGISTRATION LAYOUT */
            <div className="register-layout-grid">
              {/* LEFT COLUMN: THE SPACIOUS FORM */}
              <div
                className="glass-card"
                style={{
                  padding: 'clamp(2rem, 4vw, 3.25rem)',
                  borderRadius: '1.5rem',
                  boxShadow: '0 20px 45px rgba(0, 0, 0, 0.15)',
                }}
              >
                {error && (
                  <div
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#ef4444',
                      padding: '1rem 1.25rem',
                      borderRadius: '0.85rem',
                      marginBottom: '2rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      fontSize: '0.925rem',
                    }}
                  >
                    <AlertCircle size={20} style={{ flexShrink: 0 }} />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                  {/* STEP 1: IDENTITY & CONTACT */}
                  <div>
                    <div className="step-badge">
                      <span>STEP 01</span> • <span>PROFILE &amp; DISPATCH</span>
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <User size={20} style={{ color: '#ec796b' }} />
                      <span>Legal Identity &amp; Notification Channels</span>
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                      We will dispatch your verified Grand Opening allocation pass and private launch link to these credentials.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                      {/* Full Name */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                          Full Legal / Entity Name <span style={{ color: '#ec796b' }}>*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Alex Rivers or Rivers Capital LLC"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="form-input-spacious"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                          Corporate / Personal Email <span style={{ color: '#ec796b' }}>*</span>
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
                          className="form-input-spacious"
                          style={{
                            borderColor:
                              emailStatus === 'valid'
                                ? '#22c55e'
                                : emailStatus === 'invalid'
                                ? '#ef4444'
                                : undefined,
                          }}
                        />
                        {emailFeedback && (
                          <div style={{ fontSize: '0.775rem', marginTop: '0.4rem', color: emailStatus === 'valid' ? '#22c55e' : '#ef4444' }}>
                            {emailFeedback}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Phone & Country */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginTop: '1.25rem' }}>
                      {/* Phone / WhatsApp */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                          Phone / WhatsApp (for Launch Day SMS/Alerts) <span style={{ color: '#ec796b' }}>*</span>
                        </label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <select
                            value={phonePrefix}
                            onChange={(e) => setPhonePrefix(e.target.value)}
                            className="form-select-spacious"
                            style={{ width: '145px', flexShrink: 0, fontSize: '0.85rem' }}
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
                            className="form-input-spacious"
                            style={{ flex: 1 }}
                          />
                        </div>
                      </div>

                      {/* Country of Residence */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                          Country of Residence / Jurisdiction <span style={{ color: '#ec796b' }}>*</span>
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
                          className="form-select-spacious"
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

                  {/* STEP 2: CAPITAL ALLOCATION & TIERS */}
                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '2rem' }}>
                    <div className="step-badge">
                      <span>STEP 02</span> • <span>CAPITAL CAPACITY</span>
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <TrendingUp size={20} style={{ color: '#ec796b' }} />
                      <span>Planned Capital Allocation Tier</span>
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                      Select your intended allocation to secure matching vault liquidity. No upfront capital is locked today.
                    </p>

                    {/* 5 Distinct Tiers Grid */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1rem',
                        marginBottom: '1.75rem',
                      }}
                    >
                      {INVESTMENT_TIERS.map((tier) => {
                        const selected = investmentTier === tier.label;
                        return (
                          <div
                            key={tier.id}
                            onClick={() => setInvestmentTier(tier.label)}
                            style={{
                              padding: '1.25rem 1rem',
                              borderRadius: '0.9rem',
                              border: `2px solid ${selected ? '#ec796b' : 'var(--border-subtle)'}`,
                              background: selected ? 'rgba(236, 121, 107, 0.08)' : 'var(--bg-surface)',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              boxShadow: selected ? '0 8px 24px rgba(236, 121, 107, 0.2)' : 'none',
                            }}
                          >
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                                <span
                                  style={{
                                    fontSize: '0.68rem',
                                    fontWeight: 800,
                                    textTransform: 'uppercase',
                                    padding: '0.2rem 0.5rem',
                                    borderRadius: '4px',
                                    background: selected ? '#ec796b' : 'var(--bg-surface-elevated)',
                                    color: selected ? '#ffffff' : 'var(--text-muted)',
                                  }}
                                >
                                  {tier.badge}
                                </span>
                                {selected && <CheckCircle2 size={16} color="#ec796b" />}
                              </div>

                              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: selected ? '#ec796b' : 'var(--text-main)', marginBottom: '0.25rem' }}>
                                {tier.label}
                              </div>
                              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.45rem' }}>
                                {tier.subtitle}
                              </div>
                            </div>

                            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: 1.45, borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem' }}>
                              {tier.desc}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                      {/* Investor Classification */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                          Investor Classification
                        </label>
                        <select
                          value={investorType}
                          onChange={(e) => setInvestorType(e.target.value)}
                          className="form-select-spacious"
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
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                          Primary Strategy of Interest
                        </label>
                        <select
                          value={primaryInterest}
                          onChange={(e) => setPrimaryInterest(e.target.value)}
                          className="form-select-spacious"
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

                  {/* STEP 3: PREFERRED PAYMENT & FUNDING METHOD */}
                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '2rem' }}>
                    <div className="step-badge">
                      <span>STEP 03</span> • <span>SETTLEMENT RAILS</span>
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CreditCard size={20} style={{ color: '#ec796b' }} />
                      <span>Preferred Funding &amp; Payment Rail</span>
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                      Choose your preferred currency or payment gateway for when your allocation window unlocks.
                    </p>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        gap: '1rem',
                      }}
                    >
                      {PAYMENT_METHODS.map((method) => {
                        const selected = paymentMethod === method.label;
                        return (
                          <div
                            key={method.id}
                            onClick={() => setPaymentMethod(method.label)}
                            style={{
                              padding: '1.15rem 1rem',
                              borderRadius: '0.9rem',
                              border: `2px solid ${selected ? '#ec796b' : 'var(--border-subtle)'}`,
                              background: selected ? 'rgba(236, 121, 107, 0.08)' : 'var(--bg-surface)',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              boxShadow: selected ? '0 8px 24px rgba(236, 121, 107, 0.2)' : 'none',
                            }}
                          >
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                                <span style={{ fontSize: '1.45rem' }}>{method.icon}</span>
                                <span
                                  style={{
                                    fontSize: '0.65rem',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    padding: '0.2rem 0.5rem',
                                    borderRadius: '4px',
                                    background: selected ? '#ec796b' : 'var(--bg-surface-elevated)',
                                    color: selected ? '#ffffff' : 'var(--text-muted)',
                                  }}
                                >
                                  {method.badge}
                                </span>
                              </div>
                              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: selected ? '#ec796b' : 'var(--text-main)', marginBottom: '0.35rem' }}>
                                {method.label}
                              </div>
                            </div>
                            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.45, borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem' }}>
                              {method.subtitle}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* STEP 4: OPTIONAL DETAILS & VIP PREFERENCES */}
                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '2rem' }}>
                    <div className="step-badge">
                      <span>STEP 04</span> • <span>OPTIONAL PREFERENCES</span>
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MessageSquare size={20} style={{ color: '#ec796b' }} />
                      <span>VIP Lounge &amp; Custody Notes (Optional)</span>
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginTop: '1.25rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                          Telegram Handle (for Private VIP Group)
                        </label>
                        <input
                          type="text"
                          placeholder="@username"
                          value={telegramHandle}
                          onChange={(e) => setTelegramHandle(e.target.value)}
                          className="form-input-spacious"
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                          Referral / Partner Invitation Code
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. VIP-PARTNER-77"
                          value={referralCode}
                          onChange={(e) => setReferralCode(e.target.value)}
                          className="form-input-spacious"
                        />
                      </div>
                    </div>

                    <div style={{ marginTop: '1.25rem' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                        Special Custody Notes or Inquiries
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Specify any multi-sig key holder setup, institutional corporate treasury requirements, or custom liquidity timelines..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="form-input-spacious"
                        style={{ resize: 'vertical' }}
                      />
                    </div>
                  </div>

                  {/* TERMS CHECKBOX */}
                  <div
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      padding: '1.25rem',
                      borderRadius: '0.9rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.85rem',
                    }}
                  >
                    <input
                      id="vip-terms"
                      type="checkbox"
                      checked={termsAgreed}
                      onChange={(e) => setTermsAgreed(e.target.checked)}
                      style={{
                        marginTop: '3px',
                        width: '18px',
                        height: '18px',
                        accentColor: '#ec796b',
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                    />
                    <label htmlFor="vip-terms" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, cursor: 'pointer' }}>
                      <strong style={{ color: 'var(--text-main)' }}>Grand Opening Whitelist Acknowledgment:</strong> I consent to receiving my verified VIP Priority Ticket and launch allocation notices via email and WhatsApp. No capital transfers are binding until formal onboarding upon protocol release.
                    </label>
                  </div>

                  {/* SUBMIT BUTTON */}
                  <div>
                    <button
                      type="submit"
                      disabled={loading || !termsAgreed}
                      style={{
                        width: '100%',
                        padding: '1.15rem',
                        fontSize: '1.1rem',
                        fontWeight: 800,
                        background: termsAgreed
                          ? 'linear-gradient(135deg, #ec796b 0%, #ff8c7e 100%)'
                          : 'var(--bg-surface-elevated)',
                        color: termsAgreed ? '#ffffff' : 'var(--text-muted)',
                        border: 'none',
                        borderRadius: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.65rem',
                        cursor: termsAgreed && !loading ? 'pointer' : 'not-allowed',
                        boxShadow: termsAgreed ? '0 10px 30px rgba(236, 121, 107, 0.4)' : 'none',
                        transition: 'all 0.25s ease',
                      }}
                    >
                      {loading ? (
                        <>
                          <div style={{ width: '20px', height: '20px', border: '3px solid #ffffff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                          <span>Generating Priority Pass...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={20} />
                          <span>Reserve My VIP Allocation Pass</span>
                          <ArrowRight size={20} />
                        </>
                      )}
                    </button>
                    <div style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                      <Lock size={12} style={{ color: '#22c55e' }} />
                      <span>Zero spam. Encrypted TLS 1.3 transfer. Guaranteed whitelist queue placement.</span>
                    </div>
                  </div>
                </form>
              </div>

              {/* RIGHT COLUMN: STICKY VIP PRIVILEGES & TRANSPARENCY SIDEBAR (Desktop) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', position: 'sticky', top: '90px' }}>
                {/* Card 1: Whitelist Privileges */}
                <div
                  className="glass-card"
                  style={{
                    padding: '1.75rem',
                    borderRadius: '1.25rem',
                    border: '1px solid rgba(236, 121, 107, 0.3)',
                    background: 'var(--bg-surface-elevated)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <Sparkles size={18} style={{ color: '#ec796b' }} />
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      VIP Whitelist Privileges
                    </h4>
                  </div>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.55, marginBottom: '1.25rem' }}>
                    Reserving your spot ensures your allocation is locked before general public vault limits are reached.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {[
                      {
                        title: 'Guaranteed Capacity',
                        desc: 'Access to 12.4% APY Starknet ZK-vault starting from $200.',
                      },
                      {
                        title: '0% Launch Fees',
                        desc: 'Complete waiver on all management & platform fees during launch.',
                      },
                      {
                        title: 'Multi-Sig Cold Custody',
                        desc: 'Institutional key management and non-commingled accounts.',
                      },
                      {
                        title: 'Instant VIP Digital Pass',
                        desc: 'Numbered queue ticket with permanent priority status.',
                      },
                    ].map((item) => (
                      <div key={item.title} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                        <div
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            background: 'rgba(34, 197, 94, 0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#22c55e',
                            flexShrink: 0,
                            marginTop: '2px',
                          }}
                        >
                          <Check size={12} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                            {item.title}
                          </div>
                          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                            {item.desc}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card 2: Security & Multi-Sig Assurance */}
                <div
                  className="glass-card"
                  style={{
                    padding: '1.5rem',
                    borderRadius: '1.25rem',
                    background: 'var(--bg-surface)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
                    <ShieldCheck size={18} style={{ color: '#22c55e' }} />
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      Security Assurance
                    </h4>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                    Starknet STARK proofs and Cairo contracts mathematically verify all vault operations off-chain. No seed phrases or private keys will ever be requested.
                  </p>
                </div>

                {/* Card 3: Institutional Concierge */}
                <div
                  className="glass-card"
                  style={{
                    padding: '1.5rem',
                    borderRadius: '1.25rem',
                    background: 'rgba(236, 121, 107, 0.05)',
                    border: '1px solid rgba(236, 121, 107, 0.25)',
                    textAlign: 'center',
                  }}
                >
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '0.4rem', color: 'var(--text-main)' }}>
                    Need Private OTC Consultation?
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1rem' }}>
                    For allocations above $250,000 or custom treasury custody arrangements.
                  </p>
                  <a
                    href={`https://t.me/${(process.env.NEXT_PUBLIC_TELEGRAM_SUPPORT_USERNAME || 'AtechAtech').replace('@', '').trim()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                    style={{
                      width: '100%',
                      padding: '0.65rem',
                      fontSize: '0.825rem',
                      fontWeight: 700,
                      borderRadius: '0.75rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.45rem',
                    }}
                  >
                    <Send size={14} />
                    <span>Contact VIP Concierge</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
