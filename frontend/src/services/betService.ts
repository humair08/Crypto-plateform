/**
 * Bets API Service
 * Handles all betting-related API calls
 */

import axios from '@/lib/axios';
import { ApiResponse } from '@/types';

export interface Bet {
  id: string;
  userId: string;
  eventId: string;
  amount: number;
  odds: number;
  potentialWinnings: number;
  status: 'pending' | 'won' | 'lost' | 'cancelled';
  type: 'moneyline' | 'spread' | 'over_under';
  createdAt: string;
  resolvedAt?: string;
  result?: 'win' | 'loss';
}

export interface BetCreatePayload {
  eventId: string;
  amount: number;
  type: 'moneyline' | 'spread' | 'over_under';
  selection: string;
}

/**
 * Get all bets for current user
 */
export async function getUserBets(page: number = 1, limit: number = 20): Promise<{
  bets: Bet[];
  total: number;
  pages: number;
}> {
  try {
    const response = await axios.get<ApiResponse<any>>('/bets', {
      params: { page, limit },
    });

    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to fetch bets');
    }

    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to fetch bets');
  }
}

/**
 * Get single bet details
 */
export async function getBetById(betId: string): Promise<Bet> {
  try {
    const response = await axios.get<ApiResponse<Bet>>(`/bets/${betId}`);

    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to fetch bet');
    }

    return response.data.data as Bet;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to fetch bet');
  }
}

/**
 * Create new bet
 */
export async function createBet(payload: BetCreatePayload): Promise<Bet> {
  try {
    const response = await axios.post<ApiResponse<Bet>>('/bets', payload);

    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to create bet');
    }

    return response.data.data as Bet;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to create bet');
  }
}

/**
 * Cancel bet
 */
export async function cancelBet(betId: string): Promise<void> {
  try {
    const response = await axios.post(`/bets/${betId}/cancel`);

    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to cancel bet');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to cancel bet');
  }
}

/**
 * Get bet statistics
 */
export async function getBetStats(): Promise<{
  totalBets: number;
  winRate: number;
  totalStaked: number;
  totalWinnings: number;
  activeBets: number;
}> {
  try {
    const response = await axios.get<ApiResponse<any>>('/bets/stats');

    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to fetch stats');
    }

    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to fetch stats');
  }
}
