import { create } from 'zustand';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

interface NotificationStore {
  notifications: Notification[];
  add: (notification: Omit<Notification, 'id'>) => void;
  remove: (id: string) => void;
  clear: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  add: (notification) => {
    const id = `${Date.now()}-${Math.random()}`;
    set((state) => ({
      notifications: [...state.notifications, { ...notification, id }],
    }));

    if (notification.duration ?? 5000) {
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      }, notification.duration ?? 5000);
    }
  },
  remove: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  clear: () => set({ notifications: [] }),
}));
