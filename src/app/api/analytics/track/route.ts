import { NextResponse } from 'next/server';
import { trackLogin, trackSignup } from '@/lib/analytics';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, user } = body as {
      type: 'signup' | 'login';
      user: {
        id: string;
        email: string;
        name: string;
        kycTier: number;
        kycStatus: string;
        role: string;
      };
    };

    if (!type || !user?.id || !user?.email) {
      return NextResponse.json(
        { success: false, error: 'type and user.id/user.email are required' },
        { status: 400 }
      );
    }

    if (type === 'signup') {
      await trackSignup(user);
    } else {
      await trackLogin(user);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to track analytics event' },
      { status: 500 }
    );
  }
}