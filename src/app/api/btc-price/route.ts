import { NextResponse } from 'next/server';
import { DEFAULT_MARKET_DATA } from '@/lib/btc-calc';
import { BtcMarketData } from '@/lib/types';

let cachedData: BtcMarketData = DEFAULT_MARKET_DATA;
let lastFetchTimestamp = 0;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds cache

export async function GET() {
  const now = Date.now();

  if (now - lastFetchTimestamp < CACHE_TTL_MS) {
    return NextResponse.json(cachedData, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  }

  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true',
      {
        headers: { Accept: 'application/json' },
        next: { revalidate: 60 },
      }
    );

    if (res.ok) {
      const data = await res.json();
      if (data.bitcoin) {
        cachedData = {
          priceUsd: data.bitcoin.usd || DEFAULT_MARKET_DATA.priceUsd,
          change24h: data.bitcoin.usd_24h_change || DEFAULT_MARKET_DATA.change24h,
          high24h: (data.bitcoin.usd || DEFAULT_MARKET_DATA.priceUsd) * 1.018,
          low24h: (data.bitcoin.usd || DEFAULT_MARKET_DATA.priceUsd) * 0.982,
          marketCapUsd: data.bitcoin.usd_market_cap || DEFAULT_MARKET_DATA.marketCapUsd,
          volume24hUsd: data.bitcoin.usd_24h_vol || DEFAULT_MARKET_DATA.volume24hUsd,
          blockHeight: DEFAULT_MARKET_DATA.blockHeight + Math.floor((now - 1741500000000) / 600000),
          mempoolFeeSatPerVb: 14,
          lastUpdated: new Date().toISOString(),
        };
        lastFetchTimestamp = now;
      }
    }
  } catch (err) {
    console.warn('Fallback to cached BTC data due to external rate limit:', err);
  }

  return NextResponse.json(cachedData, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
    },
  });
}
