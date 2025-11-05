import { Module } from "@nestjs/common";
import { PrismaService } from "@/modules/prisma/prisma.service";
import { PaymentService } from "@/modules/payment/payment.service";
import { RefundService } from "@/modules/payment/refund.service";
import { PaymentMethodService } from "@/modules/payment/payment-method.service";
import { PaymentController } from "@/modules/payment/payment.controller";
import { RefundController } from "@/modules/payment/refund.controller";
import { PaymentMethodController } from "@/modules/payment/payment-method.controller";

@Module({
  controllers: [PaymentController, RefundController, PaymentMethodController],
  providers: [
    PrismaService,
    PaymentService,
    RefundService,
    PaymentMethodService,
  ],
  exports: [PaymentService, RefundService, PaymentMethodService],
})
export class PaymentModule {}
