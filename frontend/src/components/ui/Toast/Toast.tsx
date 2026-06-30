'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useNotificationStore } from '@/store/notificationStore';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
}

function ToastItem({ id, message, type }: ToastProps) {
  const { remove } = useNotificationStore();

  const icons = {
    success: <Check size={20} />,
    error: <AlertCircle size={20} />,
    info: <Info size={20} />,
    warning: <AlertTriangle size={20} />,
  };

  const colors = {
    success: 'bg-success/10 border-success text-success',
    error: 'bg-danger/10 border-danger text-danger',
    info: 'bg-accent/10 border-accent text-accent',
    warning: 'bg-warning/10 border-warning text-warning',
  };

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      className={`flex items-center gap-3 p-4 rounded-lg border ${colors[type]} backdrop-blur-lg`}
    >
      {icons[type]}
      <span className="flex-1">{message}</span>
      <button onClick={() => remove(id)} className="hover:opacity-70">
        <X size={18} />
      </button>
    </motion.div>
  );
}

export function Toast() {
  const { notifications } = useNotificationStore();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      <AnimatePresence>
        {notifications.map((notification) => (
          <ToastItem
            key={notification.id}
            id={notification.id}
            message={notification.message}
            type={notification.type as ToastType}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
