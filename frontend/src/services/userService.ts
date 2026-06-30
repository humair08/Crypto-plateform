/**
 * User API Service
 * Handles user profile and account operations
 */

import axios from '@/lib/axios';
import { User, ApiResponse } from '@/types';

/**
 * Get user profile
 */
export async function getUserProfile(userId: string): Promise<User> {
  try {
    const response = await axios.get<ApiResponse<User>>(`/users/${userId}`);

    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to fetch profile');
    }

    return response.data.data as User;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to fetch profile');
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  data: Partial<User>
): Promise<User> {
  try {
    const response = await axios.patch<ApiResponse<User>>(`/users/${userId}`, data);

    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to update profile');
    }

    return response.data.data as User;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to update profile');
  }
}

/**
 * Change password
 */
export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<void> {
  try {
    const response = await axios.post('/users/change-password', {
      currentPassword,
      newPassword,
    });

    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to change password');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to change password');
  }
}

/**
 * Enable two-factor authentication
 */
export async function enableTwoFactor(): Promise<{ secret: string; qrCode: string }> {
  try {
    const response = await axios.post<ApiResponse<{ secret: string; qrCode: string }>>(
      '/users/2fa/enable'
    );

    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to enable 2FA');
    }

    return response.data.data as { secret: string; qrCode: string };
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to enable 2FA');
  }
}

/**
 * Verify two-factor authentication
 */
export async function verifyTwoFactor(code: string): Promise<void> {
  try {
    const response = await axios.post('/users/2fa/verify', { code });

    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to verify 2FA');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to verify 2FA');
  }
}
