// src/lib/utils/util.ts
import envConfig from "@/config/env";
import twilio from "twilio";
import { getTemplate, TemplateTypes } from "@/config/template";

const twilioClient = twilio(
  envConfig.twilio.accountSid,
  envConfig.twilio.authToken
);

export interface ISendSms {
  purpose: TemplateTypes;
  phone: string;
  secret?: string;
}

export const sendSms = async ({ purpose, phone, secret }: ISendSms) => {
  const { html } = getTemplate({ purpose, identifier: phone, secret });

  await twilioClient.messages.create({
    body: html,
    from: envConfig.twilio.phone,
    to: phone,
  });
};
