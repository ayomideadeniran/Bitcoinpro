import { KycProfile } from './types';

export const DEFAULT_KYC_PROFILE: KycProfile = {
  tier: 1,
  status: 'unverified',
  documentType: 'passport',
  dailyLimitUsd: 500,
  remainingDailyUsd: 500,
  monthlyLimitUsd: 15000,
  verifiedAt: '',
};

function getKycKey(userEmail?: string): string {
  if (userEmail && userEmail.trim()) {
    return `bitcoinpro_kyc_profile_${userEmail.trim().toLowerCase()}`;
  }
  return 'bitcoinpro_kyc_profile';
}

export function getStoredKycProfile(userEmail?: string): KycProfile {
  if (typeof window === 'undefined') return DEFAULT_KYC_PROFILE;
  try {
    const key = getKycKey(userEmail);
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : DEFAULT_KYC_PROFILE;
  } catch {
    return DEFAULT_KYC_PROFILE;
  }
}

export function saveStoredKycProfile(profile: KycProfile, userEmail?: string): void {
  if (typeof window === 'undefined') return;
  try {
    const key = getKycKey(userEmail);
    localStorage.setItem(key, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save KYC profile', err);
  }
}
