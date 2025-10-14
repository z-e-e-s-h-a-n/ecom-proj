import type { CUAddressDto, RDAddressDto } from "@/common/dto/address.dto";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/modules/prisma/prisma.service";
import type { Request } from "express";

@Injectable()
export class AddressService {
  constructor(private readonly prisma: PrismaService) {}

  async createAddress(dto: CUAddressDto, req: Request) {
    const userId = req.user!.id;

    const address = await this.prisma.address.create({
      data: { userId, ...dto },
    });

    return { message: "Address added successfully", data: { address } };
  }

  async getAddresses(req: Request) {
    const userId = req.user!.id;

    const addresses = await this.prisma.address.findMany({
      where: { userId },
    });

    return { message: "Address Fetched successfully", data: { addresses } };
  }

  async getAddress(dto: RDAddressDto) {
    const address = await this.prisma.address.findUnique({
      where: { id: dto.addressId },
    });

    return { message: "Address Fetched successfully", data: { address } };
  }

  async updateAddress(dto: CUAddressDto, addressId: string) {
    const address = await this.prisma.address.update({
      where: { id: addressId },
      data: dto,
    });

    return { message: "Address updated successfully", data: { address } };
  }

  async deleteAddress(dto: RDAddressDto) {
    const address = await this.prisma.address.delete({
      where: { id: dto.addressId },
    });

    return { message: "Address Deleted Successfully", data: { address } };
  }
}
