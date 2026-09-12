'use client';

import React, { useState } from 'react';
import { Send, User, MessageSquare, Clock, ShieldCheck, Mail, Phone, ChevronRight } from 'lucide-react';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    text: 'Hello! I am your dedicated Wealth Manager. How can I assist you with your portfolio today?',
    sender: 'agent',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
];

export default function SupportSection() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate agent response
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: 'Thank you for your message. One of our expert traders will review your request and get back to you shortly.',
          sender: 'agent',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 2000);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          Customer Care
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
          Connect directly with your dedicated wealth managers and support experts.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          alignItems: 'start'
        }}
      >
        {/* Chat Interface */}
        <div 
          className="glass-card" 
          style={{ 
            gridColumn: '1 / -1', 
            '@media (min-width: 1024px)': { gridColumn: '1 / 3' },
            display: 'flex', 
            flexDirection: 'column', 
            height: '600px',
            overflow: 'hidden'
          } as React.CSSProperties}
        >
          {/* Chat Header */}
          <div style={{ 
            padding: '1.25rem', 
            borderBottom: '1px solid var(--border-subtle)', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem',
            background: 'var(--bg-surface)'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--brand-btc) 0%, #e08213 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)' }}>Expert Support Team</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--brand-success)' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--brand-success)' }}></span>
                Online - Typically replies in minutes
              </div>
            </div>
          </div>

          {/* Chat Messages Area */}
          <div style={{ 
            flex: 1, 
            padding: '1.5rem', 
            overflowY: 'auto', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1.25rem',
            background: 'rgba(0,0,0,0.1)'
          }}>
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div key={msg.id} style={{
                  alignSelf: isUser ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem'
                }}>
                  <div style={{
                    background: isUser ? 'var(--brand-btc)' : 'var(--bg-surface-elevated)',
                    color: isUser ? '#fff' : 'var(--text-main)',
                    padding: '0.85rem 1.15rem',
                    borderRadius: '1.25rem',
                    borderBottomRightRadius: isUser ? '0.25rem' : '1.25rem',
                    borderBottomLeftRadius: !isUser ? '0.25rem' : '1.25rem',
                    fontSize: '0.95rem',
                    lineHeight: 1.5,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    border: !isUser ? '1px solid var(--border-subtle)' : 'none'
                  }}>
                    {msg.text}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', alignSelf: isUser ? 'flex-end' : 'flex-start', padding: '0 0.5rem' }}>
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}
            
            {isTyping && (
              <div style={{
                alignSelf: 'flex-start',
                background: 'var(--bg-surface-elevated)',
                padding: '0.75rem 1rem',
                borderRadius: '1rem',
                display: 'flex',
                gap: '0.25rem'
              }}>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
            <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '0.75rem' }}>
              <input
                type="text"
                placeholder="Type your message here..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.85rem 1.25rem',
                  borderRadius: '99px',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-main)',
                  outline: 'none',
                  fontSize: '0.95rem'
                }}
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: inputValue.trim() ? 'var(--brand-btc)' : 'var(--bg-surface-elevated)',
                  color: inputValue.trim() ? '#fff' : 'var(--text-muted)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s'
                }}
              >
                <Send size={18} style={{ marginLeft: '-2px' }} />
              </button>
            </form>
          </div>
        </div>

        {/* Contact Info Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1.25rem' }}>Contact Information</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '0.5rem', background: 'rgba(247, 147, 26, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-btc)' }}>
                  <Mail size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Email Support</div>
                  <div style={{ fontWeight: 500, color: 'var(--text-main)' }}>support@bitcoinpro.com</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '0.5rem', background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-success)' }}>
                  <Phone size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Priority Phone Line</div>
                  <div style={{ fontWeight: 500, color: 'var(--text-main)' }}>+1 (800) 555-0199</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '0.5rem', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                  <Clock size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Operating Hours</div>
                  <div style={{ fontWeight: 500, color: 'var(--text-main)' }}>24/7 Global Support</div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(247, 147, 26, 0.1) 0%, rgba(247, 147, 26, 0.05) 100%)', border: '1px solid rgba(247, 147, 26, 0.2)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={18} style={{ color: 'var(--brand-btc)' }} />
              Secure Communication
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1rem' }}>
              All communications on this platform are end-to-end encrypted. Our experts will never ask for your passwords or private keys.
            </p>
          </div>
        </div>
      </div>
      
      {/* CSS for typing animation */}
      <style dangerouslySetInnerHTML={{__html: `
        .typing-dot {
          width: 6px;
          height: 6px;
          background: var(--text-muted);
          border-radius: 50%;
          animation: typingBounce 1.4s infinite ease-in-out both;
        }
        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }
        @keyframes typingBounce {
          0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}} />
    </div>
  );
}
