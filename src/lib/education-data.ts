import { EducationArticle, FaqItem, QuizQuestion } from './types';

export const EDUCATION_ARTICLES: EducationArticle[] = [
  {
    id: 'bitcoin-on-starknet',
    category: 'fundamentals',
    title: 'Scaling Bitcoin Yield With Starknet ZK-Rollups',
    readTime: '3 min read',
    summary: 'How Layer-2 validity rollups (STARKs) bring high-speed transactions, sub-cent gas fees, and automated smart vault yields to the Bitcoin economy.',
    keyPoints: [
      'STARK Proofs: Zero-Knowledge proofs verify thousands of off-chain transactions in a single batch.',
      'Massive Cost Reduction: Saves over 95% on gas fees compared to base-layer Bitcoin transfers.',
      'Cairo Smart Contracts: Enables programmatic non-custodial yield vaults, arbitrage, and multi-sig security.',
      'Sovereignty Intact: Assets inherit robust cryptographic guarantees while enjoying modern DeFi efficiency.'
    ],
    riskTip: 'Layer-2 protocols interact with smart contracts. Always ensure you allocate via audited, non-custodial vaults.'
  },
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
    id: 'minimum-investment',
    category: 'investing',
    question: 'What is the minimum investment amount required?',
    answer: 'Our Private Starter Allocation Tier begins at just $200 (ranging up to $1,000), ensuring institutional-grade ZK-vault yields are accessible without massive initial capital. Intermediate tiers scale from $1,000 to $50,000, while Institutional Custody and White-Glove tiers support $50,000 to $250,000+.'
  },
  {
    id: 'bitcoin-plus-starknet',
    category: 'basics',
    question: 'Why does this protocol unite Bitcoin with Starknet?',
    answer: 'Bitcoin is the world’s pristine monetary reserve and ultimate store of value, but base-layer transfers can be slow and costly. Starknet Layer-2 brings validity zero-knowledge rollups (STARKs), sub-second execution, and automated Cairo smart vaults that eliminate 95%+ of gas fees while preserving cryptographic security.'
  },
  {
    id: 'payment-methods',
    category: 'fees',
    question: 'What payment and funding methods are accepted?',
    answer: 'We support seamless multi-asset funding: USDT & USDC Stablecoins (TRC20, ERC20, Polygon), Bitcoin (BTC on-chain & Lightning), Ethereum (ETH), Starknet (STRK & L2 ETH), direct Bank Wire (SWIFT / SEPA), and Credit/Debit Card on-ramps with 0% platform deposit surcharges.'
  },
  {
    id: 'why-grand-opening-wishlist',
    category: 'basics',
    question: 'Why is there a Grand Opening VIP Wishlist instead of direct login?',
    answer: 'To protect protocol stability and vault liquidity prior to full public release, access is strictly reserved for whitelisted members. Submitting your profile via the VIP Wishlist (/register) guarantees your tier capacity, waives early management fees, and queues your account for priority onboarding.'
  },
  {
    id: 'are-yields-from-mining',
    category: 'investing',
    question: 'Are returns generated from Proof-of-Work hardware mining?',
    answer: 'No. We do not rely on physical mining rigs or hashrate contracts. All earnings are generated through Starknet Layer-2 algorithmic liquidity vaults, delta-neutral hedging, and cross-venue Bitcoin arbitrage with transparent mathematical verification.'
  },
  {
    id: 'how-do-fees-and-gas-work',
    category: 'fees',
    question: 'What fees will I pay on the platform?',
    answer: 'We maintain radical transparency: zero hidden spreads, a competitive 0.49% platform execution fee, and near-zero Starknet L2 gas fees (fractions of a cent). Unlike traditional brokers who mark up Bitcoin prices by 2%–4%, every price is matched to genuine spot market liquidity.'
  },
  {
    id: 'can-i-withdraw-my-capital',
    category: 'security',
    question: 'How and when can I withdraw my capital and profits?',
    answer: 'Funds reside in multi-sig cold storage and verified Cairo smart contracts. Depending on your selected allocation tier, profits compound daily and can be withdrawn directly to your external Bitcoin, Starknet, or Stablecoin wallet during regular liquidity settlement windows.'
  }
];
