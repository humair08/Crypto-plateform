import express, { Express, Request, Response, NextFunction } from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from 'dotenv';
import authRouter from './routes/auth';
import paymentsRouter from './routes/payments';
import walletRouter from './routes/wallet';
import kycRouter from './routes/kyc';

config();

const app: Express = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
});

const PORT = process.env.PORT || 3001;

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});

app.use(limiter);

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Make io accessible to routes
app.use((req: any, _res, next) => {
  req.io = io;
  next();
});

// Auth + Payments + Wallet + KYC Routes
app.use('/auth', authRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/wallet', walletRouter);
app.use('/api/kyc', kycRouter);

// Health Check Endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// WebSocket Connection Handler
io.on('connection', (socket) => {
  console.log(`✅ User connected: ${socket.id}`);

  socket.on('join_user', (userId: string) => {
    socket.join(`user_${userId}`);
    console.log(`📡 User ${userId} joined room`);
  });

  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

// Error Handling Middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// 404 Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
  });
});

// Start Server
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📡 WebSocket server ready`);
  console.log(`🔐 API endpoints configured`);
});

export default app;
export { io };

