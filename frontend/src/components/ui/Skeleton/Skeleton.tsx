'use client';

import React from 'react';

interface SkeletonProps {
  variant?: 'text' | 'circle' | 'rect';
  width?: string;
  height?: string;
  className?: string;
}

export function Skeleton({
  variant = 'rect',
  width = '100%',
  height = '20px',
  className = '',
}: SkeletonProps) {
  const shapes = {
    text: 'rounded',
    circle: 'rounded-full',
    rect: 'rounded-lg',
  };

  return (
    <div
      className={`skeleton ${shapes[variant]} ${className}`}
      style={{ width, height }}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="space-y-4 p-6 rounded-lg border border-border bg-secondary/30">
      <Skeleton height="24px" />
      <Skeleton height="16px" width="80%" />
      <div className="space-y-2">
        <Skeleton height="16px" />
        <Skeleton height="16px" width="90%" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4 bg-secondary/30 rounded-lg">
          <Skeleton width="40px" height="40px" variant="circle" />
          <div className="flex-1 space-y-2">
            <Skeleton height="16px" width="60%" />
            <Skeleton height="14px" width="40%" />
          </div>
        </div>
      ))}
    </div>
  );
}
