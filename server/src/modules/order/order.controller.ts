import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from "@nestjs/common";
import { OrderService } from "./order.service";
import { Roles } from "@/common/decorators/roles.decorator";
import type { Request } from "express";
import type { CreateOrderDto, RDOrderDto } from "@/common/dto/order.dto";

@Controller("orders")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async placeOrder(@Body() dto: CreateOrderDto, @Req() req: Request) {
    return this.orderService.placeOrder(dto, req);
  }

  @Get()
  async getUserOrders(@Req() req: Request) {
    this.orderService.getUserOrders(req);
  }

  @Roles("admin")
  @Get("/all")
  async getAllOrders() {
    this.orderService.getAllOrders();
  }

  @Get("/:orderId")
  async getOrder(@Param() dto: RDOrderDto) {
    this.orderService.getOrder(dto);
  }

  @Roles("admin")
  @Put("/:orderId")
  async updateOrder() {}

  @Roles("admin")
  @Delete("/:orderId")
  async deleteOrder() {}
}
