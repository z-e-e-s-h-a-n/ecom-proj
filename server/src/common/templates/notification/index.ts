import * as auth from "./auth.template";
import * as order from "./order.template";

const authTemplates = {
  login: auth.loginTemplate,
  signup: auth.signupTemplate,
  mfa: auth.mfaTemplate,
  verifyEmail: auth.verifyEmailTemplate,
  verifyPhone: auth.verifyPhoneTemplate,
  setPassword: auth.setPasswordTemplate,
  resetPassword: auth.resetPasswordTemplate,
  changeEmail: auth.changeEmailTemplate,
  changePhone: auth.changePhoneTemplate,
  enable2FA: auth.enable2FATemplate,
  disable2FA: auth.disable2FATemplate,
};

const orderTemplates = {
  orderConfirmation: order.orderConfirmationTemplate,
};

const templateFactory: Record<
  NotificationPurpose,
  (data: any) => TemplateReturn
> = {
  ...authTemplates,
  ...orderTemplates,
};

interface TemplateReturn {
  subject: string;
  html: string;
  text?: string;
}

export const resolveTemplate = (
  purpose: NotificationPurpose,
  data: any
): TemplateReturn => {
  const templateFn = templateFactory[purpose];
  if (!templateFn) throw new Error(`Undefined template purpose: ${purpose}`);
  return templateFn(data);
};
