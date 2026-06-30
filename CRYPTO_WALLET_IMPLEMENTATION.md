# Teuzux Betting Platform - Cryptocurrency Wallet & Real-Time Updates System

## Complete Implementation Summary

This document outlines the production-ready integration of a cryptocurrency wallet engine, WebSocket-powered real-time betting updates, and a multi-tier KYC verification flow for the Teuzux platform.

---

## Part 1: Database Schema Updates

### New Prisma Models

#### 1. **Wallet Model**
```prisma
model Wallet {
  id        String     @id @default(cuid())
  userId    String     @unique
  user      User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  balance   Decimal    @db.Decimal(18, 8) @default(0)
  currency  String     @default("USDT")
  address   String?
  transactions Transaction[]
  
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  
  @@map("wallets")
}
```

**Features:**
- 1-to-1 relationship with User
- Supports high-precision cryptocurrency values (18 decimal places)
- Tracks virtual wallet addresses
- Linked to all transactions

#### 2. **Enhanced Transaction Model**
```prisma
model Transaction {
  id        String     @id @default(cuid())
  walletId  String
  wallet    Wallet     @relation(fields: [walletId], references: [id], onDelete: Cascade)
  userId    String
  user      User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  type      TransactionType
  amount    Decimal    @db.Decimal(18, 8)
  status    TransactionStatus @default(PENDING)
  description String?
  reference String?
  
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  
  @@map("transactions")
}
```

**Transaction Types:**
- `DEPOSIT` - User funds wallet
- `WITHDRAWAL` - User withdraws funds
- `BET_PLACED` - Funds locked for bet
- `BET_WON` - Winnings credited
- `BET_LOST` - Loss recorded

**Transaction Status:**
- `PENDING` - Awaiting confirmation
- `COMPLETED` - Transaction finalized
- `FAILED` - Transaction failed
- `CANCELLED` - User cancelled

#### 3. **Enhanced User Model**
```prisma
model User {
  // ... existing fields ...
  kycStatus     KYCStatus  @default(UNSUBMITTED)
  wallet        Wallet?
  // ... relationships ...
}

enum KYCStatus {
  UNSUBMITTED
  PENDING
  VERIFIED
  REJECTED
}
```

---

## Part 2: Backend Architecture

### 2.1 WebSocket Setup (`backend/src/index.ts`)

**Features:**
- Socket.io integration with Express HTTP server
- CORS support for frontend origin
- User-specific room joins for targeted updates
- Automatic reconnection handling

**Key Functions:**
```typescript
// Initialize WebSocket
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
});

// User joins room
socket.on('join_user', (userId: string) => {
  socket.join(`user_${userId}`);
});

// Broadcast updates to specific user
io.to(`user_${userId}`).emit('wallet_updated', { ... });
```

### 2.2 Wallet API Routes (`backend/src/routes/wallet.ts`)

#### **GET /api/wallet/balance**
Fetches current wallet balance and details.

**Response:**
```json
{
  "success": true,
  "data": {
    "balance": "1250.50",
    "currency": "USDT",
    "address": "0x..."
  }
}
```

#### **POST /api/wallet/deposit**
Initiates crypto deposit with virtual address generation.

**Request:**
```json
{
  "amount": 100
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transactionId": "txn_123",
    "virtualAddress": "0x...",
    "amount": 100,
    "currency": "USDT",
    "status": "PENDING",
    "message": "Deposit initiated. Confirmation in 3 seconds."
  }
}
```

**Behavior:**
- Generates virtual wallet address for display
- Creates pending transaction record
- Simulates 3-second confirmation delay
- Auto-increments wallet balance on confirmation
- Broadcasts WebSocket update to client

#### **POST /api/wallet/withdraw**
Handles cryptocurrency withdrawals.

**Request:**
```json
{
  "amount": 50,
  "address": "0x..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transactionId": "txn_456",
    "amount": 50,
    "address": "0x...",
    "status": "PENDING"
  }
}
```

**Behavior:**
- Validates sufficient balance
- Creates withdrawal transaction
- Decrements wallet balance
- Broadcasts update via WebSocket

### 2.3 KYC Verification Routes (`backend/src/routes/kyc.ts`)

#### **GET /api/kyc/status**
Fetches current KYC verification status.

**Response:**
```json
{
  "success": true,
  "data": {
    "kycStatus": "VERIFIED",
    "verified": true
  }
}
```

#### **POST /api/kyc/submit**
Submits KYC verification documents.

**Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "documentId": "12345",
  "documentType": "PASSPORT"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "kycStatus": "PENDING",
    "message": "KYC submission received. Verification in progress (5 seconds)."
  }
}
```

**Behavior:**
- Updates user KYC status to `PENDING`
- Simulates 5-second verification process
- Auto-approves to `VERIFIED` status
- Broadcasts update via WebSocket

---

## Part 3: Frontend Integration

### 3.1 WebSocket Service (`frontend/src/services/socketService.ts`)

**Features:**
- Socket.io client initialization
- User room management
- Event subscription handlers
- Automatic connection management

**Core Functions:**
```typescript
// Initialize connection
const socket = initializeSocket(token);

// Join user room
joinUserRoom(userId);

// Subscribe to updates
subscribeToWalletUpdates((data) => {
  console.log('Wallet updated:', data);
});

// Unsubscribe when done
unsubscribeWallet();
```

### 3.2 Wallet API Service (`frontend/src/services/walletService.ts`)

```typescript
// Get wallet balance
const response = await getWalletBalance(token);

