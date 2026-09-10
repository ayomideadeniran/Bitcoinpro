import { NextResponse } from 'next/server';

function getEnv(name: string): string | undefined {
  if (typeof process !== 'undefined') return process.env[name];
  return undefined;
}

export async function GET(request: Request) {
  const botToken = getEnv('TELEGRAM_BOT_TOKEN');
  const chatId = getEnv('TELEGRAM_CHAT_ID');

  if (!botToken || !chatId) {
    return NextResponse.json(
      { success: false, error: 'TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not configured' },
      { status: 500 }
    );
  }

  const text = `✅ *BitcoinPro Test Message*\n\nTelegram notifications are working.\n\nTime: ${new Date().toUTCString()}`;

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json(
        { success: false, error: `Telegram API error (${response.status}): ${errText}` },
        { status: 500 }
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to send test message' },
      { status: 500 }
    );
  }
}