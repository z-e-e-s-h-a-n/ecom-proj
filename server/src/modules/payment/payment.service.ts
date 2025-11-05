import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "@/modules/prisma/prisma.service";
import type {
  InitiatePaymentDto,
  RDPaymentDto,
  UpdatePaymentDto,
} from "@/common/dto/payment.dto";

@Injectable()
export class PaymentService {
  constructor(private readonly prisma: PrismaService) {}

  async initiatePayment(dto: InitiatePaymentDto) {
    const method = await this.prisma.paymentMethod.findUnique({
      where: { id: dto.methodId },
    });
    if (!method || !method.isActive)
      throw new BadRequestException("Invalid or inactive payment method");

    let payment = await this.prisma.payment.create({ data: dto });

    switch (method.code) {
      case "cod":
        payment = await this.prisma.payment.update({
          where: { id: payment.id },
          data: { status: "completed", processedAt: new Date() },
        });
        await this.prisma.order.update({
          where: { id: dto.orderId },
          data: { status: "confirmed", confirmedAt: new Date() },
        });
        break;

      case "bankTransfer":
        payment = await this.prisma.payment.update({
          where: { id: payment.id },
          data: { status: "pending" },
        });
        break;

      case "card":
      case "paypal":
      case "gpay":
      case "applepay":
      case "stripeLink":
        payment = await this.prisma.payment.update({
          where: { id: payment.id },
          data: { status: "processing" },
        });
        break;

      default:
        throw new BadRequestException("Unsupported payment method");
    }

    return { message: "Payment initiated successfully", data: payment };
  }

  async getPayment(dto: RDPaymentDto) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: dto.paymentId },
    });

    return { message: "Payment fetched", data: payment };
  }

  async getPayments() {
    const payments = await this.prisma.payment.findMany();
    return { message: "Payments fetched", data: payments };
  }

  async updatePayment(dto: UpdatePaymentDto, paymentId: string) {
    const payment = await this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: dto.status,
        processedAt: new Date(),
      },
    });

    if (dto.status === "completed") {
      await this.prisma.order.update({
        where: { id: payment.orderId },
        data: { status: "confirmed", confirmedAt: new Date() },
      });
    }

    return { message: "Payment status updated", data: { payment } };
  }

  async deletePayment(dto: RDPaymentDto) {
    const payment = await this.prisma.payment.delete({
      where: { id: dto.paymentId },
    });

    return { message: "Payment cancelled successfully", data: { payment } };
  }

  async handleWebhook(dto: any, paymentMethod: string) {
    switch (paymentMethod) {
      case "paypal":
        // TODO: Validate and process PayPal webhook
        break;
      case "stripeLink":
      case "gpay":
      case "applepay":
        // TODO: Validate and process Stripe or Google/Apple Pay webhook
        break;
      default:
        throw new BadRequestException("Unsupported webhook method");
    }
    return { message: "Webhook processed", data: { dto } };
  }
}
