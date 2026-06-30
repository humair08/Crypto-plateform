'use client';

import React, { useState, useEffect } from 'react';
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
  RadioGroup,
} from '@/components/ui';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { useRequireAuth } from '@/components/ProtectedRoute';
import { useSearchParams, useRouter } from 'next/navigation';
import { useNotificationStore } from '@/store/notificationStore';
import { ArrowLeft, DollarSign } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  participants: string[];
  odds: { home: number; away: number };
  startTime: string;
}

export default function PlaceBetPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loading } = useRequireAuth();
  const { add: addNotification } = useNotificationStore();

  const eventId = searchParams.get('eventId');

  const [event, setEvent] = useState<Event | null>(null);
  const [betType, setBetType] = useState<'moneyline' | 'spread'>('moneyline');
  const [selection, setSelection] = useState<string>('home');
  const [betAmount, setBetAmount] = useState('');
  const [loading2, setLoading2] = useState(false);

  const selectedOdds =
    selection === 'home'
      ? event?.odds.home || 0
      : event?.odds.away || 0;

  const potentialWinnings =
    (parseFloat(betAmount) || 0) * selectedOdds - (parseFloat(betAmount) || 0);

  useEffect(() => {
    if (eventId) {
      loadEvent();
    }
  }, [eventId]);

  const loadEvent = async () => {
    try {
      // TODO: Replace with actual API call
      const mockEvent: Event = {
        id: eventId || '1',
        title: 'Manchester United vs Liverpool',
        participants: ['Manchester United', 'Liverpool'],
        odds: { home: 2.1, away: 1.8 },
        startTime: '2024-02-15T15:00:00',
      };
      setEvent(mockEvent);
    } catch (error) {
      addNotification({ message: 'Failed to load event', type: 'error' });
      router.back();
    }
  };

  const handlePlaceBet = async () => {
    if (!betAmount || parseFloat(betAmount) <= 0) {
      addNotification({ message: 'Please enter a valid amount', type: 'warning' });
      return;
    }

    setLoading2(true);
    try {
      // TODO: Call API to place bet
      await new Promise((resolve) => setTimeout(resolve, 1500));

      addNotification({
        message: `Bet placed successfully! Potential winnings: $${potentialWinnings.toFixed(2)}`,
        type: 'success',
      });

      router.push('/dashboard/bets');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to place bet';
      addNotification({
        message,
        type: 'error',
      });
    } finally {
      setLoading2(false);
    }
  };

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

  if (!event) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white/60">Event not found</div>
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
        {/* Back Button */}
        <motion.div variants={itemVariants}>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-accent hover:text-accent-secondary transition-colors"
          >
            <ArrowLeft size={20} />
            <Text>Back to Events</Text>
          </button>
        </motion.div>

        {/* Header */}
        <motion.div variants={itemVariants}>
          <Heading level={1} className="text-white">
            Place Bet
          </Heading>
          <Text className="text-white/60 mt-2">{event.title}</Text>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bet Details */}
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
            {/* Event Info */}
            <Card>
              <CardHeader>
                <Heading level={4}>Event Information</Heading>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {event.participants.map((participant, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-lg bg-secondary/50 border border-border/30"
                    >
                      <Text className="text-sm text-white/70">{participant}</Text>
                      <Text className="text-2xl font-bold text-accent mt-2">
                        {idx === 0 ? event.odds.home : event.odds.away}
                      </Text>
                    </div>
                  ))}
                </div>
                <div className="p-3 rounded-lg bg-accent/10 border border-accent/30">
                  <Text className="text-sm text-accent">
                    Starts: {new Date(event.startTime).toLocaleString()}
                  </Text>
                </div>
              </CardBody>
            </Card>

            {/* Bet Type Selection */}
            <Card>
              <CardHeader>
                <Heading level={4}>Bet Type</Heading>
              </CardHeader>
              <CardBody>
                <RadioGroup
                  options={[
                    { value: 'moneyline', label: 'Moneyline (Pick a winner)' },
                    { value: 'spread', label: 'Spread (Point differential)' },
                  ]}
                  value={betType}
                  onChange={(value) => setBetType(value as 'moneyline' | 'spread')}
                />
              </CardBody>
            </Card>

            {/* Selection */}
            <Card>
              <CardHeader>
                <Heading level={4}>Choose Team</Heading>
              </CardHeader>
              <CardBody>
                <RadioGroup
                  options={event.participants.map((participant, idx) => ({
                    value: idx === 0 ? 'home' : 'away',
                    label: `${participant} (${idx === 0 ? event.odds.home : event.odds.away})`,
                  }))}
                  value={selection}
                  onChange={setSelection}
                />
              </CardBody>
            </Card>

            {/* Bet Amount */}
            <Card>
              <CardHeader>
                <Heading level={4}>Bet Amount</Heading>
              </CardHeader>
              <CardBody>
                <Input
                  type="number"
                  label="Amount ($)"
                  placeholder="Enter bet amount"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  icon={<DollarSign size={18} />}
                />
                <div className="mt-4 p-3 rounded-lg bg-secondary/50 border border-border/30">
                  <Text className="text-sm text-white/60">Available Balance</Text>
                  <Text className="text-lg font-bold text-accent mt-1">$5,240.50</Text>
                </div>
              </CardBody>
            </Card>
          </motion.div>

          {/* Bet Summary */}
          <motion.div variants={itemVariants}>
            <Card className="sticky top-24">
              <CardHeader>
                <Heading level={4}>Bet Summary</Heading>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="space-y-3 pb-4 border-b border-border/30">
                  <div className="flex justify-between items-center">
                    <Text className="text-white/60 text-sm">Team</Text>
                    <Text className="text-white font-medium">
                      {selection === 'home' ? event.participants[0] : event.participants[1]}
                    </Text>
                  </div>
                  <div className="flex justify-between items-center">
                    <Text className="text-white/60 text-sm">Type</Text>
                    <Badge color="accent" variant="soft" size="sm">
                      {betType.charAt(0).toUpperCase() + betType.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <Text className="text-white/60 text-sm">Odds</Text>
                    <Text className="text-accent font-bold">{selectedOdds}</Text>
                  </div>
                </div>

                <div className="space-y-3 pb-4 border-b border-border/30">
                  <div className="flex justify-between items-center">
                    <Text className="text-white/60 text-sm">Stake</Text>
                    <Text className="text-white font-medium">
                      ${parseFloat(betAmount || '0').toFixed(2)}
                    </Text>
                  </div>
                  <div className="flex justify-between items-center">
                    <Text className="text-white/60 text-sm">Potential Profit</Text>
                    <Text className="text-success font-medium">
                      ${potentialWinnings.toFixed(2)}
                    </Text>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <Text className="text-white font-semibold">To Win</Text>
                  <Text className="text-2xl font-bold text-accent">
                    ${(potentialWinnings + parseFloat(betAmount || '0')).toFixed(2)}
                  </Text>
                </div>

                <Button
                  variant="primary"
                  fullWidth
                  loading={loading2}
                  disabled={loading2 || !betAmount || parseFloat(betAmount) <= 0}
                  className="mt-4"
                  onClick={handlePlaceBet}
                >
                  Place Bet
                </Button>

                <Text className="text-xs text-white/50 text-center mt-2">
                  You agree to our betting terms by placing this bet
                </Text>
              </CardBody>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
