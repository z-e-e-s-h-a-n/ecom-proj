import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EnvModule } from "./modules/env/env.module";
import { validateEnv } from "@/common/schemas/env.schema";
import { PrismaModule } from './modules/prisma/prisma.module';

@Module({
  imports: [
    EnvModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    PrismaModule,
  ],
})
export class AppModule {}
