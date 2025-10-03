import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EnvModule } from "./modules/env/env.module";
import { validateEnv } from "@/common/schemas/env.schema";

@Module({
  imports: [
    EnvModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
  ],
})
export class AppModule {}
