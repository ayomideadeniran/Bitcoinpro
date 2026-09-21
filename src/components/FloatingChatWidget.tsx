'use client';

import React, { useState, useEffect } from 'react';
import { X, Send, ShieldCheck, ArrowUpRight, MessageCircle, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';

export default function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [mounted, setMounted] = useState(false);

  // Direct Telegram username from environment or fallback
  const telegramUsername = (
    process.env.NEXT_PUBLIC_TELEGRAM_SUPPORT_USERNAME || 
    process.env.NEXT_PUBLIC_TELEGRAM_USERNAME || 
    'AtechAtech'
  ).replace('@', '').trim();

  useEffect(() => {
    setMounted(true);
  }, []);

  const openTelegramDirect = (prefillMessage?: string) => {
    const textToSend = prefillMessage !== undefined ? prefillMessage : userMessage;
    const cleanText = encodeURIComponent(textToSend.trim());
    const directUrl = cleanText
      ? `https://t.me/${telegramUsername}?text=${cleanText}`
      : `https://t.me/${telegramUsername}`;

    window.open(directUrl, '_blank', 'noopener,noreferrer');
  };

  const handleSendToTelegram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userMessage.trim()) {
      openTelegramDirect();
      return;
    }
    openTelegramDirect(userMessage);
    setUserMessage('');
    setIsOpen(false);
  };

  const quickTopics = [
    { label: '💰 Deposit & Capital Allocation', msg: 'Hello, I need direct assistance with a deposit or capital allocation on Starknet.' },
    { label: '⚡ Withdrawal Support', msg: 'Hello, I have an inquiry regarding a withdrawal on my Starknet account.' },
    { label: '📑 Custodial Agreement Inquiry', msg: 'Hello, I have a question regarding my institutional custody agreement execution.' },
    { label: '🔐 Account & Security Help', msg: 'Hello, I need help with my account security and authentication.' },
  ];

  if (!mounted) return null;

  return (
    <>
      {/* Floating Telegram Support Launcher */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '0.5rem',
        }}
      >
        {/* Tooltip / Prompt pill */}
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            style={{
              background: 'rgba(15, 23, 42, 0.92)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(34, 158, 217, 0.4)',
              color: '#ffffff',
              padding: '0.45rem 0.9rem',
              borderRadius: '99px',
              fontSize: '0.78rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }}></span>
            <span>Direct Telegram Support</span>
            <ArrowUpRight size={13} style={{ color: '#229ED9' }} />
          </button>
        )}

        {/* Main Floating Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close Telegram Support' : 'Open Direct Telegram Support'}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #229ED9 0%, #0088cc 100%)',
            color: '#fff',
            border: 'none',
            boxShadow: '0 8px 28px rgba(34, 158, 217, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            transform: isOpen ? 'scale(0.92)' : 'scale(1)',
          }}
        >
          {isOpen ? (
            <X size={26} />
          ) : (
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m22 2-7 20-4-9-9-4Z"/>
              <path d="M22 2 11 13"/>
            </svg>
          )}
        </button>
      </div>

      {/* Direct Telegram Support Modal Card */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '24px',
            width: 'calc(100vw - 48px)',
            maxWidth: '410px',
            background: '#0d131f',
            border: '1px solid rgba(34, 158, 217, 0.35)',
            borderRadius: '1.25rem',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.05)',
            zIndex: 9998,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: 'inherit',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '1.25rem 1.5rem',
              background: 'linear-gradient(180deg, rgba(34, 158, 217, 0.18) 0%, rgba(13, 19, 31, 0.8) 100%)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #229ED9 0%, #0088cc 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  boxShadow: '0 4px 14px rgba(34, 158, 217, 0.4)',
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m22 2-7 20-4-9-9-4Z"/>
                  <path d="M22 2 11 13"/>
                </svg>
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  Direct Telegram Chat
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#4ade80', marginTop: '0.15rem' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e' }}></span>
                  <span>Human Support Desk &bull; Online</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
              }}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '480px', overflowY: 'auto' }}>
            {/* Direct human desk badge */}
            <div
              style={{
                padding: '0.9rem 1rem',
                borderRadius: '0.85rem',
                background: 'rgba(34, 158, 217, 0.08)',
                border: '1px solid rgba(34, 158, 217, 0.25)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
              }}
            >
              <ShieldCheck size={20} style={{ color: '#229ED9', flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '0.825rem', color: '#cbd5e1', lineHeight: 1.45 }}>
                <strong style={{ color: '#ffffff' }}>Direct 1-on-1 Human Support:</strong> No automated bots. Chat directly with our private trading and compliance desk on Telegram.
              </div>
            </div>

            {/* Direct 1-Click Launch Button */}
            <button
              type="button"
              onClick={() => openTelegramDirect()}
              style={{
                width: '100%',
                padding: '0.95rem 1.25rem',
                borderRadius: '0.85rem',
                background: 'linear-gradient(135deg, #229ED9 0%, #0088cc 100%)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.65rem',
                boxShadow: '0 8px 24px rgba(34, 158, 217, 0.4)',
                transition: 'transform 0.15s ease',
              }}
              onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
              onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m22 2-7 20-4-9-9-4Z"/>
                <path d="M22 2 11 13"/>
              </svg>
              <span>Open Chat on Telegram (@{telegramUsername})</span>
              <ExternalLink size={16} />
            </button>

            {/* Quick topics */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.6rem' }}>
                Quick Direct Inquiries
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {quickTopics.map((topic, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => openTelegramDirect(topic.msg)}
                    style={{
                      width: '100%',
                      padding: '0.7rem 0.9rem',
                      borderRadius: '0.65rem',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      color: '#e2e8f0',
                      fontSize: '0.825rem',
                      fontWeight: 600,
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = 'rgba(34, 158, 217, 0.12)';
                      e.currentTarget.style.borderColor = 'rgba(34, 158, 217, 0.35)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    }}
                  >
                    <span>{topic.label}</span>
                    <ArrowUpRight size={14} style={{ color: '#229ED9' }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Type custom message to send directly to Telegram */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                Or Type Your Question
              </div>
              <form onSubmit={handleSendToTelegram} style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Type message to open on Telegram..."
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.75rem 1rem',
                    borderRadius: '0.65rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#ffffff',
                    outline: 'none',
                    fontSize: '0.85rem',
                  }}
                />
                <button
                  type="submit"
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '0.65rem',
                    background: '#229ED9',
                    color: '#ffffff',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                  title="Send to Telegram"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </div>

          {/* Footer note */}
          <div
            style={{
              padding: '0.75rem 1.25rem',
              background: 'rgba(0, 0, 0, 0.3)',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              fontSize: '0.72rem',
              color: '#64748b',
              textAlign: 'center',
            }}
          >
            Encrypted End-to-End via Telegram MTProto &bull; Direct Human Contact
          </div>
        </div>
      )}
    </>
  );
}
