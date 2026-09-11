import { promises as fs } from 'fs';
import path from 'path';

const ANALYTICS_FILE = path.join(process.cwd(), 'analytics.json');

export interface AnalyticsUser {
  email: string;
  name: string;
  id: string;
  signupDate: string;
  loginCount: number;
  lastLogin: string;
  kycTier: number;
  kycStatus: string;
  role: string;
}

export interface AnalyticsData {
  totalSignups: number;
  totalLogins: number;
  users: Record<string, AnalyticsUser>;
  recentEvents: Array<{
    type: 'signup' | 'login';
    userId: string;
    email: string;
    name: string;
    timestamp: string;
  }>;
}

export async function readAnalytics(): Promise<AnalyticsData> {
  try {
    const raw = await fs.readFile(ANALYTICS_FILE, 'utf-8');
    return JSON.parse(raw) as AnalyticsData;
  } catch {
    return {
      totalSignups: 0,
      totalLogins: 0,
      users: {},
      recentEvents: [],
    };
  }
}

export async function writeAnalytics(data: AnalyticsData): Promise<void> {
  await fs.writeFile(ANALYTICS_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export async function trackSignup(user: {
  id: string;
  email: string;
  name: string;
  kycTier: number;
  kycStatus: string;
  role: string;
}): Promise<void> {
  const data = await readAnalytics();
  const now = new Date().toISOString();

  data.totalSignups += 1;
  data.users[user.id] = {
    id: user.id,
    email: user.email,
    name: user.name,
    signupDate: now,
    loginCount: 0,
    lastLogin: now,
    kycTier: user.kycTier,
    kycStatus: user.kycStatus,
    role: user.role,
  };
  data.recentEvents.unshift({
    type: 'signup',
    userId: user.id,
    email: user.email,
    name: user.name,
    timestamp: now,
  });

  if (data.recentEvents.length > 100) {
    data.recentEvents = data.recentEvents.slice(0, 100);
  }

  await writeAnalytics(data);
}

export async function trackLogin(user: {
  id: string;
  email: string;
  name: string;
  kycTier: number;
  kycStatus: string;
  role: string;
}): Promise<void> {
  const data = await readAnalytics();
  const now = new Date().toISOString();

  data.totalLogins += 1;

  if (!data.users[user.id]) {
    data.users[user.id] = {
      id: user.id,
      email: user.email,
      name: user.name,
      signupDate: now,
      loginCount: 0,
      lastLogin: now,
      kycTier: user.kycTier,
      kycStatus: user.kycStatus,
      role: user.role,
    };
    data.totalSignups += 1;
  } else {
    data.users[user.id].loginCount += 1;
    data.users[user.id].lastLogin = now;
  }

  data.recentEvents.unshift({
    type: 'login',
    userId: user.id,
    email: user.email,
    name: user.name,
    timestamp: now,
  });

  if (data.recentEvents.length > 100) {
    data.recentEvents = data.recentEvents.slice(0, 100);
  }

  await writeAnalytics(data);
}