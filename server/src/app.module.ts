import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
// import { APP_GUARD, Reflector } from "@nestjs/core";
import { EnvModule } from "@/modules/env/env.module";
// import { AuthGuard } from "@/guards/auth.guard";
import { AuthModule } from "@/modules/auth/auth.module";
import { validateEnv } from "@/schemas/env.schema";
import { AuditModule } from "@/modules/audit/audit.module";
import { TokenModule } from "@/modules/token/token.module";
import { PublicModule } from "@/modules/public/public.module";
// import { TokenService } from "@/modules/token/token.service";
import { PrismaModule } from "@/modules/prisma/prisma.module";
import { LoggerModule } from "@/modules/logger/logger.module";
import { SchedulerModule } from "@/modules/scheduler/scheduler.module";
import { NotificationModule } from "@/modules/notification/notification.module";
import { TemplateModule } from "@/modules/template/template.module";
import { CategoryModule } from "@/modules/category/category.module";
import { AttributeModule } from "@/modules/attribute/attribute.module";
import { SpecificationModule } from "@/modules/specification/specification.module";
import { ProductModule } from "@/modules/product/product.module";
import { AllExceptionsFilter } from "@/common/filters/exceptions.filter";
import { ResponseInterceptor } from "@/common/interceptors/response.interceptor";
import { CurrencyModule } from "@/modules/currency/currency.module";
import { ProductEngagementModule } from "@/modules/engagement/engagement.module";
import { PaymentModule } from "./modules/payment/payment.module";
import { TaxRateModule } from "./modules/tax-rate/tax-rate.module";
import { CouponModule } from "./modules/coupon/coupon.module";
import { LoyaltyModule } from "./modules/loyalty/loyalty.module";
import { SettingModule } from "./modules/setting/setting.module";
import { UserModule } from "./modules/user/user.module";
import { ShippingModule } from "./modules/shipping/shipping.module";

@Module({
  imports: [
    PublicModule,
    PrismaModule,
    LoggerModule,
    AuditModule,
    EnvModule,
    AuthModule,
    TokenModule,
    TemplateModule,
    NotificationModule,
    SchedulerModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    CategoryModule,
    AttributeModule,
    SpecificationModule,
    ProductModule,
    CurrencyModule,
    ProductEngagementModule,
    PaymentModule,
    TaxRateModule,
    CouponModule,
    LoyaltyModule,
    SettingModule,
    UserModule,
    ShippingModule,
  ],

  providers: [
    // {
    //   provide: APP_GUARD,
    //   useFactory: (tokenService, reflector) =>
    //     new AuthGuard(tokenService, reflector),
    //   inject: [TokenService, Reflector],
    // },
    AllExceptionsFilter,
    ResponseInterceptor,
  ],
})
export class AppModule {}
