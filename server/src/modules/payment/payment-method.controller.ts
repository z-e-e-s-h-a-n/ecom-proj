import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { PaymentMethodService } from "@/modules/payment/payment-method.service";
import type {
  CUPaymentMethodDto,
  RDPaymentMethodDto,
} from "@/common/dto/payment.dto";

@Controller("payment-methods")
export class PaymentMethodController {
  constructor(private readonly paymentMethodService: PaymentMethodService) {}

  @Get()
  async getPaymentMethods() {
    return this.paymentMethodService.getPaymentMethods();
  }

  @Get("/all")
  async getAllPaymentMethods() {
    return this.paymentMethodService.getAllPaymentMethods();
  }

  @Post()
  async createPaymentMethod(@Body() dto: CUPaymentMethodDto) {
    return this.paymentMethodService.createPaymentMethod(dto);
  }

  @Get("/:methodId")
  async getPaymentMethod(@Param() dto: RDPaymentMethodDto) {
    return this.paymentMethodService.getPaymentMethod(dto);
  }

  @Put("/:methodId")
  async updatePaymentMethod(
    @Body() dto: CUPaymentMethodDto,
    @Param("methodId") methodId: string
  ) {
    return this.paymentMethodService.updatePaymentMethod(dto, methodId);
  }

  @Delete("/:methodId")
  async deletePaymentMethod(@Param() dto: RDPaymentMethodDto) {
    return this.paymentMethodService.deletePaymentMethod(dto);
  }
}
