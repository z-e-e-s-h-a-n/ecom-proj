import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { TaxRateService } from "./tax-rate.service";
import type {
  CalculateTaxDto,
  CUTaxRateDto,
  RDTaxRateDto,
} from "@/common/dto/tax-rate.dto";

@Controller("tax-rates")
export class TaxRateController {
  constructor(private readonly TaxRateService: TaxRateService) {}

  @Post()
  async createTaxRate(@Body() dto: CUTaxRateDto) {
    return this.TaxRateService.createTaxRate(dto);
  }

  @Get()
  async getTaxRates() {
    this.TaxRateService.getTaxRates();
  }

  @Post("/calculate")
  async calculateTax(@Body() dto: CalculateTaxDto) {
    return this.TaxRateService.calculateTax(dto);
  }

  @Get("/:taxRateId")
  async getTaxRate(@Param() dto: RDTaxRateDto) {
    return this.TaxRateService.getTaxRate(dto);
  }

  @Post("/:taxRateId")
  async updateTaxRate(
    @Body() dto: CUTaxRateDto,
    @Param("taxRateId") taxRateId: string
  ) {
    return this.TaxRateService.updateTaxRate(dto, taxRateId);
  }

  @Delete("/:taxRateId")
  async deleteTaxRate(@Param() dto: RDTaxRateDto) {
    return this.TaxRateService.deleteTaxRate(dto);
  }
}
