import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@/modules/prisma/prisma.service";
import type {
  CreateRefundDto,
  UpdateRefundDto,
  RDRefundDto,
} from "@/common/dto/payment.dto";

@Injectable()
export class RefundService {
  constructor(private readonly prisma: PrismaService) {}

  async createRefund(dto: CreateRefundDto) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: dto.paymentId },
    });
    if (!payment) throw new NotFoundException("Payment not found");

    const refund = await this.prisma.refund.create({
      data: {
        ...dto,
        orderId: payment.orderId,
        status: "processed",
      },
    });

    if (dto.amount >= Number(payment.amount)) {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: "refunded" },
      });
    }

    await this.prisma.order.update({
      where: { id: payment.orderId },
      data: { status: "refunded" },
    });

    return { message: "Refund processed successfully", data: { refund } };
  }

  async getRefund(dto: RDRefundDto) {
    const refund = await this.prisma.refund.findUnique({
      where: { id: dto.refundId },
      include: { payment: true, order: true, processedBy: true },
    });

    return { message: "Refund fetched", data: { refund } };
  }

  async getRefunds() {
    const refunds = await this.prisma.refund.findMany({
      orderBy: { createdAt: "desc" },
    });

    return { message: "Refunds fetched", data: { refunds } };
  }

  async updateRefund(dto: UpdateRefundDto, refundId: string) {
    const refund = await this.prisma.refund.update({
      where: { id: refundId },
      data: { status: dto.status },
    });

    if (dto.status === "processed") {
      await this.prisma.payment.update({
        where: { id: refund.paymentId },
        data: { status: "refunded" },
      });
    }

    return { message: "Refund status updated", data: { refund } };
  }

  async deleteRefund(dto: RDRefundDto) {
    const refund = await this.prisma.refund.delete({
      where: { id: dto.refundId },
    });

    return { message: "Refund Deleted Successfully", data: { refund } };
  }
}
