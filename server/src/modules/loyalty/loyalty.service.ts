import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/modules/prisma/prisma.service";
import type {
  CreateLoyaltyTransactionDto,
  CULoyaltyRuleDto,
  RDLoyaltyRuleDto,
} from "@/dto/loyalty.dto";
import type { Request } from "express";

@Injectable()
export class LoyaltyService {
  constructor(private prisma: PrismaService) {}

  async createLoyaltyRule(dto: CULoyaltyRuleDto) {
    const loyaltyRule = await this.prisma.loyaltyRule.create({ data: dto });
    return { message: "Loyalty rule created", data: { loyaltyRule } };
  }

  async getLoyaltyRules() {
    const loyaltyRules = this.prisma.loyaltyRule.findMany({
      where: { isActive: true },
    });

    return {
      message: "Loyalty Rules Fetched Successfully",
      data: { loyaltyRules },
    };
  }

  async getLoyaltyRule(dto: RDLoyaltyRuleDto) {
    const loyaltyRule = this.prisma.loyaltyRule.findUnique({
      where: { id: dto.ruleId },
    });

    return {
      message: "Loyalty Rule Fetched Successfully",
      data: { loyaltyRule },
    };
  }

  async updateLoyaltyRule(id: string, dto: CULoyaltyRuleDto) {
    const loyaltyRule = await this.prisma.loyaltyRule.update({
      where: { id },
      data: dto,
    });
    return { message: "Loyalty rule updated", data: { loyaltyRule } };
  }

  async deleteLoyaltyRule(dto: RDLoyaltyRuleDto) {
    const loyaltyRule = this.prisma.loyaltyRule.delete({
      where: { id: dto.ruleId },
    });

    return {
      message: "Loyalty Rule Deleted Successfully",
      data: { loyaltyRule },
    };
  }

  async createLoyaltyTransaction(
    dto: CreateLoyaltyTransactionDto,
    req: Request
  ) {
    const userId = req.user!.id;

    const loyaltyTransaction = await this.prisma.loyaltyPointTransaction.create(
      {
        data: { ...dto, userId },
      }
    );
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        loyaltyPoints: {
          increment: dto.type === "earn" ? dto.points : -dto.points,
        },
      },
    });
    return {
      message: "Loyalty transaction recorded",
      data: { loyaltyTransaction },
    };
  }

  async getUserTransactions(userId: string) {
    const loyaltyTransactions =
      await this.prisma.loyaltyPointTransaction.findMany({
        where: { userId },
      });

    return {
      message: "loyalty Transactions Fetched Successfully",
      data: { loyaltyTransactions },
    };
  }
}
