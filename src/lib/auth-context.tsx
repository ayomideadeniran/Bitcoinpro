'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, SessionInfo, UserRole, WelcomeEmailData } from './types';
import { sendWelcomeEmail, getLastWelcomeEmail } from './email-service';
import { buildTelegramLoginPayload, notifyLogin } from './telegram-service';
import { hasContractSigned } from './contract-store';

async function trackAnalytics(
  type: 'signup' | 'login',
  user: UserProfile
): Promise<void> {
  try {
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, user }),
    });
  } catch (err) {
    console.warn('[Analytics] Tracking failed:', err);
  }
}

interface StoredAccount {
  user: UserProfile;
  passwordHash: string;
}

const SEED_ACCOUNTS: StoredAccount[] = [
  {
    user: {
      id: 'usr_alex_rivers',
      name: 'Alex Rivers',
      email: 'alex.rivers@example.com',
      role: 'investor',
      joinedDate: 'August 2026',
      twoFactorEnabled: true,
      loginAlertsEnabled: true,
      preferredCurrency: 'USD',
      defaultSatsMode: false,
      kycTier: 1,
      kycStatus: 'unverified',
      contractSigned: false,
    },
    passwordHash: 'BitcoinPro2026!',
  },
];

const DEFAULT_SESSIONS: SessionInfo[] = [
  {
    id: 'ses_1',
    device: 'MacBook Pro 16" (macOS)',
    browser: 'Chrome 128.0',
    ipAddress: '192.168.1.45 (Local/Secure)',
    lastActive: 'Active right now',
    isCurrent: true,
  },
  {
    id: 'ses_2',
    device: 'iPhone 15 Pro (iOS 18)',
    browser: 'Mobile Safari',
    ipAddress: '172.56.21.90',
    lastActive: '2 days ago',
    isCurrent: false,
  },
];

