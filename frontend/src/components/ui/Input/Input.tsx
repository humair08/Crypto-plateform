'use client';

import React, { InputHTMLAttributes, ReactNode, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  helpText?: string;
}

export function Input({
  label,
  error,
  hint,
  icon,
  helpText,
  type = 'text',
  disabled = false,
  className = '',
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="block text-sm font-medium text-white">
          {label}
          {props.required && <span className="text-danger ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">
            {icon}
          </div>
        )}

        <input
          type={isPassword && showPassword ? 'text' : type}
          disabled={disabled}
          className={`
            w-full px-4 py-2.5 rounded-lg
            bg-secondary border border-border
            text-white placeholder-white/40
            transition-all duration-300
            focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20
            disabled:opacity-50 disabled:cursor-not-allowed
            ${icon ? 'pl-10' : ''}
            ${isPassword ? 'pr-10' : ''}
            ${error ? 'border-danger focus:ring-danger/20 focus:border-danger' : ''}
            ${className}
          `}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}
      {hint && <p className="text-sm text-white/60">{hint}</p>}
      {helpText && <p className="text-xs text-white/50">{helpText}</p>}
    </div>
  );
}
