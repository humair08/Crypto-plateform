'use client';

import React from 'react';
import { getInitials } from '@/utils/helpers';

interface AvatarProps {
  src?: string;
  alt?: string;
  firstName?: string;
  lastName?: string;
  size?: 'sm' | 'md' | 'lg';
  status?: 'online' | 'offline' | 'away';
}

export function Avatar({
  src,
  alt,
  firstName,
  lastName,
  size = 'md',
  status,
}: AvatarProps) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const statusDots = {
    online: 'bg-success',
    offline: 'bg-white/40',
    away: 'bg-warning',
  };

  if (src) {
    return (
      <div className="relative">
        <img
          src={src}
          alt={alt}
          className={`${sizes[size]} rounded-full object-cover border border-white/[0.08] bg-slate-800/50`}
        />
        {status && (
          <div className={`absolute bottom-0 right-0 w-3 h-3 ${statusDots[status]} rounded-full border-2 border-white/[0.08]`} />
        )}
      </div>
    );
  }

  const initials = getInitials(firstName || '', lastName || '');

  return (
    <div className="relative">
      <div
        className={`${sizes[size]} rounded-full bg-slate-800/50 border border-white/[0.08] flex items-center justify-center font-semibold text-white`}
      >
        {initials}
      </div>
      {status && (
        <div className={`absolute bottom-0 right-0 w-3 h-3 ${statusDots[status]} rounded-full border-2 border-white/[0.08]`} />
      )}
    </div>
  );
}
