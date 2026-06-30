import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface KYCStatusResponse {
  success: boolean;
  data?: {
    kycStatus: 'UNSUBMITTED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
    verified: boolean;
  };
  error?: string;
}

interface SubmitKYCResponse {
  success: boolean;
  data?: {
    kycStatus: string;
    message: string;
  };
  error?: string;
}

export async function getKYCStatus(token: string): Promise<KYCStatusResponse> {
  try {
    const response = await axios.get(`${API_URL}/api/kyc/status`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to fetch KYC status',
    };
  }
}

export async function submitKYC(
  token: string,
  data: {
    firstName: string;
    lastName: string;
    email: string;
    documentId: string;
    documentType: string;
  }
): Promise<SubmitKYCResponse> {
  try {
    const response = await axios.post(
      `${API_URL}/api/kyc/submit`,
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || 'KYC submission failed',
    };
  }
}

export async function rejectKYC(token: string, reason: string): Promise<SubmitKYCResponse> {
  try {
    const response = await axios.post(
      `${API_URL}/api/kyc/reject`,
      { reason },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || 'KYC rejection failed',
    };
  }
}
