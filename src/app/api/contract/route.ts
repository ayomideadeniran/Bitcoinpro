import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ContractModel, UserModel } from '@/models/User';

export const dynamic = 'force-dynamic';

// GET contract review and execution status
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ status: 'none', remainingSeconds: 0, record: null });
    }

    const cleanEmail = email.trim().toLowerCase();
    await connectToDatabase();

    const record = await ContractModel.findOne({ userEmail: cleanEmail });
    if (!record) {
      return NextResponse.json({ status: 'none', remainingSeconds: 0, record: null });
    }

    if (record.status === 'certified') {
      return NextResponse.json({ status: 'certified', remainingSeconds: 0, record });
    }

    if (record.status === 'under_review') {
      const started = record.reviewStartedAt ? new Date(record.reviewStartedAt).getTime() : Date.now();
      const elapsed = Math.floor((Date.now() - started) / 1000);
      const remaining = Math.max(0, 30 - elapsed);

      if (remaining <= 0) {
        // Auto-promote to certified
        record.status = 'certified';
        record.certifiedAt = new Date();
        await record.save();

        await UserModel.updateOne({ email: cleanEmail }, { $set: { contractSigned: true } });

        return NextResponse.json({ status: 'certified', remainingSeconds: 0, record });
      }

      return NextResponse.json({ status: 'under_review', remainingSeconds: remaining, record });
    }

    return NextResponse.json({ status: 'none', remainingSeconds: 0, record: null });
  } catch (error: any) {
    console.error('[API /api/contract] GET error:', error);
    return NextResponse.json({ status: 'none', remainingSeconds: 0, error: error.message }, { status: 500 });
  }
}

// POST: Save contract signature & start review in MongoDB
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      userEmail,
      userName,
      signingMethod,
      signatureText,
      signatureImage,
      initials,
      legalCapacity,
      residentialAddress,
      phoneNumber,
      securityFingerprint,
      countersignHash,
      action,
    } = body;

    if (!userEmail) {
      return NextResponse.json({ success: false, error: 'User email is required' }, { status: 400 });
    }

    const cleanEmail = String(userEmail).trim().toLowerCase();
    await connectToDatabase();

    // Reset action
    if (action === 'reset') {
      await ContractModel.deleteOne({ userEmail: cleanEmail });
      await UserModel.updateOne({ email: cleanEmail }, { $set: { contractSigned: false } });
      return NextResponse.json({ success: true, message: 'Contract state reset' });
    }

    // Finalize action
    if (action === 'finalize') {
      const updated = await ContractModel.findOneAndUpdate(
        { userEmail: cleanEmail },
        {
          $set: {
            status: 'certified',
            certifiedAt: new Date(),
          },
        },
        { new: true }
      );
      await UserModel.updateOne({ email: cleanEmail }, { $set: { contractSigned: true } });
      return NextResponse.json({ success: true, record: updated });
    }

    // New signature execution / submission
    const record = await ContractModel.findOneAndUpdate(
      { userEmail: cleanEmail },
      {
        $set: {
          userEmail: cleanEmail,
          userName: userName || 'Institutional Investor',
          status: 'under_review',
          signingMethod: signingMethod || 'typed',
          signatureText,
          signatureImage,
          initials: initials || 'BP',
          legalCapacity: legalCapacity || 'Authorized Signatory',
          residentialAddress: residentialAddress || 'Primary Residence',
          phoneNumber: phoneNumber || '+1 (555) 000-0000',
          reviewStartedAt: new Date(),
          securityFingerprint: securityFingerprint || `SIG-${Date.now().toString(16).toUpperCase()}`,
          countersignHash: countersignHash || `CCO-VAULT-${Date.now().toString(16).toUpperCase()}`,
          contractVersion: 'v2.4-INSTITUTIONAL',
        },
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, record });
  } catch (error: any) {
    console.error('[API /api/contract] POST error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
