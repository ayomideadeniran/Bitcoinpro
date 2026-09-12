import type { Metadata } from 'next';
import './globals.css';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0e17' },
  ],
};

export const metadata: Metadata = {
  title: 'BitcoinPro — Trusted Bitcoin Investment & Education Platform',
  description:
    'A modern, secure, beginner-friendly platform designed to help you understand Bitcoin fundamentals, simulate dollar-cost averaging (DCA), and build a disciplined investment strategy without the hype.',
  keywords: [
    'Bitcoin education',
    'Bitcoin DCA calculator',
    'Satoshi calculator',
    'cryptocurrency risk management',
    'learn Bitcoin',
    'Bitcoin investing for beginners',
    'Bitcoin fee transparency',
  ],
  authors: [{ name: 'BitcoinPro Team' }],
};

import Providers from '@/components/Providers';
import FloatingChatWidget from '@/components/FloatingChatWidget';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('theme');
                  if (stored === 'light' || stored === 'dark') {
                    document.documentElement.setAttribute('data-theme', stored);
                  } else {
                    var isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <Providers>
          {children}
          <FloatingChatWidget />
        </Providers>
      </body>
    </html>
  );
}
