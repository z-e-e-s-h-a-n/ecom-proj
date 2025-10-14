import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Param,
  Query,
} from "@nestjs/common";
import { SpecificationService } from "@/modules/specification/specification.service";
import type {
  RDSpecificationDto,
  CUSpecificationDto,
  GetSpecificationsDto,
} from "@/common/dto/specifications.dto";
import { Roles } from "@/common/decorators/roles.decorator";

@Controller("specifications")
export class SpecificationController {
  constructor(private readonly specsService: SpecificationService) {}

  @Roles("admin")
  @Post()
  async createSpecification(@Body() dto: CUSpecificationDto) {
    return this.specsService.createSpecification(dto);
  }

  @Roles("admin")
  @Get()
  async getSpecifications(@Query() dto: GetSpecificationsDto) {
    return this.specsService.getSpecifications(dto);
  }

  @Roles("admin")
  @Get("/:specsId")
  async getSpecification(@Param() dto: RDSpecificationDto) {
    return this.specsService.getSpecification(dto);
  }

  @Roles("admin")
  @Put("/:specsId")
  async updateSpecification(
    @Param("specsId") specsId: string,
    @Body() dto: CUSpecificationDto
  ) {
    return this.specsService.updateSpecification(dto, specsId);
  }

  @Roles("admin")
  @Delete("/:specsId")
  async deleteSpecification(@Param() dto: RDSpecificationDto) {
    return this.specsService.deleteSpecification(dto);
  }
}
