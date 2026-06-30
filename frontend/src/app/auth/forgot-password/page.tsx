'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button, Card, CardBody, CardHeader, Input, Heading, Text } from '@/components/ui';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // TODO: Implement password reset API call
      // await resetPasswordRequest(email);
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call
      setSent(true);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to send reset link. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-cards flex items-center justify-center px-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 w-full max-w-md"
        >
          <Card className="border-border/50 shadow-2xl">
            <CardBody className="text-center py-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mb-6"
              >
                <CheckCircle size={64} className="text-success mx-auto" />
              </motion.div>

              <Heading level={3} className="text-white mb-2">
                Check Your Email
              </Heading>

              <Text className="text-white/60 mb-6">
                We&apos;ve sent a password reset link to <span className="font-semibold">{email}</span>
              </Text><div className="p-4 rounded-lg bg-secondary/50 border border-border/30 text-sm text-white/70 mb-6">
                <p className="mb-2">Please check your email and:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Click the reset link</li>
                  <li>Create a new password</li>
                  <li>Sign in with your new password</li>
                </ul>
              </div>

              <Text className="text-white/50 text-xs mb-6">
                Link expires in 24 hours
              </Text>

              <Link href="/auth/login">
                <Button variant="primary" fullWidth>
                  Back to Login
                </Button>
              </Link>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-cards flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md"
      >
        <Card className="border-border/50 shadow-2xl">
          <CardHeader className="text-center border-b border-border/30 pb-6">
            <motion.div variants={itemVariants} className="mb-2">
              <Heading level={2} className="text-accent">
                Reset Password
              </Heading>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Text className="text-white/60">Enter your email to receive reset instructions</Text>
            </motion.div>
          </CardHeader>

          <CardBody className="pt-6">
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <motion.div variants={itemVariants}>
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  icon={<Mail size={18} />}
                />
              </motion.div>

              {error && (
                <motion.div
                  variants={itemVariants}
                  className="p-3 rounded-lg bg-danger/10 border border-danger text-danger text-sm"
                >
                  {error}
                </motion.div>
              )}

              <motion.div variants={itemVariants}>
                <Button
                  variant="primary"
                  fullWidth
                  loading={loading}
                  disabled={loading || !email}
                >
                  Send Reset Link
                </Button>
              </motion.div>

              <motion.div variants={itemVariants} className="flex items-center justify-center">
                <Link
                  href="/auth/login"
                  className="flex items-center gap-2 text-accent hover:text-accent-secondary transition-colors text-sm"
                >
                  <ArrowLeft size={16} />
                  Back to Login
                </Link>
              </motion.div>
            </motion.form>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}
