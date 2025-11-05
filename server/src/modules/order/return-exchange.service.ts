import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "@/modules/prisma/prisma.service";
import type {
  CreateReturnExchangeDto,
  RDReturnExchangeDto,
  UpdateReturnExchangeDto,
} from "@/common/dto/return-exchange.dto";
import type { Request } from "express";

@Injectable()
export class ReturnExchangeService {
  constructor(private readonly prisma: PrismaService) {}

  async createReturnExchange(dto: CreateReturnExchangeDto, req: Request) {
    const userId = req.user!.id;

    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
      include: { items: true },
    });

    if (!order) throw new NotFoundException("Order not found");

    if (dto.orderItems) {
      for (const it of dto.orderItems) {
        const oi = order.items.find((o) => o.id === it.orderItemId);
        if (!oi) throw new BadRequestException("Invalid order item id");
        if (it.quantity > oi.quantity)
          throw new BadRequestException(
            "Return quantity exceeds ordered quantity"
          );
      }
    }

    const txResult = await this.prisma.$transaction(async (tx) => {
      if (dto.type === "exchange" && dto.exchangeVariants) {
        for (const v of dto.exchangeVariants) {
          const variant = await tx.productVariant.findUnique({
            where: { id: v.variantId },
          });
          if (!variant) throw new NotFoundException("Variant not found");
          if (variant.stock < v.quantity)
            throw new BadRequestException(
              `Insufficient stock for variant ${v.variantId}`
            );

          await tx.productVariant.update({
            where: { id: v.variantId },
            data: {
              stock: { decrement: v.quantity },
              reserved: { increment: v.quantity },
            },
          });
        }
      }

      const re = await tx.returnExchange.create({
        data: {
          orderId: dto.orderId,
          type: dto.type,
          reason: dto.reason,
          shippingResponsibility: dto.shippingResponsibility,
          priceDifference: dto.priceDifference ?? 0,
          initiatedById: userId,
          notes: dto.notes,
          orderItems: {
            create: dto?.orderItems?.map((i) => ({
              orderItemId: i.orderItemId,
              quantity: i.quantity,
            })),
          },
          exchangeVariants: {
            create: dto?.exchangeVariants?.map((v) => ({
              variantId: v.variantId,
              quantity: v.quantity,
            })),
          },
        },
        include: { orderItems: true, exchangeVariants: true },
      });

      await tx.auditLog.create({
        data: {
          userId,
          action: "orderCreated",
          entityType: "ReturnExchange",
          entityId: re.id,
          metadata: { type: dto.type, orderId: dto.orderId },
        },
      });

      return re;
    });

    return {
      message: "Return/Exchange requested",
      data: { returnExchange: txResult },
    };
  }

  async getReturnExchange(dto: RDReturnExchangeDto) {
    const re = await this.prisma.returnExchange.findUnique({
      where: { id: dto.returnExchangeId },
      include: {
        order: true,
        orderItems: { include: { orderItem: true } },
        exchangeVariants: true,
        initiatedBy: true,
        approvedBy: true,
        refund: true,
      },
    });

    return { message: "Return/Exchange fetched", data: { returnExchange: re } };
  }

  async getReturnExchanges() {
    const list = await this.prisma.returnExchange.findMany({
      orderBy: { createdAt: "desc" },
      include: { order: true, initiatedBy: true },
    });

    return { message: "Return/Exchanges fetched", data: { list } };
  }

  async updateReturnExchange(dto: UpdateReturnExchangeDto, id: string) {
    const existing = await this.prisma.returnExchange.findUnique({
      where: { id },
      include: { exchangeVariants: true },
    });
    if (!existing) throw new NotFoundException("Return/Exchange not found");

    const updated = await this.prisma.returnExchange.update({
      where: { id },
      data: { status: dto.status, notes: dto.notes },
    });

    if (dto.status === "rejected" && existing.exchangeVariants?.length) {
      await this.prisma.$transaction(
        existing.exchangeVariants.map((v) =>
          this.prisma.productVariant.update({
            where: { id: v.variantId },
            data: {
              stock: { increment: v.quantity },
              reserved: { decrement: v.quantity },
            },
          })
        )
      );
    }

    return { message: "Return/Exchange updated", data: { updated } };
  }

  async deleteReturnExchange(dto: RDReturnExchangeDto) {
    const existing = await this.prisma.returnExchange.findUnique({
      where: { id: dto.returnExchangeId },
      include: { exchangeVariants: true },
    });
    if (!existing) throw new NotFoundException("Return/Exchange not found");

    if (existing.exchangeVariants?.length) {
      await this.prisma.$transaction(
        existing.exchangeVariants.map((v) =>
          this.prisma.productVariant.update({
            where: { id: v.variantId },
            data: {
              stock: { increment: v.quantity },
              reserved: { decrement: v.quantity },
            },
          })
        )
      );
    }

    const deleted = await this.prisma.returnExchange.delete({
      where: { id: dto.returnExchangeId },
    });

    return { message: "Return/Exchange deleted", data: { deleted } };
  }
}
