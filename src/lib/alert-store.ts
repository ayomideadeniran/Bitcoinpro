import { AppNotification, PriceAlert } from './types';

export const SEED_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Recurring DCA Executed',
    message: 'Your weekly $25.00 automated order was filled at $83,000 / BTC.',
    type: 'order',
    timestamp: '2026-08-22T09:16:00Z',
    read: false,
    link: '#transactions',
  },
  {
    id: 'notif-2',
    title: 'Withdrawal Broadcasted',
    message: '0.0050 BTC successfully sent to your self-custody wallet.',
    type: 'order',
    timestamp: '2026-08-29T11:45:00Z',
    read: false,
    link: '#transactions',
  },
  {
    id: 'notif-3',
    title: 'Security Verified',
    message: 'Two-Factor Authentication (TOTP) is active on your account.',
    type: 'security',
    timestamp: '2026-08-10T14:00:00Z',
    read: true,
  },
  {
    id: 'notif-4',
    title: 'Market Milestone',
    message: 'Bitcoin network hash rate reached a new all-time high of 710 EH/s.',
    type: 'price',
    timestamp: '2026-09-01T18:00:00Z',
    read: true,
  },
];

export const SEED_PRICE_ALERTS: PriceAlert[] = [
  {
    id: 'pa-1',
    targetPriceUsd: 95000,
    condition: 'above',
    createdAt: '2026-08-15',
    triggered: false,
    notes: 'Key resistance zone milestone',
  },
  {
    id: 'pa-2',
    targetPriceUsd: 75000,
    condition: 'below',
    createdAt: '2026-08-20',
    triggered: false,
    notes: 'Opportunity to increase weekly DCA allocation',
  },
];

const STORAGE_KEY_NOTIFS = 'bitcoinpro_notifications';
const STORAGE_KEY_ALERTS = 'bitcoinpro_price_alerts';

export function getStoredNotifications(): AppNotification[] {
  if (typeof window === 'undefined') return SEED_NOTIFICATIONS;
  try {
    const item = localStorage.getItem(STORAGE_KEY_NOTIFS);
    return item ? JSON.parse(item) : SEED_NOTIFICATIONS;
  } catch {
    return SEED_NOTIFICATIONS;
  }
}

export function saveStoredNotifications(notifs: AppNotification[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(notifs));
  } catch (err) {
    console.error('Failed to save notifications', err);
  }
}

export function getStoredPriceAlerts(): PriceAlert[] {
  if (typeof window === 'undefined') return SEED_PRICE_ALERTS;
  try {
    const item = localStorage.getItem(STORAGE_KEY_ALERTS);
    return item ? JSON.parse(item) : SEED_PRICE_ALERTS;
  } catch {
    return SEED_PRICE_ALERTS;
  }
}

export function saveStoredPriceAlerts(alerts: PriceAlert[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_ALERTS, JSON.stringify(alerts));
  } catch (err) {
    console.error('Failed to save price alerts', err);
  }
}
