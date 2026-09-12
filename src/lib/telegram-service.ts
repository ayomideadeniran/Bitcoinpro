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