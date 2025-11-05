import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "@/modules/prisma/prisma.service";
import type {
  CreateOrderDto,
  RDOrderDto,
  UpdateOrderDto,
} from "@/common/dto/order.dto";
import type { Request } from "express";
import type { AuditAction } from "@prisma/client";
import { PaymentService } from "@/modules/payment/payment.service";

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paymentService: PaymentService
  ) {}

  async placeOrder(
    { items, paymentMethodId, ...rest }: CreateOrderDto,
    req: Request
  ) {
    const userId = req.user!.id;

    const order = await this.prisma.$transaction(async (tx) => {
      for (const item of items) {
        const updated = await tx.productVariant.update({
          where: { id: item.variantId, stock: { gte: item.quantity } },
          data: {
            stock: { decrement: item.quantity },
            reserved: { increment: item.quantity },
          },
        });

        if (!updated) {
          throw new BadRequestException(
            `Insufficient stock for variant ${item.variantId}`
          );
        }
      }

      const newOrder = await tx.order.create({
        data: {
          userId,
          ...rest,
          items: { create: items.map((i) => i) },
        },
        include: {
          items: true,
          currency: true,
          shippingAddress: true,
          billingAddress: true,
        },
      });

      if (rest.userCouponId) {
        await tx.userCoupon.update({
          where: { id: rest.userCouponId },
          data: { usedAt: new Date(), isApplied: true },
        });
      }

      await this.paymentService.initiatePayment({
        amount: rest.total,
        currencyId: rest.currencyId,
        methodId: paymentMethodId,
        orderId: newOrder.id,
      });

      await tx.auditLog.create({
        data: {
          userId,
          action: "orderCreated",
          entityType: "Order",
          entityId: newOrder.id,
          metadata: { total: rest.total, items: items.length },
        },
      });

      return newOrder;
    });

    return { message: "Order Created Successfully", data: { order } };
  }

  async getUserOrders(req: Request) {
    const userId = req.user!.id;

    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: {
        items: true,
        currency: true,
        shippingAddress: true,
        billingAddress: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return { message: "Orders Fetched Successfully", data: { orders } };
  }

  async getAllOrders() {
    const orders = await this.prisma.order.findMany({
      include: {
        user: { select: { id: true, firstName: true, email: true } },
        items: true,
        currency: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return { message: "Orders Fetched Successfully", data: { orders } };
  }

  async getOrder(dto: RDOrderDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
      include: {
        items: true,
        currency: true,
        user: { select: { firstName: true, email: true } },
        shippingAddress: true,
        billingAddress: true,
      },
    });

    return { message: "Order Fetched Successfully", data: { order } };
  }

  async updateOrder(dto: UpdateOrderDto, orderId: string) {
    const order = await this.prisma.order.update({
      where: { id: orderId },
      data: dto,
      include: { items: true },
    });

    const actions: AuditAction[] = [
      "orderCancelled",
      "orderCreated",
      "orderDelivered",
      "orderRefunded",
      "orderShipped",
    ];

    await this.prisma.auditLog.create({
      data: {
        action: actions.find((a) =>
          a.toLocaleLowerCase().includes(order.status)
        )!,
        entityType: "Order",
        entityId: orderId,
        metadata: { status: dto.status },
      },
    });

    return { message: "Order Updated Successfully", data: { order } };
  }

  async deleteOrder(dto: RDOrderDto) {
    const order = await this.prisma.order.delete({
      where: { id: dto.orderId },
    });

    await this.prisma.auditLog.create({
      data: {
        action: "orderCancelled",
        entityType: "Order",
        entityId: dto.orderId,
      },
    });

    return { message: "Order Deleted Successfully", data: { order } };
  }
}
