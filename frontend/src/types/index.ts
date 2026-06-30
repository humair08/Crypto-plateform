import { ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  phone?: string;
  country?: string;
  birthDate?: string;
  role: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  action: string;
  resource: string;
}

export interface Bet {
  id: string;
  userId: string;
  eventId: string;
  type: 'MONEYLINE' | 'SPREAD' | 'TOTAL' | 'PARLAY';
  amount: number;
  odds: number;
  potential: number;
  status: 'PENDING' | 'ACCEPTED' | 'WON' | 'LOST' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

export interface BettingEvent {
  id: string;
  name: string;
  description?: string;
  type: 'SPORTS' | 'ESPORTS' | 'POLITICS' | 'ENTERTAINMENT';
  status: 'ACTIVE' | 'CLOSED' | 'CANCELLED';
  odds: Record<string, number>;
  startTime: string;
  endTime?: string;
}

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  method: 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_TRANSFER' | 'WALLET';
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'BET_WIN' | 'BET_LOSS' | 'BONUS';
  amount: number;
  balance: number;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  read: boolean;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  username: string;
  firstName?: string;
  lastName?: string;
}

export interface ComponentProps {
  children?: ReactNode;
  className?: string;
}
