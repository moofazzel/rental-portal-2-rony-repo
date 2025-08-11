import { API_ENDPOINTS } from "@/constants/ApiEndpointsConstants";
import {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
} from "@/types/auth.types";
import { api } from "./api";

export async function registerUser(data: RegisterPayload) {
  return api(API_ENDPOINTS.USER.register, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function verifyUser(data: LoginPayload) {
  return api<LoginResponse>(API_ENDPOINTS.USER.login, {
    method: "POST",
    body: JSON.stringify(data),
  });
}
