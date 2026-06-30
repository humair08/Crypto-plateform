'use client';

import React, { InputHTMLAttributes } from 'react';

interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Radio({
  label,
  disabled = false,
  ...props
}: RadioProps) {
  return (
    <label className={`flex items-center gap-3 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <div className="relative">
        <input
          type="radio"
          disabled={disabled}
          className="absolute opacity-0 w-5 h-5 cursor-pointer"
          {...props}
        />
        <div
          className={`
            w-5 h-5 rounded-full border-2 border-border
            transition-all duration-200
            flex items-center justify-center
            ${props.checked ? 'border-accent' : 'hover:border-accent/50'}
          `}
        >
          {props.checked && (
            <div className="w-2.5 h-2.5 rounded-full bg-accent" />
          )}
        </div>
      </div>
      {label && <span className="text-white">{label}</span>}
    </label>
  );
}

interface RadioGroupProps {
  label?: string;
  options: Array<{ value: string; label: string }>;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
}

export function RadioGroup({
  label,
  options,
  value,
  onChange,
  error,
}: RadioGroupProps) {
  return (
    <div className="space-y-3">
      {label && <label className="block text-sm font-medium text-white">{label}</label>}

      <div className="space-y-2">
        {options.map((option) => (
          <Radio
            key={option.value}
            label={option.label}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange?.(option.value)}
            name={label}
          />
        ))}
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}
