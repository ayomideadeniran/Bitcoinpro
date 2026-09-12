'use client';

import React from 'react';
import { ArrowLeft, Trophy, Crown, Medal, Award, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface LeaderboardUser {
  rank: number;
  name: string;
  avatarUrl: string;
  tier: string;
  earnings: string;
  currency: string;
}

const LEADERBOARD_DATA: LeaderboardUser[] = [
  { rank: 1, name: 'Maurice Boendermaker', avatarUrl: 'https://i.pravatar.cc/100?img=15', tier: 'Platinum Tier', earnings: '840,250', currency: 'USDT' },
  { rank: 2, name: 'Gopi Kannappan', avatarUrl: 'https://i.pravatar.cc/100?img=53', tier: 'Platinum Tier', earnings: '612,400', currency: 'USDT' },
  { rank: 3, name: 'Milan Shoukri', avatarUrl: 'https://i.pravatar.cc/100?img=60', tier: 'Gold Tier', earnings: '480,950', currency: 'USDT' },
  { rank: 4, name: 'Ranit Mondal', avatarUrl: 'https://i.pravatar.cc/100?img=11', tier: 'Gold Tier', earnings: '345,100', currency: 'USDC' },
  { rank: 5, name: 'Lawrence Oyebanji', avatarUrl: 'https://i.pravatar.cc/100?img=68', tier: 'Gold Tier', earnings: '298,500', currency: 'USDC' },
  { rank: 6, name: 'Khair Bush', avatarUrl: 'https://i.pravatar.cc/100?img=33', tier: 'Silver Tier', earnings: '142,800', currency: 'USDT' },
  { rank: 7, name: 'Sarah Jenkins', avatarUrl: 'https://i.pravatar.cc/100?img=47', tier: 'Silver Tier', earnings: '95,400', currency: 'USDC' },
  { rank: 8, name: 'Michael Chen', avatarUrl: 'https://i.pravatar.cc/100?img=12', tier: 'Silver Tier', earnings: '88,200', currency: 'USDT' },
  { rank: 9, name: 'Elena Rodriguez', avatarUrl: 'https://i.pravatar.cc/100?img=44', tier: 'Silver Tier', earnings: '76,500', currency: 'USDC' },
  { rank: 10, name: 'David Smith', avatarUrl: 'https://i.pravatar.cc/100?img=59', tier: 'Silver Tier', earnings: '64,100', currency: 'USDT' },
];

export default function LeaderboardPage() {
  const top3 = LEADERBOARD_DATA.slice(0, 3);
  const restOfList = LEADERBOARD_DATA.slice(3);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <header style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/dashboard" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Trophy size={20} style={{ color: 'var(--brand-btc)' }} />
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Global Wealth Leaderboard</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container" style={{ flex: 1, padding: '3rem 1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Title Section */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', background: 'linear-gradient(to right, #f59e0b, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Top Wealth Builders
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Discover the highest-performing portfolios and their winning strategies. Rank up by accumulating wealth on the platform.
          </p>
        </div>

        {/* Podium for Top 3 */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '1.5rem', marginBottom: '5rem', height: '280px' }}>
          
          {/* Rank 2 (Left) */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '220px' }}>
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <img src={top3[1].avatarUrl} alt={top3[1].name} style={{ width: '80px', height: '80px', borderRadius: '50%', border: '4px solid #9ca3af', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: '-10px', left: '50%', transform: 'translateX(-50%)', background: '#9ca3af', color: '#111', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>2</div>
            </div>
            <div className="glass-card" style={{ width: '100%', height: '160px', padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to top, rgba(156, 163, 175, 0.1), transparent)', borderTopColor: '#9ca3af' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 0.25rem', textAlign: 'center' }}>{top3[1].name}</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>{top3[1].tier}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--brand-success)' }}>
                <TrendingUp size={14} />
                <span className="mono" style={{ fontWeight: 700 }}>${top3[1].earnings}</span>
              </div>
            </div>
          </div>

          {/* Rank 1 (Center) */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '260px', zIndex: 10 }}>
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <Crown size={32} style={{ position: 'absolute', top: '-35px', left: '50%', transform: 'translateX(-50%)', color: '#fbbf24', filter: 'drop-shadow(0 0 10px rgba(251,191,36,0.6))' }} />
              <img src={top3[0].avatarUrl} alt={top3[0].name} style={{ width: '110px', height: '110px', borderRadius: '50%', border: '5px solid #fbbf24', objectFit: 'cover', boxShadow: '0 0 30px rgba(251,191,36,0.3)' }} />
              <div style={{ position: 'absolute', bottom: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#fbbf24', color: '#111', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1rem' }}>1</div>
            </div>
            <div className="glass-card" style={{ width: '100%', height: '200px', padding: '2rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to top, rgba(251, 191, 36, 0.15), transparent)', borderTopColor: '#fbbf24', boxShadow: '0 -10px 40px rgba(251,191,36,0.1)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 0.25rem', textAlign: 'center' }}>{top3[0].name}</h3>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{top3[0].tier}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--brand-success)' }}>
                <TrendingUp size={16} />
                <span className="mono" style={{ fontWeight: 800, fontSize: '1.25rem' }}>${top3[0].earnings}</span>
              </div>
            </div>
          </div>

          {/* Rank 3 (Right) */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '220px' }}>
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <img src={top3[2].avatarUrl} alt={top3[2].name} style={{ width: '80px', height: '80px', borderRadius: '50%', border: '4px solid #b45309', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: '-10px', left: '50%', transform: 'translateX(-50%)', background: '#b45309', color: '#fff', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>3</div>
            </div>
            <div className="glass-card" style={{ width: '100%', height: '140px', padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to top, rgba(180, 83, 9, 0.15), transparent)', borderTopColor: '#b45309' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 0.25rem', textAlign: 'center' }}>{top3[2].name}</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>{top3[2].tier}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--brand-success)' }}>
                <TrendingUp size={14} />
                <span className="mono" style={{ fontWeight: 700 }}>${top3[2].earnings}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Full Table */}
        <div className="glass-card" style={{ padding: '1rem' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr>
                  <th style={{ padding: '1.25rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, borderBottom: '1px solid var(--border-subtle)' }}>Rank</th>
                  <th style={{ padding: '1.25rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, borderBottom: '1px solid var(--border-subtle)' }}>Investor</th>
                  <th style={{ padding: '1.25rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, borderBottom: '1px solid var(--border-subtle)' }}>Tier / Strategy</th>
                  <th style={{ padding: '1.25rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, borderBottom: '1px solid var(--border-subtle)', textAlign: 'right' }}>Total Earnings</th>
                </tr>
              </thead>
              <tbody>
                {restOfList.map((user) => (
                  <tr key={user.rank} style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.2s', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-surface-elevated)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>#{user.rank}</td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <img src={user.avatarUrl} alt={user.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                        <span style={{ fontWeight: 600 }}>{user.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      {user.tier}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(34, 197, 94, 0.1)', color: 'var(--brand-success)', padding: '0.35rem 0.75rem', borderRadius: '2rem' }}>
                        <TrendingUp size={14} />
                        <span className="mono" style={{ fontWeight: 700 }}>${user.earnings} {user.currency}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
