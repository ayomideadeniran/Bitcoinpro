import { NextResponse } from 'next/server';
import { readAnalytics } from '@/lib/analytics';

export async function GET() {
  try {
    const data = await readAnalytics();
    const users = Object.values(data.users).sort((a, b) => {
      const la = a.lastLogin || a.signupDate;
      const lb = b.lastLogin || b.signupDate;
      return new Date(lb).getTime() - new Date(la).getTime();
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalSignups: data.totalSignups,
        totalLogins: data.totalLogins,
        totalUsers: users.length,
      },
      recentEvents: data.recentEvents.slice(0, 20),
      users: users.slice(0, 50).map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        signupDate: u.signupDate,
        loginCount: u.loginCount,
        lastLogin: u.lastLogin,
        kycTier: u.kycTier,
        kycStatus: u.kycStatus,
        role: u.role,
      })),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to load analytics' },
      { status: 500 }
    );
  }
}