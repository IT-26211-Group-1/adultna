"use client";

// Token-based authentication utility for cross-domain requests
export class TokenAuth {
  private static getCookie(name: string): string | null {
    if (typeof window === "undefined") return null;

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) {
      return parts.pop()?.split(";").shift() || null;
    }

    return null;
  }

  static getAccessToken(): string | null {
    return this.getCookie("access_token");
  }

  static getRefreshToken(): string | null {
    return this.getCookie("refresh_token");
  }

  static getAuthHeaders(): Record<string, string> {
    const accessToken = this.getAccessToken();

    if (accessToken) {
      return {
        Authorization: `Bearer ${accessToken}`,
      };
    }

    return {};
  }

  static isTokenAvailable(): boolean {
    return !!this.getAccessToken();
  }
}