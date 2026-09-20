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
import InvestmentPlanModal from '@/components/dashboard/InvestmentPlanModal';
import ActiveInvestmentTracker from '@/components/dashboard/ActiveInvestmentTracker';
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
import { 
  hasContractSigned, 
  getContractReviewStatus, 
  finalizeContractCertification,
} from '@/lib/contract-store';
import {
  getStoredInvestments,
  saveStoredInvestments,
  claimStoredInvestment,
} from '@/lib/investment-store';
import {
  Transaction,
  InvestmentGoal,
  BtcMarketData,
  RecurringSchedule,
  KycProfile,
  AppNotification,
  PriceAlert,
  ActiveInvestment,
} from '@/lib/types';
import { DEFAULT_MARKET_DATA } from '@/lib/btc-calc';
import { ShieldCheck, RefreshCw } from 'lucide-react';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    isAuthenticated,
    isAuthLoading,
    guestLogin,
    user,
    logout,
    setContractSignedStatus,
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
  const [investments, setInvestments] = useState<ActiveInvestment[]>([]);

  // Modal States
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);
  const [isPriceAlertModalOpen, setIsPriceAlertModalOpen] = useState(false);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [inspectedTx, setInspectedTx] = useState<Transaction | null>(null);

  const [contractSigned, setContractSigned] = useState<boolean>(false);
  const [contractReviewState, setContractReviewState] = useState<{
    status: 'none' | 'under_review' | 'certified';
    remainingSeconds: number;
    record: any;
  }>({ status: 'none', remainingSeconds: 0, record: null });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setSchedules(getStoredRecurringSchedules());
    setNotifications(getStoredNotifications());
    setPriceAlerts(getStoredPriceAlerts());
  }, []);

  // Reload user-specific isolated data whenever authenticated user changes
  useEffect(() => {
    if (!user?.email) return;
    setTransactions(getStoredTransactions(user.email));
    setGoals(getStoredGoals(user.email));
    setKycProfile(getStoredKycProfile(user.email));
    setInvestments(getStoredInvestments(user.email));

    // Also fetch real-time from MongoDB
    fetch(`/api/investment?email=${encodeURIComponent(user.email)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.investments)) {
          setInvestments(data.investments);
          saveStoredInvestments(data.investments, user.email);
        }
      })
      .catch((err) => console.error('[Dashboard] Error fetching investments:', err));
  }, [user?.email]);

  useEffect(() => {
    if (!user?.email) return;

    const checkContract = () => {
      const status = getContractReviewStatus(user.email);
      setContractReviewState((prev) => {
        if (prev.status === status.status && prev.remainingSeconds === status.remainingSeconds) {
          return prev;
        }
        return status;
      });

      if (status.status === 'certified') {
        setContractSigned(true);
        setContractSignedStatus(true);
      } else {
        const isSigned = hasContractSigned(user.email) || Boolean(user.contractSigned);
        if (isSigned) {
          setContractSigned(true);
        }
      }
    };

    checkContract();
    const interval = setInterval(checkContract, 1000);
    return () => clearInterval(interval);
  }, [user?.email, user?.contractSigned, setContractSignedStatus]);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/btc-price')
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data && data.priceUsd) {
          setMarketData(data);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  const handleAddTransaction = (newTx: Transaction) => {
    const updated = [newTx, ...transactions];
    setTransactions(updated);
    saveStoredTransactions(updated, user?.email);
  };

  const handleDeleteTransaction = (id: string) => {
    const updated = transactions.filter((t) => t.id !== id);
    setTransactions(updated);
    saveStoredTransactions(updated, user?.email);
  };

  const handleAddGoal = (newGoal: InvestmentGoal) => {
    const updated = [newGoal, ...goals];
    setGoals(updated);
    saveStoredGoals(updated, user?.email);
  };

  const handleDeleteGoal = (id: string) => {
    const updated = goals.filter((g) => g.id !== id);
    setGoals(updated);
    saveStoredGoals(updated, user?.email);
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
    const email = user?.email || undefined;
    finalizeContractCertification(email);
    setContractSigned(true);
    setContractSignedStatus(true);
    setContractReviewState(getContractReviewStatus(email));
    setIsContractModalOpen(false);
  };

  const handleInvestmentCreated = (newInv: ActiveInvestment) => {
    const updated = [newInv, ...investments];
    setInvestments(updated);
    saveStoredInvestments(updated, user?.email);
    if (user?.email) {
      setTransactions(getStoredTransactions(user.email));
    }
  };

  const handleClaimInvestment = async (invId: string) => {
    try {
      await fetch('/api/investment', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: user?.email,
          investmentId: invId,
          action: 'claim',
        }),
      });
    } catch (err) {
      console.error('[Dashboard] Error claiming investment:', err);
    }
    const updated = claimStoredInvestment(invId, user?.email);
    setInvestments(updated);
    if (user?.email) {
      setTransactions(getStoredTransactions(user.email));
    }
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
  const effectiveEmail = user?.email || undefined;
  const isContractCertified = contractReviewState.status === 'certified' || Boolean(user?.contractSigned || contractSigned || (effectiveEmail ? hasContractSigned(effectiveEmail) : hasContractSigned()));
  const isContractUnderReview = contractReviewState.status === 'under_review';

  // MANDATORY ONBOARDING GATE: User MUST execute the contract (and pass the 30s review) to access dashboard.
  // Once contract is signed and review is completed, this screen is NEVER visible again.
  // KYC is strictly optional on onboarding (required only when requesting a withdrawal).
  if (!isContractCertified) {
    return (
      <div suppressHydrationWarning style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
        <header style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <ShieldCheck style={{ color: 'var(--brand-btc)' }} size={24} />
              <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>BitcoinPro <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>| Account Activation</span></span>
            </div>
            <button onClick={logout} className="btn" style={{ background: 'transparent', color: 'var(--text-muted)', padding: '0.5rem' }}>
              Sign Out
            </button>
          </div>
        </header>

        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div className="glass-card" style={{ maxWidth: '660px', width: '100%', padding: '3rem 2.5rem', textAlign: 'center' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-main)' }}>
              {isContractUnderReview
                ? 'Contract Execution Under Review'
                : 'Sign Your Master Custody Agreement'}
            </h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '1.025rem', lineHeight: 1.5 }}>
              {isContractUnderReview
                ? 'Your signed contract is undergoing an automated 30-second cryptographic compliance verification. Dashboard will unlock automatically upon completion.'
                : 'To unlock your managed portfolio, review and electronically execute your institutional custodial agreement below.'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
              {/* STEP 1: CONTRACT SIGNING (MANDATORY ON SIGNUP) */}
              <div style={{
                padding: '1.5rem',
                borderRadius: '1rem',
                border: '1px solid',
                borderColor: isContractUnderReview 
                  ? 'rgba(255, 204, 0, 0.5)' 
                  : 'var(--border-subtle)',
                background: isContractUnderReview 
                  ? 'rgba(255, 204, 0, 0.08)' 
                  : 'var(--bg-surface)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-main)' }}>
                    Master Custody Agreement
                    {isContractUnderReview ? (
                      <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.65rem', background: 'rgba(255, 204, 0, 0.2)', color: '#d97706', borderRadius: '99px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <RefreshCw size={12} className="spin" /> Review ({contractReviewState.remainingSeconds}s remaining)
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', background: 'rgba(247, 147, 26, 0.15)', color: 'var(--brand-btc)', borderRadius: '99px', fontWeight: 700 }}>
                        Required on Signup
                      </span>
                    )}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.35rem' }}>
                    {isContractUnderReview
                      ? 'Automated FinCEN counterparty clearing and multisig cold-vault ledger anchoring in progress...'
                      : 'Legally binding master agreement for non-commingled custodial safekeeping and execution.'}
                  </p>
                </div>

                {!isContractUnderReview ? (
                  <button onClick={() => setIsContractModalOpen(true)} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontWeight: 800 }}>
                    Sign Agreement
                  </button>
                ) : (
                  <button onClick={() => setIsContractModalOpen(true)} className="btn btn-secondary" style={{ padding: '0.75rem 1.25rem', borderColor: '#ffcc00', color: '#d97706', fontWeight: 700 }}>
                    View Live Audit ({contractReviewState.remainingSeconds}s)
                  </button>
                )}
              </div>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Full-width High-Yield Investment Growth & Live Duration Countdown */}
            <ActiveInvestmentTracker
              investments={investments}
              onOpenPlanModal={() => setIsPlanModalOpen(true)}
              onClaimInvestment={handleClaimInvestment}
              userEmail={user?.email}
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
              <PortfolioOverview
                summary={summary}
                transactions={transactions}
                goals={goals}
                investments={investments}
                marketData={marketData}
                satsMode={satsMode}
                onOpenBuyModal={() => setIsBuyModalOpen(true)}
                onOpenWithdrawModal={() => setIsWithdrawModalOpen(true)}
                onOpenKycModal={() => setIsKycModalOpen(true)}
                onOpenGoalModal={() => setIsGoalModalOpen(true)}
                onOpenPlanModal={() => setIsPlanModalOpen(true)}
                onClaimInvestment={handleClaimInvestment}
                onViewAllTransactions={() => setActiveTab('transactions')}
                onViewAllGoals={() => setActiveTab('goals')}
                onInspectTx={(tx) => setInspectedTx(tx)}
                kycStatus={kycProfile.status}
                contractSigned={!!user?.contractSigned}
                userEmail={user?.email}
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
            saveStoredKycProfile(profile, user?.email);
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

      {isPlanModalOpen && (
        <InvestmentPlanModal
          isOpen={isPlanModalOpen}
          onClose={() => setIsPlanModalOpen(false)}
          userEmail={user?.email}
          onInvestmentCreated={handleInvestmentCreated}
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
