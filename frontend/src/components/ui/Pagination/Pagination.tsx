'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../Button/Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisible?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  maxVisible = 5,
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const half = Math.floor(maxVisible / 2);

    let start = Math.max(1, currentPage - half);
    const end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    if (start > 1) pages.push(1);
    if (start > 2) pages.push('...');

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) pages.push('...');
    if (end < totalPages) pages.push(totalPages);

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        icon={<ChevronLeft size={18} />}
      />

      {pages.map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <span className="px-2 text-white/60">...</span>
          ) : (
            <Button
              variant={currentPage === page ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onPageChange(page as number)}
            >
              {page}
            </Button>
          )}
        </React.Fragment>
      ))}

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        icon={<ChevronRight size={18} />}
      />
    </div>
  );
}
