import { EducationArticle, FaqItem, QuizQuestion } from './types';

export const EDUCATION_ARTICLES: EducationArticle[] = [
  {
    id: 'what-is-bitcoin',
    category: 'fundamentals',
    title: 'What is Bitcoin & Why Was It Created?',
    readTime: '3 min read',
    summary: 'Bitcoin is the world’s first decentralized digital currency, invented in 2008 by Satoshi Nakamoto to enable borderless peer-to-peer value transfer without central bank intermediaries.',
    keyPoints: [
      'Strictly capped supply of exactly 21 Million Bitcoins — no government can inflate it.',
      'Decentralized ledger run by tens of thousands of independent nodes across the globe.',
      'Divisible down to 8 decimal places (each unit is called a Satoshi).',
      'Immutable transaction records that cannot be forged or arbitrarily reversed.'
    ],
    riskTip: 'Because Bitcoin is not backed by a central government or corporation, its market value is determined purely by global supply and demand.'
  },
  {
    id: 'wallets-and-keys',
    category: 'security',
    title: 'Wallets, Public Addresses & Private Keys',
    readTime: '4 min read',
    summary: 'Demystifying the core security concepts: a Bitcoin wallet does not store coins physically; it securely holds your cryptographic keys that prove ownership on the blockchain.',
    keyPoints: [
      'Public Address: Like an email address or IBAN. Safe to share with anyone who is sending you Bitcoin.',
      'Private Key (or 12/24-word Seed Phrase): Like your master vault key. Anyone with access can spend your funds forever.',
      'Cold Storage (Hardware Wallet): Generates and isolates your private keys offline away from internet threats.',
      'The Golden Rule: Never photograph, upload, or paste your seed phrase anywhere online.'
    ],
    riskTip: 'There is no "Forgot Password" button on the Bitcoin blockchain. If you lose your self-custody seed phrase, your funds are permanently unrecoverable.'
  },
  {
    id: 'dca-strategy',
    category: 'investing',
    title: 'Dollar-Cost Averaging (DCA) vs. Market Timing',
    readTime: '4 min read',
    summary: 'Why disciplined recurring investing beats emotional market timing for 95% of retail investors facing Bitcoin’s historical volatility.',
    keyPoints: [
      'DCA involves investing a fixed dollar amount at regular intervals (e.g. $50 every Monday), regardless of price.',
      'When price drops, your $50 buys more satoshis; when price climbs, you buy fewer.',
      'Removes the stress of trying to time "the exact bottom" or panicking during market corrections.',
      'Encourages a multi-year horizon rather than short-term speculative anxiety.'
    ],
    riskTip: 'DCA does not eliminate risk or prevent paper losses during extended bear markets. Never invest capital needed for living expenses or emergency reserves.'
  },
  {
    id: 'understanding-volatility',
    category: 'fundamentals',
    title: 'Bitcoin Volatility & Market Cycles',
    readTime: '5 min read',
    summary: 'Understanding why Bitcoin experiences 50%+ drawdowns, the 4-year halving cycle, and how to maintain emotional discipline.',
    keyPoints: [
      'Bitcoin is a nascent asset class transitioning into a global store of value, which causes sharp price discovery phases.',
      'Historically, Bitcoin has experienced multiple drawdowns exceeding 70% to 80% during multi-year bear cycles.',
      'The Halving occurs every 210,000 blocks (roughly every 4 years), cutting newly minted block rewards in half.',
      'Long-term perspective: Historically, holding for 4+ year rolling windows has substantially rewarded patient savers.'
    ],
    riskTip: 'Past performance does not guarantee future results. Sharp drawdowns can last months or years.'
  },
  {
    id: 'phishing-and-scams',
    category: 'security',
    title: 'Spotting Scams, Phishing & Fake Promises',
    readTime: '4 min read',
    summary: 'How to protect yourself against the most prevalent crypto scams and social engineering tactics.',
    keyPoints: [
      'Legitimate platforms will NEVER contact you asking for your seed phrase, 2FA code, or password.',
      'Be wary of YouTube/X "crypto giveaways" claiming to double any Bitcoin you send them.',
      'Watch out for fake sponsored ads on search engines with misspelled domain names.',
      'Always verify URLs and enable App-based Two-Factor Authentication (Authenticator app, not SMS).'
    ],
    riskTip: 'Any platform or person promising "guaranteed returns", "passive daily profit", or "zero-risk yield" is an active fraud.'
  },
  {
    id: 'fees-and-mempool',
    category: 'investing',
    title: 'Understanding Network Fees vs. Platform Fees',
    readTime: '3 min read',
    summary: 'How Bitcoin network transaction fees work, what the mempool is, and how to avoid overpaying.',
    keyPoints: [
      'Platform Fee: The transparent service cost charged by an exchange or on-ramp to broker your trade.',
      'Network Miner Fee: Paid directly to Bitcoin miners to prioritize your transaction in the next block.',
      'Mempool: The queue of pending unconfirmed transactions waiting to be included in a block.',
      'Fees are based on transaction data size in bytes (satoshis per virtual byte, sat/vB), NOT the dollar amount sent.'
    ],
    riskTip: 'Sending $10 of Bitcoin on-chain during high congestion can cost as much in miner fees as sending $1,000,000.'
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'What is the maximum total number of Bitcoins that will ever exist?',
    options: [
      'There is no limit; central banks print more as needed',
      'Exactly 21 Million Bitcoins',
      '100 Million Bitcoins',
      'It increases by 10% every year'
    ],
    correctIndex: 1,
    explanation: 'Bitcoin has a mathematically capped total supply of 21,000,000 BTC written directly into its protocol, creating guaranteed digital scarcity.'
  },
  {
    id: 2,
    question: 'If a customer support representative asks for your 12-word seed phrase to "verify your account", what should you do?',
    options: [
      'Give it to them immediately so they can unlock your account',
      'Send only the first 6 words',
      'Never give it to them under any circumstance — it is a scam attempt',
      'Email it as an encrypted screenshot'
    ],
    correctIndex: 2,
    explanation: 'No legitimate customer support team or platform will EVER ask for your seed phrase. Anyone asking for your seed phrase is attempting to steal your funds.'
  },
  {
    id: 3,
    question: 'How does Dollar-Cost Averaging (DCA) help manage investment risk?',
    options: [
      'It guarantees you will make a 100% profit within one month',
      'It eliminates all investment risk completely',
      'It smooths your average purchase price over time by investing fixed amounts regularly regardless of price',
      'It automatically predicts the exact market peak'
    ],
    correctIndex: 2,
    explanation: 'DCA does not eliminate risk, but it removes emotional market timing by spreading purchases evenly across market highs and lows, averaging out volatility.'
  }
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'do-i-have-to-buy-whole-btc',
    category: 'basics',
    question: 'Do I have to buy an entire Bitcoin?',
    answer: 'No! You can buy small fractions of a Bitcoin. Each Bitcoin is divisible into 100,000,000 smaller units called Satoshis (or "sats"). You can get started with as little as $10 or $25.'
  },
  {
    id: 'can-bitcoin-be-hacked',
    category: 'security',
    question: 'Can the Bitcoin network be hacked?',
    answer: 'The core Bitcoin blockchain has operated continuously for over 15 years with virtually 100% uptime, secured by massive decentralized computational power (Proof of Work). Vulnerabilities typically happen at individual user endpoints (weak passwords, phishing, device malware) or unregulated third-party exchanges, rather than the Bitcoin network itself.'
  },
  {
    id: 'how-to-keep-bitcoin-safe',
    category: 'security',
    question: 'How do I keep my Bitcoin safe?',
    answer: 'Always use unique, strong passwords combined with App-based Two-Factor Authentication (e.g. Google Authenticator or hardware security keys). For significant long-term savings, consider withdrawing to a dedicated self-custody hardware wallet (cold storage) where you hold your own private keys.'
  },
  {
    id: 'what-if-price-drops',
    category: 'investing',
    question: 'What happens if the Bitcoin price drops significantly?',
    answer: 'Bitcoin is notoriously volatile and can experience 20% to 50%+ downward fluctuations over short-to-medium periods. You still own the exact same number of Bitcoins/Satoshis, but their fiat value fluctuates. This is why you should only invest money you do not need for short-term expenses and adopt a multi-year time horizon.'
  },
  {
    id: 'are-returns-guaranteed',
    category: 'investing',
    question: 'Are profits or returns guaranteed?',
    answer: 'Absolutely not. Any service, individual, or website promising guaranteed profits or fixed returns in Bitcoin is dishonest or fraudulent. Bitcoin is a market-driven asset subject to capital loss.'
  },
  {
    id: 'how-do-fees-work',
    category: 'fees',
    question: 'What fees will I pay when buying or transferring Bitcoin?',
    answer: 'There are two potential fees: (1) The platform/provider execution fee (clearly displayed before you confirm any trade), and (2) The Bitcoin network miner fee (paid to miners on the blockchain to process your transaction). We prioritize 100% fee transparency with zero hidden spreads.'
  }
];
