import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EnvModule } from "@/modules/env/env.module";
import { validateEnv } from "@/common/schemas/env.schema";
import { PrismaModule } from "@/modules/prisma/prisma.module";
import { LoggerModule } from "@/modules/logger/logger.module";
import { SchedulerModule } from "@/modules/scheduler/scheduler.module";
import { ScheduleModule } from "@nestjs/schedule";
import { NotificationModule } from "@/modules/notification/notification.module";
import { AuditModule } from "@/modules/audit/audit.module";
import { PublicModule } from "@/modules/public/public.module";

@Module({
  imports: [
    PublicModule,
    EnvModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    PrismaModule,
    LoggerModule,
    SchedulerModule,
    ScheduleModule.forRoot(),
    NotificationModule,
    AuditModule,
  ],
})
export class AppModule {}
