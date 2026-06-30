'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { Button, Card, CardBody, CardHeader, Input, Heading, Text } from '@/components/ui';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/services/authService';

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setToken, setRefreshToken } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await loginUser(formData.email, formData.password);
      setUser(response.user);
      setToken(response.token);
      setRefreshToken(response.refreshToken);

      if (rememberMe) {
        localStorage.setItem('rememberEmail', formData.email);
      } else {
        localStorage.removeItem('rememberEmail');
      }

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Login failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const formVariants = {
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
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-cards flex items-center justify-center px-4">
      {/* Animated background elements */}
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
                Welcome Back
              </Heading>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Text className="text-white/60">Sign in to your account</Text>
            </motion.div>
          </CardHeader>

          <CardBody className="pt-6">
            <motion.form
              variants={formVariants}
              initial="hidden"
              animate="visible"
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {/* Email Input */}
              <motion.div variants={itemVariants}>
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  icon={<Mail size={18} />}
                />
              </motion.div>

              {/* Password Input */}
              <motion.div variants={itemVariants}>
                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    icon={<Lock size={18} />}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-10 text-white/60 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </motion.div>

              {/* Remember Me & Forgot Password */}
              <motion.div
                variants={itemVariants}
                className="flex items-center justify-between text-sm"
              >
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-border bg-secondary/50"
                  />
                  <span className="text-white/70">Remember me</span>
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-accent hover:text-accent-secondary transition-colors"
                >
                  Forgot password?
                </Link>
              </motion.div>

              {/* Error Message */}
              {error && (
                <motion.div
                  variants={itemVariants}
                  className="p-3 rounded-lg bg-danger/10 border border-danger text-danger text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.div variants={itemVariants}>
                <Button
                  variant="primary"
                  fullWidth
                  loading={loading}
                  disabled={loading}
                  className="mt-2"
                >
                  Sign In
                </Button>
              </motion.div>

              {/* Sign Up Link */}
              <motion.div variants={itemVariants} className="text-center text-sm text-white/60">
                Don&apos;t have an account?{' '}
                <Link href="/auth/register" className="text-accent hover:text-accent-secondary">
                  Sign up
                </Link>
              </motion.div>
            </motion.form>
          </CardBody>
        </Card>

        {/* Social Login (Future Enhancement) */}
        <motion.div
          variants={itemVariants}
          className="mt-6 text-center text-sm text-white/50"
        >
          Secure login powered by enterprise-grade security
        </motion.div>
      </motion.div>
    </div>
  );
}
