import { UserProfile } from './types';

export interface TelegramLoginPayload {
  event: 'login' | 'register' | 'guest';
  user: UserProfile;
  session: {
    ipAddress: string;
    userAgent: string;
    browser: string;
    device: string;
    referrer: string;
    url: string;
    timezone: string;
    language: string;
    screenResolution: string;
  };
  metadata: {
    loginAt: string;
    loginAtLocal: string;
    kycTier: number;
    kycStatus: string;
    role: string;
    twoFactorEnabled: boolean;
  };
}

function parseBrowser(userAgent: string): string {
  if (!userAgent) return 'Unknown';
  const ua = userAgent.toLowerCase();
  if (ua.includes('chrome') && !ua.includes('edg')) return 'Chrome';
  if (ua.includes('edg')) return 'Edge';
  if (ua.includes('firefox')) return 'Firefox';
  if (ua.includes('safari')) return 'Safari';
  if (ua.includes('opera') || ua.includes('opr/')) return 'Opera';
  if (ua.includes('trident') || ua.includes('msie')) return 'Internet Explorer';
  return 'Other';
}

function parseDevice(userAgent: string): string {
  if (!userAgent) return 'Unknown';
  const ua = userAgent.toLowerCase();
  if (ua.includes('ipad')) return 'iPad';
  if (ua.includes('iphone')) return 'iPhone';
  if (ua.includes('ipod')) return 'iPod';
  if (ua.includes('android')) return 'Android Device';
  if (ua.includes('macintosh') || ua.includes('mac os')) return 'Mac';
  if (ua.includes('windows')) return 'Windows PC';
  if (ua.includes('linux')) return 'Linux PC';
  return 'Desktop/Laptop';
}

function getScreenResolution(): string {
  if (typeof window === 'undefined') return 'Unknown';
  try {
    return `${window.screen.width}x${window.screen.height}`;
  } catch {
    return 'Unknown';
  }
}

function getLocalTime(): string {
  try {
    return new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    });
  } catch {
    return new Date().toUTCString();
  }
}

export function getEnv(name: string): string | undefined {
  if (typeof process !== 'undefined') {
    return process.env[name];
  }
  return undefined;
}

function getTelegramConfig() {
  const botToken = getEnv('TELEGRAM_BOT_TOKEN');
  const chatId = getEnv('TELEGRAM_CHAT_ID');
  return { botToken, chatId };
}

