/**
 * Transactions API Service
 * Handles all payment and transaction operations
 */

import axios from '@/lib/axios';
import { ApiResponse } from '@/types';

export interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'bet' | 'winnings';
  amount: number;
  balance: number;
  status: 'pending' | 'completed' | 'failed';
  method?: string;
  description: string;
  createdAt: string;
}

export interface DepositPayload {
  amount: number;
  method: 'card' | 'bank' | 'wallet';
  cardToken?: string;
}

/**
 * Get transaction history
 */
export async function getTransactions(page: number = 1, limit: number = 20): Promise<{
  transactions: Transaction[];
  total: number;
  pages: number;
}> {
  try {
    const response = await axios.get<ApiResponse<any>>('/transactions', {
      params: { page, limit },
    });

    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to fetch transactions');
    }

    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to fetch transactions');
  }
}

/**
 * Get single transaction
 */
export async function getTransaction(transactionId: string): Promise<Transaction> {
  try {
    const response = await axios.get<ApiResponse<Transaction>>(`/transactions/${transactionId}`);

    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to fetch transaction');
    }

    return response.data.data as Transaction;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to fetch transaction');
  }
}

/**
 * Deposit funds
 */
export async function depositFunds(payload: DepositPayload): Promise<Transaction> {
  try {
    const response = await axios.post<ApiResponse<Transaction>>('/transactions/deposit', payload);

    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to deposit funds');
    }

    return response.data.data as Transaction;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to deposit funds');
  }
}

/**
 * Withdraw funds
 */
export async function withdrawFunds(amount: number, method: string): Promise<Transaction> {
  try {
    const response = await axios.post<ApiResponse<Transaction>>('/transactions/withdraw', {
      amount,
      method,
    });

    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to withdraw funds');
    }

    return response.data.data as Transaction;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to withdraw funds');
  }
}

/**
 * Get account balance
 */
export async function getBalance(): Promise<{ balance: number; currency: string }> {
  try {
    const response = await axios.get<ApiResponse<any>>('/transactions/balance');

    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to fetch balance');
    }

    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to fetch balance');
  }
}
