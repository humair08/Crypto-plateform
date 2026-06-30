import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initializeSocket = (token: string): Socket => {
  if (socket?.connected) return socket;

  socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001', {
    auth: { token },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

  socket.on('connect', () => {
    console.log('✅ WebSocket connected:', socket?.id);
  });

  socket.on('disconnect', () => {
    console.log('❌ WebSocket disconnected');
  });

  socket.on('error', (error) => {
    console.error('❌ WebSocket error:', error);
  });

  return socket;
};

export const joinUserRoom = (userId: string) => {
  if (!socket) return;
  socket.emit('join_user', userId);
};

export const subscribeToWalletUpdates = (callback: (data: any) => void) => {
  if (!socket) return;
  socket.on('wallet_updated', callback);
};

export const subscribeToKYCUpdates = (callback: (data: any) => void) => {
  if (!socket) return;
  socket.on('kyc_updated', callback);
};

export const subscribeToBetUpdates = (callback: (data: any) => void) => {
  if (!socket) return;
  socket.on('bet_updated', callback);
};

export const unsubscribeWallet = () => {
  if (!socket) return;
  socket.off('wallet_updated');
};

export const unsubscribeKYC = () => {
  if (!socket) return;
  socket.off('kyc_updated');
};

export const unsubscribeBets = () => {
  if (!socket) return;
  socket.off('bet_updated');
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = (): Socket | null => socket;
