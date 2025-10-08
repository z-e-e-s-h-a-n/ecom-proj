import type { EnvService } from "@/modules/env/env.service";
import type { Order, Otp, User } from "@prisma/client";

const baseStyles = `
  font-family: Arial, sans-serif;
  color: #222;
  line-height: 1.6;
`;

const buttonStyles = `
  display:inline-block;
  padding:12px 20px;
  background-color:#000;
  color:#fff;
  text-decoration:none;
  border-radius:6px;
  font-weight:bold;
`;

const appName = "Evorii";

export interface TemplateProps {
  user: User;
  otp?: Otp;
  identifier?: string;
  newIdentifier?: string;
  order?: Order;
  env?: EnvService;
  message?: string;
}

/* -----------------------------------------------------------
 *  SIGNUP
 * --------------------------------------------------------- */
export const signupTemplate = ({ user }: TemplateProps) => ({
  subject: `🎉 Welcome to ${appName}, ${user.displayName}!`,
  html: `
    <div style="${baseStyles}">
      <h1>Welcome to ${appName}, ${user.displayName}!</h1>
      <p>We’re thrilled to have you join our creative community. Explore thoughtful, customizable gifts designed to express what truly matters.</p>
      <p>If you ever need assistance, our support team is just an email away.</p>
      <p>— The ${appName} Team</p>
    </div>
  `,
  text: `Welcome to ${appName}, ${user.displayName}! Let's create something meaningful together.`,
});

/* -----------------------------------------------------------
 *  SIGNIN
 * --------------------------------------------------------- */
export const signinTemplate = ({ user }: TemplateProps) => ({
  subject: `🔐 Login Successful — ${appName}`,
  html: `
    <div style="${baseStyles}">
      <h2>Hi ${user.displayName},</h2>
      <p>You’ve successfully signed in to your ${appName} account.</p>
      <p>If this wasn’t you, please <strong>reset your password</strong> immediately from your account settings.</p>
      <p>Stay secure,<br/>The ${appName} Team</p>
    </div>
  `,
  text: `Hi ${user.displayName}, you’ve logged in to ${appName}. If this wasn’t you, reset your password right away.`,
});

/* -----------------------------------------------------------
 *  SET PASSWORD
 * --------------------------------------------------------- */
export const setPasswordTemplate = ({
  user,
  otp,
  identifier,
  env,
}: TemplateProps) => {
  const link = `${env?.get("CLIENT_ENDPOINT")}/set-password?identifier=${identifier}&purpose=${otp?.purpose}&secret=${otp?.secret}&type=${otp?.type}`;
  return {
    subject: `🔐 Set Up Your ${appName} Password`,
    html: `
      <div style="${baseStyles}">
        <h2>Welcome, ${user.displayName}!</h2>
        <p>Let’s get you set up. Click the button below to create your password and complete your account setup.</p>
        <a href="${link}" style="${buttonStyles}">Set Password</a>
        <p>If you didn’t request this, you can safely ignore this email.</p>
      </div>
    `,
    text: `Hi ${user.displayName}, set your ${appName} password here: ${link}`,
  };
};

/* -----------------------------------------------------------
 *  RESET PASSWORD
 * --------------------------------------------------------- */
export const resetPasswordTemplate = ({
  user,
  otp,
  identifier,
  env,
}: TemplateProps) => {
  const link = `${env?.get("CLIENT_ENDPOINT")}/reset-password?identifier=${identifier}&purpose=${otp?.purpose}&secret=${otp?.secret}&type=${otp?.type}`;
  return {
    subject: `🔁 Reset Your ${appName} Password`,
    html: `
      <div style="${baseStyles}">
        <h2>Hi ${user.displayName},</h2>
        <p>We received a request to reset your ${appName} password for <strong>${identifier}</strong>.</p>
        <p>Your one-time code: <strong>${otp?.secret}</strong></p>
        <a href="${link}" style="${buttonStyles}">Reset Password</a>
        <p>If you didn’t request this change, please ignore this message.</p>
      </div>
    `,
    text: `Hi ${user.displayName}, your OTP: ${otp?.secret}. Reset your password here: ${link}`,
  };
};

