import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/modules/prisma/prisma.service";
import { UpdateSettingDto } from "@/dto/setting.dto";

@Injectable()
export class SettingService {
  constructor(private prisma: PrismaService) {}

  async getSettings() {
    const setting = await this.prisma.setting.findFirst();

    return { message: "Setting Fetched Successfully", data: { setting } };
  }

  async updateSettings(dto: UpdateSettingDto, settingId: string) {
    const setting = await this.prisma.setting.update({
      where: { id: settingId },
      data: dto,
    });
    return { message: "Settings updated successfully", data: { setting } };
  }
}
