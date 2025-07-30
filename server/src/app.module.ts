import { Module } from "@nestjs/common";
import { AuthModule } from "@/modules/auth/auth.module";
import { PrismaModule } from "@/modules/prisma/prisma.module";
import { APP_GUARD, Reflector } from "@nestjs/core";
import { AuthGuard } from "@/common/guards/auth.guard";
import { TokenModule } from "@/modules/token/token.module";
import { NotificationModule } from "@/modules/notification/notification.module";
import { ConfigModule } from "@nestjs/config";
import { EnvModule } from "@/modules/env/env.module";
import { validateEnv } from "@/common/schemas/env.schema";
import { ScheduleModule } from "@nestjs/schedule";
import { SchedulerModule } from "@/modules/scheduler/scheduler.module";
import { LoggerModule } from "@/modules/logger/logger.module";
import { TokenService } from "@/modules/token/token.service";

@Module({
  imports: [
    EnvModule,
    AuthModule,
    PrismaModule,
    TokenModule,
    LoggerModule,
    SchedulerModule,
    NotificationModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useFactory: (tokenService, reflector) =>
        new AuthGuard(tokenService, reflector),
      inject: [TokenService, Reflector],
    },
  ],
})
export class AppModule {}
