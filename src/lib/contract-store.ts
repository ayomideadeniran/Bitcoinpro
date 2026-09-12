const STORAGE_KEY_CONTRACT = 'bitcoinpro_contract_signed';

export interface ContractRecord {
  signedAt: string;
  userEmail: string;
  userName: string;
  agreementVersion: string;
}

export function hasContractSigned(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONTRACT);
    return raw === 'true';
  } catch {
    return false;
  }
}

export function markContractSigned(record?: Partial<ContractRecord>): ContractRecord {
  const data: ContractRecord = {
    signedAt: new Date().toISOString(),
    userEmail: record?.userEmail || '',
    userName: record?.userName || '',
    agreementVersion: 'v1.0',
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY_CONTRACT, 'true');
      localStorage.setItem(`${STORAGE_KEY_CONTRACT}_record`, JSON.stringify(data));
    } catch (err) {
      console.error('Failed to save contract state', err);
    }
  }

  return data;
}

export function getContractRecord(): ContractRecord | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_CONTRACT}_record`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}