import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { WaitlistModel } from '@/models/Waitlist';

export const dynamic = 'force-dynamic';

// Dynamic base: starts at 1,428 and automatically increments by 20 every 24 hours
export function getDailyBaseOffset(): number {
  const BASE_COUNT = 1428;
  const ANCHOR_DATE = new Date('2026-09-21T00:00:00Z').getTime();
  const daysPassed = Math.max(0, Math.floor((Date.now() - ANCHOR_DATE) / (1000 * 60 * 60 * 24)));
  return BASE_COUNT + (daysPassed * 20);
}

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

    const baseOffset = getDailyBaseOffset();
    const displayedCount = baseOffset + totalCount;

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
      totalWaitlistCount: getDailyBaseOffset() + 12,
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

    const baseOffset = getDailyBaseOffset();
    let record = null;
    let queueNumber = baseOffset + Math.floor(Math.random() * 50) + 1;
    let ticketId = `STARK-VIP-${queueNumber.toString().padStart(5, '0')}`;

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
            paymentMethod: existing.paymentMethod || 'USDT / USDC (Stablecoins)',
            investorType: existing.investorType,
            primaryInterest: existing.primaryInterest,
            priorityStatus: existing.priorityStatus,
            createdAt: existing.createdAt,
          },
        });
      }

      const currentCount = await WaitlistModel.countDocuments();
      queueNumber = baseOffset + currentCount + 1;
      ticketId = `STARK-VIP-${queueNumber.toString().padStart(5, '0')}`;

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
        paymentMethod: cleanPaymentMethod,
        investorType: investorType || 'Individual / Private Investor ($200+ Starter)',
        primaryInterest: primaryInterest || 'Starknet Bitcoin ZK-Vault & 12.4% APY Yield',
        telegramHandle: telegramHandle ? String(telegramHandle).trim() : undefined,
        referralCode: referralCode ? String(referralCode).trim() : undefined,
        notes: notes ? String(notes).trim() : undefined,
        ticketId,
        queueNumber,
        priorityStatus: isInstitutional ? 'Institutional' : 'VIP',
        ipAddress: request.headers.get('x-forwarded-for') || undefined,
      });

      // Send Instant Telegram Notification if bot token & chat ID are configured
      if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
        try {
          const tgMsg = [
            `🚀 *New Starknet VIP Wishlist Registration!*`,
            ``,
            `👤 *Name:* ${cleanName}`,
            `📧 *Email:* ${cleanEmail}`,
            `📱 *Phone / WhatsApp:* ${cleanPhone}`,
            `🌍 *Country:* ${cleanCountry}`,
            `💰 *Planned Allocation:* ${investmentTier || '$10,000 – $50,000'}`,
            `💳 *Payment Method:* ${cleanPaymentMethod}`,
            `🏛 *Investor Type:* ${investorType || 'Individual Accredited'}`,
            `🎯 *Primary Interest:* ${primaryInterest || 'Starknet Custody & Yield'}`,
            telegramHandle ? `💬 *Telegram:* @${String(telegramHandle).replace('@', '')}` : '',
            referralCode ? `🏷 *Referral Code:* ${referralCode}` : '',
            notes ? `📝 *Notes:* ${notes}` : '',
            ``,
            `🎟 *Ticket ID:* \`${ticketId}\``,
            `🔢 *Priority Queue Position:* #${queueNumber}`,
            `⭐ *Status:* ${isInstitutional ? 'Institutional Priority' : 'VIP Priority'}`,
          ].filter(Boolean).join('\n');

          await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: process.env.TELEGRAM_CHAT_ID,
              text: tgMsg,
              parse_mode: 'Markdown',
            }),
          });
        } catch (tgErr) {
          console.warn('[API /api/wishlist] Telegram alert failed:', tgErr);
        }
      }
    } catch (dbErr: any) {
      console.warn('[API /api/wishlist] MongoDB write fallback:', dbErr.message);
      // Fallback ticket for resilience
      record = {
        fullName: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        country: cleanCountry,
        investmentTier: investmentTier || '$10,000 – $50,000',
        paymentMethod: cleanPaymentMethod,
        investorType: investorType || 'Individual / Private Investor ($200+ Starter)',
        primaryInterest: primaryInterest || 'Starknet Bitcoin ZK-Vault & 12.4% APY Yield',
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
        paymentMethod: record.paymentMethod || cleanPaymentMethod,
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
