'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardNav, { DashboardTab } from '@/components/dashboard/DashboardNav';
import PortfolioOverview from '@/components/dashboard/PortfolioOverview';
import PortfolioAnalytics from '@/components/dashboard/PortfolioAnalytics';
import TransactionHistory from '@/components/dashboard/TransactionHistory';
import InvestmentGoals from '@/components/dashboard/InvestmentGoals';
import SecuritySettings from '@/components/dashboard/SecuritySettings';
import RecurringSchedules from '@/components/dashboard/RecurringSchedules';
import TaxReports from '@/components/dashboard/TaxReports';
import RecentEarners from '@/components/dashboard/RecentEarners';
import BuyCryptoModal from '@/components/dashboard/BuyCryptoModal';
import WithdrawModal from '@/components/dashboard/WithdrawModal';
import KycVerificationModal from '@/components/dashboard/KycVerificationModal';
import TransactionMonitorModal from '@/components/dashboard/TransactionMonitorModal';
import AddGoalModal from '@/components/dashboard/AddGoalModal';
import PriceAlertModal from '@/components/dashboard/PriceAlertModal';
import ContractSigningModal from '@/components/dashboard/ContractSigningModal';
import { useAuth } from '@/lib/auth-context';
import {
  getStoredTransactions,
  saveStoredTransactions,
  getStoredGoals,
  saveStoredGoals,
  calculatePortfolioSummary,
} from '@/lib/portfolio-store';
import {
  getStoredRecurringSchedules,
  saveStoredRecurringSchedules,
} from '@/lib/recurring-store';
import {
  getStoredKycProfile,
  saveStoredKycProfile,
} from '@/lib/kyc-store';
import {
  getStoredNotifications,
  saveStoredNotifications,
  getStoredPriceAlerts,
  saveStoredPriceAlerts,
} from '@/lib/alert-store';
import { hasContractSigned, markContractSigned } from '@/lib/contract-store';
import {
  Transaction,
  InvestmentGoal,
  BtcMarketData,
  RecurringSchedule,
  KycProfile,
  AppNotification,
  PriceAlert,
} from '@/lib/types';
import { DEFAULT_MARKET_DATA } from '@/lib/btc-calc';
import { ArrowRight, ShieldCheck } from 'lucide-react';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    isAuthenticated,
    isAuthLoading,
    guestLogin,
    user,
    logout,
  } = useAuth();
  const [marketData, setMarketData] = useState<BtcMarketData>(DEFAULT_MARKET_DATA);
  const [satsMode, setSatsMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<InvestmentGoal[]>([]);
  const [schedules, setSchedules] = useState<RecurringSchedule[]>([]);
  const [kycProfile, setKycProfile] = useState<KycProfile>(getStoredKycProfile());
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([]);

  // Modal States
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);
  const [isPriceAlertModalOpen, setIsPriceAlertModalOpen] = useState(false);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [inspectedTx, setInspectedTx] = useState<Transaction | null>(null);

  const [contractSigned, setContractSigned] = useState<boolean>(() => hasContractSigned());

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTransactions(getStoredTransactions());
    setGoals(getStoredGoals());
    setSchedules(getStoredRecurringSchedules());
    setKycProfile(getStoredKycProfile());
    setNotifications(getStoredNotifications());
    setPriceAlerts(getStoredPriceAlerts());

    // Fetch live market data
    fetch('/api/btc-price')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.priceUsd) setMarketData(data);
      })
      .catch(() => {});
  }, []);

  const handleAddTransaction = (newTx: Transaction) => {
    const updated = [newTx, ...transactions];
    setTransactions(updated);
    saveStoredTransactions(updated);
  };

  const handleDeleteTransaction = (id: string) => {
    const updated = transactions.filter((t) => t.id !== id);
    setTransactions(updated);
    saveStoredTransactions(updated);
  };

  const handleAddGoal = (newGoal: InvestmentGoal) => {
    const updated = [newGoal, ...goals];
    setGoals(updated);
    saveStoredGoals(updated);
  };

  const handleDeleteGoal = (id: string) => {
    const updated = goals.filter((g) => g.id !== id);
    setGoals(updated);
    saveStoredGoals(updated);
  };

  const handleToggleSchedule = (id: string) => {
    const updated = schedules.map((s) => {
      if (s.id === id) {
        return { ...s, status: s.status === 'active' ? ('paused' as const) : ('active' as const) };
      }
      return s;
    });
    setSchedules(updated);
    saveStoredRecurringSchedules(updated);
  };

  const handleCancelSchedule = (id: string) => {
    const updated = schedules.filter((s) => s.id !== id);
    setSchedules(updated);
    saveStoredRecurringSchedules(updated);
  };

  const handleAddSchedule = (newSchedule: RecurringSchedule) => {
    const updated = [newSchedule, ...schedules];
    setSchedules(updated);
    saveStoredRecurringSchedules(updated);
  };

  const handleMarkAllNotificationsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    saveStoredNotifications(updated);
  };

  const handleAddPriceAlert = (alert: PriceAlert) => {
    const updated = [alert, ...priceAlerts];
    setPriceAlerts(updated);
    saveStoredPriceAlerts(updated);
  };

  const handleDeletePriceAlert = (id: string) => {
    const updated = priceAlerts.filter((a) => a.id !== id);
    setPriceAlerts(updated);
    saveStoredPriceAlerts(updated);
  };

  const handleContractSigned = () => {
    const record = markContractSigned({
      userEmail: user?.email || '',
      userName: user?.name || '',
    });
    setContractSigned(true);
    console.log('[Contract] Signed:', record);
  };



  useEffect(() => {
    if (mounted && !isAuthLoading && !isAuthenticated) {
      router.replace('/');
    }
  }, [mounted, isAuthLoading, isAuthenticated, router]);

  if (!mounted || isAuthLoading) {
    return (
      <div suppressHydrationWarning style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <span style={{ color: 'var(--text-muted)' }}>Verifying access...</span>
      </div>
    );
  }

  // Strict route blocking: if user is not logged in, block and redirect immediately to main website (/)
  if (!isAuthenticated) {
    return (
      <div suppressHydrationWarning style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <span style={{ color: 'var(--text-muted)' }}>Access restricted. Redirecting to main website...</span>
      </div>
    );
  }

  const summary = calculatePortfolioSummary(transactions, marketData.priceUsd);
  const isKycVerified = kycProfile.status === 'verified';
  const isContractSigned = !!user?.contractSigned;

  // HARD ONBOARDING GATE
  if (!isKycVerified || !isContractSigned) {
    return (
      <div suppressHydrationWarning style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
        <header style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <ShieldCheck style={{ color: 'var(--brand-btc)' }} size={24} />
              <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>BitcoinPro <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>| Onboarding</span></span>
            </div>
            <button onClick={logout} className="btn" style={{ background: 'transparent', color: 'var(--text-muted)', padding: '0.5rem' }}>
              Sign Out
            </button>
          </div>
        </header>

        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div className="glass-card" style={{ maxWidth: '640px', width: '100%', padding: '3rem 2.5rem', textAlign: 'center' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-main)' }}>Complete Your Profile</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1.1rem', lineHeight: 1.5 }}>
              To unlock your Expert Managed Portfolio, please complete the required regulatory and security steps below.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
              {/* KYC Step */}
              <div style={{
                padding: '1.5rem',
                borderRadius: '1rem',
                border: '1px solid',
                borderColor: isKycVerified ? 'rgba(34, 197, 94, 0.3)' : 'var(--border-subtle)',
                background: isKycVerified ? 'rgba(34, 197, 94, 0.05)' : 'var(--bg-surface)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-main)' }}>
                    1. Identity Verification
                    {isKycVerified && <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', background: 'var(--brand-success)', color: '#fff', borderRadius: '99px', fontWeight: 600 }}>Completed</span>}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.35rem' }}>Verify your identity to ensure the security of your investments.</p>
                </div>
                {!isKycVerified && (
                  <button onClick={() => setIsKycModalOpen(true)} className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem' }}>Verify KYC</button>
                )}
              </div>

              {/* Contract Step */}
              <div style={{
                padding: '1.5rem',
                borderRadius: '1rem',
                border: '1px solid',
                borderColor: isContractSigned ? 'rgba(34, 197, 94, 0.3)' : 'var(--border-subtle)',
                background: isContractSigned ? 'rgba(34, 197, 94, 0.05)' : 'var(--bg-surface)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-main)' }}>
                    2. Investment Agreement
                    {isContractSigned && <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', background: 'var(--brand-success)', color: '#fff', borderRadius: '99px', fontWeight: 600 }}>Completed</span>}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.35rem' }}>Sign the legally binding contract for expert management.</p>
                </div>
                {!isContractSigned && (
                  <button onClick={() => setIsContractModalOpen(true)} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>Sign Contract</button>
                )}
              </div>
            </div>

            {/* TESTING ONLY RESET BUTTON */}
            <div style={{ marginTop: '3rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem', textAlign: 'center' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Developer Testing Only:</p>
              <button 
                onClick={() => {
                  localStorage.clear();
                  window.location.href = '/';
                }}
                className="btn" 
                style={{ background: 'transparent', border: '1px solid var(--brand-danger)', color: 'var(--brand-danger)', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
              >
                Reset All App Data &amp; Storage
              </button>
            </div>
          </div>
        </main>

        {isKycModalOpen && (
          <KycVerificationModal
            kycProfile={kycProfile}
            onClose={() => setIsKycModalOpen(false)}
            onVerified={(profile) => setKycProfile(profile)}
          />
        )}
        {isContractModalOpen && (
          <ContractSigningModal
            userName={user?.name || ''}
            userEmail={user?.email || ''}
            onClose={() => setIsContractModalOpen(false)}
            onSigned={handleContractSigned}
          />
        )}
      </div>
    );
  }

  return (
    <div suppressHydrationWarning style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <DashboardNav
        marketData={marketData}
        satsMode={satsMode}
        onToggleSatsMode={() => setSatsMode((prev) => !prev)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenKycModal={() => setIsKycModalOpen(true)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllNotificationsRead}
        onOpenPriceAlerts={() => setIsPriceAlertModalOpen(true)}
      />

      <main className="container dashboard-main" style={{ flex: 1, padding: '2rem 1.5rem 4rem' }}>


        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
              <PortfolioOverview
                summary={summary}
                transactions={transactions}
                goals={goals}
                marketData={marketData}
                satsMode={satsMode}
                onOpenBuyModal={() => setIsBuyModalOpen(true)}
                onOpenWithdrawModal={() => setIsWithdrawModalOpen(true)}
                onOpenKycModal={() => setIsKycModalOpen(true)}
                onOpenGoalModal={() => setIsGoalModalOpen(true)}
                onViewAllTransactions={() => setActiveTab('transactions')}
                onViewAllGoals={() => setActiveTab('goals')}
                onInspectTx={(tx) => setInspectedTx(tx)}
                kycStatus={kycProfile.status}
                contractSigned={!!user?.contractSigned}
              />
              <RecentEarners />
            </div>
            <PortfolioAnalytics
              summary={summary}
              transactions={transactions}
              marketData={marketData}
              satsMode={satsMode}
            />
            <TransactionHistory
              transactions={transactions}
              satsMode={satsMode}
              onOpenBuyModal={() => setIsBuyModalOpen(true)}
              onDeleteTransaction={handleDeleteTransaction}
              onInspectTx={(tx) => setInspectedTx(tx)}
            />
          </div>
        )}

        {activeTab === 'analytics' && (
          <PortfolioAnalytics
            summary={summary}
            transactions={transactions}
            marketData={marketData}
            satsMode={satsMode}
          />
        )}

        {activeTab === 'transactions' && (
          <TransactionHistory
            transactions={transactions}
            satsMode={satsMode}
            onOpenBuyModal={() => setIsBuyModalOpen(true)}
            onDeleteTransaction={handleDeleteTransaction}
            onInspectTx={(tx) => setInspectedTx(tx)}
          />
        )}

        {activeTab === 'recurring' && (
          <RecurringSchedules
            schedules={schedules}
            onToggleSchedule={handleToggleSchedule}
            onCancelSchedule={handleCancelSchedule}
            onAddSchedule={handleAddSchedule}
          />
        )}

        {activeTab === 'goals' && (
          <InvestmentGoals
            goals={goals}
            totalBtc={summary.totalBtc}
            totalInvestedUsd={summary.totalInvestedUsd}
            currentBtcPrice={marketData.priceUsd}
            satsMode={satsMode}
            onOpenGoalModal={() => setIsGoalModalOpen(true)}
            onDeleteGoal={handleDeleteGoal}
          />
        )}

        {activeTab === 'tax' && (
          <TaxReports
            transactions={transactions}
            satsMode={satsMode}
          />
        )}

        {activeTab === 'security' && (
          <SecuritySettings transactions={transactions} />
        )}
      </main>

      {/* MODALS */}
      {isBuyModalOpen && (
        <BuyCryptoModal
          currentBtcPrice={marketData.priceUsd}
          satsMode={satsMode}
          onClose={() => setIsBuyModalOpen(false)}
          onSuccess={handleAddTransaction}
          contractSigned={contractSigned}
          onOpenContractModal={() => setIsContractModalOpen(true)}
        />
      )}

      {isWithdrawModalOpen && (
        <WithdrawModal
          totalBtc={summary.totalBtc}
          currentBtcPrice={marketData.priceUsd}
          satsMode={satsMode}
          onClose={() => setIsWithdrawModalOpen(false)}
          onConfirmWithdrawal={handleAddTransaction}
          kycStatus={kycProfile.status}
          onOpenKycModal={() => setIsKycModalOpen(true)}
        />
      )}

      {isBuyModalOpen && (
        <BuyCryptoModal
          currentBtcPrice={marketData.priceUsd}
          satsMode={satsMode}
          onClose={() => setIsBuyModalOpen(false)}
          onSuccess={handleAddTransaction}
          contractSigned={contractSigned}
          onOpenContractModal={() => setIsContractModalOpen(true)}
        />
      )}

      {isGoalModalOpen && (
        <AddGoalModal
          currentBtcPrice={marketData.priceUsd}
          onClose={() => setIsGoalModalOpen(false)}
          onAddGoal={handleAddGoal}
        />
      )}

      {isKycModalOpen && (
        <KycVerificationModal
          kycProfile={kycProfile}
          onClose={() => setIsKycModalOpen(false)}
          onVerified={(profile) => {
            setKycProfile(profile);
          }}
        />
      )}

      {isContractModalOpen && (
        <ContractSigningModal
          userName={user?.name || ''}
          userEmail={user?.email || ''}
          onClose={() => setIsContractModalOpen(false)}
          onSigned={handleContractSigned}
        />
      )}

      {isPriceAlertModalOpen && (
        <PriceAlertModal
          currentBtcPrice={marketData.priceUsd}
          alerts={priceAlerts}
          onClose={() => setIsPriceAlertModalOpen(false)}
          onAddAlert={handleAddPriceAlert}
          onDeleteAlert={handleDeletePriceAlert}
        />
      )}

      {inspectedTx && (
        <TransactionMonitorModal
          transaction={inspectedTx}
          satsMode={satsMode}
          onClose={() => setInspectedTx(null)}
        />
      )}


    </div>
  );
}

import { Suspense } from 'react';

export default function DashboardPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}><span style={{ color: 'var(--text-muted)' }}>Loading Dashboard...</span></div>}>
      <DashboardContent />
    </Suspense>
  );
}
