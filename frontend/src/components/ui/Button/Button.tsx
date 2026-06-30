'use client';

import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion, MotionProps } from 'framer-motion';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof MotionProps> {
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  fullWidth = false,
  disabled = false,
  className = '',
  ...props
}: ButtonProps) {
  const variantClasses = {
    primary: 'gradient-button text-white hover:shadow-glow-cyan',
    secondary: 'bg-secondary border border-accent/50 text-accent hover:bg-secondary/80 hover:border-accent',
    ghost: 'bg-transparent border border-border text-white hover:bg-secondary/50',
    danger: 'bg-danger/10 border border-danger text-danger hover:bg-danger/20',
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const baseClasses = `
    inline-flex items-center justify-center gap-2
    rounded-lg font-semibold
    transition-all duration-300
    disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-primary
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={baseClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon
      )}
      {children}
    </motion.button>
  );
}
