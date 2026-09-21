import { promises as fs } from 'fs';
import path from 'path';
import { connectToDatabase } from './mongodb';
import { WaitlistModel } from '@/models/Waitlist';

const DB_DIR = path.join(process.cwd(), 'data');
const REGISTRATIONS_FILE = path.join(DB_DIR, 'registrations.json');

export interface RegistrationRecord {
  ticketId: string;
  queueNumber: number;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  investmentTier: string;
  paymentMethod: string;
  investorType: string;
  primaryInterest: string;
  telegramHandle?: string;
  referralCode?: string;
  notes?: string;
  priorityStatus: 'VIP' | 'Institutional' | 'Standard';
  ipAddress?: string;
  createdAt: string;
  syncedToMongo?: boolean;
}

// Ensure database directory and file exist
async function ensureDbFile(): Promise<void> {
  try {
    await fs.mkdir(DB_DIR, { recursive: true });
  } catch {}

  try {
    await fs.access(REGISTRATIONS_FILE);
  } catch {
    await fs.writeFile(REGISTRATIONS_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

// Read all actual registrations from persistent storage
export async function getActualRegistrations(): Promise<RegistrationRecord[]> {
  await ensureDbFile();
  try {
    const raw = await fs.readFile(REGISTRATIONS_FILE, 'utf-8');
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch (err) {
    console.error('[Database] Failed to read registrations.json:', err);
    return [];
  }
}

// Write registrations array to persistent storage
async function writeRegistrations(records: RegistrationRecord[]): Promise<void> {
  await ensureDbFile();
  await fs.writeFile(REGISTRATIONS_FILE, JSON.stringify(records, null, 2), 'utf-8');
}

// Get the actual number of people who have registered successfully
export async function getActualRegistrationCount(): Promise<number> {
  const records = await getActualRegistrations();
  return records.length;
}

// Find an existing registration by email
export async function findActualRegistrationByEmail(email: string): Promise<RegistrationRecord | null> {
  const cleanEmail = email.trim().toLowerCase();
  const records = await getActualRegistrations();
  return records.find((r) => r.email.toLowerCase() === cleanEmail) || null;
}

// Save a new registration to persistent storage and attempt MongoDB sync
export async function saveActualRegistration(
  data: Omit<RegistrationRecord, 'ticketId' | 'queueNumber' | 'createdAt' | 'syncedToMongo'>
): Promise<RegistrationRecord> {
  await ensureDbFile();
  const records = await getActualRegistrations();

  const cleanEmail = data.email.trim().toLowerCase();
  const existingIndex = records.findIndex((r) => r.email.toLowerCase() === cleanEmail);

  let newRecord: RegistrationRecord;

  if (existingIndex >= 0) {
    // Update existing record
    const prev = records[existingIndex];
    newRecord = {
      ...prev,
      ...data,
      email: cleanEmail,
      queueNumber: prev.queueNumber,
      ticketId: prev.ticketId,
      createdAt: prev.createdAt,
      syncedToMongo: false,
    };
    records[existingIndex] = newRecord;
  } else {
    // Create new sequential actual record (starts at 1, 2, 3...)
    const queueNumber = records.length + 1;
    const ticketId = `STARK-VIP-${queueNumber.toString().padStart(5, '0')}`;

    newRecord = {
      ...data,
      email: cleanEmail,
      queueNumber,
      ticketId,
      createdAt: new Date().toISOString(),
      syncedToMongo: false,
    };
    records.push(newRecord);
  }

  // 1. Always save locally to disk first (zero data loss guarantee)
  await writeRegistrations(records);

  // 2. Try to sync to MongoDB Atlas
  try {
    await connectToDatabase();
    await WaitlistModel.findOneAndUpdate(
      { email: cleanEmail },
      {
        fullName: newRecord.fullName,
        email: cleanEmail,
        phone: newRecord.phone,
        country: newRecord.country,
        investmentTier: newRecord.investmentTier,
        paymentMethod: newRecord.paymentMethod,
        investorType: newRecord.investorType,
        primaryInterest: newRecord.primaryInterest,
        telegramHandle: newRecord.telegramHandle,
        referralCode: newRecord.referralCode,
        notes: newRecord.notes,
        ticketId: newRecord.ticketId,
        queueNumber: newRecord.queueNumber,
        priorityStatus: newRecord.priorityStatus,
        ipAddress: newRecord.ipAddress,
      },
      { upsert: true, new: true }
    );

    newRecord.syncedToMongo = true;
    const updatedRecords = await getActualRegistrations();
    const idx = updatedRecords.findIndex((r) => r.email === cleanEmail);
    if (idx >= 0) {
      updatedRecords[idx].syncedToMongo = true;
      await writeRegistrations(updatedRecords);
    }
  } catch (mongoErr: any) {
    console.warn('[Database] MongoDB Atlas sync pending (saved locally in data/registrations.json):', mongoErr.message);
  }

  return newRecord;
}
