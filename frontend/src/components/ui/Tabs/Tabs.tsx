'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface TabsProps {
  tabs: Array<{ label: string; content: React.ReactNode; id: string }>;
  defaultTab?: string;
  onChange?: (tabId: string) => void;
}

export function Tabs({ tabs, defaultTab, onChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  return (
    <div>
      <div className="flex border-b border-border/50 gap-4 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`px-4 py-3 font-medium whitespace-nowrap transition-colors relative ${
              activeTab === tab.id ? 'text-accent' : 'text-white/60 hover:text-white'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="active-tab"
                className="absolute bottom-0 left-0 right-0 h-1 bg-accent"
              />
            )}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {tabs.map((tab) => (
          <div key={tab.id} className={activeTab === tab.id ? 'block' : 'hidden'}>
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}
