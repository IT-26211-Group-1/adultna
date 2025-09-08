export type RegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  acceptedTerms: boolean;
};

export type LoginPayload = Pick<RegisterPayload, "email" | "password"> & {
  token: string;
  userId: string;
};

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

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}
