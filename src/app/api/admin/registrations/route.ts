import { NextResponse } from 'next/server';
import { getActualRegistrations, getActualRegistrationCount } from '@/lib/registrations-db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format');
    const records = await getActualRegistrations();
    const count = records.length;

    // Export CSV if requested
    if (format === 'csv') {
      const headers = [
        'Queue Number',
        'Ticket ID',
        'Full Name',
        'Email',
        'Phone',
        'Country',
        'Investment Tier',
        'Payment Method',
        'Investor Type',
        'Primary Interest',
        'Telegram',
        'Referral Code',
        'Priority Status',
        'IP Address',
        'Registered At',
        'Synced to MongoDB',
      ];

      const rows = records.map((r) => [
        r.queueNumber,
        `"${r.ticketId}"`,
        `"${(r.fullName || '').replace(/"/g, '""')}"`,
        `"${(r.email || '').replace(/"/g, '""')}"`,
        `"${(r.phone || '').replace(/"/g, '""')}"`,
        `"${(r.country || '').replace(/"/g, '""')}"`,
        `"${(r.investmentTier || '').replace(/"/g, '""')}"`,
        `"${(r.paymentMethod || '').replace(/"/g, '""')}"`,
        `"${(r.investorType || '').replace(/"/g, '""')}"`,
        `"${(r.primaryInterest || '').replace(/"/g, '""')}"`,
        `"${(r.telegramHandle || '').replace(/"/g, '""')}"`,
        `"${(r.referralCode || '').replace(/"/g, '""')}"`,
        r.priorityStatus,
        r.ipAddress || '',
        r.createdAt,
        r.syncedToMongo ? 'YES' : 'PENDING_WHITELIST',
      ]);

      const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="starknet_registered_investors_${new Date().toISOString().slice(0, 10)}.csv"`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      totalRegisteredCount: count,
      records,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch registrations' },
      { status: 500 }
    );
  }
}
