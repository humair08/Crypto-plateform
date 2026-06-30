'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
  delay?: number;
}

export function Tooltip({
  content,
  children,
  position = 'top',
  delay = 0.2,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const positionClasses = {
    top: 'bottom-full mb-2',
    right: 'left-full ml-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
  };

  const arrowClasses = {
    top: 'top-full -translate-y-1.5 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent',
    right: 'right-full translate-x-1.5 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent',
    bottom: 'bottom-full translate-y-1.5 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent',
    left: 'left-full -translate-x-1.5 border-t-4 border-b-4 border-l-4 border-t-transparent border-b-transparent',
  };

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => setIsVisible(true), delay * 1000);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`absolute ${positionClasses[position]} z-50 px-3 py-2 rounded-lg bg-secondary/95 border border-border/50 text-sm text-white whitespace-nowrap`}
          >
            {content}
            <div
              className={`absolute ${arrowClasses[position]} border-secondary/95`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