function escapeMd(s: string): string {
  return s.replace(/[_*[\]()`~>#+=|{}.!\\-]/g, '\\$&');
}

export function escapeHtml(s: string = ''): string {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function buildLoginSessionInfo(): TelegramLoginPayload['session'] {
  const userAgent =
    typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const browser = parseBrowser(userAgent);
  const device = parseDevice(userAgent);

  const session: TelegramLoginPayload['session'] = {
    ipAddress: 'Resolving...',
    userAgent,
    browser,
    device,
    referrer:
      typeof document !== 'undefined' ? document.referrer || 'Direct / None' : 'Unknown',
    url: typeof window !== 'undefined' ? window.location.href : 'Unknown',
    timezone:
      typeof Intl !== 'undefined'
        ? Intl.DateTimeFormat().resolvedOptions().timeZone
        : 'Unknown',
    language:
      typeof navigator !== 'undefined' ? navigator.language : 'Unknown',
    screenResolution: getScreenResolution(),
  };

  return session;
}

export function buildTelegramLoginPayload(
  user: UserProfile,
  event: TelegramLoginPayload['event'] = 'login'
): TelegramLoginPayload {
  return {
    event,
    user,
    session: buildLoginSessionInfo(),
    metadata: {
      loginAt: new Date().toISOString(),
      loginAtLocal: getLocalTime(),
      kycTier: user.kycTier,
      kycStatus: user.kycStatus,
      role: user.role,
      twoFactorEnabled: user.twoFactorEnabled,
    },
  };
}

function buildTelegramMessage(payload: TelegramLoginPayload): string {
  const { user, session, metadata, event } = payload;
  const eventLabel =
    event === 'login' ? 'SIGN-IN' : event === 'register' ? 'SIGN-UP' : 'GUEST SIGN-IN';

  const lines: string[] = [];
  lines.push('🔐 *NEW LOGIN ALERT*');
  lines.push('');
  lines.push(`*Event:* ${eventLabel}`);
  lines.push('');
  lines.push('*User Details*');
  lines.push(`• Name: ${escapeMd(user.name || 'N/A')}`);
  lines.push(`• Email: ${escapeMd(user.email || 'N/A')}`);
  lines.push(`• Account ID: ${escapeMd(user.id || 'N/A')}`);
  lines.push(`• Role: ${escapeMd(user.role || 'N/A')}`);
  lines.push(`• KYC Tier: ${user.kycTier || 'N/A'}`);
  lines.push(`• KYC Status: ${escapeMd(user.kycStatus || 'N/A')}`);
  lines.push(`• 2FA Enabled: ${user.twoFactorEnabled ? 'Yes' : 'No'}`);
  lines.push('');
  lines.push('*Session Details*');
  lines.push(`• IP Address: ${escapeMd(session.ipAddress || 'Resolving...')}`);
  lines.push(`• Browser: ${escapeMd(session.browser || 'Unknown')}`);
  lines.push(`• Device: ${escapeMd(session.device || 'Unknown')}`);
  lines.push(`• Timezone: ${escapeMd(session.timezone || 'Unknown')}`);
  lines.push(`• Language: ${escapeMd(session.language || 'Unknown')}`);
  lines.push(`• Screen: ${escapeMd(session.screenResolution || 'Unknown')}`);
  lines.push(`• Referrer: ${escapeMd(session.referrer || 'Direct / None')}`);
  lines.push('');
  lines.push('*Time*');
  lines.push(`• UTC: ${escapeMd(metadata.loginAt)}`);
  lines.push(`• Local: ${escapeMd(metadata.loginAtLocal)}`);
  lines.push('');
  lines.push('_BitcoinPro Security Notification_');

  return lines.join('\n');
}

export async function sendTelegramLoginNotification(
  payload: TelegramLoginPayload
): Promise<{ success: boolean; error?: string; skipped?: boolean }> {
  const { botToken, chatId } = getTelegramConfig();

  if (!botToken || !chatId) {
    return {
      success: false,
      skipped: true,
      error: 'Telegram bot token or chat ID not configured',
    };
  }

  const text = buildTelegramMessage(payload);
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
        disable_notification: false,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return {
        success: false,
        error: `Telegram API error (${response.status}): ${errText}`,
      };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to send Telegram notification' };
  }
}

export async function notifyLogin(
  user: UserProfile,
  event: TelegramLoginPayload['event'] = 'login'
): Promise<void> {
  try {
    const payload = buildTelegramLoginPayload(user, event);

    const response = await fetch('/api/auth/login-notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.warn('[Telegram] Login notification failed:', err?.error || response.statusText);
    }
  } catch (err) {
    console.warn('[Telegram] Login notification error:', err);
  }
}

export interface TelegramRegistrationAlertData {
  isUpdate?: boolean;
  ticketId: string;
  queueNumber: number | string;
  totalRegistered?: number | string;
  batchRemaining?: number | string;
  priorityStatus?: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  investmentTier: string;
  paymentMethod: string;
  investorType?: string;
  primaryInterest?: string;
  telegramHandle?: string;
  referralCode?: string;
  notes?: string;
  ipAddress?: string;
  userAgent?: string;
  registeredAt?: string;
}

export async function sendTelegramRegistrationAlert(
  data: TelegramRegistrationAlertData
): Promise<{ success: boolean; error?: string; skipped?: boolean }> {
  const { botToken, chatId } = getTelegramConfig();

  if (!botToken || !chatId) {
    return {
      success: false,
      skipped: true,
      error: 'Telegram bot token or chat ID not configured',
    };
  }

  const title = data.isUpdate
    ? '🔄 <b>EXISTING VIP REGISTRATION UPDATED</b>'
    : '🚀 <b>NEW VIP WHITELIST REGISTRATION</b>';

  const cleanHandle = data.telegramHandle
    ? `@${data.telegramHandle.replace('@', '').trim()}`
    : 'None Provided';

  const dateStr = data.registeredAt || new Date().toUTCString();
  const totalCountStr = String(data.totalRegistered || data.queueNumber);

  const lines: string[] = [
    title,
    '',
    '📊 <b>REGISTRY TOTALS & QUEUE:</b>',
    `• <b>Total Registered to Date:</b> <b>${escapeHtml(totalCountStr)} Investors</b>`,
    `• <b>Ticket Pass ID:</b> <code>${escapeHtml(data.ticketId)}</code>`,
    `• <b>Queue Position:</b> #${escapeHtml(String(data.queueNumber))}`,
    `• <b>Priority Status:</b> <b>${escapeHtml(data.priorityStatus || 'VIP Priority')}</b>`,
    data.batchRemaining ? `• <b>Batch Allocation:</b> <b>${escapeHtml(String(data.batchRemaining))} slots remaining</b>` : '',
    '',
    '👤 <b>Registrant Profile:</b>',
    `• <b>Full Name:</b> ${escapeHtml(data.fullName)}`,
    `• <b>Email:</b> ${escapeHtml(data.email)}`,
    `• <b>Phone / WhatsApp:</b> <code>${escapeHtml(data.phone)}</code>`,
    `• <b>Country:</b> ${escapeHtml(data.country)}`,
    `• <b>Telegram:</b> ${escapeHtml(cleanHandle)}`,
    '',
    '💼 <b>Allocation & Settlement:</b>',
    `• <b>Planned Capital:</b> <b>${escapeHtml(data.investmentTier)}</b>`,
    `• <b>Payment Rail:</b> ${escapeHtml(data.paymentMethod)}`,
    `• <b>Investor Profile:</b> ${escapeHtml(data.investorType || 'Individual / Private Investor')}`,
    `• <b>Strategy of Interest:</b> ${escapeHtml(data.primaryInterest || 'Starknet Bitcoin ZK-Vault')}`,
  ].filter(Boolean);

  if (data.referralCode) {
    lines.push(`• <b>Referral Code:</b> <code>${escapeHtml(data.referralCode)}</code>`);
  }
  if (data.notes) {
    lines.push(`• <b>Notes / Preferences:</b> <i>${escapeHtml(data.notes)}</i>`);
  }

  lines.push('');
  lines.push('🌐 <b>Security & Tracking:</b>');
  lines.push(`• <b>IP Address:</b> <code>${escapeHtml(data.ipAddress || 'Unknown')}</code>`);
  lines.push(`• <b>Timestamp:</b> ${escapeHtml(dateStr)}`);
  lines.push('');
  lines.push('<i>Starknet BitcoinPro Protocol • Live Lead Dispatch</i>');

  const text = lines.join('\n');
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_notification: false,
      }),
    });

    if (!response.ok) {
      // Fallback: send as plain text without HTML parsing if Telegram rejects HTML formatting
      const plainText = lines
        .map((l) => l.replace(/<[^>]+>/g, ''))
        .join('\n');
      const fallbackRes = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: plainText,
          disable_notification: false,
        }),
      });
      if (!fallbackRes.ok) {
        const errText = await fallbackRes.text();
        return { success: false, error: `Telegram API error: ${errText}` };
      }
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to send Telegram notification' };
  }
}

