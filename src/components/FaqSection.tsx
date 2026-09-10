'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, MessageCircle, Mail } from 'lucide-react';
import { FAQ_ITEMS } from '@/lib/education-data';

export default function FaqSection() {
  const [openFaqId, setOpenFaqId] = useState<string | null>(FAQ_ITEMS[0].id);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredFaqs = selectedCategory === 'all'
    ? FAQ_ITEMS
    : FAQ_ITEMS.filter((f) => f.category === selectedCategory);

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <section id="faq" className="section-wrapper" style={{ background: 'var(--bg-surface)' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge">
            <HelpCircle size={14} />
            <span>Got Questions?</span>
          </div>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">
            Honest answers to the most common questions beginners ask before getting started.
          </p>
        </div>

        {/* Category Filter Chips */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
            flexWrap: 'wrap',
            marginBottom: '2.5rem',
          }}
        >
          {['all', 'basics', 'investing', 'security', 'fees'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: '9999px',
                fontSize: '0.825rem',
                fontWeight: 600,
                textTransform: 'capitalize',
                background: selectedCategory === cat ? 'var(--brand-btc)' : 'var(--bg-surface-elevated)',
                color: selectedCategory === cat ? '#ffffff' : 'var(--text-muted)',
                border: '1px solid',
                borderColor: selectedCategory === cat ? 'var(--brand-btc)' : 'var(--border-subtle)',
              }}
            >
              {cat === 'all' ? 'All Questions' : cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div
          style={{
            maxWidth: '820px',
            margin: '0 auto 3rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          {filteredFaqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="glass-card"
                style={{
                  overflow: 'hidden',
                  borderColor: isOpen ? 'var(--border-active)' : 'var(--border-subtle)',
                }}
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  style={{
                    width: '100%',
                    padding: '1.25rem 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textAlign: 'left',
                    background: 'transparent',
                    cursor: 'pointer',
                  }}
                  aria-expanded={isOpen}
                >
                  <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {faq.question}
                  </span>
                  <div
                    style={{
                      color: isOpen ? 'var(--brand-btc)' : 'var(--text-muted)',
                      transition: 'transform 0.2s ease',
                    }}
                  >
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </button>

                {isOpen && (
                  <div
                    style={{
                      padding: '0 1.5rem 1.25rem',
                      fontSize: '0.95rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.6,
                      borderTop: '1px solid var(--border-subtle)',
                      paddingTop: '1rem',
                    }}
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support Callout */}
        <div
          style={{
            textAlign: 'center',
            maxWidth: '600px',
            margin: '0 auto',
            padding: '2rem',
            borderRadius: '1rem',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--brand-btc)' }}>
            <MessageCircle size={24} />
          </div>
          <h4 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Still have questions?
          </h4>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Our educational support team is here to help you navigate Bitcoin safely. We will never ask for your seed phrase or password.
          </p>
          <a href="mailto:support@bitcoinpro.local" className="btn btn-secondary">
            <Mail size={16} />
            <span>Contact Educational Support</span>
          </a>
        </div>
      </div>
    </section>
  );
}
