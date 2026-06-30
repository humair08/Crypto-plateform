'use client';

import { useState, useEffect } from 'react';
import { useSearchStore } from '@/store/searchStore';
import { motion } from 'framer-motion';
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  Input,
  Button,
  Badge,
  Table,
  Pagination,
} from '@/components/ui';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { useRequireAuth } from '@/components/ProtectedRoute';
import { useNotificationStore } from '@/store/notificationStore';
import { useAuthStore } from '@/store/authStore';
import { Download, Search, Wallet as WalletIcon, Check } from 'lucide-react';
import {
  initializeSocket,
  joinUserRoom,
  subscribeToWalletUpdates,
  subscribeToBetUpdates,
  unsubscribeWallet,
  unsubscribeBets,
  disconnectSocket,
} from '@/services/socketService';
import { getWalletBalance } from '@/services/walletService';
import { getKYCStatus } from '@/services/kycService';

interface Bet {
  id: string;
  event: string;
  amount: number;
  odds: number;
  potentialWinnings: number;
  status: 'won' | 'lost' | 'pending';
  type: 'moneyline' | 'spread';
  placedDate: string;
  resolvedDate?: string;
  selection: string;
}

export default function BetsHistoryPage() {
  const { loading } = useRequireAuth();
  const { add: addNotification } = useNotificationStore();
  const { user } = useAuthStore();

  const [allBets, setAllBets] = useState<Bet[]>([]);
  const [filteredBets, setFilteredBets] = useState<Bet[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const searchQuery = useSearchStore((s) => s.searchQuery);
  const setSearchQuery = useSearchStore((s) => s.setSearchQuery);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [walletBalance, setWalletBalance] = useState<string>('0.00');
  const [kycStatus, setKycStatus] = useState<'UNSUBMITTED' | 'PENDING' | 'VERIFIED' | 'REJECTED'>('UNSUBMITTED');
  const [socketConnected, setSocketConnected] = useState(false);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredBets.length / itemsPerPage);
  const paginatedBets = filteredBets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Initialize WebSocket and load data
  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem('accessToken');
    if (!token) return;

    // Initialize WebSocket
    initializeSocket(token);
    setSocketConnected(true);

    // Join user room
    joinUserRoom(user.id);

    // Load initial data
    loadBets();
    loadWalletBalance();
    loadKYCStatus();

    // Subscribe to real-time updates
    subscribeToWalletUpdates((data) => {
      setWalletBalance(parseFloat(data.balance).toFixed(2));
      addNotification({
        message: `Wallet updated: +${data.transaction.amount} ${data.currency}`,
        type: 'success',
      });
    });

    subscribeToBetUpdates((data) => {
      setAllBets((prevBets) =>
        prevBets.map((bet) =>
          bet.id === data.betId
            ? {
                ...bet,
                status: data.status,
                potentialWinnings: data.result,
                resolvedDate: new Date().toISOString().split('T')[0],
              }
            : bet
        )
      );

      const resultText = data.status === 'won' ? `Won $${data.result}` : `Lost $${data.amount}`;
      addNotification({
        message: `Bet result: ${resultText}`,
        type: data.status === 'won' ? 'success' : 'error',
      });
    });

    return () => {
      unsubscribeWallet();
      unsubscribeBets();
      disconnectSocket();
    };
  }, [user, addNotification]);

  useEffect(() => {
    filterBets();
  }, [allBets, searchQuery, statusFilter, typeFilter]);

  const loadBets = async () => {
    try {
      // Mock data with complete bet history
      const mockBets: Bet[] = [
        {
          id: '1',
          event: 'Manchester United vs Liverpool',
          amount: 100,
          odds: 2.5,
          potentialWinnings: 150,
          status: 'won',
          type: 'moneyline',
          placedDate: '2024-02-10',
          resolvedDate: '2024-02-10',
          selection: 'Manchester United',
        },
        {
          id: '2',
          event: 'Real Madrid vs Barcelona',
          amount: 50,
          odds: 1.8,
          potentialWinnings: 40,
          status: 'pending',
          type: 'moneyline',
          placedDate: '2024-02-14',
          selection: 'Real Madrid',
        },
        {
          id: '3',
          event: 'Arsenal vs Chelsea',
          amount: 75,
          odds: 2.1,
          potentialWinnings: -75,
          status: 'lost',
          type: 'spread',
          placedDate: '2024-02-13',
          resolvedDate: '2024-02-13',
          selection: 'Arsenal',
        },
        {
          id: '4',
          event: 'Lakers vs Celtics',
          amount: 200,
          odds: 1.95,
          potentialWinnings: 190,
          status: 'won',
          type: 'moneyline',
          placedDate: '2024-02-12',
          resolvedDate: '2024-02-12',
          selection: 'Lakers',
        },
        {
          id: '5',
          event: 'Juventus vs AC Milan',
          amount: 120,
          odds: 2.2,
          potentialWinnings: 144,
          status: 'pending',
          type: 'moneyline',
          placedDate: '2024-02-15',
          selection: 'Juventus',
        },
      ];
      setAllBets(mockBets);
    } catch (error) {
      addNotification({ message: 'Failed to load bets', type: 'error' });
    }
  };

  const loadWalletBalance = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;
      const response = await getWalletBalance(token);
      if (response.success && response.data) {
        setWalletBalance(parseFloat(response.data.balance).toFixed(2));
      }
    } catch (error) {
      console.error('Failed to load wallet balance:', error);
    }
  };

  const loadKYCStatus = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;
      const response = await getKYCStatus(token);
      if (response.success && response.data) {
        setKycStatus(response.data.kycStatus);
      }
    } catch (error) {
      console.error('Failed to load KYC status:', error);
    }
  };

  const filterBets = () => {
    const filtered = allBets.filter((bet) => {
      const matchesSearch = bet.event.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || bet.status === statusFilter;
      const matchesType = typeFilter === 'all' || bet.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });

    setFilteredBets(filtered);
    setCurrentPage(1);
  };

  const calculateStats = (bets: Bet[]) => {
    const totalBets = bets.length;
    const wonBets = bets.filter((b) => b.status === 'won').length;
    const totalStaked = bets.reduce((sum, b) => sum + b.amount, 0);
    const totalWinnings = bets
      .filter((b) => b.status === 'won')
      .reduce((sum, b) => sum + Math.max(0, b.potentialWinnings), 0);

    return {
      totalBets,
      winRate: totalBets > 0 ? ((wonBets / totalBets) * 100).toFixed(1) : 0,
      totalStaked,
      totalWinnings,
    };
  };

  const stats = calculateStats(filteredBets);

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
        {/* Header with Wallet Pill */}
        <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <Heading level={1} className="text-white">
              Betting History
            </Heading>
            <Text className="text-slate-400 mt-2">
              Live bet tracking with real-time updates
            </Text>
          </div>

          {/* Wallet & KYC Status Pills */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#00FF87]/20 bg-[#00FF87]/10 px-4 py-3 text-sm">
              <WalletIcon size={18} className="text-[#00FF87]" />
              <span className="text-white font-semibold">${walletBalance}</span>
            </div>

            {kycStatus === 'VERIFIED' && (
              <div className="inline-flex items-center gap-2 rounded-full border border-[#22c55e]/20 bg-[#22c55e]/10 px-4 py-3 text-sm">
                <Check size={18} className="text-[#22c55e]" />
                <span className="text-[#22c55e] font-semibold">KYC Verified</span>
              </div>
            )}

            {kycStatus === 'PENDING' && (
              <div className="inline-flex items-center gap-2 rounded-full border border-[#fbbf24]/20 bg-[#fbbf24]/10 px-4 py-3 text-sm">
                <span className="h-2 w-2 rounded-full bg-[#fbbf24] animate-pulse" />
                <span className="text-[#fbbf24] font-semibold">KYC Pending</span>
              </div>
            )}

            {socketConnected && (
              <div className="inline-flex items-center gap-2 rounded-full border border-[#00FF87]/20 bg-[#00FF87]/10 px-4 py-3 text-sm">
                <span className="h-2 w-2 rounded-full bg-[#00FF87] animate-pulse" />
                <span className="text-[#00FF87] text-xs">Live</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            { label: 'Total Bets', value: stats.totalBets, color: 'accent' },
            { label: 'Win Rate', value: `${stats.winRate}%`, color: 'success' },
            { label: 'Total Staked', value: `$${stats.totalStaked}`, color: 'warning' },
            { label: 'Total Won', value: `$${stats.totalWinnings}`, color: 'success' },
          ].map((stat, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <Card className="bg-[#131722] border border-white/5">
                <CardBody>
                  <Text className="text-slate-400 text-sm">{stat.label}</Text>
                  <Text
                    className={`text-3xl font-semibold mt-2 ${
                      stat.color === 'accent'
                        ? 'text-[#00FF87]'
                        : stat.color === 'success'
                        ? 'text-[#22c55e]'
                        : 'text-[#fbbf24]'
                    }`}
                  >
                    {stat.value}
                  </Text>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <Input
            label="Search Bets"
            placeholder="Search by event name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search size={18} />}
          />

          <div>
            <label className="block text-sm font-medium text-white mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-[#0d1724] border border-white/10 text-white focus:outline-none focus:border-[#00FF87]"
            >
              <option value="all">All Status</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Bet Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-[#0d1724] border border-white/10 text-white focus:outline-none focus:border-[#00FF87]"
            >
              <option value="all">All Types</option>
              <option value="moneyline">Moneyline</option>
              <option value="spread">Spread</option>
            </select>
          </div>
        </motion.div>

        {/* Bets Table */}
        <motion.div variants={itemVariants}>
          <Card className="bg-[#131722] border border-white/5">
            <CardHeader className="border-b border-white/10 flex items-center justify-between">
              <Heading level={4} className="text-white">
                Your Bets
              </Heading>
              <Button variant="ghost" size="sm" icon={<Download size={18} />}>
                Export
              </Button>
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
                    key: 'selection',
                    header: 'Selection',
                    render: (value) => <Text className="text-slate-300">{value}</Text>,
                  },
                  {
                    key: 'type',
                    header: 'Type',
                    render: (value) => (
                      <Badge variant="soft" color="accent" size="sm">
                        {value && typeof value === 'string' ? value.charAt(0).toUpperCase() + value.slice(1) : '—'}
                      </Badge>
                    ),
                  },
                  {
                    key: 'amount',
                    header: 'Amount',
                    render: (value) => <Text className="text-slate-300">${typeof value === 'number' ? value.toFixed(2) : '0.00'}</Text>,
                  },
                  {
                    key: 'odds',
                    header: 'Odds',
                    render: (value) => <Text className="text-[#00FF87] font-bold">{value}</Text>,
                  },
                  {
                    key: 'status',
                    header: 'Status',
                    render: (value) => (
                      <Badge
                        color={value === 'won' ? 'success' : value === 'lost' ? 'danger' : 'warning'}
                        variant="soft"
                        size="sm"
                      >
                        {value && typeof value === 'string' ? value.charAt(0).toUpperCase() + value.slice(1) : '—'}
                      </Badge>
                    ),
                  },
                  {
                    key: 'placedDate',
                    header: 'Date',
                    render: (value) => <Text className="text-slate-500 text-sm">{value}</Text>,
                  },
                ]}
                data={paginatedBets}
              />
            </CardBody>
          </Card>
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div variants={itemVariants} className="flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </motion.div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
