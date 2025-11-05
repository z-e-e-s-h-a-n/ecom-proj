import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/modules/prisma/prisma.service";
import type { Request } from "express";
import type { UpdateUserPreferenceDto } from "@/common/dto/user-preference.dto";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getPreferences(req: Request) {
    const userId = req.user?.id;
    const preferences = await this.prisma.userPreference.findUnique({
      where: { userId },
    });

    return {
      message: "preferences Fetched Successfully",
      data: { preferences },
    };
  }

  async updatePreferences(userId: string, dto: UpdateUserPreferenceDto) {
    const preferences = await this.prisma.userPreference.upsert({
      where: { userId },
      create: { userId, ...dto },
      update: dto,
    });
    return { message: "Preferences updated", data: { preferences } };
  }
}
