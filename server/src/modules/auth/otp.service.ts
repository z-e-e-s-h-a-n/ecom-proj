import { Injectable, UnauthorizedException } from "@nestjs/common";
import { OtpPurpose, OtpType } from "@prisma/client";
import { PrismaService } from "@/modules/prisma/prisma.service";
import { NotificationService } from "@/modules/notification/notification.service";
import { generateSecret, expiryDate } from "@/lib/utils/general.util";
import { EnvService } from "@/modules/env/env.service";

interface SendOtpPayload {
  userId: string;
  email?: string;
  phone?: string;
  purpose: OtpPurpose;
  type?: OtpType;
}

interface verifyOtpPayload {
  userId: string;
  secret: string;
  purpose: OtpPurpose;
  type?: OtpType;
  verifyOnly?: boolean;
}

@Injectable()
export class OtpService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notification: NotificationService,
    private readonly env: EnvService
  ) {}

  async sendOtp({
    userId,
    email,
    phone,
    purpose,
    type = "otp",
  }: SendOtpPayload) {
    let otp = await this.prisma.otp.findFirst({
      where: { userId, purpose, type, isUsed: false },
    });

    if (!otp) {
      otp = await this.prisma.otp.create({
        data: {
          userId,
          purpose,
          type,
          secret: generateSecret(type),
          expiresAt: expiryDate(this.env.get("OTP_EXP"), true),
        },
      });
    }

    if (email) {
      await this.notification.sendEmail(purpose, email, otp);
    } else if (phone) {
      await this.notification.sendSms(purpose, phone, otp);
    }

    return otp;
  }

  async verifyOtp({
    userId,
    secret,
    purpose,
    type = "otp",
    verifyOnly,
  }: verifyOtpPayload) {
    const otp = await this.prisma.otp.findFirst({
      where: { userId, secret, purpose, type, isUsed: false },
    });

    if (!otp) {
      throw new UnauthorizedException("Invalid OTP");
    }

    if (!verifyOnly) {
      await this.prisma.otp.update({
        where: { id: otp.id },
        data: { isUsed: true },
      });
    }

    return otp;
  }
}
