"use client";

import { API_CONFIG } from "@/config/api";

export const API_BASE_URL = API_CONFIG.API_URL;
export const ONBOARDING_API_BASE_URL = API_CONFIG.API_URL;

let tokenProvider: (() => string | null) | null = null;

export function setTokenProvider(provider: () => string | null) {
  tokenProvider = provider;
}

export function setRefreshTokenCallback(
  _callback: () => Promise<string | null>,
) {}

export class ApiClient {
  private static buildHeaders(
    customHeaders?: HeadersInit,
  ): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "X-Request-ID": crypto.randomUUID(),
    };

    if (customHeaders) {
      Object.entries(customHeaders).forEach(([key, value]) => {
        if (typeof value === "string") {
          headers[key] = value;
        }
      });
    }

    const token = tokenProvider?.();

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  static async request<T>(
    endpoint: string,
    options: RequestInit = {},
    baseUrl: string = API_BASE_URL as string,
    _isRetry = false,
  ): Promise<T> {
    const url = `${baseUrl}${endpoint}`;
    const headers = this.buildHeaders(options.headers);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

    const config: RequestInit = {
      ...options,
      credentials: "include",
      headers,
      signal: controller.signal,
    };

    try {
      const response = await fetch(url, config);

      clearTimeout(timeoutId);

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        const errorData = contentType?.includes("application/json")
          ? await response.json()
          : await response.text();

        throw new ApiError(
          errorData?.message ||
            `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData,
        );
      }

      const contentType = response.headers.get("content-type");
      const data = contentType?.includes("application/json")
        ? await response.json()
        : await response.text();

      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiError) throw error;

      if (error instanceof Error && error.name === "AbortError") {
        throw new ApiError("Request timeout", 408, null);
      }

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

  static patch<T>(
    endpoint: string,
    data?: any,
    options?: RequestInit,
    baseUrl?: string,
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        ...options,
        method: "PATCH",
        body: data ? JSON.stringify(data) : undefined,
      },
      baseUrl,
    );
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

  get isTimeout() {
    return this.status === 408;
  }
}

export const queryKeys = {
  // Auth queries
  auth: {
    all: ["auth"] as const,
    me: () => ["auth", "me"] as const,
    token: () => ["auth", "token"] as const,
  },

  // User queries
  user: {
    all: ["user"] as const,
    profile: (userId: string) => ["user", "profile", userId] as const,
  },

  // Onboarding queries
  onboarding: {
    all: ["onboarding"] as const,
    questions: () => ["onboarding", "questions"] as const,
    responses: (userId: string) => ["onboarding", "responses", userId] as const,
  },
  // Admin queries
  admin: {
    all: ["admin"] as const,
    auth: {
      all: ["admin", "auth"] as const,
      me: () => ["admin", "auth", "me"] as const,
    },
    users: {
      all: ["admin", "users"] as const,
      list: () => ["admin", "users", "list"] as const,
      detail: (userId: string) => ["admin", "users", "detail", userId] as const,
    },
    feedback: {
      all: ["admin", "feedback"] as const,
      list: () => ["admin", "feedback", "list"] as const,
      detail: (feedbackId: string) =>
        ["admin", "feedback", "detail", feedbackId] as const,
    },
  },
} as const;
