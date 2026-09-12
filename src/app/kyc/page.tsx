'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import KycVerificationModal from '@/components/dashboard/KycVerificationModal';
import { getStoredKycProfile, saveStoredKycProfile } from '@/lib/kyc-store';
import { KycProfile } from '@/lib/types';

export default function KycPage() {
  const router = useRouter();
  const [kycProfile, setKycProfile] = useState<KycProfile>(getStoredKycProfile());
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const profile = getStoredKycProfile();
    setKycProfile(profile);
    setOpen(true);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ maxWidth: '480px', width: '100%', textAlign: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>KYC Verification</h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          Complete identity verification to unlock withdrawals and higher limits.
        </p>
      </div>

      <KycVerificationModal
        kycProfile={kycProfile}
        onClose={() => router.push('/dashboard')}
        onVerified={(profile) => {
          setKycProfile(profile);
          saveStoredKycProfile(profile);
        }}
      />

      <button
        onClick={() => router.push('/dashboard')}
        style={{
          marginTop: '1rem',
          padding: '0.65rem 1.1rem',
          borderRadius: '0.5rem',
          background: 'transparent',
          color: 'var(--text-muted)',
          border: '1px solid var(--border-subtle)',
          cursor: 'pointer',
          fontSize: '0.85rem',
        }}
      >
        Back to Dashboard
      </button>
    </div>
  );
}