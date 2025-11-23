"use client";

import { API_CONFIG } from "@/config/api";
import { PUBLIC_ROUTES } from "@/config/site";
import { logger } from "@/lib/logger";

export const API_BASE_URL = API_CONFIG.API_URL;
export const ONBOARDING_API_BASE_URL = API_CONFIG.API_URL;

export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((path) => {
    if (path === "/") {
      return pathname === "/";
    }

    return pathname === path || pathname.startsWith(path + "/");
  });
}

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

    return headers;
  }

  static async request<T>(
    endpoint: string,
    options: RequestInit = {},
    baseUrl: string = API_BASE_URL as string,
    isRetry = false,
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

        // If 401 and not already retrying, try to refresh token
        if (
          response.status === 401 &&
          !isRetry &&
          !endpoint.includes("/refresh-token") &&
          !endpoint.includes("/login")
        ) {
          try {
            const refreshUrl = baseUrl.includes("/admin")
              ? "/admin/refresh-token"
              : "/auth/refresh-token";

            const refreshResponse = await fetch(`${baseUrl}${refreshUrl}`, {
              method: "POST",
              credentials: "include",
            });

            if (!refreshResponse.ok) {
              logger.log(
                "[ApiClient] ❌ Refresh failed - refresh token expired, logging out",
              );

              // Refresh token expired, logout user
              if (typeof window !== "undefined") {
                const currentPath = window.location.pathname;

                // Only redirect if not already on a public route
                if (!isPublicRoute(currentPath)) {
                  const loginPath = currentPath.startsWith("/admin")
                    ? "/admin/login"
                    : "/auth/login";

                  window.location.href = loginPath;
                }
              }

              throw new Error("Refresh token expired");
            }

            // Retry the original request once
            return this.request<T>(endpoint, options, baseUrl, true);
          } catch (error) {
            logger.log("[ApiClient] ❌ Token refresh error:", error);

            // If refresh fails, logout user
            if (typeof window !== "undefined") {
              const currentPath = window.location.pathname;

              // Only redirect if not already on a public route
              if (!isPublicRoute(currentPath)) {
                const loginPath = currentPath.startsWith("/admin")
                  ? "/admin/login"
                  : "/auth/login";

                window.location.href = loginPath;
              }
            }

            throw new ApiError(
              "Session expired. Please login again.",
              401,
              errorData,
            );
          }
        }

        const errorMessage =
          typeof errorData?.message === "string"
            ? errorData.message
            : `HTTP ${response.status}: ${response.statusText}`;

        throw new ApiError(errorMessage, response.status, errorData);
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
    onboarding: {
      all: ["admin", "onboarding"] as const,
      list: () => ["admin", "onboarding", "list"] as const,
      detail: (questionId: number) =>
        ["admin", "onboarding", "detail", questionId] as const,
    },
    auditLogs: {
      all: ["admin", "auditLogs"] as const,
      list: (filters?: {
        startTime?: Date;
        endTime?: Date;
        service?: string;
        action?: string;
        userEmail?: string;
        status?: "success" | "failure";
        limit?: number;
      }) => ["admin", "auditLogs", "list", filters] as const,
    },
  },

  // Jobs queries
  jobs: {
    all: ["jobs"] as const,
    search: (query: string) => ["jobs", "search", query] as const,
  },

  // Gabay queries
  gabay: {
    all: ["gabay"] as const,
    chat: () => ["gabay", "chat"] as const,
  },

  // Filebox queries
  filebox: {
    all: ["filebox"] as const,
    list: (category?: string) =>
      category
        ? (["filebox", "list", category] as const)
        : (["filebox", "list"] as const),
    detail: (fileId: string) => ["filebox", "detail", fileId] as const,
    quota: () => ["filebox", "quota"] as const,
  },

  // Resume queries
  resumes: {
    all: ["resumes"] as const,
    list: () => ["resumes", "list"] as const,
    detail: (resumeId: string) => ["resumes", "detail", resumeId] as const,
    contactInfo: (resumeId: string) =>
      ["resumes", "contactInfo", resumeId] as const,
  },

  // Cover Letter queries
  coverLetters: {
    all: ["coverLetters"] as const,
    list: () => ["coverLetters", "list"] as const,
    detail: (coverLetterId: string) =>
      ["coverLetters", "detail", coverLetterId] as const,
  },

  // Roadmap queries
  roadmap: {
    all: ["roadmap"] as const,
    milestones: () => ["roadmap", "milestones"] as const,
    milestone: (milestoneId: string) =>
      ["roadmap", "milestone", milestoneId] as const,
    byStatus: (status: string) => ["roadmap", "byStatus", status] as const,
    byCategory: (category: string) =>
      ["roadmap", "byCategory", category] as const,
  },

  // Dashboard queries
  dashboard: {
    all: ["dashboard"] as const,
    summary: () => ["dashboard", "summary"] as const,
    notifications: (limit?: number) =>
      limit
        ? (["dashboard", "notifications", limit] as const)
        : (["dashboard", "notifications"] as const),
  },
} as const;
