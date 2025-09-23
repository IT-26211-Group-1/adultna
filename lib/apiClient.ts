"use client";

// Base API URLs
export const AUTH_API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "/api/auth"
    : process.env.NEXT_PUBLIC_AUTH_SERVICE_URL;

export const ONBOARDING_API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "/api/onboarding"
    : process.env.NEXT_PUBLIC_ONBOARDING_SERVICE_URL;

const defaultOptions: RequestInit = {
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
};

// API Client
export class ApiClient {
  static async request<T>(
    endpoint: string,
    options: RequestInit = {},
    baseUrl: string = AUTH_API_BASE_URL as string,
  ): Promise<T> {
    const url = `${baseUrl}${endpoint}`;

    const config: RequestInit = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        "X-Request-ID": crypto.randomUUID(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      const contentType = response.headers.get("content-type");
      let data: any;

      if (contentType?.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      // Check if response is ok
      if (!response.ok) {
        throw new ApiError(
          data?.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          data,
        );
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      // network errors
      throw new ApiError(
        error instanceof Error ? error.message : "Network error",
        0,
        null,
      );
    }
  }

  static get<T>(
    endpoint: string,
    options?: RequestInit,
    baseUrl?: string,
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" }, baseUrl);
  }

  static post<T>(
    endpoint: string,
    data?: any,
    options?: RequestInit,
    baseUrl?: string,
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        ...options,
        method: "POST",
        body: data ? JSON.stringify(data) : undefined,
      },
      baseUrl,
    );
  }

  static put<T>(
    endpoint: string,
    data?: any,
    options?: RequestInit,
    baseUrl?: string,
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        ...options,
        method: "PUT",
        body: data ? JSON.stringify(data) : undefined,
      },
      baseUrl,
    );
  }

  static delete<T>(
    endpoint: string,
    options?: RequestInit,
    baseUrl?: string,
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" }, baseUrl);
  }
}

// Custom API Error class
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data: any = null,
  ) {
    super(message);
    this.name = "ApiError";
  }

  get isNetworkError() {
    return this.status === 0;
  }

  get isServerError() {
    return this.status >= 500;
  }

  get isClientError() {
    return this.status >= 400 && this.status < 500;
  }

  get isUnauthorized() {
    return this.status === 401;
  }

  get isForbidden() {
    return this.status === 403;
  }

  get isNotFound() {
    return this.status === 404;
  }

  get isTooManyRequests() {
    return this.status === 429;
  }
}

// Query key factories for consistent cache management
export const queryKeys = {
  // Auth queries
  auth: {
    all: ["auth"] as const,
    me: () => [...queryKeys.auth.all, "me"] as const,
  },

  // User queries
  user: {
    all: ["user"] as const,
    profile: (userId: string) =>
      [...queryKeys.user.all, "profile", userId] as const,
  },

  // Onboarding queries
  onboarding: {
    all: ["onboarding"] as const,
    questions: () => [...queryKeys.onboarding.all, "questions"] as const,
    responses: (userId: string) =>
      [...queryKeys.onboarding.all, "responses", userId] as const,
  },
} as const;
