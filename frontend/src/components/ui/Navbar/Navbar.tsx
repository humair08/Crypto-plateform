'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronDown, Menu, X } from 'lucide-react';

interface NavbarProps {
  logo?: React.ReactNode;
  items?: Array<{
    label: string;
    href: string;
    children?: Array<{ label: string; href: string }>;
  }>;
  onNavigate?: (href: string) => void;
  rightContent?: React.ReactNode;
}

const defaultNavItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    children: [
      { label: 'Overview Analytics', href: '/dashboard/overview-analytics' },
      { label: 'PnL Ledger', href: '/dashboard/pnl' },
      { label: 'Settings', href: '/dashboard/settings' },
    ],
  },
  {
    label: 'Bets',
    href: '/dashboard/bets',
    children: [
      { label: 'Active Slips', href: '/dashboard/bets/active-slips' },
      { label: 'Settled History', href: '/dashboard/bets/settled-history' },
      { label: 'Rules', href: '/dashboard/bets/rules' },
    ],
  },
  {
    label: 'Wallet',
    href: '/dashboard/wallet',
    children: [
      { label: 'Deposits', href: '/dashboard/wallet/deposits' },
      { label: 'Withdrawals', href: '/dashboard/wallet/withdrawals' },
      { label: 'Logs', href: '/dashboard/wallet/logs' },
    ],
  },
  {
    label: 'Events',
    href: '/dashboard/events',
    children: [
      { label: 'Live', href: '/dashboard/events/live' },
      { label: 'In-Play', href: '/dashboard/events/in-play' },
      { label: 'Championships', href: '/dashboard/events/championships' },
    ],
  },
];

export function Navbar({
  logo = 'Betting Platform',
  items = [],
  onNavigate,
  rightContent,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const navItems = items.length > 0 ? items : defaultNavItems;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <nav
        ref={navRef}
        className="sticky top-0 z-50 backdrop-blur-md bg-[#0B0E14]/80 border-b border-white/[0.04]"
      >
        <div className="w-full px-6 md:px-10">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Left Group: Logo */}
            <div className="flex-shrink-0 flex items-center gap-3">
              {typeof logo === 'string' ? (
                <h1 className="text-xl font-bold tracking-tight text-white">{logo}</h1>
              ) : (
                logo
              )}
            </div>

            {/* Center Group: Desktop Navigation */}
            <div className="hidden md:flex flex-1 justify-center">
              <div className="flex items-center gap-8 justify-center mx-auto">
                {navItems.map((item) => {
                  const hasChildren = !!item.children?.length;
                  const isActive = activeDropdown === item.label;

                  return (
                    <div key={item.href} className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          if (hasChildren) {
                            setActiveDropdown((prev) => (prev === item.label ? null : item.label));
                            return;
                          }

                          onNavigate?.(item.href);
                          setActiveDropdown(null);
                        }}
                        className="group px-3 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-colors flex items-center gap-1.5"
                      >
                        <span>{item.label}</span>
                        {hasChildren && (
                          <ChevronDown
                            size={14}
                            className={`transition-transform ${isActive ? 'rotate-180' : ''}`}
                          />
                        )}
                      </button>

                      {hasChildren && isActive && (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-[#131722] border border-white/[0.06] rounded-xl p-2 shadow-2xl backdrop-blur-xl z-50 transition-all duration-200 ease-out">
                          {(item.children || []).map((child) => (
                            <Link key={child.href} href={child.href} passHref>
                              <button
                                type="button"
                                onClick={() => {
                                  onNavigate?.(child.href);
                                  setActiveDropdown(null);
                                }}
                                className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-white/[0.04] hover:text-[#00FF87] transition-all flex items-center gap-2"
                              >
                                <span className="h-1.5 w-1.5 rounded-full bg-[#00FF87]/70" />
                                {child.label}
                              </button>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Group: Controls */}
            <div className="hidden md:flex items-center gap-4">
              {rightContent}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white/70 hover:text-white"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden border-t border-white/10 bg-[#070b17]/95"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <div key={item.href} className="space-y-1">
                  <Link href={item.href} passHref>
                    <button
                      type="button"
                      onClick={() => {
                        onNavigate?.(item.href);
                        setIsOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                    >
                      {item.label}
                    </button>
                  </Link>
                  {(item.children || []).map((child) => (
                    <Link key={child.href} href={child.href} passHref>
                      <button
                        type="button"
                        onClick={() => {
                          onNavigate?.(child.href);
                          setIsOpen(false);
                        }}
                        className="ml-3 block w-[calc(100%-0.75rem)] text-left px-3 py-2 text-sm text-slate-400 hover:text-[#00FF87] hover:bg-white/5 rounded-lg transition-colors"
                      >
                        {child.label}
                      </button>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </nav>
    </>
  );
}
