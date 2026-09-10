import { KycProfile } from './types';

export const DEFAULT_KYC_PROFILE: KycProfile = {
  tier: 2,
  status: 'verified',
  documentType: 'passport',
  dailyLimitUsd: 10000,
  remainingDailyUsd: 8750,
  monthlyLimitUsd: 100000,
  verifiedAt: '2026-08-10T12:00:00Z',
};

const STORAGE_KEY_KYC = 'bitcoinpro_kyc_profile';

export function getStoredKycProfile(): KycProfile {
  if (typeof window === 'undefined') return DEFAULT_KYC_PROFILE;
  try {
    const item = localStorage.getItem(STORAGE_KEY_KYC);
    return item ? JSON.parse(item) : DEFAULT_KYC_PROFILE;
  } catch {
    return DEFAULT_KYC_PROFILE;
  }
}

export function saveStoredKycProfile(profile: KycProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_KYC, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save KYC profile', err);
  }
}
