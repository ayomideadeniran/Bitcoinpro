export interface SupportMessage {
  id: string;
  role: 'user' | 'bot' | 'agent';
  text: string;
  timestamp: string;
}

export interface SupportArticle {
  keywords: string[];
  answer: string;
  escalate?: boolean;
}

export const SUPPORT_ARTICLES: SupportArticle[] = [
  {
    keywords: ['buy', 'purchase', 'invest', 'how to buy', 'get started', 'start'],
    answer: 'To buy Bitcoin on BitcoinPro, go to your Dashboard and click "Buy Bitcoin". You can pay via Bank ACH, Debit/Credit Card, or Apple Pay/Google Pay. Make sure you have signed the investment agreement first.',
  },
  {
    keywords: ['withdraw', 'send', 'transfer', 'cash out', 'move bitcoin'],
    answer: 'Withdrawals require completed KYC verification. Go to Dashboard > Withdraw, enter your destination Bitcoin address, amount, and confirm with 2FA. Withdrawals are sent directly to your self-custody wallet.',
  },
  {
    keywords: ['kyc', 'verify', 'identity', 'verification', 'document', 'passport', 'license'],
    answer: 'KYC (Know Your Customer) verification is required before withdrawals. Visit /kyc or click "Verify KYC" in the dashboard to submit your full legal name, date of birth, address, and government-issued ID details.',
  },
  {
    keywords: ['contract', 'agreement', 'sign', 'terms', 'legal'],
    answer: 'Before purchasing Bitcoin, you must sign the BitcoinPro Investment Agreement. You can sign it from the dashboard banner or when you attempt your first buy. This is a one-time requirement.',
  },
  {
    keywords: ['2fa', 'two factor', 'authenticator', 'google authenticator', 'security'],
    answer: '2FA adds an extra layer of security. Enable it in Security Settings. Use an authenticator app like Google Authenticator or Authy. Never share your 2FA code with anyone.',
  },
  {
    keywords: ['seed', 'phrase', 'recovery', '12 words', 'private key', 'lost password'],
    answer: 'Your BitcoinPro account uses email/password login, not a seed phrase. However, if you withdraw to a self-custody wallet, NEVER share your wallet seed phrase. BitcoinPro support will NEVER ask for your password, 2FA code, or seed phrase.',
  },
  {
    keywords: ['fee', 'fees', 'cost', 'price', 'charge', 'expensive'],
    answer: 'BitcoinPro charges transparent platform fees: 0.49% for Bank ACH and 1.49% for Card/Apple Pay, plus network miner fees. Fees are always shown before you confirm any transaction.',
  },
  {
    keywords: ['pending', 'stuck', 'not working', 'error', 'failed', 'issue', 'problem', 'help'],
    answer: 'If a transaction is pending, check the transaction history in your dashboard. For technical issues, payment problems, or account access issues, I can escalate this to our support team on Telegram.',
  },
  {
    keywords: ['scam', 'phishing', 'fake', 'suspicious', 'fraud', 'steal'],
    answer: 'BitcoinPro will never ask for your seed phrase, password, or 2FA code. Always verify you are on the correct URL. Enable 2FA and never share sensitive information via email or chat.',
  },
  {
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
    answer: 'Hello! I\'m the BitcoinPro support assistant. How can I help you today? You can ask me about buying Bitcoin, withdrawals, KYC, fees, security, or any other account-related questions.',
  },
  {
    keywords: ['thank', 'thanks', 'appreciate'],
    answer: 'You\'re welcome! If you need anything else, just ask. For account-specific issues, I can escalate to our human support team via Telegram.',
  },
];

export const ESCALATION_MESSAGE = "I've escalated your question to our support team. They will respond shortly via Telegram.";

export function matchSupportAnswer(userMessage: string): { answer: string; escalate: boolean } {
  const normalized = userMessage.toLowerCase().replace(/[^\w\s]/g, '').trim();

  for (const article of SUPPORT_ARTICLES) {
    for (const keyword of article.keywords) {
      if (normalized.includes(keyword.toLowerCase())) {
        return {
          answer: article.answer,
          escalate: article.escalate || false,
        };
      }
    }
  }

  return {
    answer: "I'm not sure I understand. I can help with: buying Bitcoin, withdrawals, KYC verification, contracts, fees, 2FA, and security. Or I can escalate this to our support team.",
    escalate: true,
  };
}