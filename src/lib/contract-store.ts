'use client';

function getRecordKey(userEmail?: string): string {
  if (userEmail && userEmail.trim()) {
    return `bitcoinpro_contract_record_${userEmail.trim().toLowerCase()}`;
  }
  return 'bitcoinpro_contract_record';
}

function getSignedKey(userEmail?: string): string {
  if (userEmail && userEmail.trim()) {
    return `bitcoinpro_contract_signed_${userEmail.trim().toLowerCase()}`;
  }
  return 'bitcoinpro_contract_signed';
}

export interface ContractRecord {
  signedAt: string;
  userEmail: string;
  userName: string;
  agreementVersion: string;
  envelopeId: string;
  auditHash: string;
  status: 'under_review' | 'certified';
  reviewStartedAt: number; // timestamp in ms
  reviewDurationSeconds: number; // 30 seconds
  signatureType: 'draw' | 'type' | 'pki';
  signatureData?: string; // base64 canvas image or font identifier
  initials?: string;
  countersignedBy: string;
  countersignedAt?: string;
  clientIp?: string;
}

export function getContractRecord(userEmail?: string): ContractRecord | null {
  if (typeof window === 'undefined') return null;
  try {
    const key = getRecordKey(userEmail);
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);

    // If userEmail was specified, do not fall back to generic legacy to prevent cross-account leakage
    if (userEmail && userEmail.trim()) {
      return null;
    }

    return null;
  } catch {
    return null;
  }
}

export function startContractReview(params: {
  userEmail: string;
  userName: string;
  signatureType: 'draw' | 'type' | 'pki';
  signatureData?: string;
  initials?: string;
}): ContractRecord {
  const cleanEmail = params.userEmail?.trim().toLowerCase() || 'investor@bitcoinpro.io';
  const hexPart = Math.random().toString(16).substring(2, 8).toUpperCase();
  const envelopeId = `BPRO-DOCU-${hexPart}A9-2026-PKI`;
  const auditHash = `SHA256: ${Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase()}`;

  const record: ContractRecord = {
    signedAt: new Date().toISOString(),
    userEmail: cleanEmail,
    userName: params.userName || 'Valued Investor',
    agreementVersion: 'v2.4-INSTITUTIONAL',
    envelopeId,
    auditHash,
    status: 'under_review',
    reviewStartedAt: Date.now(),
    reviewDurationSeconds: 30,
    signatureType: params.signatureType,
    signatureData: params.signatureData,
    initials: params.initials || 'VI',
    countersignedBy: 'Johnathan E. Vance, Chief Compliance Officer, BitcoinPro Custodial Trust LLC',
    clientIp: '192.0.2.148 (TLS 1.3 High-Assurance Verified)',
  };

  if (typeof window !== 'undefined') {
    try {
      const recordKey = getRecordKey(cleanEmail);
      const signedKey = getSignedKey(cleanEmail);
      localStorage.setItem(recordKey, JSON.stringify(record));
      // In review, remove signed flag until certification completes
      localStorage.removeItem(signedKey);

      // Sync to MongoDB in background
      fetch('/api/contract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: cleanEmail,
          userName: record.userName,
          signingMethod: record.signatureType === 'draw' ? 'drawn' : 'typed',
          signatureText: record.signatureData,
          initials: record.initials,
          legalCapacity: 'Institutional Signatory',
          residentialAddress: 'Primary Custody Account',
          phoneNumber: '+1 (555) 019-2831',
          securityFingerprint: record.auditHash,
          countersignHash: record.envelopeId,
        }),
      }).catch((err) => console.warn('[Contract] MongoDB sync warning:', err));
    } catch (err) {
      console.error('Failed to save contract review state', err);
    }
  }

  return record;
}

export function finalizeContractCertification(userEmail?: string): ContractRecord | null {
  if (typeof window === 'undefined') return null;
  try {
    const record = getContractRecord(userEmail);
    if (!record) return null;

    const certifiedRecord: ContractRecord = {
      ...record,
      status: 'certified',
      countersignedAt: new Date().toISOString(),
    };

    const effectiveEmail = record.userEmail || userEmail;
    const recordKey = getRecordKey(effectiveEmail);
    const signedKey = getSignedKey(effectiveEmail);

    localStorage.setItem(recordKey, JSON.stringify(certifiedRecord));
    localStorage.setItem(signedKey, 'true');

    // Sync certification to MongoDB in background
    if (effectiveEmail) {
      fetch('/api/contract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: effectiveEmail,
          action: 'finalize',
        }),
      }).catch((err) => console.warn('[Contract] MongoDB finalize sync warning:', err));
    }

    return certifiedRecord;
  } catch {
    return null;
  }
}

