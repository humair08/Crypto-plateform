'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Text,
  Input,
  Button,
  Select,
  RadioGroup,
  Badge,
} from '@/components/ui';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { useRequireAuth } from '@/components/ProtectedRoute';
import { useNotificationStore } from '@/store/notificationStore';
import { depositCrypto } from '@/services/walletService';
import { DollarSign, CheckCircle } from 'lucide-react';

interface DepositResult {
  transactionId: string;
  virtualAddress: string;
  amount: number;
  currency: string;
  status: string;
  message: string;
}

export default function DepositPage() {
  const { loading } = useRequireAuth();
  const { add: addNotification } = useNotificationStore();

  const [depositAmount, setDepositAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [step, setStep] = useState<'amount' | 'method' | 'confirm' | 'success'>('amount');
  const [processing, setProcessing] = useState(false);
  const [depositResult, setDepositResult] = useState<DepositResult | null>(null);

  const depositAmounts = [50, 100, 250, 500, 1000];

  const handleAmountSelect = (amount: number) => {
    setDepositAmount(amount.toString());
    setStep('method');
  };

  const handleCustomAmount = () => {
    if (depositAmount && parseFloat(depositAmount) > 0) {
      setStep('method');
    }
  };

  const handleProcessPayment = async () => {
    setProcessing(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await depositCrypto(token, parseFloat(depositAmount));

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Deposit failed');
      }

      setDepositResult(response.data);
      setStep('success');
      addNotification({
        message: `Successfully deposited $${depositAmount}!`,
        type: 'success',
      });

      // Reset after 3 seconds
      setTimeout(() => {
        setStep('amount');
        setDepositAmount('');
        setPaymentMethod('card');
        setDepositResult(null);
      }, 3000);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Payment failed';
      addNotification({
        message,
        type: 'error',
      });
      setStep('method');
    } finally {
      setProcessing(false);
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

  return (
    <DashboardLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <Heading level={1} className="text-white">
            Deposit Funds
          </Heading>
          <Text className="text-white/60 mt-2">
            Add funds to your betting account
          </Text>
        </motion.div>

        {/* Success State */}
        {step === 'success' && (
          <motion.div
            variants={itemVariants}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <Card>
              <CardBody className="py-12 flex flex-col items-center gap-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <CheckCircle size={64} className="text-success mb-4" />
                </motion.div>
                <Heading level={3} className="text-success">
                  Deposit Successful!
                </Heading>
                <Text className="text-white/60 mt-2">
                  ${depositAmount} has been added to your account
                </Text>
                {depositResult && (
                  <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#131722]/90 p-4 text-left text-sm">
                    <Text className="text-white/80">Transaction ID</Text>
                    <Text className="font-medium text-white mb-2">{depositResult.transactionId}</Text>
                    <Text className="text-white/80">Destination Address</Text>
                    <Text className="font-medium text-white">{depositResult.virtualAddress}</Text>
                  </div>
                )}
              </CardBody>
            </Card>
          </motion.div>
        )}

        {/* Amount Selection */}
        {step === 'amount' && (
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <Heading level={4}>Select Amount</Heading>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {depositAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleAmountSelect(amount)}
                      className="p-4 rounded-3xl border border-white/10 bg-[#0b1320]/80 hover:border-accent transition-colors text-center"
                    >
                      <Text className="font-bold text-accent">${amount}</Text>
                    </button>
                  ))}
                </div>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border/30" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-2 bg-primary text-white/60 text-sm">Or</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Enter custom amount"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    icon={<DollarSign size={18} />}
                  />
                  <Button
                    variant="primary"
                    onClick={handleCustomAmount}
                    disabled={!depositAmount || parseFloat(depositAmount) <= 0}
                  >
                    Next
                  </Button>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        )}

        {/* Payment Method Selection */}
        {step === 'method' && (
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <Heading level={4}>Payment Method</Heading>
              </CardHeader>
              <CardBody className="space-y-4">
                <RadioGroup
                  options={[
                    { value: 'card', label: 'Credit/Debit Card' },
                    { value: 'bank', label: 'Bank Transfer' },
                    { value: 'wallet', label: 'Digital Wallet' },
                  ]}
                  value={paymentMethod}
                  onChange={setPaymentMethod}
                />

                {paymentMethod === 'card' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4 mt-6 p-4 rounded-lg bg-secondary/50 border border-border/30"
                  >
                    <Input
                      label="Cardholder Name"
                      placeholder="HUMAIR TARIQ"
                    />
                    <Input
                      label="Card Number"
                      placeholder="1234 5678 9012 3456"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Expiry (MM/YY)" placeholder="12/25" />
                      <Input label="CVV" placeholder="123" type="password" />
                    </div>
                  </motion.div>
                )}

                {paymentMethod === 'bank' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg bg-secondary/50 border border-border/30"
                  >
                    <Text className="text-sm text-white/70">
                      You will be redirected to your bank for verification
                    </Text>
                  </motion.div>
                )}

                {paymentMethod === 'wallet' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4 p-4 rounded-lg bg-secondary/50 border border-border/30"
                  >
                    <Select
                      label="Select Wallet"
                      options={[
                        { value: 'paypal', label: 'PayPal' },
                        { value: 'skrill', label: 'Skrill' },
                        { value: 'crypto', label: 'Cryptocurrency' },
                      ]}
                    />
                  </motion.div>
                )}
              </CardBody>
              <CardFooter className="flex gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setStep('amount')}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setStep('confirm')}
                  className="flex-1"
                >
                  Continue
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {/* Confirmation */}
        {step === 'confirm' && (
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <Heading level={4}>Confirm Deposit</Heading>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="p-4 rounded-lg bg-secondary/50 border border-border/30 space-y-3">
                  <div className="flex justify-between items-center">
                    <Text className="text-white/70">Deposit Amount</Text>
                    <Text className="text-2xl font-bold text-accent">
                      ${depositAmount}
                    </Text>
                  </div>
                  <div className="border-t border-border/30 pt-3">
                    <div className="flex justify-between items-center mb-2">
                      <Text className="text-white/70">Payment Method</Text>
                      <Badge
                        color="accent"
                        variant="soft"
                        size="sm"
                      >
                        {paymentMethod === 'card'
                          ? 'Credit Card'
                          : paymentMethod === 'bank'
                          ? 'Bank Transfer'
                          : 'Digital Wallet'}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-accent/10 border border-accent/30">
                  <Text className="text-sm text-accent">
                    ✓ Your deposit is secure and encrypted
                  </Text>
                </div>
              </CardBody>
              <CardFooter className="flex gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setStep('method')}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  loading={processing}
                  disabled={processing}
                  className="flex-1"
                  onClick={handleProcessPayment}
                >
                  {processing ? 'Processing...' : 'Complete Deposit'}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {/* Info Card */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <Heading level={5}>Deposit Information</Heading>
            </CardHeader>
            <CardBody className="space-y-3 text-sm">
              <div className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0 mt-1" />
                <Text className="text-white/70">
                  Minimum deposit: <span className="text-white">$10</span>
                </Text>
              </div>
              <div className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0 mt-1" />
                <Text className="text-white/70">
                  Maximum deposit: <span className="text-white">$10,000</span>
                </Text>
              </div>
              <div className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0 mt-1" />
                <Text className="text-white/70">
                  Deposits are processed instantly
                </Text>
              </div>
              <div className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0 mt-1" />
                <Text className="text-white/70">
                  No deposit fees charged
                </Text>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
