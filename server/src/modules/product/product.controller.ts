import { Body, Controller, Param, Query } from "@nestjs/common";
import { ProductService } from "./product.service";
import type {
  CUProductDto,
  GetProductsDto,
  RDProductDto,
} from "@/common/dto/product.dto";
import { Roles } from "@/common/decorators/roles.decorator";
import { Public } from "@/common/decorators/public.decorator";

@Controller("products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Roles("admin")
  async createProduct(@Body() dto: CUProductDto) {
    return this.productService.createProduct(dto);
  }

  @Roles("admin")
  async updateProduct(
    @Body() dto: CUProductDto,
    @Param("productId") productId: string
  ) {
    return this.productService.updateProduct(dto, productId);
  }

  @Public()
  async getProduct(@Param() dto: RDProductDto) {
    return this.productService.getProduct(dto);
  }

  @Public()
  async getProducts(@Query() dto: GetProductsDto) {
    return this.productService.getProducts(dto);
  }

  @Roles("admin")
  async deleteProduct(@Param() dto: RDProductDto) {
    return this.productService.deleteProduct(dto);
  }
}
