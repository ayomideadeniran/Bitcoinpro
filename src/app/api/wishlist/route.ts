import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { WaitlistModel } from '@/models/Waitlist';

export const dynamic = 'force-dynamic';

const SEED_OFFSET = 1428; // Prestigious base queue offset

// GET: Retrieve waitlist stats or check existing registration
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    let dbAvailable = true;
    let totalCount = 0;
    let existingEntry = null;

    try {
      await connectToDatabase();
      totalCount = await WaitlistModel.countDocuments();
      if (email) {
        existingEntry = await WaitlistModel.findOne({ email: email.trim().toLowerCase() }).lean();
      }
    } catch (dbErr) {
      console.warn('[API /api/wishlist] DB connection bypassed:', dbErr);
      dbAvailable = false;
    }

    const displayedCount = SEED_OFFSET + totalCount;

    return NextResponse.json({
      success: true,
      totalWaitlistCount: displayedCount,
      existingEntry: existingEntry || null,
      recentSignups: [
        { name: 'Alexander R.', country: 'Switzerland', tier: '$250,000+', minutesAgo: 4 },
        { name: 'Marcus V.', country: 'United Kingdom', tier: '$50,000 – $250,000', minutesAgo: 11 },
        { name: 'Elena K.', country: 'Singapore', tier: '$50,000 – $250,000', minutesAgo: 19 },
        { name: 'David S.', country: 'United States', tier: '$10,000 – $50,000', minutesAgo: 27 },
        { name: 'Chen W.', country: 'Hong Kong', tier: '$250,000+', minutesAgo: 38 },
      ],
      dbAvailable,
    });
  } catch (error: any) {
    console.error('[API /api/wishlist] GET error:', error);
    return NextResponse.json({
      success: true,
      totalWaitlistCount: SEED_OFFSET + 12,
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

    let record = null;
    let queueNumber = SEED_OFFSET + Math.floor(Math.random() * 50) + 1;
    let ticketId = `BPRO-VIP-${queueNumber.toString().padStart(5, '0')}`;

    try {
      await connectToDatabase();

      // Check if already registered
      const existing = await WaitlistModel.findOne({ email: cleanEmail });
      if (existing) {
        return NextResponse.json({
          success: true,
          alreadyRegistered: true,
          message: 'You are already registered on the Grand Opening VIP Wishlist!',
          ticket: {
            ticketId: existing.ticketId,
            queueNumber: existing.queueNumber,
            fullName: existing.fullName,
            email: existing.email,
            phone: existing.phone,
            country: existing.country,
            investmentTier: existing.investmentTier,
            investorType: existing.investorType,
            primaryInterest: existing.primaryInterest,
            priorityStatus: existing.priorityStatus,
            createdAt: existing.createdAt,
          },
        });
      }

      const currentCount = await WaitlistModel.countDocuments();
      queueNumber = SEED_OFFSET + currentCount + 1;
      ticketId = `BPRO-VIP-${queueNumber.toString().padStart(5, '0')}`;

      // Assign VIP/Institutional priority based on tier
      const isInstitutional =
        investmentTier === '$250,000+' ||
        investmentTier === '$50,000 – $250,000' ||
        investorType === 'Family Office' ||
        investorType === 'Corporate Treasury';

      record = await WaitlistModel.create({
        fullName: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        country: cleanCountry,
        investmentTier: investmentTier || '$10,000 – $50,000',
        investorType: investorType || 'Individual Accredited',
        primaryInterest: primaryInterest || 'Bitcoin Custody & Yield',
        telegramHandle: telegramHandle ? String(telegramHandle).trim() : undefined,
        referralCode: referralCode ? String(referralCode).trim() : undefined,
        notes: notes ? String(notes).trim() : undefined,
        ticketId,
        queueNumber,
        priorityStatus: isInstitutional ? 'Institutional' : 'VIP',
        ipAddress: request.headers.get('x-forwarded-for') || undefined,
      });
    } catch (dbErr: any) {
      console.warn('[API /api/wishlist] MongoDB write fallback:', dbErr.message);
      // Fallback ticket for resilience
      record = {
        fullName: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        country: cleanCountry,
        investmentTier: investmentTier || '$10,000 – $50,000',
        investorType: investorType || 'Individual Accredited',
        primaryInterest: primaryInterest || 'Bitcoin Custody & Yield',
        telegramHandle,
        ticketId,
        queueNumber,
        priorityStatus: 'VIP',
        createdAt: new Date(),
      };
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully registered for Grand Opening VIP Wishlist!',
      ticket: {
        ticketId: record.ticketId,
        queueNumber: record.queueNumber,
        fullName: record.fullName,
        email: record.email,
        phone: record.phone,
        country: record.country,
        investmentTier: record.investmentTier,
        investorType: record.investorType,
        primaryInterest: record.primaryInterest,
        priorityStatus: record.priorityStatus,
        createdAt: record.createdAt,
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
