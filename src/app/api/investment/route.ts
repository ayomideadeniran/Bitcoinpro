import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { InvestmentModel, TransactionModel, UserModel } from '@/models/User';
import { INVESTMENT_PLANS } from '@/lib/investment-store';

export const dynamic = 'force-dynamic';

// GET: Fetch user's isolated active investments from MongoDB
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ investments: [] });
    }

    const cleanEmail = email.trim().toLowerCase();
    await connectToDatabase();

    const records = await InvestmentModel.find({ userEmail: cleanEmail }).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ investments: records || [] });
  } catch (error: any) {
    console.error('[API /api/investment] GET error:', error);
    return NextResponse.json({ investments: [], error: error.message }, { status: 500 });
  }
}

// POST: Create a new investment for the authenticated user
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userEmail, planId, amountInvestedUsd, autoReinvest } = body;

    if (!userEmail) {
      return NextResponse.json({ success: false, error: 'User email is required' }, { status: 400 });
    }

    const cleanEmail = String(userEmail).trim().toLowerCase();
    const plan = INVESTMENT_PLANS.find((p) => p.id === planId);
    if (!plan) {
      return NextResponse.json({ success: false, error: 'Invalid investment plan selected' }, { status: 400 });
    }

    const amount = Number(amountInvestedUsd);
    if (isNaN(amount) || amount < plan.minAmountUsd || (plan.maxAmountUsd && amount > plan.maxAmountUsd)) {
      return NextResponse.json(
        {
          success: false,
          error: `Investment amount for ${plan.name} must be between $${plan.minAmountUsd.toLocaleString()} and $${plan.maxAmountUsd.toLocaleString()}`,
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const startDate = new Date();
    const maturityDate = new Date(startDate.getTime() + plan.durationDays * 24 * 60 * 60 * 1000);
    const totalProfitUsd = amount * (plan.expectedRoiPercent / 100);
    const targetPayoutUsd = amount + totalProfitUsd;
    const investmentId = `inv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const newInvestment = await InvestmentModel.create({
      userEmail: cleanEmail,
      id: investmentId,
      planId: plan.id,
      planName: plan.name,
      tier: plan.tier,
      amountInvestedUsd: amount,
      durationDays: plan.durationDays,
      expectedRoiPercent: plan.expectedRoiPercent,
      targetPayoutUsd,
      startDate: startDate.toISOString(),
      maturityDate: maturityDate.toISOString(),
      status: 'active',
      autoReinvest: Boolean(autoReinvest),
    });

    // Record institutional deposit in Transaction ledger
    const txId = `tx_inv_${Date.now()}`;
    await TransactionModel.create({
      userEmail: cleanEmail,
      id: txId,
      date: startDate.toISOString().split('T')[0],
      type: 'recurring_buy',
      amountBtc: 0,
      amountUsd: amount,
      pricePerBtc: 0,
      feeUsd: 0,
      status: 'completed',
      notes: `Active Investment: ${plan.name} Tier (${plan.durationDays}d Lockup @ +${plan.expectedRoiPercent}% ROI)`,
    });

    return NextResponse.json({
      success: true,
      investment: newInvestment,
      message: `Successfully allocated $${amount.toLocaleString()} into ${plan.name}`,
    });
  } catch (error: any) {
    console.error('[API /api/investment] POST error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PATCH: Claim matured payout or toggle auto-reinvestment
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { userEmail, investmentId, action } = body;

    if (!userEmail || !investmentId) {
      return NextResponse.json({ success: false, error: 'User email and investment ID required' }, { status: 400 });
    }

    const cleanEmail = String(userEmail).trim().toLowerCase();
    await connectToDatabase();

    const investment = await InvestmentModel.findOne({ userEmail: cleanEmail, id: investmentId });
    if (!investment) {
      return NextResponse.json({ success: false, error: 'Investment not found' }, { status: 404 });
    }

    if (action === 'claim') {
      investment.status = 'claimed';
      await investment.save();

      // Record profit return in user ledger
      await TransactionModel.create({
        userEmail: cleanEmail,
        id: `tx_claim_${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        type: 'spot_buy',
        amountBtc: 0,
        amountUsd: investment.targetPayoutUsd,
        pricePerBtc: 0,
        feeUsd: 0,
        status: 'completed',
        notes: `Matured Yield Payout: ${investment.planName} (+${investment.expectedRoiPercent}% ROI)`,
      });

      return NextResponse.json({ success: true, investment, message: 'Investment yield claimed successfully!' });
    }

    if (action === 'toggle_reinvest') {
      investment.autoReinvest = !investment.autoReinvest;
      await investment.save();
      return NextResponse.json({ success: true, investment });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    console.error('[API /api/investment] PATCH error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
