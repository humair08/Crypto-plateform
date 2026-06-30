'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  Table,
  Progress,
  ProgressRing,
} from '@/components/ui';
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { useRequireAuth } from '@/components/ProtectedRoute';

interface StatCard {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
}

interface RecentBet {
  id: string;
  event: string;
  amount: number;
  odds: number;
  status: 'won' | 'lost' | 'pending';
  createdAt: string;
}

export default function DashboardPage() {
  const { loading } = useRequireAuth();
  const [stats, setStats] = useState<StatCard[]>([]);
  const [recentBets, setRecentBets] = useState<RecentBet[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setStats([
        {
          title: 'Balance',
          value: '$5,240.50',
          icon: <DollarSign size={20} />,
          trend: 12.5,
        },
        {
          title: 'Total Bets',
          value: '347',
          icon: <Activity size={20} />,
          trend: 8.2,
        },
        {
          title: 'Win Rate',
          value: '62.3%',
          icon: <TrendingUp size={20} />,
          trend: 3.1,
        },
        {
          title: 'Active Bets',
          value: '12',
          icon: <Users size={20} />,
          trend: -2.4,
        },
      ]);

      setRecentBets([
        {
          id: '1',
          event: 'Manchester vs Liverpool',
          amount: 100,
          odds: 2.5,
          status: 'won',
          createdAt: '2024-01-15',
        },
        {
          id: '2',
          event: 'Real Madrid vs Barcelona',
          amount: 50,
          odds: 1.8,
          status: 'pending',
          createdAt: '2024-01-14',
        },
        {
          id: '3',
          event: 'Arsenal vs Chelsea',
          amount: 75,
          odds: 2.1,
          status: 'lost',
          createdAt: '2024-01-13',
        },
      ]);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white/60">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        <motion.div variants={itemVariants}>
          <Heading level={1} className="text-white">
            <span className="text-[#00FF87]">Teuzux</span> Dashboard
          </Heading>
          <Text className="text-slate-400 mt-2">
            Luxury crypto analytics for your live bets and portfolio.
          </Text>
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="bg-[#131722] border border-white/5 shadow-[0_25px_80px_rgba(0,0,0,0.32)]">
                <CardBody className="space-y-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Text className="text-sm text-slate-400">{stat.title}</Text>
                      <Heading level={3} className="text-3xl font-semibold text-[#00FF87] mt-2">
                        {stat.value}
                      </Heading>
                    </div>

                    <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/5 text-[#00FF87] shadow-[0_0_30px_rgba(0,255,135,0.12)]">
                      {stat.icon}
                    </div>
                  </div>

                  {typeof stat.trend === 'number' && (
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold ${
                          stat.trend >= 0
                            ? 'border-[#00FF87]/15 bg-[#00FF87]/10 text-[#00FF87]'
                            : 'border-[#ef4444]/15 bg-[#ef4444]/10 text-[#ef4444]'
                        }`}
                      >
                        {stat.trend >= 0 ? '+' : ''}
                        {stat.trend}%
                      </span>
                      <Text className="text-xs text-slate-500">vs last month</Text>
                    </div>
                  )}
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <motion.div variants={itemVariants}>
            <Card className="bg-[#131722] border border-white/5 shadow-[0_25px_80px_rgba(0,0,0,0.32)]">
              <CardHeader className="border-b border-white/10">
                <Heading level={4} className="text-white">
                  Win Rate
                </Heading>
              </CardHeader>
              <CardBody className="flex flex-col items-center justify-center py-10">
                <div className="relative w-fit h-fit">
                  <ProgressRing value={62.3} max={100} color="accent" size={150} showLabel={false} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-semibold text-white">62%</span>
                    <span className="text-xs uppercase tracking-[0.3em] text-slate-500">Last 30 days</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-[#131722] border border-white/5 shadow-[0_25px_80px_rgba(0,0,0,0.32)]">
              <CardHeader className="border-b border-white/10">
                <Heading level={4} className="text-white">
                  Monthly Progress
                </Heading>
              </CardHeader>
              <CardBody className="space-y-5 py-8">
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <Text>Target</Text>
                  <Text className="text-[#00FF87] font-semibold">52.4%</Text>
                </div>
                <Progress value={52.4} max={100} color="accent" size="lg" showLabel={false} animated={false} />
                <Text className="text-sm text-slate-500">
                  You are on track to beat this month&apos;s crypto staking goals.
                </Text>
              </CardBody>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-[#131722] border border-white/5 shadow-[0_25px_80px_rgba(0,0,0,0.32)]">
              <CardHeader className="border-b border-white/10">
                <Heading level={4} className="text-white">
                  Recent Activity
                </Heading>
              </CardHeader>
              <CardBody className="space-y-4 py-8">
                {[
                  { label: '4 bets placed today', color: '#00FF87' },
                  { label: '2 bets resolved', color: '#7dd3fc' },
                  { label: '$450 earned today', color: '#a3e635' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                  >
                    <span
                      className="inline-flex h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <Text className="text-sm text-slate-300">{item.label}</Text>
                  </div>
                ))}
              </CardBody>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-[#131722] border border-white/5 shadow-[0_25px_80px_rgba(0,0,0,0.32)]">
            <CardHeader className="border-b border-white/10">
              <Heading level={4} className="text-white">
                Recent Bets
              </Heading>
            </CardHeader>
            <CardBody>
              <Table
                columns={[
                  {
                    key: 'event',
                    header: 'Event',
                    render: (value) => <Text className="font-medium text-white">{value}</Text>,
                  },
                  {
                    key: 'amount',
                    header: 'Amount',
                    render: (value) => <Text className="text-slate-300">${typeof value === 'number' ? value.toFixed(2) : value}</Text>,
                  },
                  {
                    key: 'odds',
                    header: 'Odds',
                    render: (value) => <Text className="text-slate-300">{typeof value === 'number' ? value.toFixed(2) : '0.00'}</Text>,
                  },
                  {
                    key: 'status',
                    header: 'Status',
                    render: (value) => (
                      <span
                        className={`inline-flex rounded-md px-2 py-1 text-xs font-semibold ${
                          value === 'won'
                            ? 'bg-[#22c55e]/15 text-[#22c55e]'
                            : value === 'lost'
                            ? 'bg-[#ef4444]/15 text-[#ef4444]'
                            : 'bg-[#fbbf24]/15 text-[#fbbf24]'
                        }`}
                      >
                        {value && typeof value === 'string' ? value.charAt(0).toUpperCase() + value.slice(1) : '—'}
                      </span>
                    ),
                  },
                  {
                    key: 'createdAt',
                    header: 'Date',
                    render: (value) => <Text className="text-slate-500 text-sm">{value}</Text>,
                  },
                ]}
                data={recentBets}
              />
            </CardBody>
          </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
