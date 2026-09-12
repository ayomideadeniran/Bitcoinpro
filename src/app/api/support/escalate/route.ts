import { NextResponse } from 'next/server';
import { getEnv } from '@/lib/telegram-service';

function getTelegramConfig() {
  const botToken = getEnv('TELEGRAM_BOT_TOKEN');
  const chatId = getEnv('TELEGRAM_CHAT_ID');
  return { botToken, chatId };
}

function escapeMd(s: string): string {
  return s.replace(/[_*[\]()`~>#+=|{}.!\\-]/g, '\\$&');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, userEmail, userName } = body as {
      message: string;
      userEmail?: string;
      userName?: string;
    };

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { success: false, error: 'message is required' },
        { status: 400 }
      );
    }

    const { botToken, chatId } = getTelegramConfig();

    if (!botToken || !chatId) {
      return NextResponse.json(
        { success: false, skipped: true, error: 'Telegram not configured' },
        { status: 500 }
      );
    }

    const text = [
      '💬 *Support Chat Escalation*',
      '',
      `*User:* ${escapeMd(userName || 'Website Visitor')}`,
      userEmail ? `*Email:* ${escapeMd(userEmail)}` : '',
      `*Message:* ${escapeMd(message)}`,
      '',
      `*Time:* ${escapeMd(new Date().toISOString())}`,
      '',
      '_Reply directly in this chat to respond to the user._',
    ]
      .filter(Boolean)
      .join('\n');

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json(
        { success: false, error: `Telegram API error (${response.status}): ${errText}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to escalate support message' },
      { status: 500 }
    );
  }
}