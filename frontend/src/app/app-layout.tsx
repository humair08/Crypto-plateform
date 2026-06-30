import React from 'react';
import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';

const font = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Betting Platform Dashboard',
  description: 'Professional betting platform with real-time odds and analytics',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

/**
 * Root app layout wrapper
 * Note: Toast component is imported in specific pages where needed
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={font.className}>
      <body className="bg-[#02040f] text-white">{children}</body>
    </html>
  );
}
