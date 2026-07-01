import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '@/db/client';
import { verifyToken } from '@/utils/jwt';

const router = Router();

interface AuthRequest extends Request {
  user?: { id: string };
  io?: any;
}

// Middleware to verify auth
const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): Response | void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ success: false, error: 'No token provided' });
    return;
  }

  try {
    const decoded = verifyToken(token) as any;
    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    res.status(403).json({ success: false, error: 'Invalid token' });
    return;
  }
};

// GET /api/wallet/balance
router.get('/balance', authenticateToken, async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const wallet = await prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      return res.status(404).json({ success: false, error: 'Wallet not found' });
    }

    res.json({
      success: true,
      data: {
        balance: wallet.balance.toString(),
        currency: wallet.currency,
        address: wallet.address,
      },
    });
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch balance' });
  }
});

// POST /api/wallet/deposit
router.post('/deposit', authenticateToken, async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const { amount } = req.body;

    if (!amount || parseFloat(amount) <= 0) {
      return res.status(400).json({ success: false, error: 'Invalid amount' });
    }

    // Get or create wallet
    let wallet = await prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          userId,
          balance: 0,
          currency: 'USDT',
          address: `0x${Math.random().toString(16).slice(2).padEnd(40, '0')}`,
        },
      });
    }

    // Generate virtual address for display
    const virtualAddress = `0x${Math.random().toString(16).slice(2).padEnd(40, '0')}`;

    // Create pending transaction
    const transaction = await prisma.transaction.create({
      data: {
        walletId: wallet.id,
        userId,
        type: 'DEPOSIT',
        amount: BigInt(parseFloat(amount) * 1e8) as any,
        status: 'PENDING',
        reference: `DEP-${Date.now()}`,
        description: `Deposit via virtual address ${virtualAddress}`,
      },
    });

    // Simulate payment confirmation after 3 seconds
    setTimeout(async () => {
      try {
        const depositAmount = parseFloat(amount);

        // Update wallet balance
        const updatedWallet = await prisma.wallet.update({
          where: { userId },
          data: {
            balance: { increment: depositAmount },
          },
        });

        // Update transaction status
        await prisma.transaction.update({
          where: { id: transaction.id },
          data: { status: 'COMPLETED' },
        });

        // Broadcast update via WebSocket
        if (req.io) {
          req.io.to(`user_${userId}`).emit('wallet_updated', {
            balance: updatedWallet.balance.toString(),
            currency: updatedWallet.currency,
            transaction: {
              id: transaction.id,
              type: 'DEPOSIT',
              amount: depositAmount,
              status: 'COMPLETED',
              timestamp: new Date().toISOString(),
            },
          });
        }

        console.log(`✅ Deposit confirmed for user ${userId}: ${depositAmount} USDT`);
      } catch (error) {
        console.error('Error confirming deposit:', error);
      }
    }, 3000);

    res.json({
      success: true,
      data: {
        transactionId: transaction.id,
        virtualAddress,
        amount: parseFloat(amount),
        currency: 'USDT',
        status: 'PENDING',
        message: 'Deposit initiated. Confirmation in 3 seconds.',
      },
    });
  } catch (error) {
    console.error('Deposit error:', error);
    res.status(500).json({ success: false, error: 'Deposit failed' });
  }
});

// POST /api/wallet/withdraw
router.post('/withdraw', authenticateToken, async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const { amount, address } = req.body;

    if (!amount || parseFloat(amount) <= 0) {
      return res.status(400).json({ success: false, error: 'Invalid amount' });
    }

    if (!address) {
      return res.status(400).json({ success: false, error: 'Invalid address' });
    }

    const wallet = await prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      return res.status(404).json({ success: false, error: 'Wallet not found' });
    }

    const withdrawAmount = parseFloat(amount);
    if (withdrawAmount > parseFloat(wallet.balance.toString())) {
      return res.status(400).json({ success: false, error: 'Insufficient balance' });
    }

    // Create withdrawal transaction
    const transaction = await prisma.transaction.create({
      data: {
        walletId: wallet.id,
        userId,
        type: 'WITHDRAWAL',
        amount: BigInt(withdrawAmount * 1e8) as any,
        status: 'PENDING',
        reference: `WTH-${Date.now()}`,
        description: `Withdrawal to ${address}`,
      },
    });

    // Update wallet balance
    const updatedWallet = await prisma.wallet.update({
      where: { userId },
      data: {
        balance: { decrement: withdrawAmount },
      },
    });

    // Broadcast update
    if (req.io) {
      req.io.to(`user_${userId}`).emit('wallet_updated', {
        balance: updatedWallet.balance.toString(),
        currency: updatedWallet.currency,
        transaction: {
          id: transaction.id,
          type: 'WITHDRAWAL',
          amount: withdrawAmount,
          status: 'PENDING',
          address,
          timestamp: new Date().toISOString(),
        },
      });
    }

    res.json({
      success: true,
      data: {
        transactionId: transaction.id,
        amount: withdrawAmount,
        address,
        status: 'PENDING',
      },
    });
  } catch (error) {
    console.error('Withdrawal error:', error);
    res.status(500).json({ success: false, error: 'Withdrawal failed' });
  }
});

export default router;
