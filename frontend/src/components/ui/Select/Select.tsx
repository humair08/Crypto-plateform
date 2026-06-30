'use client';

import React, { SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: Array<{ value: string; label: string }>;
}

export function Select({
  label,
  error,
  hint,
  options,
  disabled = false,
  className = '',
  ...props
}: SelectProps) {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="block text-sm font-medium text-white">
          {label}
          {props.required && <span className="text-danger ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          disabled={disabled}
          className={`
            w-full px-4 py-2.5 rounded-lg
            bg-secondary border border-border
            text-white placeholder-white/40
            transition-all duration-300
            focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20
            disabled:opacity-50 disabled:cursor-not-allowed
            appearance-none pr-10
            ${error ? 'border-danger focus:ring-danger/20 focus:border-danger' : ''}
            ${className}
          `}
          {...props}
        >
          <option value="">Select an option</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown
          size={20}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none"
        />
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}
      {hint && <p className="text-sm text-white/60">{hint}</p>}
    </div>
  );
}
