/**
 * Authentication API Service
 * Handles all authentication-related API calls
 */

import axios from '@/lib/axios';
import { User, ApiResponse } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const AUTH_BASE = `${API_URL}/auth`;

interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

interface RegisterResponse {
  user: User;
  token: string;
  refreshToken: string;
}

/**
 * Login user with email and password
 */
export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  try {
    const response = await axios.post<ApiResponse<LoginResponse>>(`${AUTH_BASE}/login`, {
      email,
      password,
    });

    if (!response.data.success) {
      throw new Error(response.data.error || 'Login failed');
    }

    return response.data.data as LoginResponse;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        'Login failed'
    );
  }
}

/**
 * Register new user
 */
export async function registerUser(
  firstName: string,
  lastName: string,
  email: string,
  password: string
): Promise<RegisterResponse> {
  try {
    const response = await axios.post<ApiResponse<RegisterResponse>>(`${AUTH_BASE}/register`, {
      firstName,
      lastName,
      email,
      password,
    });

    if (!response.data.success) {
      throw new Error(response.data.error || 'Registration failed');
    }

    return response.data.data as RegisterResponse;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        'Registration failed'
    );
  }
}

/**
 * Request password reset
 */
export async function requestPasswordReset(email: string): Promise<void> {
  try {
    const response = await axios.post(`${AUTH_BASE}/forgot-password`, { email });

    if (!response.data.success) {
      throw new Error(response.data.error || 'Password reset request failed');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Password reset request failed');
  }
}

/**
 * Reset password with token
 */
export async function resetPassword(token: string, newPassword: string): Promise<void> {
  try {
    const response = await axios.post(`${AUTH_BASE}/reset-password`, {
      token,
      newPassword,
    });

    if (!response.data.success) {
      throw new Error(response.data.error || 'Password reset failed');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Password reset failed');
  }
}

/**
 * Logout user
 */
export async function logoutUser(): Promise<void> {
  try {
    await axios.post(`${AUTH_BASE}/logout`);
  } catch (error: any) {
    console.error('Logout error:', error);
  }
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<User> {
  try {
    const response = await axios.get<ApiResponse<User>>(`${AUTH_BASE}/me`);

    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to fetch user');
    }

    return response.data.data as User;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to fetch user');
  }
}

/**
 * Refresh access token
 */
export async function refreshToken(): Promise<string> {
  try {
    const response = await axios.post<ApiResponse<{ token: string }>>(`${AUTH_BASE}/refresh`);

    if (!response.data.success) {
      throw new Error(response.data.error || 'Token refresh failed');
    }

    return response.data.data?.token || '';
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Token refresh failed');
  }
}
