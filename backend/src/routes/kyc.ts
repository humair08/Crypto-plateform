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

// GET /api/kyc/status
router.get('/status', authenticateToken, async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({
      success: true,
      data: {
        kycStatus: user.kycStatus,
        verified: user.kycStatus === 'VERIFIED',
      },
    });
  } catch (error) {
    console.error('KYC status error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch KYC status' });
  }
});

// POST /api/kyc/submit
router.post('/submit', authenticateToken, async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const { firstName, lastName, email, documentId, documentType } = req.body;

    if (!firstName || !lastName || !email || !documentId || !documentType) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    // Update user KYC status to PENDING
    let user = await prisma.user.update({
      where: { id: userId },
      data: {
        kycStatus: 'PENDING',
        firstName,
        lastName,
        email,
      },
    });

    // Simulate verification approval after 5 seconds
    setTimeout(async () => {
      try {
        user = await prisma.user.update({
          where: { id: userId },
          data: { kycStatus: 'VERIFIED' },
        });

        // Broadcast update
        if (req.io) {
          req.io.to(`user_${userId}`).emit('kyc_updated', {
            kycStatus: 'VERIFIED',
            verified: true,
            message: 'KYC verification approved!',
            timestamp: new Date().toISOString(),
          });
        }

        console.log(`✅ KYC verified for user ${userId}`);
      } catch (error) {
        console.error('Error updating KYC status:', error);
      }
    }, 5000);

    res.json({
      success: true,
      data: {
        kycStatus: user.kycStatus,
        message: 'KYC submission received. Verification in progress (5 seconds).',
      },
    });
  } catch (error) {
    console.error('KYC submission error:', error);
    res.status(500).json({ success: false, error: 'KYC submission failed' });
  }
});

// POST /api/kyc/reject
router.post('/reject', authenticateToken, async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ success: false, error: 'Reason required' });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { kycStatus: 'REJECTED' },
    });

    // Broadcast update
    if (req.io) {
      req.io.to(`user_${userId}`).emit('kyc_updated', {
        kycStatus: 'REJECTED',
        verified: false,
        reason,
        message: `KYC rejected: ${reason}`,
        timestamp: new Date().toISOString(),
      });
    }

    res.json({
      success: true,
      data: {
        kycStatus: user.kycStatus,
        reason,
      },
    });
  } catch (error) {
    console.error('KYC rejection error:', error);
    res.status(500).json({ success: false, error: 'KYC rejection failed' });
  }
});

export default router;
