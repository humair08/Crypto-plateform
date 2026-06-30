'use client';

import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'accent' | 'primary';
}

export function Spinner({ size = 'md', color = 'accent' }: SpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  const colors = {
    accent: 'border-accent border-t-transparent',
    primary: 'border-white border-t-transparent',
  };

  return <div className={`rounded-full animate-spin ${sizes[size]} ${colors[color]}`} />;
}

export function LoadingDots() {
  return (
    <div className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-full bg-accent animate-pulse"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}
