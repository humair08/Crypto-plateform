'use client';

import { useState } from 'react';
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
  RadioGroup,
} from '@/components/ui';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { useRequireAuth } from '@/components/ProtectedRoute';
import { useNotificationStore } from '@/store/notificationStore';
import { withdrawCrypto } from '@/services/walletService';
import { DollarSign, AlertCircle, CheckCircle } from 'lucide-react';

export default function WithdrawPage() {
  const { loading } = useRequireAuth();
  const { add: addNotification } = useNotificationStore();

  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawalMethod, setWithdrawalMethod] = useState('bank');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [withdrawResult, setWithdrawResult] = useState<null | { transactionId: string; amount: number; address: string; status: string }>(null);
  const [step, setStep] = useState<'amount' | 'method' | 'confirm' | 'success'>('amount');
  const [processing, setProcessing] = useState(false);

  const availableBalance = 5240.50;
  const withdrawalAmounts = [100, 250, 500, 1000];

  const handleAmountSelect = (amount: number) => {
    if (amount <= availableBalance) {
      setWithdrawAmount(amount.toString());
      setStep('method');
    } else {
      addNotification({
        message: 'Amount exceeds available balance',
        type: 'warning',
      });
    }
  };

  const handleCustomAmount = () => {
    if (withdrawAmount && parseFloat(withdrawAmount) > 0) {
      if (parseFloat(withdrawAmount) > availableBalance) {
        addNotification({
          message: 'Insufficient balance',
          type: 'warning',
        });
        return;
      }
      setStep('method');
    }
  };

  const handleProcessWithdrawal = async () => {
    setProcessing(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      if (!withdrawAddress) {
        throw new Error('Please enter a withdrawal address');
      }

      const response = await withdrawCrypto(token, parseFloat(withdrawAmount), withdrawAddress);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Withdrawal failed');
      }

      setWithdrawResult(response.data);
      setStep('success');
      addNotification({
        message: `Withdrawal of $${withdrawAmount} requested successfully!`,
        type: 'success',
      });

      setTimeout(() => {
        setStep('amount');
        setWithdrawAmount('');
        setWithdrawalMethod('bank');
        setWithdrawAddress('');
        setWithdrawResult(null);
      }, 3000);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Withdrawal failed';
      addNotification({
        message,
        type: 'error',
      });
      setStep('method');
    } finally {
      setProcessing(false);
    }
  };

  const processingFee = parseFloat(withdrawAmount) * 0.02;
  const netAmount = parseFloat(withdrawAmount) - processingFee;

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
            Withdraw Funds
          </Heading>
          <Text className="text-white/60 mt-2">
            Withdraw money from your account to your bank
          </Text>
        </motion.div>

        {/* Balance Card */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardBody>
              <Text className="text-white/60 text-sm">Available Balance</Text>
              <Text className="text-4xl font-bold text-accent mt-2">
                ${availableBalance.toFixed(2)}
              </Text>
            </CardBody>
          </Card>
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
              <CardBody className="py-12 flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <CheckCircle size={64} className="text-success mb-4" />
                </motion.div>
                <Heading level={3} className="text-success">
                  Withdrawal Requested!
                </Heading>
                <Text className="text-white/60 mt-2">
                  Your withdrawal of ${withdrawAmount} has been requested. It will be processed within 2-5 business days.
                </Text>
                {withdrawResult && (
                  <div className="mt-4 rounded-3xl border border-white/10 bg-[#0b1320]/80 p-5 text-left text-sm">
                    <div className="flex justify-between gap-3">
                      <Text className="text-white/70">Transaction ID</Text>
                      <Text className="font-medium text-white">{withdrawResult.transactionId}</Text>
                    </div>
                    <div className="flex justify-between gap-3 mt-2">
                      <Text className="text-white/70">Destination</Text>
                      <Text className="font-medium text-white">{withdrawResult.address}</Text>
                    </div>
                    <div className="flex justify-between gap-3 mt-2">
                      <Text className="text-white/70">Status</Text>
                      <Text className="font-medium text-success">{withdrawResult.status}</Text>
                    </div>
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
                <Heading level={4}>Withdrawal Amount</Heading>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {withdrawalAmounts
                    .filter((amount) => amount <= availableBalance)
                    .map((amount) => (
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
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    icon={<DollarSign size={18} />}
                  />
                  <Button
                    variant="primary"
                    onClick={handleCustomAmount}
                    disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0}
                  >
                    Next
                  </Button>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        )}

        {/* Withdrawal Method */}
        {step === 'method' && (
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <Heading level={4}>Withdrawal Method</Heading>
              </CardHeader>
              <CardBody className="space-y-4">
                <RadioGroup
                  options={[
                    { value: 'bank', label: 'Bank Transfer (2-5 business days)' },
                    { value: 'wallet', label: 'Digital Wallet (Instant)' },
                    { value: 'check', label: 'Check (5-7 business days)' },
                  ]}
                  value={withdrawalMethod}
                  onChange={setWithdrawalMethod}
                />

                <div className="space-y-3">
                  <Input
                    label={
                      withdrawalMethod === 'bank'
                        ? 'Bank Account / IBAN'
                        : withdrawalMethod === 'wallet'
                        ? 'Wallet Address'
                        : 'Mailing Address'
                    }
                    placeholder={
                      withdrawalMethod === 'bank'
                        ? 'Enter bank account or IBAN'
                        : withdrawalMethod === 'wallet'
                        ? 'Enter crypto wallet address'
                        : 'Enter mailing address'
                    }
                    value={withdrawAddress}
                    onChange={(e) => setWithdrawAddress(e.target.value)}
                  />
                </div>
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
                  disabled={!withdrawAddress || parseFloat(withdrawAmount) <= 0}
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
                <Heading level={4}>Confirm Withdrawal</Heading>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="p-4 rounded-lg bg-secondary/50 border border-border/30 space-y-3">
                  <div className="flex justify-between items-center">
                    <Text className="text-white/70">Withdrawal Amount</Text>
                    <Text className="text-2xl font-bold text-accent">
                      ${withdrawAmount}
                    </Text>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <Text className="text-white/70">Processing Fee (2%)</Text>
                    <Text className="text-danger">${processingFee.toFixed(2)}</Text>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <Text className="text-white/70">Destination</Text>
                    <Text className="font-medium text-white">{withdrawAddress || 'Not specified'}</Text>
                  </div>
                  <div className="border-t border-border/30 pt-3 flex justify-between items-center">
                    <Text className="text-white font-semibold">You Will Receive</Text>
                    <Text className="text-xl font-bold text-success">
                      ${netAmount.toFixed(2)}
                    </Text>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-warning/10 border border-warning/30 flex gap-2">
                  <AlertCircle size={20} className="text-warning flex-shrink-0" />
                  <Text className="text-sm text-warning">
                    Withdrawals are processed to your selected destination. Processing time may vary.
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
                  onClick={handleProcessWithdrawal}
                >
                  {processing ? 'Processing...' : 'Confirm Withdrawal'}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {/* Information */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <Heading level={5}>Withdrawal Information</Heading>
            </CardHeader>
            <CardBody className="space-y-3 text-sm">
              <div className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0 mt-1" />
                <Text className="text-white/70">
                  Minimum withdrawal: <span className="text-white">$50</span>
                </Text>
              </div>
              <div className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0 mt-1" />
                <Text className="text-white/70">
                  Maximum withdrawal: <span className="text-white">$10,000</span>
                </Text>
              </div>
              <div className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0 mt-1" />
                <Text className="text-white/70">
                  Processing fee: <span className="text-white">2%</span>
                </Text>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
