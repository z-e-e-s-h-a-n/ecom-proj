import type { OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { LoggerService } from "@/modules/logger/logger.service";
import { InjectLogger } from "@/common/decorators/logger.decorator";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  @InjectLogger()
  private readonly logger!: LoggerService;

  async onModuleInit() {
    this.logger.log("Connecting to the database...");
    try {
      await this.$connect();
      this.logger.log("✅ Database connection established.");
    } catch (error) {
      this.logger.error("❌ Database connection failed", {
        error,
      });
      throw error;
    }
  }

  async onModuleDestroy() {
    this.logger.log("Disconnecting from the database...");
    try {
      await this.$disconnect();
      this.logger.log("Database connection closed.");
    } catch (error) {
      this.logger.error("❌ Error Disconnecting Database", {
        error,
      });
      throw error;
    }
  }
}
