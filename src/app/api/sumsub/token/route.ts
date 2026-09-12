import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, levelName = 'basic-kyc-level' } = body;

    const SUMSUB_APP_TOKEN = process.env.SUMSUB_APP_TOKEN;
    const SUMSUB_SECRET_KEY = process.env.SUMSUB_SECRET_KEY;

    if (!SUMSUB_APP_TOKEN || !SUMSUB_SECRET_KEY) {
      return NextResponse.json({ error: 'SumSub credentials not configured in .env.local' }, { status: 500 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    const ts = Math.floor(Date.now() / 1000);
    
    // Create signature
    const signature = crypto.createHmac('sha256', SUMSUB_SECRET_KEY);
    signature.update(ts + 'POST' + `/resources/accessTokens?userId=${userId}&levelName=${levelName}`);
    const hex = signature.digest('hex');

    const res = await fetch(`https://api.sumsub.com/resources/accessTokens?userId=${userId}&levelName=${levelName}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'X-App-Token': SUMSUB_APP_TOKEN,
        'X-App-Access-Ts': ts.toString(),
        'X-App-Access-Sig': hex,
      },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('[SumSub API Error]', text);
      throw new Error(`SumSub API responded with ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data); // returns { token: "...", userId: "..." }
  } catch (err: any) {
    console.error('[SumSub Token Handler Error]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