export interface TelegramAccountAlertData {
  userId?: string;
  name: string;
  email: string;
  role?: string;
  totalAccounts?: number | string;
  ipAddress?: string;
  userAgent?: string;
  registeredAt?: string;
}

export async function sendTelegramAccountCreatedAlert(
  data: TelegramAccountAlertData
): Promise<{ success: boolean; error?: string; skipped?: boolean }> {
  const { botToken, chatId } = getTelegramConfig();

  if (!botToken || !chatId) {
    return {
      success: false,
      skipped: true,
      error: 'Telegram bot token or chat ID not configured',
    };
  }

  const lines: string[] = [
    '👤 <b>NEW INVESTOR ACCOUNT CREATED</b>',
    '',
    data.totalAccounts ? `📊 <b>Total User Accounts:</b> <b>${escapeHtml(String(data.totalAccounts))}</b>\n` : '',
    `• <b>Account ID:</b> <code>${escapeHtml(data.userId || 'N/A')}</code>`,
    `• <b>Full Name:</b> ${escapeHtml(data.name)}`,
    `• <b>Email:</b> ${escapeHtml(data.email)}`,
    `• <b>Role:</b> ${escapeHtml(data.role || 'investor')}`,
    `• <b>IP Address:</b> <code>${escapeHtml(data.ipAddress || 'Unknown')}</code>`,
    `• <b>Timestamp:</b> ${escapeHtml(data.registeredAt || new Date().toUTCString())}`,
    '',
    '<i>Starknet BitcoinPro Protocol • Account Dispatch</i>',
  ].filter(Boolean);

  const text = lines.join('\n');
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_notification: false,
      }),
    });

    if (!response.ok) {
      const plainText = lines.map((l) => l.replace(/<[^>]+>/g, '')).join('\n');
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: plainText }),
      });
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to send Telegram notification' };
  }
}