'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button, Card, CardBody, CardHeader, Input, Heading, Text, Checkbox } from '@/components/ui';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/services/authService';

export default function RegisterPage() {
  const router = useRouter();
  const { setUser, setToken, setRefreshToken } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const passwordStrength = {
    min8: formData.password.length >= 8,
    hasUpper: /[A-Z]/.test(formData.password),
    hasLower: /[a-z]/.test(formData.password),
    hasNumber: /[0-9]/.test(formData.password),
  };

  const isStrongPassword =
    Object.values(passwordStrength).every(Boolean) &&
    formData.password === formData.confirmPassword;

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

    // Validation
    if (!isStrongPassword) {
      setError('Password does not meet requirements');
      setLoading(false);
      return;
    }

    if (!agreeTerms) {
      setError('You must agree to the terms and conditions');
      setLoading(false);
      return;
    }

    try {
      const response = await registerUser(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.password
      );

      setUser(response.user);
      setToken(response.token);
      setRefreshToken(response.refreshToken);
      setSuccess(true);

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Registration failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-cards flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-4"
          >
            <CheckCircle size={64} className="text-success mx-auto" />
          </motion.div>
          <Heading level={2} className="text-success mb-2">
            Welcome!
          </Heading>
          <Text className="text-white/60 mb-4">
            Your account has been created successfully. Redirecting...
          </Text>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-cards flex items-center justify-center px-4 py-8">
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
                Create Account
              </Heading>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Text className="text-white/60">Join our platform today</Text>
            </motion.div>
          </CardHeader>

          <CardBody className="pt-6">
            <motion.form
              variants={formVariants}
              initial="hidden"
              animate="visible"
              onSubmit={handleSubmit}
              className="space-y-3"
            >
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-3">
                <motion.div variants={itemVariants}>
                  <Input
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    required
                    icon={<User size={18} />}
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Input
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    required
                    icon={<User size={18} />}
                  />
                </motion.div>
              </div>

              {/* Email */}
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

              {/* Password */}
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

              {/* Confirm Password */}
              <motion.div variants={itemVariants}>
                <div className="relative">
                  <Input
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    icon={<Lock size={18} />}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-10 text-white/60 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </motion.div>

              {/* Password Strength Indicator */}
              {formData.password && (
                <motion.div
                  variants={itemVariants}
                  className="p-3 rounded-lg bg-secondary/50 border border-border/30 space-y-2"
                >
                  <p className="text-xs font-semibold text-white/70">Password Requirements:</p>
                  <div className="space-y-1 text-xs">
                    {Object.entries(passwordStrength).map(([key, value]) => (
                      <div
                        key={key}
                        className={`flex items-center gap-2 ${
                          value ? 'text-success' : 'text-white/40'
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            value ? 'bg-success' : 'bg-white/20'
                          }`}
                        />
                        {key === 'min8' && 'At least 8 characters'}
                        {key === 'hasUpper' && 'One uppercase letter'}
                        {key === 'hasLower' && 'One lowercase letter'}
                        {key === 'hasNumber' && 'One number'}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Terms Checkbox */}
              <motion.div variants={itemVariants} className="pt-2">
                <Checkbox
                  label={
                    <span className="text-sm">
                      I agree to the{' '}
                      <Link href="/terms" className="text-accent hover:underline">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" className="text-accent hover:underline">
                        Privacy Policy
                      </Link>
                    </span>
                  }
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                />
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
              <motion.div variants={itemVariants} className="pt-2">
                <Button
                  variant="primary"
                  fullWidth
                  loading={loading}
                  disabled={loading || !isStrongPassword || !agreeTerms}
                >
                  Create Account
                </Button>
              </motion.div>

              {/* Sign In Link */}
              <motion.div variants={itemVariants} className="text-center text-sm text-white/60">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-accent hover:text-accent-secondary">
                  Sign in
                </Link>
              </motion.div>
            </motion.form>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}