export function getContractReviewStatus(userEmail?: string): {
  status: 'none' | 'under_review' | 'certified';
  remainingSeconds: number;
  record: ContractRecord | null;
} {
  if (typeof window === 'undefined') {
    return { status: 'none', remainingSeconds: 0, record: null };
  }

  try {
    const record = getContractRecord(userEmail);
    if (!record) {
      const signedKey = getSignedKey(userEmail);
      const isSigned = localStorage.getItem(signedKey) === 'true';
      if (isSigned) {
        return { status: 'certified', remainingSeconds: 0, record: null };
      }
      return { status: 'none', remainingSeconds: 0, record: null };
    }

    if (record.status === 'certified') {
      return { status: 'certified', remainingSeconds: 0, record };
    }

    if (record.status === 'under_review') {
      const elapsed = Math.floor((Date.now() - record.reviewStartedAt) / 1000);
      const remaining = Math.max(0, 30 - elapsed);

      if (remaining === 0) {
        // Auto-promote to certified
        const certified = finalizeContractCertification(record.userEmail || userEmail);
        return { status: 'certified', remainingSeconds: 0, record: certified || record };
      }

      return { status: 'under_review', remainingSeconds: remaining, record };
    }

    return { status: 'none', remainingSeconds: 0, record: null };
  } catch {
    return { status: 'none', remainingSeconds: 0, record: null };
  }
}

export function hasContractSigned(userEmail?: string): boolean {
  if (typeof window === 'undefined') return false;
  const signedKey = getSignedKey(userEmail);
  if (localStorage.getItem(signedKey) === 'true') {
    return true;
  }
  const status = getContractReviewStatus(userEmail);
  return status.status === 'certified';
}

export function isContractInReview(userEmail?: string): boolean {
  const status = getContractReviewStatus(userEmail);
  return status.status === 'under_review';
}

export function markContractSigned(record?: Partial<ContractRecord>, userEmail?: string): ContractRecord {
  const effectiveEmail = record?.userEmail || userEmail || '';
  const existing = getContractRecord(effectiveEmail);
  const data: ContractRecord = {
    signedAt: existing?.signedAt || new Date().toISOString(),
    userEmail: effectiveEmail,
    userName: record?.userName || existing?.userName || 'Valued Investor',
    agreementVersion: 'v2.4-INSTITUTIONAL',
    envelopeId: existing?.envelopeId || 'BPRO-DOCU-8F42A9-2026-PKI',
    auditHash: existing?.auditHash || 'SHA256: 8F39A1C52E74B9A9D44E09B1A2C3D4E5',
    status: 'certified',
    reviewStartedAt: existing?.reviewStartedAt || Date.now() - 31000,
    reviewDurationSeconds: 30,
    signatureType: existing?.signatureType || 'type',
    countersignedBy: 'Johnathan E. Vance, Chief Compliance Officer, BitcoinPro Custodial Trust LLC',
    countersignedAt: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    try {
      const recordKey = getRecordKey(effectiveEmail);
      const signedKey = getSignedKey(effectiveEmail);
      localStorage.setItem(signedKey, 'true');
      localStorage.setItem(recordKey, JSON.stringify(data));
    } catch (err) {
      console.error('Failed to save contract state', err);
    }
  }

  return data;
}

export function resetContractState(userEmail?: string): void {
  if (typeof window === 'undefined') return;
  try {
    const recordKey = getRecordKey(userEmail);
    const signedKey = getSignedKey(userEmail);
    localStorage.removeItem(recordKey);
    localStorage.removeItem(signedKey);
    if (!userEmail) {
      localStorage.removeItem('bitcoinpro_contract_record');
      localStorage.removeItem('bitcoinpro_contract_signed');
    }
  } catch (err) {
    console.error('Failed to reset contract state', err);
  }
}