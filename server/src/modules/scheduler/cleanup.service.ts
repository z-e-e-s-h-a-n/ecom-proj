import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { PrismaService } from "@/modules/prisma/prisma.service";
import { LoggerService } from "@/modules/logger/logger.service";

@Injectable()
export class CleanupService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleOtpCleanup() {
    const result = await this.prisma.otp.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });
    this.logger.log(`Deleted ${result.count} expired OTPs`);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleRefreshTokenCleanup() {
    const result = await this.prisma.refreshToken.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });
    this.logger.log(`Deleted ${result.count} expired refresh tokens`);
  }
}
