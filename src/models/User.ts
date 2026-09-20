import mongoose, { Schema, Model } from 'mongoose';

// User Account Schema
export interface IUserDocument {
  name: string;
  email: string;
  passwordHash: string;
  role: 'investor' | 'admin';
  contractSigned: boolean;
  kycStatus: 'unverified' | 'pending' | 'verified';
  twoFactorEnabled: boolean;
  loginAlertsEnabled: boolean;
  preferredCurrency: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['investor', 'admin'], default: 'investor' },
    contractSigned: { type: Boolean, default: false },
    kycStatus: { type: String, enum: ['unverified', 'pending', 'verified'], default: 'unverified' },
    twoFactorEnabled: { type: Boolean, default: false },
    loginAlertsEnabled: { type: Boolean, default: true },
    preferredCurrency: { type: String, default: 'USD' },
    avatarUrl: { type: String },
  },
  {
    timestamps: true,
  }
);

export const UserModel: Model<IUserDocument> =
  mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);

// Contract Agreement Schema
export interface IContractDocument {
  userEmail: string;
  userName: string;
  status: 'draft' | 'under_review' | 'certified';
  signingMethod: 'typed' | 'drawn';
  signatureText?: string;
  signatureImage?: string;
  initials: string;
  legalCapacity: string;
  residentialAddress: string;
  phoneNumber: string;
  reviewStartedAt?: Date;
  certifiedAt?: Date;
  securityFingerprint: string;
  countersignHash: string;
  contractVersion: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContractSchema = new Schema<IContractDocument>(
  {
    userEmail: { type: String, required: true, unique: true, lowercase: true, trim: true },
    userName: { type: String, required: true },
    status: { type: String, enum: ['draft', 'under_review', 'certified'], default: 'under_review' },
    signingMethod: { type: String, enum: ['typed', 'drawn'], required: true },
    signatureText: { type: String },
    signatureImage: { type: String },
    initials: { type: String, required: true },
    legalCapacity: { type: String, required: true },
    residentialAddress: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    reviewStartedAt: { type: Date },
    certifiedAt: { type: Date },
    securityFingerprint: { type: String, required: true },
    countersignHash: { type: String, required: true },
    contractVersion: { type: String, default: 'v2.4-INSTITUTIONAL' },
  },
  {
    timestamps: true,
  }
);

export const ContractModel: Model<IContractDocument> =
  mongoose.models.Contract || mongoose.model<IContractDocument>('Contract', ContractSchema);

// User Portfolio Transactions Schema
export interface ITransactionDocument {
  userEmail: string;
  id: string;
  date: string;
  type: 'spot_buy' | 'recurring_buy' | 'sell' | 'deposit' | 'withdrawal';
  amountBtc: number;
  amountUsd: number;
  pricePerBtc: number;
  feeUsd: number;
  status: 'completed' | 'pending' | 'failed';
  notes?: string;
  txHash?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransactionDocument>(
  {
    userEmail: { type: String, required: true, lowercase: true, trim: true, index: true },
    id: { type: String, required: true },
    date: { type: String, required: true },
    type: { type: String, required: true },
    amountBtc: { type: Number, required: true },
    amountUsd: { type: Number, required: true },
    pricePerBtc: { type: Number, required: true },
    feeUsd: { type: Number, required: true, default: 0 },
    status: { type: String, required: true, default: 'completed' },
    notes: { type: String },
    txHash: { type: String },
  },
  {
    timestamps: true,
  }
);

export const TransactionModel: Model<ITransactionDocument> =
  mongoose.models.Transaction || mongoose.model<ITransactionDocument>('Transaction', TransactionSchema);

// User Investment Goals Schema
export interface IGoalDocument {
  userEmail: string;
  id: string;
  title: string;
  category: 'sats_target' | 'usd_target' | 'custom';
  targetAmountUsd: number;
  targetBtc: number;
  durationMonths: number;
  startDate: string;
  targetDate?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const GoalSchema = new Schema<IGoalDocument>(
  {
    userEmail: { type: String, required: true, lowercase: true, trim: true, index: true },
    id: { type: String, required: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    targetAmountUsd: { type: Number, required: true },
    targetBtc: { type: Number, required: true },
    durationMonths: { type: Number, required: true },
    startDate: { type: String, required: true },
    targetDate: { type: String },
    notes: { type: String },
  },
  {
    timestamps: true,
  }
);

export const GoalModel: Model<IGoalDocument> =
  mongoose.models.Goal || mongoose.model<IGoalDocument>('Goal', GoalSchema);

// User Active Investments Schema
export interface IInvestmentDocument {
  userEmail: string;
  id: string;
  planId: string;
  planName: string;
  tier: 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
  amountInvestedUsd: number;
  durationDays: number;
  expectedRoiPercent: number;
  targetPayoutUsd: number;
  startDate: string;
  maturityDate: string;
  status: 'active' | 'matured' | 'claimed';
  autoReinvest: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const InvestmentSchema = new Schema<IInvestmentDocument>(
  {
    userEmail: { type: String, required: true, lowercase: true, trim: true, index: true },
    id: { type: String, required: true },
    planId: { type: String, required: true },
    planName: { type: String, required: true },
    tier: { type: String, enum: ['Silver', 'Gold', 'Platinum', 'Diamond'], required: true },
    amountInvestedUsd: { type: Number, required: true },
    durationDays: { type: Number, required: true },
    expectedRoiPercent: { type: Number, required: true },
    targetPayoutUsd: { type: Number, required: true },
    startDate: { type: String, required: true },
    maturityDate: { type: String, required: true },
    status: { type: String, enum: ['active', 'matured', 'claimed'], default: 'active' },
    autoReinvest: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const InvestmentModel: Model<IInvestmentDocument> =
  mongoose.models.Investment || mongoose.model<IInvestmentDocument>('Investment', InvestmentSchema);

