import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface WalletResponse {
  success: boolean;
  data?: {
    balance: string;
    currency: string;
    address?: string;
  };
  error?: string;
}

interface DepositResponse {
  success: boolean;
  data?: {
    transactionId: string;
    virtualAddress: string;
    amount: number;
    currency: string;
    status: string;
    message: string;
  };
  error?: string;
}

interface WithdrawResponse {
  success: boolean;
  data?: {
    transactionId: string;
    amount: number;
    address: string;
    status: string;
  };
  error?: string;
}

export async function getWalletBalance(token: string): Promise<WalletResponse> {
  try {
    const response = await axios.get(`${API_URL}/api/wallet/balance`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to fetch wallet balance',
    };
  }
}

export async function depositCrypto(
  token: string,
  amount: number
): Promise<DepositResponse> {
  try {
    const response = await axios.post(
      `${API_URL}/api/wallet/deposit`,
      { amount },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || 'Deposit failed',
    };
  }
}

export async function withdrawCrypto(
  token: string,
  amount: number,
  address: string
): Promise<WithdrawResponse> {
  try {
    const response = await axios.post(
      `${API_URL}/api/wallet/withdraw`,
      { amount, address },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || 'Withdrawal failed',
    };
  }
}
