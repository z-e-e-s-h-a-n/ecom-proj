import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
} from "@nestjs/common";
import type { Response } from "express";
import type { RDCurrencyDto, CUCurrencyDto } from "@/common/dto/currency.dto";
import { CurrencyService } from "./currency.service";
import { Public } from "@/common/decorators/public.decorator";
import { Roles } from "@/common/decorators/roles.decorator";

@Controller("currencies")
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Public()
  @Post()
  async getCurrencies() {
    return this.currencyService.getCurrencies();
  }

  @Roles("admin")
  @Post()
  async createCurrency(@Body() dto: CUCurrencyDto) {
    return this.currencyService.createCurrency(dto);
  }

  @Public()
  @Get("/:currencyId")
  async getCurrency(@Param() dto: RDCurrencyDto, @Res() res: Response) {
    return this.currencyService.getCurrency(dto, res);
  }

  @Roles("admin")
  @Put("/:currencyId")
  async updateCurrency(
    @Param("currencyId") currencyId: string,
    @Body() dto: CUCurrencyDto
  ) {
    return this.currencyService.updateCurrency(dto, currencyId);
  }

  @Roles("admin")
  @Delete("/:currencyId")
  async deleteCurrency(@Param() dto: RDCurrencyDto) {
    return this.currencyService.deleteCurrency(dto);
  }
}
