'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  hoverable?: boolean;
}

export function Card({
  children,
  className = '',
  interactive = false,
  hoverable = true,
}: CardProps) {
  const baseClasses = `
    rounded-lg border border-border
    bg-secondary/30 backdrop-blur-lg
    p-6
    transition-all duration-300
    ${hoverable ? 'hover:border-accent/50 hover:shadow-glow-cyan' : ''}
    ${interactive ? 'cursor-pointer' : ''}
    ${className}
  `;

  if (interactive) {
    return (
      <motion.div
        whileHover={{ y: -4 }}
        className={baseClasses}
      >
        {children}
      </motion.div>
    );
  }

  return <div className={baseClasses}>{children}</div>;
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div className={`mb-4 pb-4 border-b border-border/50 ${className}`}>
      {children}
    </div>
  );
}

interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

export function CardBody({ children, className = '' }: CardBodyProps) {
  return <div className={`space-y-3 ${className}`}>{children}</div>;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div className={`mt-4 pt-4 border-t border-border/50 flex gap-2 ${className}`}>
      {children}
    </div>
  );
}
