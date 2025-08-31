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
  token: string;
  data?: LoginData;
  message?: string;
  success: boolean;
}

export type RegisterResponse = {
  id: string;
  success: boolean;
  message?: string;
};

export interface VerifyEmailResponse {
  token?: string;
  userId?: string;
  message?: string;
}

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  needsVerification?: boolean;
  verificationToken?: string;
};
