import { Router, Request, Response } from 'express';
import Stripe from 'stripe';
import { authenticateToken } from '../middleware/auth';
import { AuthRequest } from '@/types/express';
import { prisma } from '../db/client';

const router = Router();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-08-16',
});

// Types
interface PaymentRequest {
  amount: number;
  paymentMethod: string;
  type: 'deposit' | 'withdrawal';
}

interface ConfirmPaymentRequest {
  paymentIntentId: string;
  paymentMethodId: string;
}

// Create Payment Intent
router.post('/create-intent', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { amount, paymentMethod, type } = req.body as PaymentRequest;

    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    if (!amount || amount <= 0) {
      throw new Error('Invalid amount');
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || undefined,
      });
      customerId = customer.id;

      await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customerId },
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      customer: customerId,
      payment_method: paymentMethod,
      automatic_payment_methods: {
        enabled: true,
      },
      confirm: false,
      metadata: {
        userId,
        type,
      },
    });

    await prisma.payment.create({
      data: {
        userId,
        stripePaymentIntentId: paymentIntent.id,
        amount,
        currency: 'USD',
        status: 'PENDING',
        method: 'CREDIT_CARD',
      },
    });

    return res.json({
      status: 'success',
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount,
        currency: 'usd',
      },
    });
  } catch (error: any) {
    return res.status(error.statusCode || 400).json({
      status: 'error',
      message: error.message,
      stripeError: error.stripeError || null,
    });
  }
});

// Confirm Payment
router.post('/confirm', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { paymentIntentId, paymentMethodId } = req.body as ConfirmPaymentRequest;

    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    if (!paymentIntentId || !paymentMethodId) {
      throw new Error('Invalid payment parameters');
    }

    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethodId,
    });

    const amount = (paymentIntent.amount ?? 0) / 100;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    if (paymentIntent.status === 'succeeded') {
      // Ensure the user has a wallet and use its id for the transaction
      let wallet = await prisma.wallet.findUnique({ where: { userId } });
      if (!wallet) {
        wallet = await prisma.wallet.create({
          data: {
            userId,
            balance: 0,
            currency: 'USD',
            address: `0x${Math.random().toString(16).slice(2).padEnd(40, '0')}`,
          },
        });
      }

      const transaction = await prisma.transaction.create({
        data: {
          walletId: wallet.id,
          userId,
          type: 'DEPOSIT',
          amount,
          reference: paymentIntent.id,
        },
      });

      await prisma.payment.updateMany({
        where: { stripePaymentIntentId: paymentIntentId },
        data: { status: 'COMPLETED' },
      });

      await prisma.user.update({
        where: { id: userId },
        data: { balance: Number(user.balance) + amount },
      });

      return res.json({
        status: 'success',
        data: {
          success: true,
          status: 'succeeded',
          transactionId: transaction.id,
        },
      });
    } else if (paymentIntent.status === 'requires_action') {
      return res.json({
        status: 'success',
        data: {
          success: false,
          status: 'requires_action',
          clientSecret: paymentIntent.client_secret,
        },
      });
    } else {
      throw new Error('Payment failed');
    }
  } catch (error: any) {
    return res.status(error.statusCode || 400).json({
      status: 'error',
      message: error.message,
    });
  }
});

// Create Customer
router.post('/customers', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const customer = await stripe.customers.create({
      email: user.email,
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || undefined,
    });

    await prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId: customer.id },
    });

    return res.json({
      status: 'success',
      data: {
        customerId: customer.id,
      },
    });
  } catch (error: any) {
    return res.status(error.statusCode || 400).json({
      status: 'error',
      message: error.message,
    });
  }
});

// Add Payment Method
router.post('/payment-methods', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { customerId, card } = req.body;

    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    if (!customerId || !card) {
      throw new Error('Customer ID and card data are required');
    }

    const paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card,
    });

    await stripe.paymentMethods.attach(paymentMethod.id, {
      customer: customerId,
    });

    return res.json({
      status: 'success',
      data: paymentMethod,
    });
  } catch (error: any) {
    return res.status(error.statusCode || 400).json({
      status: 'error',
      message: error.message,
    });
  }
});

// Get Payment Methods
router.get('/payment-methods/:customerId', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { customerId } = req.params;

    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });

    return res.json({
      status: 'success',
      data: paymentMethods.data,
    });
  } catch (error: any) {
    return res.status(error.statusCode || 400).json({
      status: 'error',
      message: error.message,
    });
  }
});

// Delete Payment Method
router.delete('/payment-methods/:paymentMethodId', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { paymentMethodId } = req.params;

    if (!userId) {
      throw new Error('Unauthorized');
    }

    // Detach from customer
    await stripe.paymentMethods.detach(paymentMethodId);

    return res.json({
      status: 'success',
      message: 'Payment method deleted',
    });
  } catch (error: any) {
    return res.status(error.statusCode || 400).json({
      status: 'error',
      message: error.message,
    });
  }
});

// Process Refund
router.post('/refund', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { paymentIntentId, reason } = req.body;

    if (!paymentIntentId) {
      throw new Error('Payment Intent ID is required');
    }

    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      reason: reason || 'requested_by_customer',
    });

    await prisma.payment.updateMany({
      where: {
        stripePaymentIntentId: paymentIntentId,
      },
      data: {
        status: 'REFUNDED',
      },
    });

    return res.json({
      status: 'success',
      data: {
        refundId: refund.id,
        status: refund.status,
      },
    });
  } catch (error: any) {
    return res.status(error.statusCode || 400).json({
      status: 'error',
      message: error.message,
    });
  }
});

// Webhook Handler
router.post('/webhooks', async (req: Request, res: Response) => {
  try {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

    const event = stripe.webhooks.constructEvent(
      req.body,
      sig as string,
      webhookSecret
    );

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await prisma.payment.updateMany({
          where: {
            stripePaymentIntentId: paymentIntent.id,
          },
          data: {
            status: 'COMPLETED',
          },
        });
        break;
      }

      case 'payment_intent.payment_failed': {
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        await prisma.payment.updateMany({
          where: {
            stripePaymentIntentId: failedPayment.id,
          },
          data: {
            status: 'FAILED',
          },
        });
        break;
      }

      case 'charge.refunded': {
        const refundedCharge = event.data.object as Stripe.Charge;
        await prisma.payment.updateMany({
          where: {
            stripePaymentIntentId: refundedCharge.payment_intent as string,
          },
          data: {
            status: 'REFUNDED',
          },
        });
        break;
      }
    }

    return res.json({ status: 'success', received: true });
  } catch (error: any) {
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
});

export default router;
