/**
 * Events API Service
 * Handles all betting events and odds API calls
 */

import axios from '@/lib/axios';
import { ApiResponse } from '@/types';

export interface BettingEvent {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  status: 'upcoming' | 'live' | 'closed' | 'settled';
  sport: string;
  league: string;
  odds: {
    moneyline?: { home: number; away: number };
    spread?: { home: number; homeSpread: number; away: number; awaySpread: number };
    overUnder?: { over: number; under: number; total: number };
  };
  imageUrl?: string;
  participants: Array<{ name: string; logo?: string }>;
}

/**
 * Get all upcoming events
 */
export async function getUpcomingEvents(page: number = 1, limit: number = 20): Promise<{
  events: BettingEvent[];
  total: number;
  pages: number;
}> {
  try {
    const response = await axios.get<ApiResponse<any>>('/events/upcoming', {
      params: { page, limit },
    });

    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to fetch events');
    }

    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to fetch events');
  }
}

/**
 * Get live events
 */
export async function getLiveEvents(page: number = 1, limit: number = 20): Promise<{
  events: BettingEvent[];
  total: number;
  pages: number;
}> {
  try {
    const response = await axios.get<ApiResponse<any>>('/events/live', {
      params: { page, limit },
    });

    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to fetch live events');
    }

    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to fetch live events');
  }
}

/**
 * Get event by ID
 */
export async function getEventById(eventId: string): Promise<BettingEvent> {
  try {
    const response = await axios.get<ApiResponse<BettingEvent>>(`/events/${eventId}`);

    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to fetch event');
    }

    return response.data.data as BettingEvent;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to fetch event');
  }
}

/**
 * Search events
 */
export async function searchEvents(query: string, page: number = 1, limit: number = 20): Promise<{
  events: BettingEvent[];
  total: number;
  pages: number;
}> {
  try {
    const response = await axios.get<ApiResponse<any>>('/events/search', {
      params: { q: query, page, limit },
    });

    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to search events');
    }

    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to search events');
  }
}

/**
 * Get events by sport
 */
export async function getEventsBySport(sport: string, page: number = 1, limit: number = 20): Promise<{
  events: BettingEvent[];
  total: number;
  pages: number;
}> {
  try {
    const response = await axios.get<ApiResponse<any>>(`/events/sport/${sport}`, {
      params: { page, limit },
    });

    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to fetch events');
    }

    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to fetch events');
  }
}
