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
  id: string;
  success: boolean;
  message?: string;
};

export type User = {
  id: string;
  email: string;
  role: string;
};

export type VerifyEmailResponse = {
  token?: string;
  userId?: string;
  message?: string;
  user: User;
  cooldownLeft?: number;
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiresAt?: string;
  accessTokenExpiresAt?: string;
};

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  needsVerification?: boolean;
  verificationToken?: string;
};
