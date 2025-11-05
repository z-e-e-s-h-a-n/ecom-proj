import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { PaymentService } from "@/modules/payment/payment.service";
import {
  InitiatePaymentDto,
  RDPaymentDto,
  UpdatePaymentDto,
} from "@/common/dto/payment.dto";

@Controller("payments")
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async initiatePayment(dto: InitiatePaymentDto) {
    return this.paymentService.initiatePayment(dto);
  }

  @Get()
  async getPayments() {
    return this.paymentService.getPayments();
  }

  @Get("/:paymentId")
  async getPayment(@Param() dto: RDPaymentDto) {
    return this.paymentService.getPayment(dto);
  }

  @Put("/:paymentId")
  async updatePayment(
    @Body() dto: UpdatePaymentDto,
    @Param("paymentId") paymentId: string
  ) {
    return this.paymentService.updatePayment(dto, paymentId);
  }

  @Delete("/:paymentId")
  async deletePayment(@Param() dto: RDPaymentDto) {
    return this.paymentService.deletePayment(dto);
  }

  @Post("/:paymentMethod")
  async handleWebhook(
    @Body() dto: any,
    @Param("paymentMethod") paymentMethod: string
  ) {
    return this.paymentService.handleWebhook(dto, paymentMethod);
  }
}
