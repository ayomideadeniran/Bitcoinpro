'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, MessageCircle, ShieldCheck, Send, X } from 'lucide-react';
import { SupportMessage, matchSupportAnswer, ESCALATION_MESSAGE } from '@/lib/support-knowledge';

function generateId() {
  return `msg_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export default function SupportPage() {
  const [messages, setMessages] = useState<SupportMessage[]>([
    {
      id: generateId(),
      role: 'bot',
      text: 'Hello! I\'m the BitcoinPro support assistant. How can I help you today?',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [escalated, setEscalated] = useState(false);
  const [escalating, setEscalating] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    const userMessage: SupportMessage = {
      id: generateId(),
      role: 'user',
      text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setEscalated(false);
    setEscalating(false);

    setTimeout(async () => {
      const { answer, escalate } = matchSupportAnswer(text);

      if (escalate) {
        setEscalating(true);
          try {
            const raw = typeof window !== 'undefined' ? localStorage.getItem('bitcoinpro_auth_user') : null;
            const parsed = raw ? JSON.parse(raw) : {};
            const userEmail = parsed?.email || parsed?.user?.email;
            const res = await fetch('/api/support/escalate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                message: text,
                userEmail,
                userName: parsed?.name || parsed?.user?.name,
              }),
            });

          const data = await res.json();
          if (data.success) {
            setEscalated(true);
          }
        } catch {
          // swallow escalation failure; user still sees bot fallback text
        } finally {
          setEscalating(false);
        }
      }

      const botMessage: SupportMessage = {
        id: generateId(),
        role: 'bot',
        text: escalate ? `${answer}\n\n${ESCALATION_MESSAGE}` : answer,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 700);
  };

  const clearChat = () => {
    setMessages([
      {
        id: generateId(),
        role: 'bot',
        text: 'Chat cleared. How else can I help you?',
        timestamp: new Date().toISOString(),
      },
    ]);
    setEscalated(false);
    setEscalating(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      <div className="container" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '2rem 1.5rem 4rem' }}>
        <div style={{ maxWidth: '860px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '0.5rem',
                  background: 'var(--brand-info)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                }}
              >
                <MessageCircle size={20} />
              </div>
              <div>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Help &amp; Support Center</h1>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Instant answers + human escalation</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={clearChat}
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: '0.5rem',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                }}
              >
                Clear chat
              </button>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="glass-card"
            style={{
              flex: 1,
              minHeight: '420px',
              maxHeight: '620px',
              overflowY: 'auto',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              marginBottom: '1rem',
            }}
          >
            {messages.map((message) => {
              const isUser = message.role === 'user';
              const isEscalation = message.role === 'bot' && message.text.includes(ESCALATION_MESSAGE);

              return (
                <div
                  key={message.id}
                  style={{
                    alignSelf: isUser ? 'flex-end' : 'flex-start',
                    maxWidth: '78%',
                    padding: '0.85rem 1rem',
                    borderRadius: '0.75rem',
                    background: isUser ? 'var(--brand-btc)' : isEscalation ? 'rgba(59, 130, 246, 0.12)' : 'var(--bg-surface-elevated)',
                    color: isUser ? '#ffffff' : 'var(--text-main)',
                    border: isEscalation ? '1px solid rgba(59, 130, 246, 0.35)' : '1px solid var(--border-subtle)',
                    fontSize: '0.9rem',
                    lineHeight: 1.5,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {message.text}
                </div>
              );
            })}

            {isTyping && (
              <div
                style={{
                  alignSelf: 'flex-start',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.75rem',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-muted)',
                  fontSize: '0.8rem',
                  fontStyle: 'italic',
                }}
              >
                Support assistant is typing...
              </div>
            )}

            {escalating && (
              <div
                style={{
                  alignSelf: 'flex-start',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.75rem',
                  background: 'rgba(59, 130, 246, 0.08)',
                  border: '1px solid rgba(59, 130, 246, 0.25)',
                  color: 'var(--brand-info)',
                  fontSize: '0.8rem',
                }}
              >
                Forwarding your question to our support team on Telegram...
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            style={{
              display: 'flex',
              gap: '0.65rem',
              padding: '0.75rem',
              borderRadius: '0.75rem',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about KYC, withdrawals, buying Bitcoin, fees..."
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-main)',
                fontSize: '0.95rem',
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || escalating}
              className="btn btn-primary"
              style={{ padding: '0.55rem 0.95rem', opacity: (!input.trim() || escalating) ? 0.6 : 1 }}
            >
              <Send size={16} />
            </button>
          </form>

          <div
            style={{
              marginTop: '1rem',
              padding: '0.85rem 1rem',
              borderRadius: '0.65rem',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
            }}
          >
            <span>
              {escalated
                ? 'Your question was forwarded to our support team. Check Telegram for a response.'
                : 'For complex account issues, we can forward your chat directly to our human support team on Telegram.'}
            </span>
            <a
              href={`https://t.me/${(process.env.NEXT_PUBLIC_TELEGRAM_SUPPORT_USERNAME || 'AtechAtech').replace('@', '').trim()}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary"
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', textDecoration: 'none' }}
            >
              <MessageCircle size={14} />
              <span>Open Telegram Support</span>
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}