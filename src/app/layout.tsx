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
  title: 'Starknet — Institutional Asset Management & Yield Protocol',
  description:
    'Starknet delivers institutional-grade digital asset custody, algorithmic yield generation, and secure asset vaults powered by state-of-the-art cryptographic proofs.',
  keywords: [
    'Starknet',
    'Starknet yield protocol',
    'institutional crypto custody',
    'Bitcoin yield',
    'multi-sig cold storage',
    'digital asset wealth management',
  ],
  authors: [{ name: 'Starknet Foundation & Team' }],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Allura&family=Caveat:wght@600;700&family=Cedarville+Cursive&family=Dancing+Script:wght@600;700&family=Great+Vibes&family=Herr+Von+Muellerhoff&family=Homemade+Apple&family=Italianno&family=Kristi&family=La+Belle+Aurore&family=Marck+Script&family=Meddon&family=MonteCarlo&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400&family=Parisienne&family=Rouge+Script&family=Sacramento&family=Satisfy&family=Yellowtail&display=swap" rel="stylesheet" />
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
