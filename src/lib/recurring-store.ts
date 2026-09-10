import { RecurringSchedule } from './types';

export const SEED_SCHEDULES: RecurringSchedule[] = [
  {
    id: 'rec-1',
    amountUsd: 25,
    frequency: 'weekly',
    paymentMethod: 'ach_bank',
    startDate: '2026-08-15',
    nextRunDate: '2026-09-15',
    status: 'active',
    totalInvestedUsd: 100,
    executionCount: 4,
  },
  {
    id: 'rec-2',
    amountUsd: 100,
    frequency: 'monthly',
    paymentMethod: 'ach_bank',
    startDate: '2026-07-01',
    nextRunDate: '2026-10-01',
    status: 'paused',
    totalInvestedUsd: 200,
    executionCount: 2,
  },
];

const STORAGE_KEY_SCHEDULES = 'bitcoinpro_recurring_schedules';

export function getStoredRecurringSchedules(): RecurringSchedule[] {
  if (typeof window === 'undefined') return SEED_SCHEDULES;
  try {
    const item = localStorage.getItem(STORAGE_KEY_SCHEDULES);
    return item ? JSON.parse(item) : SEED_SCHEDULES;
  } catch {
    return SEED_SCHEDULES;
  }
}

export function saveStoredRecurringSchedules(schedules: RecurringSchedule[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_SCHEDULES, JSON.stringify(schedules));
  } catch (err) {
    console.error('Failed to save recurring schedules', err);
  }
}
