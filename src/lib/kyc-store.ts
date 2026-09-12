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
