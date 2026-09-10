'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, Clock, ShieldCheck, Tag, X, Settings2 } from 'lucide-react';
import { AppNotification } from '@/lib/types';

interface NotificationDrawerProps {
  notifications: AppNotification[];
  onMarkAllRead: () => void;
  onOpenPriceAlerts: () => void;
}

export default function NotificationDrawer({
  notifications,
  onMarkAllRead,
  onOpenPriceAlerts,
}: NotificationDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '38px',
          height: '38px',
          borderRadius: '0.5rem',
          border: '1px solid var(--border-subtle)',
          background: 'var(--bg-surface)',
          color: 'var(--text-main)',
          cursor: 'pointer',
        }}
        aria-label="Open notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              background: 'var(--brand-danger)',
              color: '#ffffff',
              fontSize: '0.65rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {/* Flyout Drawer */}
      {isOpen && (
        <div
          className="glass-card"
          style={{
            position: 'absolute',
            right: 0,
            top: '46px',
            width: '360px',
            maxHeight: '440px',
            overflowY: 'auto',
            padding: '1.25rem',
            zIndex: 200,
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
            <span style={{ fontSize: '0.95rem', fontWeight: 800 }}>Notifications</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={onOpenPriceAlerts}
                title="Manage Price Triggers"
                style={{ fontSize: '0.75rem', color: 'var(--brand-btc)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
              >
                <Settings2 size={13} />
                <span>Alerts</span>
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllRead}
                  style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                >
                  <CheckCheck size={13} />
                  <span>Mark Read</span>
                </button>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {notifications.length === 0 ? (
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1.5rem 0' }}>
                No notifications right now.
              </p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    background: n.read ? 'var(--bg-surface)' : 'var(--bg-surface-elevated)',
                    border: '1px solid',
                    borderColor: n.read ? 'var(--border-subtle)' : 'var(--border-active)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {n.title}
                    </span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-faint)' }}>
                      {new Date(n.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    {n.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
