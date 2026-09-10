'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DashboardNav, { DashboardTab } from '@/components/dashboard/DashboardNav';
import PortfolioOverview from '@/components/dashboard/PortfolioOverview';
import PortfolioAnalytics from '@/components/dashboard/PortfolioAnalytics';
import TransactionHistory from '@/components/dashboard/TransactionHistory';
import InvestmentGoals from '@/components/dashboard/InvestmentGoals';
import SecuritySettings from '@/components/dashboard/SecuritySettings';
import RecurringSchedules from '@/components/dashboard/RecurringSchedules';
import TaxReports from '@/components/dashboard/TaxReports';
import BuyCryptoModal from '@/components/dashboard/BuyCryptoModal';
import WithdrawModal from '@/components/dashboard/WithdrawModal';
import KycVerificationModal from '@/components/dashboard/KycVerificationModal';
import TransactionMonitorModal from '@/components/dashboard/TransactionMonitorModal';
import AddGoalModal from '@/components/dashboard/AddGoalModal';
import PriceAlertModal from '@/components/dashboard/PriceAlertModal';
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
  const {
    isAuthenticated,
    isAuthLoading,
    guestLogin,
    user,
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
  const [inspectedTx, setInspectedTx] = useState<Transaction | null>(null);

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

  useEffect(() => {
    if (mounted && !isAuthLoading && !isAuthenticated) {
      router.replace('/');
    }
  }, [mounted, isAuthLoading, isAuthenticated, router]);

  if (!mounted || isAuthLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <span style={{ color: 'var(--text-muted)' }}>Verifying access...</span>
      </div>
    );
  }

  // Strict route blocking: if user is not logged in, block and redirect immediately to main website (/)
  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <span style={{ color: 'var(--text-muted)' }}>Access restricted. Redirecting to main website...</span>
      </div>
    );
  }

  const summary = calculatePortfolioSummary(transactions, marketData.priceUsd);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-primary)' }}>
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

      <main className="container" style={{ flex: 1, padding: '2.5rem 1.5rem 4rem' }}>


        {activeTab === 'overview' && (
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
          />
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
        />
      )}

      {isWithdrawModalOpen && (
        <WithdrawModal
          totalBtc={summary.totalBtc}
          currentBtcPrice={marketData.priceUsd}
          satsMode={satsMode}
          onClose={() => setIsWithdrawModalOpen(false)}
          onConfirmWithdrawal={handleAddTransaction}
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

export default function DashboardPage() {
  return <DashboardContent />;
}
