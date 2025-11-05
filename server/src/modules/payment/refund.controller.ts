import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { RefundService } from "@/modules/payment/refund.service";
import {
  RDRefundDto,
  CreateRefundDto,
  UpdateRefundDto,
} from "@/common/dto/payment.dto";

@Controller("refunds")
export class RefundController {
  constructor(private readonly refundService: RefundService) {}

  @Get()
  async getRefunds() {
    return this.refundService.getRefunds();
  }

  @Post()
  async createRefund(@Body() dto: CreateRefundDto) {
    return this.refundService.createRefund(dto);
  }

  @Get("/:refundId")
  async getRefund(@Param() dto: RDRefundDto) {
    return this.refundService.getRefund(dto);
  }

  @Put("/:refundId")
  async updateRefund(
    @Body() dto: UpdateRefundDto,
    @Param("refundId") refundId: string
  ) {
    return this.refundService.updateRefund(dto, refundId);
  }

  @Delete("/:refundId")
  async deleteRefund(@Param() dto: RDRefundDto) {
    return this.refundService.deleteRefund(dto);
  }
}