/* -----------------------------------------------------------
 *  VERIFY IDENTIFIER (EMAIL / PHONE)
 * --------------------------------------------------------- */
export const verifyIdentifierTemplate = ({
  user,
  otp,
  identifier,
  env,
}: TemplateProps) => {
  const link = `${env?.get("CLIENT_ENDPOINT")}/verify?identifier=${identifier}&purpose=${otp?.purpose}&secret=${otp?.secret}&type=${otp?.type}`;
  return {
    subject: `📧 Verify Your ${appName} Account`,
    html: `
      <div style="${baseStyles}">
        <h2>Hi ${user.displayName},</h2>
        <p>Welcome! Please verify your ${identifier?.includes("@") ? "email address" : "phone number"} to activate your ${appName} account.</p>
        <p>Your verification code: <strong>${otp?.secret}</strong></p>
        <a href="${link}" style="${buttonStyles}">Verify Now</a>
      </div>
    `,
    text: `Hi ${user.displayName}, your OTP is ${otp?.secret}. Verify here: ${link}`,
  };
};

/* -----------------------------------------------------------
 *  CHANGE IDENTIFIER REQUEST
 * --------------------------------------------------------- */
export const changeIdentifierReqTemplate = ({
  user,
  otp,
  identifier,
}: TemplateProps) => ({
  subject: `📨 Confirm Change Request — ${appName}`,
  html: `
    <div style="${baseStyles}">
      <h2>Hi ${user.displayName},</h2>
      <p>We received a request to change your ${identifier?.includes("@") ? "email address" : "phone number"}.</p>
      <p>Use the OTP below to confirm your request:</p>
      <h3>${otp?.secret}</h3>
      <p>If you didn’t make this request, please secure your account immediately.</p>
    </div>
  `,
  text: `Hi ${user.displayName}, your OTP to confirm the change request is ${otp?.secret}.`,
});

/* -----------------------------------------------------------
 *  CHANGE IDENTIFIER CONFIRMATION
 * --------------------------------------------------------- */
export const changeIdentifierTemplate = ({
  user,
  otp,
  newIdentifier,
  env,
}: TemplateProps) => {
  const link = `${env?.get("CLIENT_ENDPOINT")}/confirm-change?identifier=${newIdentifier}&purpose=${otp?.purpose}&secret=${otp?.secret}&type=${otp?.type}`;
  return {
    subject: `🔗 Verify Your New ${newIdentifier?.includes("@") ? "Email" : "Phone"} — ${appName}`,
    html: `
      <div style="${baseStyles}">
        <h2>Hi ${user.displayName},</h2>
        <p>Click below to confirm your new ${newIdentifier?.includes("@") ? "email address" : "phone number"}.</p>
        <a href="${link}" style="${buttonStyles}">Verify Now</a>
      </div>
    `,
    text: `Hi ${user.displayName}, verify your new identifier here: ${link}`,
  };
};

/* -----------------------------------------------------------
 *  MFA / SECURITY
 * --------------------------------------------------------- */
export const verifyMfaTemplate = ({ user, otp }: TemplateProps) => ({
  subject: `📲 Your ${appName} 2FA Code`,
  html: `
    <div style="${baseStyles}">
      <h2>Hi ${user.displayName},</h2>
      <p>Your ${appName} two-factor authentication code is:</p>
      <h3>${otp?.secret}</h3>
      <p>This code expires shortly — do not share it with anyone.</p>
    </div>
  `,
  text: `Hi ${user.displayName}, your 2FA code is ${otp?.secret}.`,
});

export const enableMfaReqTemplate = ({ user, otp }: TemplateProps) => ({
  subject: `🔑 Enable 2FA — OTP Required (${appName})`,
  html: `
    <div style="${baseStyles}">
      <h2>Hi ${user.displayName},</h2>
      <p>Use the following code to enable 2FA for your ${appName} account:</p>
      <h3>${otp?.secret}</h3>
      <p>It expires soon. Please do not share this code.</p>
    </div>
  `,
  text: `Hi ${user.displayName}, use OTP ${otp?.secret} to enable 2FA.`,
});

