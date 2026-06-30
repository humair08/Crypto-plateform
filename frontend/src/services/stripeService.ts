import axios from 'axios';

interface StripePaymentIntent {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
}

interface StripePaymentMethod {
  id: string;
  type: string;
  card?: {
    last4: string;
    brand: string;
    expMonth: number;
    expYear: number;
  };
}

interface StripeError {
  code: string;
  message: string;
  type: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const stripeService = {
  /**
   * Create a payment intent for deposit
   */
  async createPaymentIntent(
    amount: number,
    paymentMethod: string
  ): Promise<StripePaymentIntent> {
    try {
      const response = await apiClient.post('/payments/create-intent', {
        amount: Math.round(amount * 100), // Convert to cents
        paymentMethod,
        type: 'deposit',
      });

      return response.data.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to create payment intent'
      );
    }
  },

  /**
   * Confirm payment with Stripe
   */
  async confirmPayment(
    paymentIntentId: string,
    paymentMethodId: string
  ): Promise<{ success: boolean; status: string }> {
    try {
      const response = await apiClient.post('/payments/confirm', {
        paymentIntentId,
        paymentMethodId,
      });

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Payment confirmation failed');
    }
  },

  /**
   * Create a customer
   */
  async createCustomer(email: string, name: string): Promise<string> {
    try {
      const response = await apiClient.post('/payments/customers', {
        email,
        name,
      });

      return response.data.data.customerId;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create customer');
    }
  },

  /**
   * Add a payment method to customer
   */
  async addPaymentMethod(
    customerId: string,
    paymentMethodData: any
  ): Promise<StripePaymentMethod> {
    try {
      const response = await apiClient.post('/payments/payment-methods', {
        customerId,
        ...paymentMethodData,
      });

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to add payment method');
    }
  },

  /**
   * Get customer payment methods
   */
  async getPaymentMethods(customerId: string): Promise<StripePaymentMethod[]> {
    try {
      const response = await apiClient.get(`/payments/payment-methods/${customerId}`);

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch payment methods');
    }
  },

  /**
   * Delete a payment method
   */
  async deletePaymentMethod(paymentMethodId: string): Promise<boolean> {
    try {
      await apiClient.delete(`/payments/payment-methods/${paymentMethodId}`);

      return true;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete payment method');
    }
  },

  /**
   * Process a deposit
   */
  async processDeposit(
    amount: number,
    paymentMethodId: string,
    source: string = 'web'
  ): Promise<{ transactionId: string; status: string; balance: number }> {
    try {
      const response = await apiClient.post('/transactions/deposit', {
        amount,
        paymentMethodId,
        source,
      });

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Deposit failed');
    }
  },

  /**
   * Process a withdrawal
   */
  async processWithdrawal(
    amount: number,
    bankAccountId: string
  ): Promise<{ transactionId: string; status: string; estimatedTime: string }> {
    try {
      const response = await apiClient.post('/transactions/withdraw', {
        amount,
        bankAccountId,
      });

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Withdrawal failed');
    }
  },

  /**
   * Get payment history
   */
  async getPaymentHistory(
    page: number = 1,
    limit: number = 10
  ): Promise<{
    transactions: any[];
    total: number;
    page: number;
    pages: number;
  }> {
    try {
      const response = await apiClient.get('/payments/history', {
        params: { page, limit },
      });

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch payment history');
    }
  },

  /**
   * Refund a payment
   */
  async refundPayment(
    paymentIntentId: string,
    reason: string
  ): Promise<{ refundId: string; status: string }> {
    try {
      const response = await apiClient.post('/payments/refund', {
        paymentIntentId,
        reason,
      });

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Refund failed');
    }
  },

  /**
   * Handle Stripe webhook events
   */
  async handleWebhook(event: any): Promise<boolean> {
    try {
      await apiClient.post('/payments/webhooks', event);
      return true;
    } catch (error: any) {
      console.error('Webhook handling failed:', error);
      return false;
    }
  },

  /**
   * Get wallet balance
   */
  async getBalance(): Promise<{ balance: number; currency: string }> {
    try {
      const response = await apiClient.get('/wallet/balance');
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch balance');
    }
  },

  /**
   * Validate payment method
   */
  async validatePaymentMethod(
    paymentMethodId: string
  ): Promise<{ valid: boolean; message: string }> {
    try {
      const response = await apiClient.post('/payments/validate', {
        paymentMethodId,
      });

      return response.data.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Payment method validation failed'
      );
    }
  },
};

// Export Stripe error handler
export const handleStripeError = (error: any): StripeError => {
  if (error.response?.data?.stripeError) {
    return error.response.data.stripeError;
  }

  return {
    code: 'unknown_error',
    message: error.message || 'An unexpected error occurred',
    type: 'api_error',
  };
};
