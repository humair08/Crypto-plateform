'use client';

import React, { InputHTMLAttributes } from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  error?: string;
}

export function Checkbox({
  label,
  error,
  disabled = false,
  className = '',
  ...props
}: CheckboxProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className={`flex items-center gap-3 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
        <div className="relative">
          <input
            type="checkbox"
            disabled={disabled}
            className="absolute opacity-0 w-5 h-5 cursor-pointer"
            {...props}
          />
          <div
            className={`
              w-5 h-5 rounded border-2 border-border
              transition-all duration-200
              flex items-center justify-center
              ${props.checked ? 'bg-accent border-accent' : 'hover:border-accent/50'}
            `}
          >
            {props.checked && <Check size={16} className="text-primary" />}
          </div>
        </div>
        {label && <span className="text-white">{label}</span>}
      </label>

      {error && <p className="text-sm text-danger ml-8">{error}</p>}
    </div>
  );
}

interface CheckboxGroupProps {
  label?: string;
  options: Array<{ value: string; label: string }>;
  value?: string[];
  onChange?: (values: string[]) => void;
  error?: string;
}

export function CheckboxGroup({
  label,
  options,
  value = [],
  onChange,
  error,
}: CheckboxGroupProps) {
  return (
    <div className="space-y-3">
      {label && <label className="block text-sm font-medium text-white">{label}</label>}

      <div className="space-y-2">
        {options.map((option) => (
          <Checkbox
            key={option.value}
            label={option.label}
            value={option.value}
            checked={value.includes(option.value)}
            onChange={(e) => {
              const newValue = e.currentTarget.checked
                ? [...value, option.value]
                : value.filter((v) => v !== option.value);
              onChange?.(newValue);
            }}
          />
        ))}
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}
