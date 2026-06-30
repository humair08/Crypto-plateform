export const COLORS = {
  PRIMARY: '#050505',
  SECONDARY: '#101010',
  TERTIARY: '#161616',
  BORDER: '#252525',
  ACCENT: '#00E0FF',
  ACCENT_SECONDARY: '#8A5CFF',
  SUCCESS: '#00D26A',
  WARNING: '#FFB800',
  DANGER: '#FF4D4F',
};

export const BREAKPOINTS = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
};

export const CACHE_TIMES = {
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VERIFY: '/auth/verify',
  },
  USERS: {
    PROFILE: '/api/users/profile',
    UPDATE: '/api/users/profile',
    SETTINGS: '/api/users/settings',
  },
  BETS: {
    LIST: '/api/bets',
    CREATE: '/api/bets',
    DETAIL: (id: string) => `/api/bets/${id}`,
  },
  EVENTS: {
    LIST: '/api/events',
    DETAIL: (id: string) => `/api/events/${id}`,
  },
  PAYMENTS: {
    LIST: '/api/payments',
    CREATE: '/api/payments',
    WEBHOOK: '/api/payments/webhook',
  },
  ADMIN: {
    USERS: '/api/admin/users',
    ANALYTICS: '/api/admin/analytics',
    LOGS: '/api/admin/logs',
  },
};
