import nodemailer from "nodemailer";
import envConfig from "@/config/env";
import { getTemplate, TemplateTypes } from "@/config/template";

export interface ISendEmail {
  purpose: TemplateTypes;
  email: string;
  secret?: string;
}

export const sendEmail = async ({ purpose, email, secret }: ISendEmail) => {
  const transporter = nodemailer.createTransport({
    host: envConfig.nodemailer.host,
    port: envConfig.nodemailer.port,
    secure: envConfig.env === "production",
    auth: {
      user: envConfig.nodemailer.user,
      pass: envConfig.nodemailer.pass,
    },
  });

  const { html, subject } = getTemplate({ purpose, identifier: email, secret });

  const mailOptions = {
    from: envConfig.nodemailer.from,
    to: email,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};