export const disableMfaReqTemplate = ({ user, otp }: TemplateProps) => ({
  subject: `🔑 Disable 2FA — OTP Required (${appName})`,
  html: `
    <div style="${baseStyles}">
      <h2>Hi ${user.displayName},</h2>
      <p>Use this OTP to disable 2FA on your ${appName} account:</p>
      <h3>${otp?.secret}</h3>
      <p>If this wasn’t you, please secure your account immediately.</p>
    </div>
  `,
  text: `Hi ${user.displayName}, OTP to disable 2FA: ${otp?.secret}.`,
});

export const enableMfaTemplate = ({ user }: TemplateProps) => ({
  subject: `✅ 2FA Enabled — ${appName}`,
  html: `
    <div style="${baseStyles}">
      <h2>Hi ${user.displayName},</h2>
      <p>You’ve successfully enabled two-factor authentication for your ${appName} account. Great choice — your account is now more secure.</p>
    </div>
  `,
  text: `Hi ${user.displayName}, 2FA has been enabled on your account.`,
});

export const disableMfaTemplate = ({ user }: TemplateProps) => ({
  subject: `⚠️ 2FA Disabled — ${appName}`,
  html: `
    <div style="${baseStyles}">
      <h2>Hi ${user.displayName},</h2>
      <p>Two-factor authentication has been disabled on your ${appName} account. If you didn’t do this, please re-enable it immediately.</p>
    </div>
  `,
  text: `Hi ${user.displayName}, 2FA has been disabled. If this wasn’t you, secure your account.`,
});

/* -----------------------------------------------------------
 *  SECURITY ALERT
 * --------------------------------------------------------- */
export const securityAlertTemplate = ({ user, message }: TemplateProps) => ({
  subject: `⚠️ Security Alert — ${appName}`,
  html: `
    <div style="${baseStyles}">
      <h2>Hi ${user.displayName},</h2>
      <p>${message}</p>
      <p>If you suspect any suspicious activity, please change your password immediately.</p>
    </div>
  `,
  text: `Hi ${user.displayName}, ${message}`,
});

/* -----------------------------------------------------------
 *  ORDER STATUS UPDATES
 * --------------------------------------------------------- */
export const orderStatusTemplate = ({ user, order }: TemplateProps) => {
  const statusMessages: Record<string, { subject: string; message: string }> = {
    pending: {
      subject: `🛒 Order Received — #${order?.id}`,
      message: `Thanks ${user.displayName}! We’ve received your order and it’s awaiting confirmation.`,
    },
    confirmed: {
      subject: `✅ Order Confirmed — #${order?.id}`,
      message: `Good news, ${user.displayName}! Your order is confirmed and will be processed shortly.`,
    },
    processing: {
      subject: `⚙️ Order Processing — #${order?.id}`,
      message: `We’re preparing your order with care. You’ll receive a shipping update soon.`,
    },
    shipped: {
      subject: `📦 Order Shipped — #${order?.id}`,
      message: `${user.displayName}, your order is on its way! You’ll receive tracking details shortly.`,
    },
    delivered: {
      subject: `🎁 Order Delivered — #${order?.id}`,
      message: `Your order has arrived! We hope you love your purchase. Thank you for shopping with ${appName}.`,
    },
    cancelled: {
      subject: `❌ Order Cancelled — #${order?.id}`,
      message: `Your order has been cancelled. If this wasn’t intended, please contact our support team.`,
    },
    refunded: {
      subject: `💸 Refund Processed — #${order?.id}`,
      message: `Your refund has been processed successfully. You should receive the amount shortly.`,
    },
  };

  const { subject, message } = statusMessages[order!.status] ?? {
    subject: `📦 Order Update — #${order?.id}`,
    message: `Your order status has been updated.`,
  };

  return {
    subject,
    html: `<div style="${baseStyles}"><p>${message}</p></div>`,
    text: message,
  };
};
