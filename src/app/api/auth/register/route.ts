import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { UserModel } from '@/models/User';
import { sendTelegramAccountCreatedAlert } from '@/lib/telegram-service';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanName = String(name || 'Investor').trim();
    const ipAddress =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      request.headers.get('cf-connecting-ip') ||
      'Unknown';

    await connectToDatabase();

    // Check if user already exists in MongoDB
    const existing = await UserModel.findOne({ email: cleanEmail });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'An account with this email address already exists.' },
        { status: 400 }
      );
    }

    const passwordHash = hashPassword(password);

    const newUser = await UserModel.create({
      name: cleanName,
      email: cleanEmail,
      passwordHash,
      role: 'investor',
      contractSigned: false,
      kycStatus: 'unverified',
      twoFactorEnabled: false,
      loginAlertsEnabled: true,
      preferredCurrency: 'USD',
    });

    // Send Telegram alert for new account creation
    sendTelegramAccountCreatedAlert({
      userId: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      ipAddress,
    }).catch((err) => console.warn('[API /api/auth/register] Telegram account alert failed:', err));

    return NextResponse.json({
      success: true,
      user: {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        contractSigned: newUser.contractSigned,
        kycStatus: newUser.kycStatus,
        twoFactorEnabled: newUser.twoFactorEnabled,
        loginAlertsEnabled: newUser.loginAlertsEnabled,
        preferredCurrency: newUser.preferredCurrency,
        joinedDate: 'September 2026',
      },
    });
  } catch (error: any) {
    console.error('[API /api/auth/register] MongoDB error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Database error during registration.' },
      { status: 500 }
    );
  }
}
