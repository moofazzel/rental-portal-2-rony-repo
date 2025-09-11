export interface AuthUser {
  _id?: string;
  id: string;
  name: string;
  email: string;
  role?: string;
  token: string;
  userData?: Record<string, unknown>;
}

export interface ISetTenantPassword {
  email: string;
  tenantId: string;
  password: string;
  confirmPassword: string;
}
