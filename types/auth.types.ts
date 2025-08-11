export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  preferredLocation: string;
  confirmPassword: string;
}

export interface LoginResponse {
  id: string;
  name: string;
  email: string;
  token: string;
  role: string;
  userData?: string;
}

export interface DecodedToken {
  id: string;
  email: string;
  iat: number;
  exp: number;
}
