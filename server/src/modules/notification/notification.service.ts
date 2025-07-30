import { Injectable } from "@nestjs/common";
import { resolveTemplate } from "@/common/templates/notification";
import { Resend } from "resend";
import { EnvService } from "@/modules/env/env.service";

@Injectable()
export class NotificationService {
  private readonly resend: Resend;

  constructor(private readonly env: EnvService) {
    this.resend = new Resend(this.env.get("RESEND_API_KEY"));
  }

  async sendEmail(purpose: NotificationPurpose, to: string, data: any) {
    const { html, subject } = resolveTemplate(purpose, data);
    const from = "Evorii <onboarding@resend.dev>";

    return this.resend.emails.send({ from, to, subject, html });
  }

  async sendSms(purpose: NotificationPurpose, to: string, data: any) {
    console.log(`Sending SMS to ${to}: ${purpose} with data`, data);
  }
}
