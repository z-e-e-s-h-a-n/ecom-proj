import { apiRequest } from "@/config/axios";
import envConfig from "@/config/env";

export const loginUser = async (data: ILoginPayload) => {
  return apiRequest("POST", "/auth/login", { data });
};

export const registerUser = async (data: IRegisterPayload) => {
  return apiRequest("POST", "/auth/signup", { data });
};

export const logoutUser = async () => {
  return apiRequest("POST", "/auth/logout");
};

export const requestOtp = async (data: IRequestOtpPayload) => {
  return apiRequest("POST", "/auth/request-otp", { data });
};

export const validateOtp = async (params: IVerifyOtpPayload) => {
  return apiRequest("GET", "/auth/validate-otp", { params });
};

export const resetPassword = async (data: IResetPasswordPayload) => {
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
