import { Injectable } from "@nestjs/common";
import type {
  CUShippingRateDto,
  RDShippingRateDto,
} from "@/common/dto/shipping.dto";
import { PrismaService } from "@/modules/prisma/prisma.service";
import type { DimensionUnit, WeightUnit } from "@prisma/client";

@Injectable()
export class ShippingRateService {
  constructor(private readonly prisma: PrismaService) {}

  async createShippingRate(dto: CUShippingRateDto) {
    const shippingRate = await this.prisma.shippingRate.create({
      data: dto,
    });

    return {
      message: "shippingRate Created Successfully",
      data: { shippingRate },
    };
  }

  async getShippingRates(items: any[]) {
    const productVariants = await this.prisma.productVariant.findMany({
      where: { id: { in: items.map((i) => i.variantId) } },
      select: { id: true, weight: true, dimensions: true },
    });

    const { weightInKg, volumeInCm3 } =
      this.calcShippingMetrics(productVariants);

    // TODO: Integrate with real carrier APIs/ Local Rates
    const shippingRates = await this.prisma.shippingRate.findMany({
      where: {
        minWeight: { gte: weightInKg },
        maxWeight: { lte: weightInKg },
        minVolume: { gte: volumeInCm3 },
        maxVolume: { lte: volumeInCm3 },
      },
    });

    return {
      message: "Shipping rates fetched successfully",
      data: { shippingRates },
    };
  }

  async getShippingRate(dto: RDShippingRateDto) {
    const shippingRate = await this.prisma.shippingRate.findUnique({
      where: { id: dto.shippingRateId },
    });

    return {
      message: "shippingRate Fetched Successfully",
      data: { shippingRate },
    };
  }

  async updateShippingRate(dto: CUShippingRateDto, shippingRateId: string) {
    const shippingRate = await this.prisma.shippingRate.update({
      where: { id: shippingRateId },
      data: dto,
    });

    return {
      message: "shippingRate Updated Successfully",
      data: { shippingRate },
    };
  }

  async deleteShippingRate(dto: RDShippingRateDto) {
    const shippingRate = await this.prisma.shippingRate.delete({
      where: { id: dto.shippingRateId },
    });

    return {
      message: "shippingRate Deleted Successfully",
      data: { shippingRate },
    };
  }

  private calcShippingMetrics(items: any[]) {
    const toNumber = (v: any) =>
      v === undefined || v === null ? 0 : Number(v) || 0;

    const weightToKg = (value: number, unit: WeightUnit) => {
      const v = toNumber(value);
      if (unit === "g") return v / 1000;
      if (unit === "kg") return v;
      return v;
    };

    const lengthToCm = (value: number, unit: DimensionUnit) => {
      const v = toNumber(value);
      if (unit === "inch") return v * 2.54;
      if (unit === "cm") return v;
      return v;
    };

    let totalWeightKg = 0;
    let totalVolumeCm3 = 0;

    for (const item of items || []) {
      const quantity = item.quantity;

      let wVal = item.weight.value;
      let wUnit = item.weight.unit;
      const weightKgPerUnit = weightToKg(wVal, wUnit);
      totalWeightKg += weightKgPerUnit * quantity;

      let length = item.dimensions.length;
      let width = item.dimensions.width;
      let height = item.dimensions.height;
      let dimUnit = item.dimensions.unit;

      const lCm = lengthToCm(length, dimUnit);
      const wCm = lengthToCm(width, dimUnit);
      const hCm = lengthToCm(height, dimUnit);

      const volumePerUnit = lCm * wCm * hCm; // cm^3
      totalVolumeCm3 += volumePerUnit * quantity;
    }

    return {
      weightInKg: Number(totalWeightKg.toFixed(2)),
      volumeInCm3: Number(totalVolumeCm3.toFixed(2)),
    };
  }
}
