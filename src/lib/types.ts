export interface BtcMarketData {
  priceUsd: number;
  change24h: number;
  high24h: number;
  low24h: number;
  marketCapUsd: number;
  volume24hUsd: number;
  blockHeight: number;
  mempoolFeeSatPerVb: number;
  lastUpdated: string;
}

export interface DcaCalculationParams {
  amountUsd: number;
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  durationMonths: number;
  customBtcPrice?: number;
}

export interface DcaCalculationResult {
  totalInvestedUsd: number;
  totalBtcAccumulated: number;
  totalSatsAccumulated: number;
  averagePurchasePriceUsd: number;
  currentPortfolioValueUsd: number;
  unrealizedProfitLossUsd: number;
  unrealizedProfitLossPercent: number;
  breakdown: Array<{
    period: number;
    dateLabel: string;
    investedCumulativeUsd: number;
    btcAccumulatedCumulative: number;
    portfolioValueUsd: number;
  }>;
}

export interface LumpSumCalculationParams {
  amountInvestedUsd: number;
  purchasePriceUsd: number;
  currentPriceUsd: number;
}

export interface LumpSumCalculationResult {
  btcReceived: number;
  satsReceived: number;
  currentValueUsd: number;
  unrealizedProfitLossUsd: number;
  unrealizedProfitLossPercent: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface EducationArticle {
  id: string;
  category: 'fundamentals' | 'investing' | 'security';
  title: string;
  readTime: string;
  summary: string;
  keyPoints: string[];
  riskTip: string;
}

export interface FaqItem {
  id: string;
  category: 'basics' | 'investing' | 'security' | 'fees';
  question: string;
  answer: string;
}

export type UserRole = 'investor';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  joinedDate: string;
  twoFactorEnabled: boolean;
  loginAlertsEnabled: boolean;
  preferredCurrency: 'USD' | 'EUR' | 'GBP';
  defaultSatsMode: boolean;
  kycTier: number;
  kycStatus: 'verified' | 'pending' | 'unverified';
  contractSigned: boolean;
}

export interface WelcomeEmailData {
  id: string;
  to: string;
  recipientName: string;
  subject: string;
  htmlContent: string;
  sentAt: string;
  accountTier: string;
  importantPoints: string[];
  deliveryStatus?: string;
}

export interface Transaction {
  id: string;
  date: string;
  type: 'spot_buy' | 'recurring_buy' | 'transfer_in' | 'withdrawal' | 'sell';
  amountBtc: number;
  amountUsd: number;
  pricePerBtc: number;
  feeUsd: number;
  status: 'completed' | 'pending' | 'broadcasting' | 'failed';
  notes?: string;
  txHash?: string;
  recipientAddress?: string;
  confirmations?: number;
}

export interface InvestmentGoal {
  id: string;
  title: string;
  category: 'sats_target' | 'usd_target' | 'dca_habit';
  targetAmountUsd: number;
  targetBtc: number;
  durationMonths: number;
  startDate: string;
  notes?: string;
}

export interface SessionInfo {
  id: string;
  device: string;
  browser: string;
  ipAddress: string;
  lastActive: string;
  isCurrent: boolean;
}

export type PaymentMethodType = 'ach_bank' | 'debit_card' | 'apple_pay';

export interface PaymentMethod {
  id: PaymentMethodType;
  name: string;
  description: string;
  feePercentage: number;
  speed: string;
  limitUsd: number;
}

export interface RecurringSchedule {
  id: string;
  amountUsd: number;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  paymentMethod: PaymentMethodType;
  startDate: string;
  nextRunDate: string;
  status: 'active' | 'paused' | 'cancelled';
  totalInvestedUsd: number;
  executionCount: number;
}

export interface KycProfile {
  tier: number;
  status: 'verified' | 'pending' | 'unverified';
  documentType?: 'passport' | 'drivers_license' | 'national_id';
  dailyLimitUsd: number;
  remainingDailyUsd: number;
  monthlyLimitUsd: number;
  verifiedAt: string;
}

export interface WithdrawalFeeOption {
  speed: 'fast' | 'standard' | 'economic';
  satPerVb: number;
  feeUsd: number;
  estimatedMinutes: string;
}

export interface PortfolioSummary {
  totalBtc: number;
  totalSats: number;
  totalInvestedUsd: number;
  totalFeesUsd: number;
  currentValueUsd: number;
  unrealizedProfitLossUsd: number;
  unrealizedProfitLossPercent: number;
  averagePurchasePriceUsd: number;
}

// --- Phase 4: Alerts, Analytics, Tax Reports & Admin Types ---

export interface PriceAlert {
  id: string;
  targetPriceUsd: number;
  condition: 'above' | 'below';
  createdAt: string;
  triggered: boolean;
  notes?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'security' | 'price' | 'system';
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface TaxReportItem {
  id: string;
  asset: string;
  dateAcquired: string;
  dateSold: string;
  amountBtc: number;
  proceedsUsd: number;
  costBasisUsd: number;
  gainLossUsd: number;
  holdingPeriod: 'short_term' | 'long_term';
}


