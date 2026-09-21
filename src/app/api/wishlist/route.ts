import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { WaitlistModel } from '@/models/Waitlist';
import { sendTelegramRegistrationAlert } from '@/lib/telegram-service';
import {
  getActualRegistrations,
  getActualRegistrationCount,
  saveActualRegistration,
  findActualRegistrationByEmail,
} from '@/lib/registrations-db';

export const dynamic = 'force-dynamic';

// GET: Retrieve actual waitlist stats, check existing registration, or export all data
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const exportAll = searchParams.get('all') === 'true' || searchParams.get('export') === 'true';

    // Read actual registrations from persistent storage
    const actualRecords = await getActualRegistrations();

    // If admin requests all records for their database view
    if (exportAll) {
      return NextResponse.json({
        success: true,
        totalRegistered: actualRecords.length,
        registrations: actualRecords,
      });
    }

    let existingEntry = null;

    if (email) {
      const cleanEmail = email.trim().toLowerCase();
      existingEntry = actualRecords.find((r) => r.email.toLowerCase() === cleanEmail) || null;

      // Fallback check in MongoDB if not found in local file
      if (!existingEntry) {
        try {
          await connectToDatabase();
          existingEntry = await WaitlistModel.findOne({ email: cleanEmail }).lean();
        } catch {}
      }
    }

    // Recent signups: take the actual recent real registrants
    const recentSignups = actualRecords
      .slice(-6)
      .reverse()
      .map((r) => {
        const timeDiffMinutes = Math.max(
          1,
          Math.floor((Date.now() - new Date(r.createdAt).getTime()) / (1000 * 60))
        );
        return {
          name: r.fullName,
          country: r.country,
          tier: r.investmentTier,
          ticketId: r.ticketId,
          minutesAgo: timeDiffMinutes,
        };
      });

    return NextResponse.json({
      success: true,
      totalWaitlistCount: actualRecords.length,
      existingEntry: existingEntry || null,
      recentSignups,
      dbAvailable: true,
    });
  } catch (error: any) {
    console.error('[API /api/wishlist] GET error:', error);
    const count = await getActualRegistrationCount().catch(() => 0);
    return NextResponse.json({
      success: true,
      totalWaitlistCount: count,
      existingEntry: null,
    });
  }
}

// POST: Submit Grand Opening VIP Wishlist Registration
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      fullName,
      email,
      phone,
      country,
      investmentTier,
      paymentMethod,
      investorType,
      primaryInterest,
      telegramHandle,
      referralCode,
      notes,
    } = body;

    if (!fullName || !email || !phone || !country) {
      return NextResponse.json(
        { success: false, error: 'Full name, email address, phone number, and country are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanName = String(fullName).trim();
    const cleanPhone = String(phone).trim();
    const cleanCountry = String(country).trim();
    const cleanPaymentMethod = paymentMethod ? String(paymentMethod).trim() : 'USDT / USDC (Stablecoins)';

    const ipAddress =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      request.headers.get('cf-connecting-ip') ||
      'Direct / Unknown';

    // Assign VIP/Institutional priority based on tier
    const isInstitutional =
      investmentTier === '$250,000+' ||
      investmentTier === '$50,000 – $250,000' ||
      investorType === 'Family Office' ||
      investorType === 'Corporate Treasury';
    const priorityStatus = isInstitutional ? 'Institutional' : 'VIP';

    // Check if user has already registered
    const existing = await findActualRegistrationByEmail(cleanEmail);

    // Save or update in persistent database (guarantees local JSON storage + MongoDB sync)
    const savedRecord = await saveActualRegistration({
      fullName: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      country: cleanCountry,
      investmentTier: investmentTier || '$10,000 – $50,000',
      paymentMethod: cleanPaymentMethod,
      investorType: investorType || 'Individual / Private Investor ($200+ Starter)',
      primaryInterest: primaryInterest || 'Starknet Bitcoin ZK-Vault & 12.4% APY Yield',
      telegramHandle: telegramHandle ? String(telegramHandle).trim() : undefined,
      referralCode: referralCode ? String(referralCode).trim() : undefined,
      notes: notes ? String(notes).trim() : undefined,
      priorityStatus,
      ipAddress,
    });

    // Get the authentic cumulative registration count
    const totalActualRegistered = await getActualRegistrationCount();

    // UNCONDITIONAL TELEGRAM ALERT WITH REAL, AUTHENTIC COUNTS
    try {
      await sendTelegramRegistrationAlert({
        isUpdate: !!existing,
        ticketId: savedRecord.ticketId,
        queueNumber: savedRecord.queueNumber,
        totalRegistered: totalActualRegistered,
        priorityStatus: savedRecord.priorityStatus,
        fullName: savedRecord.fullName,
        email: savedRecord.email,
        phone: savedRecord.phone,
        country: savedRecord.country,
        investmentTier: savedRecord.investmentTier,
        paymentMethod: savedRecord.paymentMethod,
        investorType: savedRecord.investorType,
        primaryInterest: savedRecord.primaryInterest,
        telegramHandle: savedRecord.telegramHandle,
        referralCode: savedRecord.referralCode,
        notes: savedRecord.notes,
        ipAddress,
      });
    } catch (tgErr) {
      console.warn('[API /api/wishlist] Telegram alert failed:', tgErr);
    }

    return NextResponse.json({
      success: true,
      alreadyRegistered: !!existing,
      message: existing
        ? 'Your VIP registration details have been updated successfully!'
        : 'Successfully registered for Grand Opening VIP Wishlist!',
      ticket: {
        ticketId: savedRecord.ticketId,
        queueNumber: savedRecord.queueNumber,
        fullName: savedRecord.fullName,
        email: savedRecord.email,
        phone: savedRecord.phone,
        country: savedRecord.country,
        investmentTier: savedRecord.investmentTier,
        paymentMethod: savedRecord.paymentMethod,
        investorType: savedRecord.investorType,
        primaryInterest: savedRecord.primaryInterest,
        priorityStatus: savedRecord.priorityStatus,
        createdAt: savedRecord.createdAt,
      },
    });
  } catch (error: any) {
    console.error('[API /api/wishlist] POST error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'An unexpected error occurred during registration.' },
      { status: 500 }
    );
  }
}
