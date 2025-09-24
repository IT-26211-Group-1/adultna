export const API_CONFIG = {
  AUTH_SERVICE_URL: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || "",
  ONBOARDING_SERVICE_URL: process.env.NEXT_PUBLIC_ONBOARDING_SERVICE_URL || "",

  TIMEOUT: 30000,

  RETRY: {
    MAX_ATTEMPTS: 2,
    DELAY: 1000,
  },

  TOKEN: {
    ACCESS_EXPIRY: 15 * 60 * 1000,
    REFRESH_INTERVAL: 13 * 60 * 1000,
    STALE_TIME: 13 * 60 * 1000,
    CACHE_TIME: 30 * 60 * 1000,
  },

  AUTH_QUERY: {
    STALE_TIME: 15 * 60 * 1000,
    CACHE_TIME: 30 * 60 * 1000,
  },
} as const;

export const isDevelopment = process.env.NODE_ENV === "development";
export const isProduction = process.env.NODE_ENV === "production";