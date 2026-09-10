import { NextResponse } from 'next/server';
import {
  buildTelegramLoginPayload,
  sendTelegramLoginNotification,
  TelegramLoginPayload,
} from '@/lib/telegram-service';

function getClientIp(request: Request): string {
  // Try standard forwarded headers first (behind proxies / Vercel / Cloudflare)
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const first = forwardedFor.split(',')[0]?.trim();
    if (first) return first;
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp;

  const forwarded = request.headers.get('forwarded');
  if (forwarded) {
    const match = /for=([^;,\s]+)/i.exec(forwarded);
    if (match?.[1]) return match[1];
  }

  const connectingIp = request.headers.get('cf-connecting-ip');
  if (connectingIp) return connectingIp;

  const xClientIp = request.headers.get('x-client-ip');
  if (xClientIp) return xClientIp;

  return 'Unknown';
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

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<TelegramLoginPayload>;
    const { user, event = 'login', session, metadata } = body;

    if (!user || !user.email) {
      return NextResponse.json(
        { success: false, error: 'User email is required' },
        { status: 400 }
      );
    }

    const ipAddress = getClientIp(request);
    const userAgent = request.headers.get('user-agent') || '';

    const enrichedSession = {
      ipAddress,
      userAgent: session?.userAgent || userAgent,
      browser: session?.browser || parseBrowser(userAgent),
      device: session?.device || parseDevice(userAgent),
      referrer: session?.referrer || 'Direct / None',
      url: session?.url || 'Unknown',
      timezone: session?.timezone || 'Unknown',
      language: session?.language || 'Unknown',
      screenResolution: session?.screenResolution || 'Unknown',
    };

    const payload: TelegramLoginPayload = {
      event,
      user,
      session: enrichedSession,
      metadata: metadata || {
        loginAt: new Date().toISOString(),
        loginAtLocal: new Date().toUTCString(),
        kycTier: user.kycTier,
        kycStatus: user.kycStatus,
        role: user.role,
        twoFactorEnabled: user.twoFactorEnabled,
      },
    };

    const result = await sendTelegramLoginNotification(payload);

    if (result.skipped) {
      return NextResponse.json({
        success: true,
        skipped: true,
        message: 'Telegram notification skipped (credentials not configured)',
        ipAddress,
      });
    }

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error, ipAddress },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      ipAddress,
      message: 'Login notification sent to Telegram',
    });
  } catch (error: any) {
    console.error('Error in login-notify API route:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to send login notification' },
      { status: 500 }
    );
  }
}