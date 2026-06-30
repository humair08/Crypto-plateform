'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onNavigate?: (href: string) => void;
}

export function Breadcrumb({ items, onNavigate }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1 text-sm text-white/70">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ChevronRight size={16} className="mx-1" />}
          {item.href ? (
            <button
              onClick={() => onNavigate?.(item.href!)}
              className="hover:text-accent transition-colors"
            >
              {item.label}
            </button>
          ) : (
            <span className={index === items.length - 1 ? 'text-white' : ''}>
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
