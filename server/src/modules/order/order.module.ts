import { Module } from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { PaymentService } from "@/modules/payment/payment.service";

@Module({
  providers: [OrderService, PaymentService],
  controllers: [OrderController],
})
export class OrderModule {}
