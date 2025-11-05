import { Injectable } from "@nestjs/common";
import type {
  CalculateTaxDto,
  CUTaxRateDto,
  RDTaxRateDto,
} from "@/common/dto/tax-rate.dto";
import { PrismaService } from "@/modules/prisma/prisma.service";

@Injectable()
export class TaxRateService {
  constructor(private readonly prisma: PrismaService) {}

  async createTaxRate({ categories, ...rest }: CUTaxRateDto) {
    const taxRate = await this.prisma.taxRate.create({
      data: {
        ...rest,
        categories: { connect: categories.map((id) => ({ id })) },
      },
    });

    return { message: "taxRate Created Successfully", data: { taxRate } };
  }

  async getTaxRates() {
    const taxRates = await this.prisma.taxRate.findMany();

    return { message: "taxRates Fetched Successfully", data: { taxRates } };
  }

  async calculateTax({
    country,
    region,
    items,
    shippingAmount,
  }: CalculateTaxDto) {
    const taxRates = await this.prisma.taxRate.findMany({
      where: {
        country,
        OR: [{ region }, { region: null }],
        isActive: true,
      },
      include: { categories: true },
    });

    let totalTax = 0;

    for (const item of items) {
      const applicableRate = taxRates.find((rate) =>
        rate.categories.some((cat) => cat.id === item.categoryId)
      );

      const rate = applicableRate ? Number(applicableRate.rate) : 0;

      totalTax += item.totalPrice * (rate / 100);
    }

    const shippingTaxRate = taxRates.find((rate) => rate.appliesToShipping);
    if (shippingTaxRate) {
      totalTax += shippingAmount * (Number(shippingTaxRate.rate) / 100);
    }

    return { totalTax, taxRatesUsed: taxRates.map((r) => r.name) };
  }

  async getTaxRate(dto: RDTaxRateDto) {
    const taxRate = await this.prisma.taxRate.findUnique({
      where: { id: dto.taxRateId },
    });

    return { message: "taxRate Fetched Successfully", data: { taxRate } };
  }

  async updateTaxRate(
    { categories, ...rest }: CUTaxRateDto,
    taxRateId: string
  ) {
    const taxRate = await this.prisma.taxRate.update({
      where: { id: taxRateId },
      data: {
        ...rest,
        categories: { connect: categories.map((id) => ({ id })) },
      },
    });

    return { message: "taxRate Created Successfully", data: { taxRate } };
  }

  async deleteTaxRate(dto: RDTaxRateDto) {
    const taxRate = await this.prisma.taxRate.delete({
      where: { id: dto.taxRateId },
    });

    return { message: "taxRate Deleted Successfully", data: { taxRate } };
  }
}
