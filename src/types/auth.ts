export type RegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  acceptedTerms: boolean;
};

export type RegisterResponse = {
  success: boolean;
  message?: string;
};
