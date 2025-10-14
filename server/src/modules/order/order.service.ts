import { Injectable } from "@nestjs/common";
import type { PrismaService } from "../prisma/prisma.service";
import type {
  CreateOrderDto,
  RDOrderDto,
  UpdateOrderDto,
} from "@/common/dto/order.dto";
import type { Request } from "express";

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async placeOrder({ items, ...rest }: CreateOrderDto, req: Request) {
    const userId = req.user!.id;

    const order = await this.prisma.order.create({
      data: {
        userId,
        ...rest,
        items: {
          create: items.map((i) => i),
        },
      },
    });

    return { message: "Order Created Successfully", data: { order } };
  }

  async getUserOrders(req: Request) {
    const userId = req.user!.id;

    const orders = await this.prisma.order.findMany({
      where: { userId },
    });

    return { message: "Orders Fetched Successfully", data: { orders } };
  }

  async getAllOrders() {
    const orders = await this.prisma.order.findMany();

    return { message: "Orders Fetched Successfully", data: { orders } };
  }

  async updateOrder(dto: UpdateOrderDto, orderId: string) {
    const order = await this.prisma.order.update({
      where: { id: orderId },
      data: dto,
    });

    return { message: "Order Updated Successfully", data: { order } };
  }

  async deleteOrder(dto: RDOrderDto) {
    const order = await this.prisma.order.delete({
      where: { id: dto.orderId },
    });

    return { message: "Order Deleted Successfully", data: { order } };
  }
}
