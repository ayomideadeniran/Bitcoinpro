import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { UserModel } from '@/models/User';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    await connectToDatabase();

    const user = await UserModel.findOne({ email: cleanEmail });
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const inputHash = hashPassword(password);
    if (user.passwordHash !== inputHash) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        contractSigned: user.contractSigned,
        kycStatus: user.kycStatus,
        twoFactorEnabled: user.twoFactorEnabled,
        loginAlertsEnabled: user.loginAlertsEnabled,
        preferredCurrency: user.preferredCurrency,
        avatarUrl: user.avatarUrl,
        joinedDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'September 2026',
      },
    });
  } catch (error: any) {
    console.error('[API /api/auth/login] MongoDB error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Database error during authentication.' },
      { status: 500 }
    );
  }
}
