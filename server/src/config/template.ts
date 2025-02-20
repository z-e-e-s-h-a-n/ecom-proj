// src/lib/utils/template.ts
import envConfig from "@/config/env";
import { OtpPurpose } from "@/models/otpSession";

const appEndpoint = envConfig.app.endpoint;
const clientEndpoint = envConfig.client.endpoint;

export type TemplateTypes = OtpPurpose;

export interface ITemplateReturn {
  html: string;
  subject: string;
}

export interface ITemplatePayload {
  purpose: TemplateTypes;
  identifier: string;
  secret?: string;
}

export interface ITemplateProps extends ITemplatePayload {}

export const verifyEmailTemplate = ({
  purpose,
  identifier,
  secret,
}: ITemplateProps): ITemplateReturn => {
  const verifyLink = `${appEndpoint}/auth/validate-otp?secret=${secret}&identifier=${identifier}&purpose=${purpose}`;
  const subject = "Verify your email address";
  const html = `<h1>${subject}</h1>
  <p>Your OTP Code is: <b>${secret}</b></p>
  <p>Please use the OTP to verify your account.</p>
  <span>or</span>
  <p>Click the link below to verify your email.</p>
  <a href="${verifyLink}">${verifyLink}</a>`;
  return { html, subject };
};

export const resetPasswordTemplate = ({
  identifier,
  purpose,
  secret,
}: ITemplateProps): ITemplateReturn => {
  const verifyLink = `${clientEndpoint}/reset-password?secret=${secret}&identifier=${identifier}&purpose=${purpose}`;
  const subject = "Reset your password";
  const html = `<h1>${subject}</h1>
  <p>Your OTP Code is: <b>${secret}</b></p>
  <p>Please use the OTP to reset your password.</p>
  <span>or</span>
  <p>Click the link below to reset your password.</p>
  <a href="${verifyLink}">${verifyLink}</a>`;
  return { html, subject };
};

export const setPasswordTemplate = ({
  identifier,
  purpose,
  secret,
}: ITemplateProps): ITemplateReturn => {
  const verifyLink = `${clientEndpoint}/set-password?secret=${secret}&identifier=${identifier}&purpose=${purpose}`;
  const subject = "Set a new password";
  const html = `<h1>${subject}</h1>
  <p>Please use the link below to set a new password.</p>
  <a href="${verifyLink}">${verifyLink}</a>`;
  return { html, subject };
};

export const getTemplate = (payload: ITemplatePayload): ITemplateReturn => {
  const { purpose } = payload;
  if (purpose === "verifyEmail") return verifyEmailTemplate(payload);
  if (purpose === "resetPassword") return resetPasswordTemplate(payload);
  if (purpose === "setPassword") return setPasswordTemplate(payload);

  throw new Error("Invalid template type or missing required parameters");
};
