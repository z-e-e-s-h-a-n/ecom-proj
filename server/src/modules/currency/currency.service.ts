import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/modules/prisma/prisma.service";
import { CookieService } from "@/lib/actions/cookie.action";
import type { Response } from "express";
import type { CUCurrencyDto, RDCurrencyDto } from "@/common/dto/currency.dto";
import { expiryDate } from "@/lib/utils/general.util";

@Injectable()
export class CurrencyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cookieService: CookieService
  ) {}

  async getCurrencies() {
    const currencies = await this.prisma.currency.findMany();

    return { message: "Currency options retrieved.", data: { currencies } };
  }

  async createCurrency(dto: CUCurrencyDto) {
    if (dto.isDefault) {
      await this.prisma.currency.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      });
    }
    const currency = await this.prisma.currency.create({
      data: dto,
    });

    return {
      message: "currency options created Successfully.",
      data: { currency },
    };
  }

  async updateCurrency(dto: CUCurrencyDto, currencyId: string) {
    if (dto.isDefault) {
      await this.prisma.currency.updateMany({
        where: { isDefault: true, id: { not: currencyId } },
        data: { isDefault: false },
      });
    }
    const currency = await this.prisma.currency.update({
      where: { id: currencyId },
      data: dto,
    });

    return {
      message: "currency options updated Successfully.",
      data: { currency },
    };
  }

  async deleteCurrency(dto: RDCurrencyDto) {
    const currency = await this.prisma.currency.delete({
      where: { id: dto.currencyId },
    });

    return {
      message: "currency options deleted Successfully.",
      data: { currency },
    };
  }

  async getCurrency(dto: RDCurrencyDto, res: Response) {
    let currency = await this.prisma.currency.findUnique({
      where: { id: dto.currencyId },
    });

    if (!currency) {
      //TODO get IpInfo And Retrieved Currency Code
      const ipInfo = true;
      const where = ipInfo ? { country: "" } : { isDefault: true };
      currency = await this.prisma.currency.findFirst({ where });
    }

    this.cookieService.setCookie(res, "currencyInfo", currency, {
      httpOnly: false,
      expires: expiryDate("7d", true),
    });

    return { message: "Currency retrieved Successfully.", data: { currency } };
  }
}