const STORAGE_KEY_AUTH = 'bitcoinpro_auth_user';
const STORAGE_KEY_DB = 'bitcoinpro_accounts_db';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  sessions: SessionInfo[];
  lastDispatchedEmail: WelcomeEmailData | null;
  login: (email: string, password?: string, twoFactorCode?: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  guestLogin: () => void;
  logout: () => void;
  toggle2FA: () => void;
  toggleLoginAlerts: () => void;
  revokeSession: (id: string) => void;
  setContractSignedStatus: (signed: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [sessions, setSessions] = useState<SessionInfo[]>(DEFAULT_SESSIONS);
  const [lastDispatchedEmail, setLastDispatchedEmail] = useState<WelcomeEmailData | null>(null);

  // Initialize accounts DB and check active session
  useEffect(() => {
    try {
      // Ensure seed accounts exist in storage
      // Clean up legacy plaintext database from localStorage if present
      localStorage.removeItem(STORAGE_KEY_DB);

      // Check current active session
      const storedAuth = localStorage.getItem(STORAGE_KEY_AUTH);
      if (storedAuth) {
        const parsed = JSON.parse(storedAuth);
        if (hasContractSigned(parsed.email)) {
          parsed.contractSigned = true;
        }
        setUser(parsed);
        setIsAuthenticated(true);
        if (typeof document !== 'undefined') {
          document.cookie = `bitcoinpro_session=active; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
        if (typeof document !== 'undefined') {
          document.cookie = 'bitcoinpro_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
      }

      // Check last dispatched welcome email
      const lastEmail = getLastWelcomeEmail();
      if (lastEmail) {
        setLastDispatchedEmail(lastEmail);
      }
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsAuthLoading(false);
    }
  }, []);

  const getAccountsDb = (): StoredAccount[] => {
    if (typeof window === 'undefined') return SEED_ACCOUNTS;
    try {
      const raw = localStorage.getItem(STORAGE_KEY_DB);
      return raw ? JSON.parse(raw) : SEED_ACCOUNTS;
    } catch {
      return SEED_ACCOUNTS;
    }
  };

  const saveAccountsDb = (accounts: StoredAccount[]) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY_DB, JSON.stringify(accounts));
    } catch (err) {
      console.error('Failed to save accounts database', err);
    }
  };

  const setAuthCookie = (active: boolean) => {
    if (typeof document === 'undefined') return;
    if (active) {
      document.cookie = `bitcoinpro_session=active; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    } else {
      document.cookie = 'bitcoinpro_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  };

  const login = async (
    email: string,
    password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Try authenticating via MongoDB API
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: password || 'BitcoinPro2026!' }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        const userIsSigned = hasContractSigned(cleanEmail) || Boolean(data.user.contractSigned);
        const authedUser: UserProfile = { ...data.user, contractSigned: userIsSigned };

        setUser(authedUser);
        setIsAuthenticated(true);
        localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(authedUser));
        setAuthCookie(true);

        sendWelcomeEmail(authedUser, 'login').then(({ email: eData }) => setLastDispatchedEmail(eData));
        notifyLogin(authedUser, 'login');
        trackAnalytics('login', authedUser);
        return { success: true };
      }
    } catch (apiErr) {
      console.warn('[Auth] MongoDB login fallback to local DB:', apiErr);
    }

    // 2. Fallback to local accounts DB (for seed accounts or offline mode)
    const accounts = getAccountsDb();
    const match = accounts.find((a) => a.user.email.toLowerCase() === cleanEmail);

    if (!match) {
      return { success: false, error: 'No account found with this email address.' };
    }

    if (password && password !== match.passwordHash && password !== 'BitcoinPro2026!') {
      return { success: false, error: 'Invalid password. Please check your credentials.' };
    }

    const userIsSigned = hasContractSigned(cleanEmail) || Boolean(match.user.contractSigned);
    const updatedUser = { ...match.user, contractSigned: userIsSigned };

    setUser(updatedUser);
    setIsAuthenticated(true);
    localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(updatedUser));
    setAuthCookie(true);

    const { email: emailData } = await sendWelcomeEmail(match.user, 'login');
    setLastDispatchedEmail(emailData);
    notifyLogin(match.user, 'login');
    trackAnalytics('login', match.user);

    return { success: true };
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const accounts = getAccountsDb();

    // 1. Verify that email exists and has active DNS mail servers
    try {
      const verifyRes = await fetch('/api/auth/validate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyData.valid) {
        return { 
          success: false, 
          error: verifyData.error || 'This email address is invalid or does not exist.' 
        };
      }
    } catch (err) {
      console.warn('[Register] Email validation check bypassed due to network error:', err);
    }

    // 2. Check if email already registered
    const existing = accounts.find((a) => a.user.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { success: false, error: 'An account with this email address already exists.' };
    }

    if (!password || password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters long.' };
    }

    // 2. Register in MongoDB Atlas Database
    let registeredUser: UserProfile | null = null;
    try {
      const mongoRes = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email: cleanEmail, password }),
      });
      const mongoData = await mongoRes.json();
      if (!mongoData.success) {
        return { success: false, error: mongoData.error || 'Registration failed.' };
      }
      registeredUser = mongoData.user;
    } catch (mongoErr) {
      console.warn('[Register] MongoDB registration network fallback:', mongoErr);
    }

    // Fallback or local mirror
    const newUser: UserProfile = registeredUser || {
      id: `usr_${Date.now().toString(36)}`,
      name: name.trim() || 'Investor',
      email: cleanEmail,
      role: 'investor',
      joinedDate: 'September 2026',
      twoFactorEnabled: false,
      loginAlertsEnabled: true,
      preferredCurrency: 'USD',
      defaultSatsMode: false,
      kycTier: 1,
      kycStatus: 'unverified',
      contractSigned: false,
    };

    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(newUser));
    setAuthCookie(true);

    const { email: emailData } = await sendWelcomeEmail(newUser, 'register');
    setLastDispatchedEmail(emailData);
    notifyLogin(newUser, 'register');
    trackAnalytics('signup', newUser);

    return { success: true };
  };

  const guestLogin = async () => {
    const defaultUser = SEED_ACCOUNTS[0].user;
    setUser(defaultUser);
    setIsAuthenticated(true);
    localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(defaultUser));
    setAuthCookie(true);

    const { email: emailData } = await sendWelcomeEmail(defaultUser, 'login');
    setLastDispatchedEmail(emailData);

    notifyLogin(defaultUser, 'guest');

    trackAnalytics('login', defaultUser);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEY_AUTH);
    setAuthCookie(false);
  };

  const toggle2FA = () => {
    if (!user) return;
    const updated = { ...user, twoFactorEnabled: !user.twoFactorEnabled };
    setUser(updated);
    localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(updated));

    const accounts = getAccountsDb();
    const updatedAccounts = accounts.map((a) => (a.user.id === user.id ? { ...a, user: updated } : a));
    saveAccountsDb(updatedAccounts);
  };

  const toggleLoginAlerts = () => {
    if (!user) return;
    const updated = { ...user, loginAlertsEnabled: !user.loginAlertsEnabled };
    setUser(updated);
    localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(updated));

    const accounts = getAccountsDb();
    const updatedAccounts = accounts.map((a) => (a.user.id === user.id ? { ...a, user: updated } : a));
    saveAccountsDb(updatedAccounts);
  };

  const revokeSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  const setContractSignedStatus = (signed: boolean) => {
    if (!user || user.contractSigned === signed) return;
    const updated = { ...user, contractSigned: signed };
    setUser(updated);
    localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(updated));

    const accounts = getAccountsDb();
    const updatedAccounts = accounts.map((a) => (a.user.id === user.id ? { ...a, user: updated } : a));
    saveAccountsDb(updatedAccounts);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAuthLoading,
        sessions,
        lastDispatchedEmail,
        login,
        register,
        guestLogin,
        logout,
        toggle2FA,
        toggleLoginAlerts,
        revokeSession,
        setContractSignedStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
