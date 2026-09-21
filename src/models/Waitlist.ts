import mongoose, { Schema, Model } from 'mongoose';

export interface IWaitlistDocument {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  investmentTier: string;
  paymentMethod: string;
  investorType: string;
  primaryInterest: string;
  telegramHandle?: string;
  referralCode?: string;
  notes?: string;
  ticketId: string;
  queueNumber: number;
  priorityStatus: 'VIP' | 'Institutional' | 'Standard';
  ipAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

const WaitlistSchema = new Schema<IWaitlistDocument>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    investmentTier: { type: String, required: true, default: '$10,000 – $50,000' },
    paymentMethod: { type: String, required: true, default: 'USDT / USDC (Stablecoins)' },
    investorType: { type: String, required: true, default: 'Individual / Private Investor ($200+ Starter)' },
    primaryInterest: { type: String, required: true, default: 'Starknet Bitcoin ZK-Vault & 12.4% APY Yield' },
    telegramHandle: { type: String, trim: true },
    referralCode: { type: String, trim: true },
    notes: { type: String, trim: true },
    ticketId: { type: String, required: true, unique: true },
    queueNumber: { type: Number, required: true },
    priorityStatus: {
      type: String,
      enum: ['VIP', 'Institutional', 'Standard'],
      default: 'VIP',
    },
    ipAddress: { type: String },
  },
  {
    timestamps: true,
  }
);

// Helpful indexes
WaitlistSchema.index({ email: 1 });
WaitlistSchema.index({ ticketId: 1 });
WaitlistSchema.index({ queueNumber: 1 });

export const WaitlistModel: Model<IWaitlistDocument> =
  mongoose.models.Waitlist || mongoose.model<IWaitlistDocument>('Waitlist', WaitlistSchema);
