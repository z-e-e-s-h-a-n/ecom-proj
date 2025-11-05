import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/modules/prisma/prisma.service";
import type {
  CUPaymentMethodDto,
  RDPaymentMethodDto,
} from "@/common/dto/payment.dto";

@Injectable()
export class PaymentMethodService {
  constructor(private readonly prisma: PrismaService) {}

  async getPaymentMethods() {
    const methods = await this.prisma.paymentMethod.findMany({
      where: { isActive: true },
    });

    return { message: "Payment methods fetched", data: { methods } };
  }

  async getAllPaymentMethods() {
    const methods = await this.prisma.paymentMethod.findMany({
      orderBy: { createdAt: "desc" },
    });

    return { message: "All payment methods fetched", data: { methods } };
  }

  async getPaymentMethod(dto: RDPaymentMethodDto) {
    const method = await this.prisma.paymentMethod.findUnique({
      where: { id: dto.methodId },
    });

    return { message: "Payment method fetched", data: { method } };
  }

  async createPaymentMethod(dto: CUPaymentMethodDto) {
    const method = await this.prisma.paymentMethod.create({ data: dto });

    return { message: "Payment method created", data: { method } };
  }

  async updatePaymentMethod(dto: CUPaymentMethodDto, methodId: string) {
    const method = await this.prisma.paymentMethod.update({
      where: { id: methodId },
      data: dto,
    });
    return { message: "Payment method updated", data: { method } };
  }

  async deletePaymentMethod(dto: RDPaymentMethodDto) {
    const method = await this.prisma.paymentMethod.delete({
      where: { id: dto.methodId },
    });

    return { message: "Payment method deleted", data: { method } };
  }
}
