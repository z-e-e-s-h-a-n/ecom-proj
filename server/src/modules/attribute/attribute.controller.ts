import { Public } from "@/decorators/public.decorator";
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Param,
} from "@nestjs/common";
import { AttributeService } from "@/modules/attribute/attribute.service";
import type {
  CUAttributeDto,
  GetAttributesDto,
  RDAttributeDto,
} from "@/common/dto/attribute.dto";
import { Roles } from "@/common/decorators/roles.decorator";

@Controller("attributes")
export class AttributeController {
  constructor(private readonly attrService: AttributeService) {}

  @Roles("admin")
  @Post()
  async createAttribute(@Body() dto: CUAttributeDto) {
    return this.attrService.createAttribute(dto);
  }

  @Public()
  @Get()
  async getAttributes(@Query() dto: GetAttributesDto) {
    return this.attrService.getAttributes(dto);
  }

  @Roles("admin")
  @Get("/:attrId")
  async getAttribute(@Param() dto: RDAttributeDto) {
    return this.attrService.getAttribute(dto);
  }

  @Roles("admin")
  @Put("/:attrId")
  async updateAttribute(
    @Param("attrId") attrId: string,
    @Body() dto: CUAttributeDto
  ) {
    return this.attrService.updateAttribute(dto, attrId);
  }

  @Roles("admin")
  @Delete("/:attrId")
  async deleteAttribute(@Param() dto: RDAttributeDto) {
    return this.attrService.deleteAttribute(dto);
  }
}
