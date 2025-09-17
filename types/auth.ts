export type RegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  acceptedTerms: boolean;
  token: string;
  verificationToken: string;
};

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginData {
  userId: string;
  token: string;
  isVerified: boolean;
}

export interface LoginResponse {
  needsVerification?: boolean;
  verificationToken?: string;
  refreshTokenExpiresAt?: string;
  accessTokenExpiresAt?: string;
  accessToken: string;
  refreshToken: string;
  data?: LoginData;
  message?: string;
  success: boolean;
}

export type RegisterResponse = {
  success: boolean;
  message?: string;
  userId?: string;
  verificationToken?: string;
};

export type User = {
  id: string;
  email: string;
  role: string;
};

export type VerifyEmailResponse = {
  statusCode?: number;
  success?: boolean;
  message?: string;
  userId?: string;
  email?: string;
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpiresAt?: number;
  refreshTokenExpiresAt?: number;
  cooldownLeft?: number;
  data?: {
    userId?: string;
  };
};

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  needsVerification?: boolean;
  verificationToken?: string;
};

export type ResendOtpResponse = {
  success: boolean;
  message?: string;
  data?: {
    cooldownLeft?: number;
  };
};

// Secure Auth Types
export interface AuthResponse {
  success: boolean;
  user?: User;
  needsVerification?: boolean;
  message?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
}

export interface RateLimitTracker {
  count: number;
  resetTime: number;
}

export interface SecureAuthService {
  checkAuth(): Promise<AuthResponse>;
  login(credentials: LoginPayload): Promise<AuthResponse>;
  register(userData: RegisterPayload): Promise<AuthResponse>;
  refreshSession(): Promise<AuthResponse>;
  logout(): Promise<void>;
  verifyEmail(otp: string, verificationToken?: string): Promise<AuthResponse>;
  forgotPassword(email: string): Promise<AuthResponse>;
  resetPassword(
    password: string,
    verificationToken: string
  ): Promise<AuthResponse>;
  initiateGoogleAuth(): Promise<{ url: string }>;
}

export interface UseSecureAuthReturn extends AuthState {
  checkAuth: () => Promise<boolean>;
  login: (credentials: LoginPayload) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
  authService: SecureAuthService;
}
