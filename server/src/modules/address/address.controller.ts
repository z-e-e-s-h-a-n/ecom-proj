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
import { AddressService } from "./address.service";
import type { Request } from "express";
import type { CUAddressDto, RDAddressDto } from "@/common/dto/address.dto";

@Controller("address")
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  async createAddress(@Body() dto: CUAddressDto, @Req() req: Request) {
    return this.addressService.createAddress(dto, req);
  }

  @Get()
  async getAddresses(@Req() req: Request) {
    return this.addressService.getAddresses(req);
  }

  @Get("/:addressId")
  async getAddress(@Param() dto: RDAddressDto) {
    return this.addressService.getAddress(dto);
  }

  @Put("/:addressId")
  async updateAddress(
    @Param("addressId") addressId: string,
    @Body() dto: CUAddressDto
  ) {
    return this.addressService.updateAddress(dto, addressId);
  }

  @Delete("/:addressId")
  async deleteAddress(@Param() dto: RDAddressDto) {
    return this.addressService.deleteAddress(dto);
  }
}
