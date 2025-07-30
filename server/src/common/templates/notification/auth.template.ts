export const signupTemplate = (user: any) => ({
  subject: "🎉 Welcome to Evorii, " + user.displayName + "!",
  html: `
    <h1 style="margin-bottom: 10px;">Welcome to Evorii, ${user.displayName}!</h1>
    <p>We're thrilled to have you with us. Explore our custom-crafted gifts and make every moment special.</p>
    <p style="margin-top: 20px;">Need help? Just reply to this email or reach out at any time.</p>
    <p>— Team Evorii</p>
  `,
  text: `Hey ${user.displayName}, welcome to Evorii! Your journey into personalized gifting starts now. Let us know if you need anything – we're here for you. – Team Evorii`,
});

export const loginTemplate = () => ({
  subject: "🔐 Login Successful — Evorii",
  html: `
    <h2>Login Alert</h2>
    <p>You just logged in to your Evorii account.</p>
    <p>If this wasn’t you, please reset your password immediately.</p>
  `,
  text: `You’ve logged in to Evorii. If this wasn't you, reset your password immediately.`,
});

export const setPasswordTemplate = (user: any) => ({
  subject: "🔐 Set Your Evorii Password",
  html: `
    <h2>Set Your Password</h2>
    <p>Hi ${user.displayName}, welcome aboard!</p>
    <p>Click the link below to set your new password and secure your Evorii account:</p>
    <a href="https://yourfrontend.com/set-password" style="display:inline-block;padding:10px 20px;background-color:#000;color:#fff;text-decoration:none;border-radius:5px;">Set Password</a>
    <p>If you didn’t request this, please ignore this email.</p>
  `,
  text: `Hi ${user.displayName}, set your password here: https://yourfrontend.com/set-password. If this wasn't you, ignore this message.`,
});

export const resetPasswordTemplate = (data: any) => {
  const resetLink = `https://yourfrontend.com/reset-password?secret=${data.secret}`;
  return {
    subject: "🔁 Reset Your Evorii Password",
    html: `
      <h2>Password Reset</h2>
      <p>We received a request to reset your password.</p>
      <p>Your verification code is: <strong>${data.secret}</strong></p>
      <p>Or click the button below:</p>
      <a href="${resetLink}" style="display:inline-block;padding:10px 20px;background-color:#000;color:#fff;text-decoration:none;border-radius:5px;">Reset Password</a>
      <p>If you didn’t request this, ignore this email.</p>
    `,
    text: `Verification code: ${data.secret}. Reset your password here: ${resetLink}. If this wasn't you, ignore this message.`,
  };
};

export const verifyEmailTemplate = (data: any) => {
  const verifyLink = `https://yourfrontend.com/verify-email?secret=${data.secret}`;
  return {
    subject: "📧 Verify Your Evorii Email",
    html: `
      <h2>Almost there!</h2>
      <p>Your verification code: <strong>${data.secret}</strong></p>
      <p>Or click the link below to verify your email:</p>
      <a href="${verifyLink}">${verifyLink}</a>
    `,
    text: `Your code is ${data.secret}. Or verify your email here: ${verifyLink}`,
  };
};

export const verifyPhoneTemplate = (data: any) => ({
  subject: "📱 Verify Your Phone Number — Evorii",
  html: `
    <h2>Phone Verification</h2>
    <p>Your phone verification code is: <strong>${data.secret}</strong></p>
    <p>It expires in a few minutes. Please do not share this code.</p>
  `,
  text: `Your Evorii phone verification code is: ${data.secret}. It will expire shortly.`,
});

export const changeEmailTemplate = (data: any) => ({
  subject: "✉️ Confirm Your Email Change — Evorii",
  html: `
    <h2>Email Change Request</h2>
    <p>You requested to change your email address.</p>
    <p>Use the verification code below to confirm:</p>
    <p><strong>${data.secret}</strong></p>
    <p>If you didn’t make this request, please secure your account immediately.</p>
  `,
  text: `Use this code to confirm your email change: ${data.secret}. If this wasn't you, please secure your account.`,
});

export const changePhoneTemplate = (data: any) => ({
  subject: "📱 Confirm Your Phone Number Change — Evorii",
  html: `
    <h2>Phone Number Change Request</h2>
    <p>We received a request to change the phone number on your account.</p>
    <p>Your verification code: <strong>${data.secret}</strong></p>
    <p>If this wasn’t you, take action to protect your account.</p>
  `,
  text: `Use this code to confirm your phone number change: ${data.secret}. If this wasn’t you, secure your account immediately.`,
});

export const enable2FATemplate = () => ({
  subject: "✅ 2FA Enabled on Your Evorii Account",
  html: `
    <h2>Two-Factor Authentication Enabled</h2>
    <p>You’ve successfully enabled 2FA for your account. This adds an extra layer of protection.</p>
    <p>If you didn’t do this, please review your security settings immediately.</p>
  `,
  text: `2FA has been enabled on your Evorii account. If this wasn’t you, check your account security now.`,
});

export const disable2FATemplate = () => ({
  subject: "⚠️ 2FA Disabled on Your Evorii Account",
  html: `
    <h2>Two-Factor Authentication Disabled</h2>
    <p>You’ve disabled 2FA on your account. Your account is now protected only by your password.</p>
    <p>If you didn’t request this change, please enable 2FA again and reset your password.</p>
  `,
  text: `2FA has been disabled on your Evorii account. If this wasn’t you, re-enable it and reset your password.`,
});

export const mfaTemplate = (data: any) => ({
  subject: "📲 Your Evorii MFA Code",
  html: `
    <h2>Multi-Factor Authentication</h2>
    <p>Here is your code: <strong style="font-size: 20px;">${data.secret}</strong></p>
    <p>It will expire shortly. Do not share this with anyone.</p>
  `,
  text: `Your MFA code is: ${data.secret}. It will expire soon. Do not share it.`,
});
