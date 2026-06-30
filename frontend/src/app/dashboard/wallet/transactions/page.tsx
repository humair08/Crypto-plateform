'use client';

import React, { useState, useEffect } from 'react';
import { useSearchStore } from '@/store/searchStore';
import { motion } from 'framer-motion';
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  Input,
  Badge,
  Table,
  Pagination,
} from '@/components/ui';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { useRequireAuth } from '@/components/ProtectedRoute';
import { useNotificationStore } from '@/store/notificationStore';
import { Search } from 'lucide-react';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'bet' | 'winnings';
  description: string;
  amount: number;
  balance: number;
  status: 'pending' | 'completed' | 'failed';
  date: string;
}

export default function TransactionsPage() {
  const { loading } = useRequireAuth();
  const { add: addNotification } = useNotificationStore();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const searchQuery = useSearchStore((s) => s.searchQuery);
  const setSearchQuery = useSearchStore((s) => s.setSearchQuery);
  const [typeFilter, setTypeFilter] = useState('all');

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [transactions, searchQuery, typeFilter]);

  const loadTransactions = async () => {
    try {
      // TODO: Replace with actual API call
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          type: 'deposit',
          description: 'Deposit via Credit Card',
          amount: 500,
          balance: 5500,
          status: 'completed',
          date: '2024-02-15',
        },
        {
          id: '2',
          type: 'bet',
          description: 'Bet on Manchester vs Liverpool',
          amount: -100,
          balance: 5400,
          status: 'completed',
          date: '2024-02-14',
        },
        {
          id: '3',
          type: 'winnings',
          description: 'Bet Won - Manchester vs Liverpool',
          amount: 150,
          balance: 5550,
          status: 'completed',
          date: '2024-02-14',
        },
        {
          id: '4',
          type: 'withdrawal',
          description: 'Withdrawal to Bank Account',
          amount: -250,
          balance: 5300,
          status: 'completed',
          date: '2024-02-13',
        },
        {
          id: '5',
          type: 'bet',
          description: 'Bet on Real Madrid vs Barcelona',
          amount: -75,
          balance: 5225,
          status: 'completed',
          date: '2024-02-13',
        },
      ];
      setTransactions(mockTransactions);
    } catch (error) {
      addNotification({ message: 'Failed to load transactions', type: 'error' });
    }
  };

  const filterTransactions = () => {
    const filtered = transactions.filter((transaction) => {
      const matchesSearch = transaction.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'all' || transaction.type === typeFilter;

      return matchesSearch && matchesType;
    });

    setFilteredTransactions(filtered);
    setCurrentPage(1);
  };

  const calculateTotals = (transactions: Transaction[]) => {
    const deposits = transactions
      .filter((t) => t.type === 'deposit')
      .reduce((sum, t) => sum + t.amount, 0);
    const withdrawals = transactions
      .filter((t) => t.type === 'withdrawal')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const winnings = transactions
      .filter((t) => t.type === 'winnings')
      .reduce((sum, t) => sum + t.amount, 0);

    return { deposits, withdrawals, winnings };
  };

  const totals = calculateTotals(filteredTransactions);

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
            Transaction History
          </Heading>
          <Text className="text-white/60 mt-2">
            View all your account transactions
          </Text>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {[
            { label: 'Total Deposited', value: `$${totals.deposits}`, color: 'success' },
            { label: 'Total Withdrawn', value: `$${totals.withdrawals}`, color: 'warning' },
            { label: 'Total Won', value: `$${totals.winnings}`, color: 'accent' },
          ].map((stat, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <Card>
                <CardBody>
                  <Text className="text-white/60 text-sm">{stat.label}</Text>
                  <Text className={`text-2xl font-bold text-${stat.color} mt-2`}>
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
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <Input
            label="Search Transactions"
            placeholder="Search by description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search size={18} />}
          />

          <div>
            <label className="block text-sm font-medium text-white mb-2">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-white focus:outline-none focus:border-accent"
            >
              <option value="all">All Types</option>
              <option value="deposit">Deposits</option>
              <option value="withdrawal">Withdrawals</option>
              <option value="bet">Bets</option>
              <option value="winnings">Winnings</option>
            </select>
          </div>
        </motion.div>

        {/* Transactions Table */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex items-center justify-between">
              <Heading level={4}>Transactions</Heading>
            </CardHeader>
            <CardBody>
              <Table
                columns={[
                  {
                    key: 'date',
                    header: 'Date',
                    render: (value) => <Text className="text-sm text-white/70">{value}</Text>,
                  },
                  {
                    key: 'type',
                    header: 'Type',
                    render: (value) => (
                      <Badge
                        color={
                          value === 'deposit'
                            ? 'success'
                            : value === 'withdrawal'
                            ? 'warning'
                            : value === 'winnings'
                            ? 'success'
                            : 'accent'
                        }
                        variant="soft"
                        size="sm"
                      >
                        {value && typeof value === 'string' ? value.charAt(0).toUpperCase() + value.slice(1) : '—'}
                      </Badge>
                    ),
                  },
                  {
                    key: 'description',
                    header: 'Description',
                    render: (value) => <Text className="text-sm">{value}</Text>,
                  },
                  {
                    key: 'amount',
                    header: 'Amount',
                    render: (value) => {
                      const amount = typeof value === 'number' ? value : 0;
                      return (
                        <Text className={amount >= 0 ? 'text-success' : 'text-danger'}>
                          {amount >= 0 ? '+' : ''}${Math.abs(amount).toFixed(2)}
                        </Text>
                      );
                    },
                  },
                  {
                    key: 'balance',
                    header: 'Balance',
                    render: (value) => <Text className="text-accent font-semibold">${value}</Text>,
                  },
                  {
                    key: 'status',
                    header: 'Status',
                    render: (value) => (
                      <Badge
                        color={value === 'completed' ? 'success' : value === 'failed' ? 'danger' : 'warning'}
                        variant="soft"
                        size="sm"
                      >
                        {value && typeof value === 'string' ? value.charAt(0).toUpperCase() + value.slice(1) : '—'}
                      </Badge>
                    ),
                  },
                ]}
                data={paginatedTransactions}
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
