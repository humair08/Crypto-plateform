'use client';

import React from 'react';

type BadgeVariant = 'solid' | 'outline' | 'soft';
type BadgeColor = 'accent' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  color?: BadgeColor;
  size?: 'sm' | 'md';
}

export function Badge({
  children,
  variant = 'solid',
  color = 'accent',
  size = 'md',
}: BadgeProps) {
  const colors = {
    accent: { solid: 'bg-accent text-primary', outline: 'border border-accent text-accent', soft: 'bg-accent/10 text-accent' },
    success: { solid: 'bg-success text-primary', outline: 'border border-success text-success', soft: 'bg-success/10 text-success' },
    warning: { solid: 'bg-warning text-primary', outline: 'border border-warning text-warning', soft: 'bg-warning/10 text-warning' },
    danger: { solid: 'bg-danger text-primary', outline: 'border border-danger text-danger', soft: 'bg-danger/10 text-danger' },
    info: { solid: 'bg-secondary/80 text-white', outline: 'border border-white/20 text-white', soft: 'bg-secondary/50 text-white/80' },
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  return (
    <span className={`rounded-full font-semibold inline-block ${colors[color][variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
}
