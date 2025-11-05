import { Module } from '@nestjs/common';
import { TaxRateService } from './tax-rate.service';
import { TaxRateController } from './tax-rate.controller';

@Module({
  providers: [TaxRateService],
  controllers: [TaxRateController]
})
export class TaxRateModule {}
