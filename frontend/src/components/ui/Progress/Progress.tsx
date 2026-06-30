'use client';

import React from 'react';

interface ProgressProps {
  value: number;
  max?: number;
  color?: 'accent' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
}

export function Progress({
  value,
  max = 100,
  color = 'accent',
  size = 'md',
  showLabel = false,
  animated = true,
}: ProgressProps) {
  const percentage = Math.min((value / max) * 100, 100);

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  const colors = {
    accent: 'bg-[#00FF87]',
    success: 'bg-[#00FF87]',
    warning: 'bg-[#FBBF24]',
    danger: 'bg-[#EF4444]',
  };

  return (
    <div className="space-y-1">
      <div
        className={`w-full ${sizes[size]} rounded-full bg-secondary/50 overflow-hidden border border-white/10`}
      >
        <div
          className={`${colors[color]} ${sizes[size]} transition-all duration-300 ${
            animated ? 'animate-pulse' : ''
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-white/60">{Math.round(percentage)}%</p>
      )}
    </div>
  );
}

interface ProgressRingProps {
  value: number;
  max?: number;
  color?: 'accent' | 'success' | 'warning' | 'danger';
  size?: number;
  showLabel?: boolean;
}

export function ProgressRing({
  value,
  max = 100,
  color = 'accent',
  size = 80,
  showLabel = true,
}: ProgressRingProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const circumference = 2 * Math.PI * (size / 2 - 4);
  const offset = circumference - (percentage / 100) * circumference;

  const colors = {
    accent: '#00FF87',
    success: '#00FF87',
    warning: '#FBBF24',
    danger: '#EF4444',
  };

  return (
    <div className="flex flex-col items-center justify-center relative">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 4}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="3"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 4}
          fill="none"
          stroke={colors[color]}
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-lg font-bold text-white">{Math.round(percentage)}%</p>
        </div>
      )}
    </div>
  );
}
