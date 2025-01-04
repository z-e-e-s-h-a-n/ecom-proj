import { apiRequest } from "@/config/axios";
import envConfig from "@/config/envConfig";

export interface ILoginData {
  email: string;
  password: string;
}

export interface IRegisterData {
  name: string;
  email: string;
  password: string;
}

export interface IRequestOtpData {
  email: string;
  purpose: "email_verification" | "password_reset";
}

export interface IVerifyOtpData extends IRequestOtpData {
  otp: string;
}

export interface IResetPasswordData {
  token: string;
  newPassword: string;
}

export const loginUser = async (credentials: ILoginData) => {
  return apiRequest("POST", "/auth/login", credentials);
};

export const registerUser = async (userData: IRegisterData) => {
  return apiRequest("POST", "/auth/signup", userData);
};

export const logoutUser = async () => {
  return apiRequest("POST", "/auth/logout");
};

export const requestOtp = async (data: IRequestOtpData) => {
  return apiRequest("POST", "/auth/request-otp", data);
};

export const validateOtp = async (data: IVerifyOtpData) => {
  return apiRequest("POST", "/auth/validate-otp", data);
};

export const resetPassword = async (data: IResetPasswordData) => {
  return apiRequest("POST", "/auth/reset-password", data);
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
