'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldAlert, X, ArrowRight } from 'lucide-react';

function BannerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const unauthorized = searchParams.get('unauthorized');

  if (!unauthorized) return null;

  const handleDismiss = () => {
    router.replace('/', { scroll: false });
  };

  return (
    <div
      style={{
        background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.15) 0%, rgba(247, 147, 26, 0.15) 100%)',
        borderBottom: '1px solid rgba(239, 68, 68, 0.3)',
        padding: '0.75rem 1rem',
        color: 'var(--text-main)',
      }}
      id="unauthorized-route-banner"
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.2)',
              color: 'var(--brand-danger)',
              flexShrink: 0,
            }}
          >
            <ShieldAlert size={16} />
          </div>
          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
            Access Restricted: You must be signed in to access the investor dashboard or protected pages.
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Link
            href="/register"
            className="btn btn-primary"
            style={{
              padding: '0.4rem 0.9rem',
              fontSize: '0.8rem',
              background: 'linear-gradient(135deg, #f7931a 0%, #ffaa33 100%)',
              color: '#000',
              fontWeight: 700,
            }}
            id="banner-signin-btn"
          >
            <span>Join Grand Opening Wishlist</span>
            <ArrowRight size={13} />
          </Link>
          <button
            onClick={handleDismiss}
            aria-label="Dismiss message"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.3rem',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UnauthorizedBanner() {
  return (
    <Suspense fallback={null}>
      <BannerContent />
    </Suspense>
  );
}
