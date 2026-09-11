'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import LiveMarketBanner from '@/components/LiveMarketBanner';
import HowItWorks from '@/components/HowItWorks';
import DcaCalculator from '@/components/DcaCalculator';
import EducationHub from '@/components/EducationHub';
import FeeTransparency from '@/components/FeeTransparency';
import RiskDisclosure from '@/components/RiskDisclosure';
import FaqSection from '@/components/FaqSection';
import Footer from '@/components/Footer';
import UnauthorizedBanner from '@/components/UnauthorizedBanner';
import InvestmentTiers from '@/components/InvestmentTiers';
import { DEFAULT_MARKET_DATA } from '@/lib/btc-calc';
import { BtcMarketData } from '@/lib/types';

export default function HomePage() {
  const [marketData, setMarketData] = useState<BtcMarketData>(DEFAULT_MARKET_DATA);
  const [satsMode, setSatsMode] = useState<boolean>(false);

  useEffect(() => {
    // Initial fetch of live market data
    const fetchMarketData = () => {
      fetch('/api/btc-price')
        .then((res) => res.json())
        .then((data) => {
          if (data && data.priceUsd) {
            setMarketData(data);
          }
        })
        .catch(() => {
          // graceful fallback already defaults in state
        });
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 60000);
    return () => clearInterval(interval);
  }, []);

  const toggleSatsMode = () => {
    setSatsMode((prev) => !prev);
  };

  return (
    <div suppressHydrationWarning style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <UnauthorizedBanner />
      <Navbar satsMode={satsMode} onToggleSatsMode={toggleSatsMode} />

      <main style={{ flex: 1 }}>
        <Hero marketData={marketData} satsMode={satsMode} />
        <LiveMarketBanner marketData={marketData} satsMode={satsMode} />
        <HowItWorks />
        <DcaCalculator
          marketData={marketData}
          satsMode={satsMode}
          onToggleSatsMode={toggleSatsMode}
        />
        <InvestmentTiers />
        <EducationHub />
        <FeeTransparency marketData={marketData} satsMode={satsMode} />
        <RiskDisclosure />
        <FaqSection />
      </main>

      <Footer />
    </div>
  );
}
