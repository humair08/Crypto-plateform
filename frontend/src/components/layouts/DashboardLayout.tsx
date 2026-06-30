'use client';

import React, { useState } from 'react';
import { Navbar, Sidebar, Avatar, Dropdown } from '@/components/ui';
import { useAuthStore } from '@/store/authStore';
import { useSearchStore } from '@/store/searchStore';
import { useRouter } from 'next/navigation';
import {
  LogOut,
  Settings,
  User,
  Bell,
  Search,
  Spade,
  Home,
  Target,
  CreditCard,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [sidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const sidebarItems = [
    {
      label: 'Dashboard',
      icon: <Home size={18} />,
      href: '/dashboard',
      active: true,
      children: [
        { label: 'Overview Analytics', href: '/dashboard/overview-analytics' },
        { label: 'PnL Ledger Statistics', href: '/dashboard/pnl' },
        { label: 'Performance Settings', href: '/dashboard/settings' },
      ],
    },
    {
      label: 'Bets',
      icon: <Target size={18} />,
      href: '/dashboard/bets',
      children: [
        { label: 'Active Slips', href: '/dashboard/bets/slips' },
        { label: 'Settled Betting History', href: '/dashboard/bets/history' },
        { label: 'Live Sportsbook Rules', href: '/dashboard/bets/rules' },
      ],
    },
    {
      label: 'Wallet',
      icon: <CreditCard size={18} />,
      href: '/dashboard/wallet',
      children: [
        { label: 'Crypto Deposits', href: '/dashboard/wallet/deposit' },
        { label: 'Withdraw Liquidity', href: '/dashboard/wallet/withdraw' },
        { label: 'Transaction History Logs', href: '/dashboard/wallet/transactions' },
      ],
    },
    {
      label: 'Account',
      children: [
        { label: 'Profile', href: '/dashboard/account/profile' },
        { label: 'Settings', href: '/dashboard/account/settings' },
        { label: 'Security', href: '/dashboard/account/security' },
      ],
    },
  ];

  const dropdownItems = [
    {
      label: 'Profile',
      icon: <User size={18} />,
      onClick: () => router.push('/dashboard/account/profile'),
    },
    {
      label: 'Settings',
      icon: <Settings size={18} />,
      onClick: () => router.push('/dashboard/account/settings'),
    },
    {
      label: 'Sign Out',
      icon: <LogOut size={18} />,
      onClick: handleLogout,
      danger: true,
    },
  ];

  const searchQuery = useSearchStore((s) => s.searchQuery);
  const setSearchQuery = useSearchStore((s) => s.setSearchQuery);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#02040f] text-white">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-72 bg-[#00e0ff]/5 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 top-20 h-96 w-96 rounded-full bg-[#8a5cff]/10 blur-[160px]" />
      <Navbar
        logo={
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#07101f]/80 px-4 py-2 shadow-glass">
            <Spade className="h-5 w-5 text-accent" />
            <span className="text-lg font-semibold tracking-tight text-white">Teuzux</span>
          </div>
        }
        items={[
          {
            label: 'Dashboard',
            href: '/dashboard',
            children: [
              { label: 'Overview Analytics', href: '/dashboard/analytics' },
              { label: 'PnL Ledger Statistics', href: '/dashboard/pnl' },
              { label: 'Performance Settings', href: '/dashboard/settings' },
            ],
          },
          {
            label: 'Bets',
            href: '/dashboard/bets',
            children: [
              { label: 'Active Slips', href: '/dashboard/bets/slips' },
              { label: 'Settled Betting History', href: '/dashboard/bets/history' },
              { label: 'Live Sportsbook Rules', href: '/dashboard/bets/rules' },
            ],
          },
          {
            label: 'Wallet',
            href: '/dashboard/wallet',
            children: [
              { label: 'Crypto Deposits', href: '/dashboard/wallet/deposit' },
              { label: 'Withdraw Liquidity', href: '/dashboard/wallet/withdraw' },
              { label: 'Transaction History Logs', href: '/dashboard/wallet/transactions' },
            ],
          },
          {
            label: 'Events',
            href: '/dashboard/events',
            children: [
              { label: 'Live Pre-Match', href: '/dashboard/events/pre-match' },
              { label: 'In-Play Streams', href: '/dashboard/events/live' },
              { label: 'Championship Hubs', href: '/dashboard/events/championships' },
            ],
          },
        ]}
        onNavigate={(href) => router.push(href)}
        rightContent={
          <div className="hidden md:flex items-center gap-3">
            <div className="hidden xl:flex items-center gap-2 rounded-xl bg-[#131722] border border-white/[0.05] px-3 py-1.5">
              <Search size={18} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search markets"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-white placeholder-white/40 w-44"
              />
            </div>

            <button className="relative rounded-full bg-white/5 p-2 text-white/80 transition hover:bg-white/10">
              <Bell size={20} />
              <div className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_10px_rgba(0,224,255,0.45)]" />
            </button>

            <Dropdown
              trigger={
                <div className="px-4 py-2 bg-[#131722]/60 hover:bg-[#131722] border border-white/[0.05] rounded-full flex items-center gap-3 transition-all cursor-pointer">
                  <div className="flex items-center">
                    <Avatar
                      firstName={user?.firstName}
                      lastName={user?.lastName}
                      size="sm"
                      status="online"
                    />
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-sm font-medium text-white">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-[#00FF87]/70 text-xs font-semibold uppercase tracking-wider mt-0.5">VIP Tier 1</p>
                  </div>
                </div>
              }
              items={dropdownItems}
              align="right"
            />
          </div>
        }
      />

      <div className="flex pt-4">
        <Sidebar
          items={sidebarItems}
          onNavigate={(href) => router.push(href)}
          initialCollapsed={!sidebarOpen}
        />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
