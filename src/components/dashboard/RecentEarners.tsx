'use client';

import React from 'react';
import { ArrowRight, User } from 'lucide-react';
import Link from 'next/link';

interface Earner {
  id: string;
  name: string;
  subtitle: string;
  amount: string;
  currency: string;
  avatarGradient: string;
  avatarUrl?: string;
  iconColor: string;
}

const EARNERS: Earner[] = [
  {
    id: '1',
    name: 'Maurice Boendermaker',
    subtitle: 'Platinum Tier Investor',
    amount: '840,250',
    currency: 'USDT',
    avatarGradient: 'linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)',
    avatarUrl: 'https://i.pravatar.cc/100?img=15',
    iconColor: '#22c55e', // green USDT like
  },
  {
    id: '2',
    name: 'Gopi Kannappan',
    subtitle: 'Platinum Tier Investor',
    amount: '612,400',
    currency: 'USDT',
    avatarGradient: 'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)',
    avatarUrl: 'https://i.pravatar.cc/100?img=53',
    iconColor: '#22c55e',
  },
  {
    id: '3',
    name: 'Milan Shoukri',
    subtitle: 'Gold Tier Investor',
    amount: '480,950',
    currency: 'USDT',
    avatarGradient: 'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)',
    avatarUrl: 'https://i.pravatar.cc/100?img=60',
    iconColor: '#22c55e',
  },
  {
    id: '4',
    name: 'Ranit Mondal',
    subtitle: 'Gold Tier Investor',
    amount: '345,100',
    currency: 'USDC',
    avatarGradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    avatarUrl: 'https://i.pravatar.cc/100?img=11',
    iconColor: '#3b82f6',
  },
  {
    id: '5',
    name: 'Lawrence Oyebanji',
    subtitle: 'Gold Tier Investor',
    amount: '298,500',
    currency: 'USDC',
    avatarGradient: 'linear-gradient(135deg, #434343 0%, #000000 100%)',
    avatarUrl: 'https://i.pravatar.cc/100?img=68',
    iconColor: '#2563eb',
  },
  {
    id: '6',
    name: 'Khair Bush',
    subtitle: 'Silver Tier Investor',
    amount: '142,800',
    currency: 'USDT',
    avatarGradient: 'linear-gradient(135deg, #cfd9df 0%, #e2ebf0 100%)',
    avatarUrl: 'https://i.pravatar.cc/100?img=33',
    iconColor: '#22c55e',
  },
];

export default function RecentEarners() {
  return (
    <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', height: 'fit-content' }}>
      <style jsx>{`
        @keyframes scrollUp {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }
        .earners-marquee-container {
          position: relative;
          height: 350px;
          overflow: hidden;
          mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
        }
        .earners-marquee-content {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          animation: scrollUp 20s linear infinite;
        }
        .earners-marquee-content:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
          Top Wealth Builders
        </h3>
        <Link 
          href="/dashboard/leaderboard" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', color: '#6366f1', fontWeight: 600, textDecoration: 'none' }}
        >
          Leaderboard <ArrowRight size={14} />
        </Link>
      </div>

      {/* Animated List Container */}
      <div className="earners-marquee-container">
        <div className="earners-marquee-content">
          {/* Duplicate the array to create a seamless infinite loop */}
          {[...EARNERS, ...EARNERS].map((earner, index) => (
            <div key={`${earner.id}-${index}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            
            {/* Left: Avatar + Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div 
                style={{ 
                  width: '42px', 
                  height: '42px', 
                  borderRadius: '50%', 
                  background: earner.avatarGradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  overflow: 'hidden'
                }}
              >
                {earner.avatarUrl ? (
                  <img src={earner.avatarUrl} alt={earner.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  !earner.avatarGradient && <User size={20} color="#fff" />
                )}
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  {earner.name}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {earner.subtitle}
                </span>
              </div>
            </div>

            {/* Right: Amount */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div 
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: earner.iconColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '0.6rem',
                  fontWeight: 'bold'
                }}
              >
                $
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {earner.amount}
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  {earner.currency}
                </span>
              </div>
            </div>

          </div>
          ))}
        </div>
      </div>
    </div>
  );
}
