'use client';

import React, { InputHTMLAttributes } from 'react';

interface ToggleProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Toggle({
  label,
  disabled = false,
  ...props
}: ToggleProps) {
  return (
    <label className={`flex items-center gap-3 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <div className="relative">
        <input
          type="checkbox"
          disabled={disabled}
          className="absolute opacity-0 w-10 h-6 cursor-pointer"
          {...props}
        />
        <div
          className={`
            w-10 h-6 rounded-full border border-border
            transition-all duration-300
            flex items-center
            ${props.checked ? 'bg-accent justify-end' : 'bg-secondary justify-start'}
          `}
        >
          <div className="w-5 h-5 rounded-full bg-primary m-0.5 transition-all duration-300" />
        </div>
      </div>
      {label && <span className="text-white">{label}</span>}
    </label>
  );
}
