'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface SidebarItem {
  label: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  children?: SidebarItem[];
  active?: boolean;
}

interface SidebarProps {
  items: SidebarItem[];
  onNavigate?: (href: string) => void;
  collapsible?: boolean;
  initialCollapsed?: boolean;
}

function SidebarItemComponent({
  item,
  onNavigate,
  level = 0,
}: {
  item: SidebarItem;
  onNavigate?: (href: string) => void;
  level?: number;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  const handleClick = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    } else if (item.href) {
      onNavigate?.(item.href);
    }
    item.onClick?.();
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className={`w-full px-4 py-2.5 flex items-center justify-between text-left transition-colors ${
          item.active
            ? 'rounded-full bg-[#00FF87]/10 text-[#00FF87]'
            : 'rounded-2xl text-white/70 hover:text-white hover:bg-white/5'
        }`}
        style={{ paddingLeft: `${12 + level * 12}px` }}
      >
        <div className="flex items-center gap-3">
          {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
          <span className="text-sm font-medium">{item.label}</span>
        </div>
        {hasChildren && (
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            className="flex-shrink-0"
          >
            <ChevronRight size={18} />
          </motion.div>
        )}
      </button>

      {hasChildren && isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-1"
        >
          {item.children?.map((child, index) => (
            <SidebarItemComponent
              key={index}
              item={child}
              onNavigate={onNavigate}
              level={level + 1}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}

export function Sidebar({
  items,
  onNavigate,
  initialCollapsed = false,
}: SidebarProps) {
  const [isCollapsed] = useState(initialCollapsed);

  return (
    <aside
      className={`transition-all duration-300 bg-[#080c16]/95 border-r border-white/10 text-white/80 shadow-glass ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      <div className="p-4 space-y-2">
        {items.map((item, index) => (
          <SidebarItemComponent
            key={index}
            item={item}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </aside>
  );
}
