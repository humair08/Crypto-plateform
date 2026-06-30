'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, BarChart2, Activity } from 'lucide-react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { useRequireAuth } from '@/components/ProtectedRoute';
import { Card, CardBody, CardHeader, Heading, Text, Badge, Progress } from '@/components/ui';

interface PnlEntry {
  date: string;
  market: string;
  stake: number;
  pnl: number;
  balance: number;
  result: 'profit' | 'loss' | 'neutral';
}

interface StatCard {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: number;
  helpText?: string;
}

const formatCurrency = (amount: number) => `${amount < 0 ? '-' : ''}$${Math.abs(amount).toFixed(2)}`;

export default function PnlPage() {
  const { loading } = useRequireAuth();
  const [stats, setStats] = useState<StatCard[]>([]);
  const [entries, setEntries] = useState<PnlEntry[]>([]);

  useEffect(() => {
    setStats([
      {
        title: 'Total PnL',
        value: '$12,820.50',
        icon: <BarChart2 size={20} className="text-[#00FF87]" />,
        trend: 18.9,
        helpText: 'Last 30 days',
      },
      {
        title: 'Winning Trades',
        value: '74%',
        icon: <ArrowUpRight size={20} className="text-[#00FF87]" />,
        trend: 7.2,
        helpText: 'Improved since last month',
      },
      {
        title: 'Avg. ROI',
        value: '14.3%',
        icon: <Activity size={20} className="text-[#7dd3fc]" />,
        trend: 2.4,
        helpText: 'On active portfolios',
      },
      {
        title: 'Max Drawdown',
        value: '-$1,120.00',
        icon: <ArrowDownRight size={20} className="text-[#fb7185]" />,
        helpText: 'Worst loss interval',
      },
    ]);

    setEntries([
      {
        date: '2026-06-29',
        market: 'BTC/ETH Long',
        stake: 350,
        pnl: 98.34,
        balance: 12640.5,
        result: 'profit',
      },
      {
        date: '2026-06-28',
        market: 'SOL Pre-Match',
        stake: 220,
        pnl: -43.5,
        balance: 12542.16,
        result: 'loss',
      },
      {
        date: '2026-06-27',
        market: 'MATIC Spread',
        stake: 180,
        pnl: 62.0,
        balance: 12585.66,
        result: 'profit',
      },
      {
        date: '2026-06-26',
        market: 'DOGE Range',
        stake: 110,
        pnl: 18.75,
        balance: 12523.66,
        result: 'profit',
      },
    ]);
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white/60">Loading PnL dashboard...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-8"
      >
        <div className="space-y-3">
          <Heading level={1} className="text-white">
            PnL Ledger
          </Heading>
          <Text className="text-slate-400 max-w-2xl">
            Track your profit and loss across live markets, review trade performance, and monitor risk in real time.
          </Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title} className="bg-[#131722] border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.32)]">
              <CardBody className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <Text className="text-sm text-slate-400">{stat.title}</Text>
                    <Heading level={3} className="text-2xl font-semibold text-white mt-1">
                      {stat.value}
                    </Heading>
                  </div>
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/5 text-white">
                    {stat.icon}
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2 text-sm text-slate-500">
                  <span>{stat.helpText}</span>
                  {typeof stat.trend === 'number' ? (
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${stat.trend >= 0 ? 'bg-[#0f766e]/20 text-[#5eead4]' : 'bg-[#7f1d1d]/20 text-[#fda4af]'}`}>
                      {stat.trend >= 0 ? '+' : ''}
                      {stat.trend}%
                    </span>
                  ) : null}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        <Card className="bg-[#131722] border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.32)]">
          <CardHeader className="border-b border-white/10">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <Heading level={3} className="text-white">
                  Latest PnL Entries
                </Heading>
                <Text className="text-slate-400 text-sm">Recent ledger updates and balance changes.</Text>
              </div>
              <Badge className="bg-[#0f766e]/10 text-[#5eead4] border border-[#5eead4]/15">Auto refreshed daily</Badge>
            </div>
          </CardHeader>
          <CardBody className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0 text-left text-sm text-slate-300">
              <thead>
                <tr className="bg-white/5 text-slate-400">
                  <th className="px-5 py-4 rounded-tl-xl">Date</th>
                  <th className="px-5 py-4">Market</th>
                  <th className="px-5 py-4">Stake</th>
                  <th className="px-5 py-4">PnL</th>
                  <th className="px-5 py-4">Balance</th>
                  <th className="px-5 py-4 rounded-tr-xl">Status</th>
                </tr>
              </thead>
              <tbody>
                {(entries || []).map((entry) => (
                  <tr key={`${entry.date}-${entry.market}`} className="border-t border-white/5">
                    <td className="px-5 py-4 text-white">{entry.date}</td>
                    <td className="px-5 py-4">{entry.market}</td>
                    <td className="px-5 py-4">{formatCurrency(entry.stake)}</td>
                    <td className={`px-5 py-4 font-semibold ${entry.pnl >= 0 ? 'text-[#00FF87]' : 'text-[#fb7185]'}`}>
                      {formatCurrency(entry.pnl)}
                    </td>
                    <td className="px-5 py-4">{formatCurrency(entry.balance)}</td>
                    <td className="px-5 py-4">
                      <Badge className={`rounded-full px-3 py-1 text-xs ${entry.result === 'profit' ? 'bg-[#0f766e]/15 text-[#5eead4]' : entry.result === 'loss' ? 'bg-[#7f1d1d]/15 text-[#fda4af]' : 'bg-white/5 text-slate-300'}`}>
                        {entry.result}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
}
