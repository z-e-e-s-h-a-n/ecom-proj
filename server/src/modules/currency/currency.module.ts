import { Module } from "@nestjs/common";
import { CurrencyService } from "./currency.service";
import { CurrencyController } from "./currency.controller";
import { CookieService } from "@/lib/actions/cookie.action";

@Module({
  providers: [CurrencyService, CookieService],
  controllers: [CurrencyController],
})
export class CurrencyModule {}
