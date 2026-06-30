'use client';

import React from 'react';

interface HeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children?: React.ReactNode;
  className?: string;
  gradient?: boolean;
}

export function Heading({
  level = 1,
  children,
  className = '',
  gradient = false,
}: HeadingProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  
  const sizeClasses = {
    1: 'text-5xl sm:text-6xl lg:text-7xl',
    2: 'text-4xl sm:text-5xl lg:text-6xl',
    3: 'text-3xl sm:text-4xl lg:text-5xl',
    4: 'text-2xl sm:text-3xl lg:text-4xl',
    5: 'text-xl sm:text-2xl lg:text-3xl',
    6: 'text-lg sm:text-xl lg:text-2xl',
  };

  const baseClasses = `font-heading font-bold leading-tight ${sizeClasses[level]} ${className}`;
  const finalClasses = gradient ? `${baseClasses} gradient-text` : baseClasses;

  return React.createElement(Tag, {
    className: finalClasses,
  }, children);
}

interface TextProps {
  children?: React.ReactNode;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  weight?: 300 | 400 | 500 | 600 | 700;
  className?: string;
  muted?: boolean;
  asChild?: boolean;
}

export function Text({
  children,
  size = 'base',
  weight = 400,
  className = '',
  muted = false,
  asChild = false,
}: TextProps) {
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  const weightClasses = {
    300: 'font-light',
    400: 'font-normal',
    500: 'font-medium',
    600: 'font-semibold',
    700: 'font-bold',
  };

  const baseClasses = `${sizeClasses[size]} ${weightClasses[weight]} ${
    muted ? 'text-white/60' : 'text-white'
  } ${className}`;

  if (asChild) {
    return <span className={baseClasses}>{children}</span>;
  }

  return <p className={baseClasses}>{children}</p>;
}

interface ParagraphProps {
  children?: React.ReactNode;
  className?: string;
  muted?: boolean;
}

export function Paragraph({ children, className = '', muted = false }: ParagraphProps) {
  return (
    <p className={`text-base leading-relaxed ${muted ? 'text-white/70' : 'text-white/90'} ${className}`}>
      {children}
    </p>
  );
}