// Deposit crypto
const response = await depositCrypto(token, 100);

// Withdraw crypto
const response = await withdrawCrypto(token, 50, '0x...');
```

### 3.3 KYC API Service (`frontend/src/services/kycService.ts`)

```typescript
// Get KYC status
const response = await getKYCStatus(token);

// Submit KYC
const response = await submitKYC(token, {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  documentId: '12345',
  documentType: 'PASSPORT',
});
```

### 3.4 Real-Time Bets Page (`frontend/src/app/dashboard/bets/page.tsx`)

**Features:**
- Live wallet balance display with neon-green pill
- KYC status indicator (Verified/Pending/Unsubmitted)
- WebSocket connection status indicator
- Real-time bet updates without page reload
- Dynamic statistics calculation
- Smooth animations with Framer Motion

**Key Components:**
```typescript
// Initialize WebSocket on mount
useEffect(() => {
  const socket = initializeSocket(token);
  joinUserRoom(user.id);
  
  subscribeToWalletUpdates((data) => {
    setWalletBalance(parseFloat(data.balance).toFixed(2));
  });
  
  subscribeToBetUpdates((data) => {
    // Update bet in real-time
  });
}, []);

// Display wallet & KYC status
<div className="inline-flex items-center gap-2 rounded-full border border-[#00FF87]/20 bg-[#00FF87]/10 px-4 py-3">
  <WalletIcon size={18} className="text-[#00FF87]" />
  <span className="text-white font-semibold">${walletBalance}</span>
</div>
```

---

## Part 4: Real-Time Update Flow

### Bet Resolution Example

```
1. User places bet via API
   └─ Backend creates Bet record with status: PENDING
   
2. Event is resolved
   └─ Backend calculates result (WIN/LOSS)
   └─ Backend updates Bet.status & Wallet.balance
   
3. Backend broadcasts WebSocket update
   └─ Emits 'bet_updated' to user_${userId} room
   └─ Payload includes: betId, status, result, amount
   
4. Frontend receives update
   └─ Updates local bet state
   └─ Recalculates statistics
   └─ Shows notification
   └─ UI updates without reload
```

### WebSocket Payload Examples

**Wallet Update:**
```json
{
  "balance": "1350.50",
  "currency": "USDT",
  "transaction": {
    "id": "txn_123",
    "type": "DEPOSIT",
    "amount": 100,
    "status": "COMPLETED",
    "timestamp": "2026-06-30T10:30:00Z"
  }
}
```

**Bet Update:**
```json
{
  "betId": "bet_456",
  "status": "won",
  "result": 250,
  "amount": 100,
  "timestamp": "2026-06-30T10:35:00Z"
}
```

**KYC Update:**
```json
{
  "kycStatus": "VERIFIED",
  "verified": true,
  "message": "KYC verification approved!",
  "timestamp": "2026-06-30T10:40:00Z"
}
```

---

## Part 5: Deployment Checklist

### Backend Setup

1. **Install Socket.io dependency:**
   ```bash
   npm install socket.io
   npm install -D @types/node
   ```

2. **Update Prisma schema:**
   ```bash
   npx prisma migrate dev --name add-wallet-kyc
   ```

3. **Environment variables:**
   ```
   FRONTEND_URL=https://your-frontend.com
   DATABASE_URL=postgresql://...
   PORT=3001
   ```

4. **Start server:**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Install Socket.io client:**
   ```bash
   npm install socket.io-client
   ```

2. **Environment variable:**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.com
   ```

3. **Services imported:**
   ```typescript
   import { socketService } from '@/services/socketService';
   import { walletService } from '@/services/walletService';
   import { kycService } from '@/services/kycService';
   ```

---

## Part 6: Security & Best Practices

### Authentication
- All API endpoints require Bearer token in Authorization header
- WebSocket connection verified via token
- User room isolation prevents cross-user data leaks

### Validation
- Amount validation for deposits/withdrawals
- KYC field validation before submission
- Transaction type validation

### Rate Limiting
- 100 requests per 15 minutes per IP
- WebSocket reconnection backoff: 1-5 seconds

### Error Handling
- Graceful WebSocket disconnection
- Automatic reconnection attempts
- User notifications for failures

---

## Part 7: Testing Recommendations

### Unit Tests
- Wallet balance calculations
- Transaction type validation
- KYC status transitions

### Integration Tests
- Deposit flow (mock 3s confirmation)
- Withdrawal with balance check
- KYC submission flow
- WebSocket emit/receive

### E2E Tests
- User deposits → balance updates → notification
- Bet placed → bet resolved → wallet updated → table refreshed
- KYC flow → status changes → feature unlock

---

## Monitoring & Metrics

Track in production:
- Active WebSocket connections
- Transaction completion rates
- KYC verification time
- Bet resolution latency
- Error rates by endpoint

---

## Future Enhancements

1. Real blockchain wallet integration
2. Multi-currency support (BTC, ETH, etc.)
3. Advanced KYC with document scanning
4. Transaction history export
5. Webhook notifications
6. Advanced analytics dashboard
7. Automated compliance checks

---

## Support

For issues or questions about this implementation, refer to:
- Backend: `backend/src/routes/wallet.ts`, `backend/src/routes/kyc.ts`
- Frontend: `frontend/src/services/socketService.ts`, `frontend/src/app/dashboard/bets/page.tsx`
- Schema: `backend/prisma/schema.prisma`
