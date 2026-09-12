'use client';

import React, { useState } from 'react';
import { MessageSquare, X, Send, ShieldCheck, Mail, Phone, Clock } from 'lucide-react';

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

export default function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
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
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--brand-btc) 0%, #e08213 100%)',
          color: '#fff',
          border: 'none',
          boxShadow: '0 8px 24px rgba(247, 147, 26, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 9999,
          transition: 'transform 0.2s ease',
          transform: isOpen ? 'scale(0.9)' : 'scale(1)',
        }}
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '24px',
            width: 'calc(100vw - 48px)',
            maxWidth: '400px',
            height: '600px',
            maxHeight: 'calc(100vh - 120px)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '1rem',
            boxShadow: '0 12px 48px rgba(0,0,0,0.5)',
            zIndex: 9998,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div style={{
            padding: '1.25rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-surface-elevated)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--brand-btc)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}>
                <ShieldCheck size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>Customer Care</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--brand-success)' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--brand-success)' }}></span>
                  Online - Replies in minutes
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            padding: '1.25rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            background: 'var(--bg-primary)'
          }}>
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div key={msg.id} style={{
                  alignSelf: isUser ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem'
                }}>
                  <div style={{
                    background: isUser ? 'var(--brand-btc)' : 'var(--bg-surface-elevated)',
                    color: isUser ? '#fff' : 'var(--text-main)',
                    padding: '0.75rem 1rem',
                    borderRadius: '1rem',
                    borderBottomRightRadius: isUser ? '0.25rem' : '1rem',
                    borderBottomLeftRadius: !isUser ? '0.25rem' : '1rem',
                    fontSize: '0.9rem',
                    lineHeight: 1.4,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}>
                    {msg.text}
                  </div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', alignSelf: isUser ? 'flex-end' : 'flex-start', padding: '0 0.5rem' }}>
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
                <span className="typing-dot" style={{ width: '5px', height: '5px', background: 'var(--text-muted)', borderRadius: '50%', animation: 'typingBounce 1.4s infinite ease-in-out both', animationDelay: '-0.32s' }}></span>
                <span className="typing-dot" style={{ width: '5px', height: '5px', background: 'var(--text-muted)', borderRadius: '50%', animation: 'typingBounce 1.4s infinite ease-in-out both', animationDelay: '-0.16s' }}></span>
                <span className="typing-dot" style={{ width: '5px', height: '5px', background: 'var(--text-muted)', borderRadius: '50%', animation: 'typingBounce 1.4s infinite ease-in-out both' }}></span>
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{ padding: '1rem', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
            <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder="Message Customer Care..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  borderRadius: '99px',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-main)',
                  outline: 'none',
                  fontSize: '0.9rem'
                }}
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                style={{
                  width: '40px',
                  height: '40px',
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
                <Send size={16} style={{ marginLeft: '-2px' }} />
              </button>
            </form>
          </div>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes typingBounce {
          0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}} />
    </>
  );
}
