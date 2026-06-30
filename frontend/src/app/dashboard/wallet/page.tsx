'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  Button,
  Badge,
} from '@/components/ui';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { useRequireAuth } from '@/components/ProtectedRoute';
import { getWalletBalance } from '@/services/walletService';
import { ArrowDownLeft, ArrowUpRight, Eye, EyeOff, CreditCard } from 'lucide-react';

interface RecentTransaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'bet' | 'win';
  description: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending';
}

export default function WalletPage() {
  const router = useRouter();
  const { loading } = useRequireAuth();

  const [balanceVisible, setBalanceVisible] = useState(true);
  const [recentTransactions, setRecentTransactions] = useState<RecentTransaction[]>([]);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [currency, setCurrency] = useState('USDT');
  const [walletAddress, setWalletAddress] = useState('');

  const totalDeposited = 5500;
  const totalWithdrawn = 259.50;
  const totalWinnings = 1250;

  useEffect(() => {
    const loadWallet = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        const response = await getWalletBalance(token);
        if (response.success && response.data) {
          setAvailableBalance(parseFloat(response.data.balance));
          setCurrency(response.data.currency);
          if (response.data.address) {
            setWalletAddress(response.data.address);
          }
        }
      } catch (error) {
        console.error('Unable to load wallet balance:', error);
      }
    };

    loadWallet();
  }, []);

  useEffect(() => {
    // Mock recent transactions
    setRecentTransactions([
      {
        id: '1',
        type: 'deposit',
        description: 'Deposit via Credit Card',
        amount: 500,
        date: '2024-02-15',
        status: 'completed',
      },
      {
        id: '2',
        type: 'bet',
        description: 'Bet on Manchester vs Liverpool',
        amount: -100,
        date: '2024-02-14',
        status: 'completed',
      },
      {
        id: '3',
        type: 'win',
        description: 'Bet Won - Manchester vs Liverpool',
        amount: 150,
        date: '2024-02-14',
        status: 'completed',
      },
      {
        id: '4',
        type: 'withdrawal',
        description: 'Withdrawal to Bank Account',
        amount: -250,
        date: '2024-02-13',
        status: 'completed',
      },
      {
        id: '5',
        type: 'bet',
        description: 'Bet on Real Madrid vs Barcelona',
        amount: -75,
        date: '2024-02-13',
        status: 'completed',
      },
    ]);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
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
        {/* Header */}
        <motion.div variants={itemVariants}>
          <Heading level={1} className="text-white">
            Wallet
          </Heading>
          <Text className="text-white/60 mt-2">
            Your funds, deposits, and withdrawals in one place
          </Text>
        </motion.div>

        <motion.div variants={itemVariants} className="grid gap-6 xl:grid-cols-[1.55fr_0.85fr]">
          <div className="space-y-6">
            <Card className="overflow-hidden border border-white/10 bg-[#08101d]/90 shadow-glass">
              <CardBody className="relative overflow-hidden p-8">
                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-accent/20 to-[#8a5cff]/10 blur-3xl" />
                <div className="relative">
                  <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                    <div>
                      <Text className="text-white/50 uppercase tracking-[0.3em] text-xs">
                        Total Balance
                      </Text>
                      <div className="mt-4 flex items-center gap-4">
                        <Heading level={1} className="text-[3rem] font-black tracking-tight text-white">
                          {balanceVisible ? `$${availableBalance.toFixed(2)}` : '••••••'}
                        </Heading>
                        <button
                          onClick={() => setBalanceVisible(!balanceVisible)}
                          className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70 hover:bg-white/10 transition"
                        >
                          {balanceVisible ? (
                            <EyeOff size={20} className="text-white/70" />
                          ) : (
                            <Eye size={20} className="text-white/70" />
                          )}
                        </button>
                      </div>
                      <Text className="text-white/60 mt-3">
                        {currency} wallet balance available for bets and withdrawals.
                      </Text>
                    </div>

                    <div className="flex flex-wrap md:flex-nowrap gap-4 items-center">
                      {[
                        { label: 'Deposited', value: `$${totalDeposited}`, tone: 'success' },
                        { label: 'Withdrawn', value: `$${totalWithdrawn}`, tone: 'warning' },
                        { label: 'Winnings', value: `$${totalWinnings}`, tone: 'accent' },
                      ].map((stat) => (
                        <div
                          key={stat.label}
                          className="px-4 py-3 rounded-xl min-w-[110px] bg-white/5 border border-white/[0.03] flex flex-col items-start"
                        >
                          <Text className="truncate text-xs tracking-wider uppercase text-white/50 w-full">
                            {stat.label}
                          </Text>
                          <Text
                            className={`mt-2 text-md font-semibold w-full ${
                              stat.tone === 'success'
                                ? 'text-success'
                                : stat.tone === 'warning'
                                ? 'text-warning'
                                : 'text-accent'
                            } truncate`}
                          >
                            {stat.value}
                          </Text>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="border border-white/10 bg-[#08101d]/90 shadow-glass">
              <CardHeader>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <Heading level={3} className="text-white">
                      Quick Actions
                    </Heading>
                    <Text className="text-white/60 mt-1">
                      Deposit or withdraw instantly with your preferred method.
                    </Text>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Button
                  variant="primary"
                  size="lg"
                  icon={<ArrowDownLeft size={20} />}
                  fullWidth
                  onClick={() => router.push('/dashboard/wallet/deposit')}
                >
                  Deposit
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  icon={<ArrowUpRight size={20} />}
                  fullWidth
                  onClick={() => router.push('/dashboard/wallet/withdraw')}
                >
                  Withdraw
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  icon={<CreditCard size={20} />}
                  fullWidth
                  onClick={() => router.push('/dashboard/wallet/methods')}
                >
                  Methods
                </Button>
              </CardBody>
            </Card>

            <Card className="border border-white/10 bg-[#08101d]/90 shadow-glass">
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <Heading level={4} className="text-white">
                      Recent Activity
                    </Heading>
                    <Text className="text-white/60 mt-1">
                      Latest wallet transactions and status updates
                    </Text>
                  </div>
                  <Button
                    variant="ghost"
                    icon={<ArrowUpRight size={18} />}
                    onClick={() => router.push('/dashboard/wallet/transactions')}
                  >
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardBody className="overflow-x-auto p-0">
                <div className="min-w-full">
                  <table className="min-w-full border-separate border-spacing-0 text-sm">
                    <thead className="bg-[#09101c]">
                      <tr>
                        {['Date', 'Type', 'Description', 'Amount', 'Status'].map((title) => (
                          <th
                            key={title}
                            className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-white/50"
                          >
                            {title}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {recentTransactions.map((transaction) => (
                        <tr key={transaction.id} className="border-t border-white/10 last:border-b-0">
                          <td className="px-4 py-4 text-white/80">{transaction.date}</td>
                          <td className="px-4 py-4 text-white/70">{transaction.type}</td>
                          <td className="px-4 py-4 text-white/70">{transaction.description}</td>
                          <td className="px-4 py-4 text-white/80">{transaction.amount < 0 ? '-' : ''}${Math.abs(transaction.amount).toFixed(2)}</td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              transaction.status === 'completed' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                            }`}>
                              {transaction.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardBody>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border border-white/10 bg-[#08101d]/90 shadow-glass">
              <CardBody className="space-y-6 p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <Text className="text-white/50 uppercase tracking-[0.3em] text-xs">
                      Wallet Address
                    </Text>
                    <Text className="mt-3 text-white font-semibold break-all">
                      {walletAddress || 'No wallet address assigned yet'}
                    </Text>
                  </div>
                  <div className="rounded-3xl bg-[#0e1828] px-4 py-3 text-xs uppercase tracking-[0.25em] text-white/70">
                    {currency}
                  </div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-[#0b1322]/80 p-4 text-sm text-white/70">
                  Use this address for crypto deposits. Always double-check before sending funds.
                </div>
              </CardBody>
            </Card>

            <Card className="border border-white/10 bg-[#08101d]/90 shadow-glass">
              <CardBody className="space-y-4 p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <Text className="text-white/50 uppercase tracking-[0.3em] text-xs">
                      Wallet Summary
                    </Text>
                    <Heading level={4} className="text-white mt-2">
                      Balance breakdown
                    </Heading>
                  </div>
                  <Badge color="accent" variant="soft">
                    Live
                  </Badge>
                </div>

                <div className="grid gap-3">
                  <div className="flex items-center justify-between rounded-3xl bg-[#0d1524]/80 px-4 py-3">
                    <Text className="text-white/70">Available</Text>
                    <Text className="text-white font-semibold">${availableBalance.toFixed(2)}</Text>
                  </div>
                  <div className="flex items-center justify-between rounded-3xl bg-[#0d1524]/80 px-4 py-3">
                    <Text className="text-white/70">Pending</Text>
                    <Text className="text-warning font-semibold">$120.00</Text>
                  </div>
                  <div className="flex items-center justify-between rounded-3xl bg-[#0d1524]/80 px-4 py-3">
                    <Text className="text-white/70">History</Text>
                    <Text className="text-accent font-semibold">Updated 2 mins ago</Text>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
