import { config } from 'dotenv';
config({ path: '.env.local' });

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const API_BASE = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

if (!BOT_TOKEN) {
  console.error('TELEGRAM_BOT_TOKEN is required');
  process.exit(1);
}

let lastUpdateId = 0;

async function api(path: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

async function getUpdates() {
  const res = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?offset=${lastUpdateId + 1}&timeout=30`
  );
  const data = await res.json();
  if (!data.ok) throw new Error(`Telegram getUpdates failed: ${data.description}`);
  return data.result;
}

async function sendMessage(text: string) {
  if (!CHAT_ID) {
    console.warn('TELEGRAM_CHAT_ID not set, skipping message');
    return;
  }
  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text,
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
    }),
  });
  const data = await res.json();
  if (!data.ok) {
    console.warn('Telegram sendMessage failed:', data.description);
  }
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    });
  } catch {
    return iso;
  }
}

async function handleStats() {
  let wishlistTotal = '1,448+';
  let recentWishlist: any[] = [];
  try {
    const wishData = await api('/api/wishlist');
    if (wishData?.success) {
      wishlistTotal = wishData.totalWaitlistCount ? wishData.totalWaitlistCount.toLocaleString() : wishlistTotal;
      recentWishlist = wishData.recentSignups || [];
    }
  } catch {}

  const data = await api('/api/analytics').catch(() => null);

  let text = `📊 *Starknet Protocol Registry Stats*\n\n`;
  text += `🚀 *Total Registered Investors:* *${wishlistTotal}*\n`;
  text += `⚡ *Allocation Capacity:* 84% Filled\n`;
  if (data?.stats) {
    text += `👤 *Platform Accounts:* ${data.stats.totalUsers}\n`;
    text += `🔑 *Total Logins:* ${data.stats.totalLogins}\n\n`;
  } else {
    text += `\n`;
  }

  if (recentWishlist.length > 0) {
    text += `⭐ *Recent VIP Wishlist Registrations*\n`;
    recentWishlist.slice(0, 5).forEach((w: any) => {
      text += `• ${w.name} (${w.country}) — *${w.tier}* (${w.minutesAgo}m ago)\n`;
    });
    text += `\n`;
  }

  await sendMessage(text);
}

async function handleUsers() {
  const data = await api('/api/analytics');
  if (!data.success) {
    await sendMessage(`❌ Failed to load users: ${data.error}`);
    return;
  }

  const { users } = data;
  if (users.length === 0) {
    await sendMessage('No users found.');
    return;
  }

  let text = `👥 *BitcoinPro Users* (${users.length})\n\n`;
  users.slice(0, 20).forEach((u: any) => {
    text += `• *${u.name || 'N/A'}*\n`;
    text += `  Email: ${u.email}\n`;
    text += `  Logins: ${u.loginCount}\n`;
    text += `  Last login: ${formatDate(u.lastLogin)}\n`;
    text += `  KYC: ${u.kycStatus} (Tier ${u.kycTier})\n\n`;
  });

  await sendMessage(text);
}

async function handleRecent(limit = 10) {
  const data = await api('/api/analytics');
  if (!data.success) {
    await sendMessage(`❌ Failed to load recent activity: ${data.error}`);
    return;
  }

  const { recentEvents } = data;
  if (recentEvents.length === 0) {
    await sendMessage('No recent activity.');
    return;
  }

  let text = `🕒 *Recent Activity* (${Math.min(limit, recentEvents.length)})\n\n`;
  recentEvents.slice(0, limit).forEach((ev: any) => {
    const icon = ev.type === 'signup' ? '🆕' : '🔐';
    text += `${icon} ${ev.type === 'signup' ? 'Signup' : 'Login'}\n`;
    text += `   User: ${ev.name}\n`;
    text += `   Email: ${ev.email}\n`;
    text += `   Time: ${formatDate(ev.timestamp)}\n\n`;
  });

  await sendMessage(text);
}

async function handleUserByEmail(args: string) {
  const email = args.trim();
  if (!email) {
    await sendMessage('Usage: /user <email>');
    return;
  }

  const data = await api('/api/analytics');
  if (!data.success) {
    await sendMessage(`❌ Failed to load user data: ${data.error}`);
    return;
  }

  const user = data.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    await sendMessage(`User with email "${email}" not found.`);
    return;
  }

  let text = `👤 *User Details*\n\n`;
  text += `• Name: *${user.name || 'N/A'}*\n`;
  text += `• Email: ${user.email}\n`;
  text += `• ID: ${user.id}\n`;
  text += `• Role: ${user.role}\n`;
  text += `• Signup: ${formatDate(user.signupDate)}\n`;
  text += `• Logins: *${user.loginCount}*\n`;
  text += `• Last Login: ${formatDate(user.lastLogin)}\n`;
  text += `• KYC: ${user.kycStatus} (Tier ${user.kycTier})\n`;

  await sendMessage(text);
}

async function handleCommand(text: string) {
  const trimmed = text.trim();
  if (!trimmed.startsWith('/')) return;

  const parts = trimmed.split(' ');
  const command = parts[0].toLowerCase();
  const args = parts.slice(1).join(' ');

  switch (command) {
    case '/stats':
      await handleStats();
      break;
    case '/users':
      await handleUsers();
      break;
    case '/recent':
      await handleRecent(10);
      break;
    case '/user':
      await handleUserByEmail(args);
      break;
    case '/start':
      await sendMessage(
        `👋 Welcome to BitcoinPro Bot!\n\nAvailable commands:\n/stats - App statistics\n/users - All users\n/recent - Recent activity\n/user <email> - User details`
      );
      break;
    default:
      await sendMessage('Unknown command. Try /stats, /users, /recent, /user <email>');
  }
}

async function poll() {
  console.log('Telegram bot started...');
  await sendMessage('✅ BitcoinPro Telegram bot is now online.');

  while (true) {
    try {
      const updates = await getUpdates();
      for (const update of updates) {
        lastUpdateId = Math.max(lastUpdateId, update.update_id);

        const message = update.message || update.edited_message;
        if (!message || !message.text) continue;

        const from = message.from;
        const chat = message.chat;

        if (CHAT_ID && String(chat.id) !== String(CHAT_ID)) {
          continue;
        }

        console.log(`[Telegram] ${from?.username || from?.id}: ${message.text}`);
        await handleCommand(message.text);
      }
    } catch (err) {
      console.error('[Telegram] Poll error:', err);
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
}

poll();