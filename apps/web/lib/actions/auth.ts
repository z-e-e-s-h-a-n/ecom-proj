import { apiRequest } from "@/config/axios";
import envConfig from "@/config/env";
import {
  TLoginSchema,
  TRequestOtpSchema,
  TResetPasswordSchema,
  TSignupSchema,
  TValidateOtpSchema,
} from "@workspace/shared/schemas/auth";

export const loginUser = async (data: TLoginSchema) => {
  return apiRequest("POST", "/auth/login", { data });
};

export const registerUser = async (data: TSignupSchema) => {
  return apiRequest("POST", "/auth/signup", { data });
};

export const logoutUser = async () => {
  return apiRequest("POST", "/auth/logout");
};

export const requestOtp = async (data: TRequestOtpSchema) => {
  return apiRequest("POST", "/auth/request-otp", { data });
};

export const validateOtp = async (params: TValidateOtpSchema) => {
  return apiRequest("GET", "/auth/validate-otp", { params });
};

export const resetPassword = async (data: TResetPasswordSchema) => {
  return apiRequest("POST", "/auth/reset-password", { data });
};

export const loginWithGoogle = async () => {
  window.location.href = `${envConfig.server.endpoint}/auth/google`;
};

export const loginWithFacebook = async () => {
  window.location.href = `${envConfig.server.endpoint}/auth/facebook`;
};

export const loginWithApple = async () => {
  alert("Apple login not implemented yet.");
};
