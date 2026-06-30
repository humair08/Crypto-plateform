import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import '../styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Betting Platform - Premium Dark UI',
  description: 'Enterprise-grade betting platform with premium dark theme and real-time updates',
  // viewport moved to a dedicated export below to avoid Unsupported metadata viewport warnings
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  themeColor: '#0B0E14',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <meta charSet="utf-8" />
      </head>
      <body className="text-white antialiased">
        <div className="relative min-h-screen bg-[#0B0E14]">
          <div
            aria-hidden
            className="fixed inset-0 pointer-events-none opacity-[0.12] mix-blend-luminosity bg-cover bg-center"
            style={{ backgroundImage: "url('/bg-crypto.jpg.png')" }}
          />

          {children}
        </div>
      </body>
    </html>
  );
}
