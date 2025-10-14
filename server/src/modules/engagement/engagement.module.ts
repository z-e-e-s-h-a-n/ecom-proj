import { Module } from "@nestjs/common";
import { ProductEngagementService } from "./engagement.service";
import { ProductEngagementController } from "./engagement.controller";

@Module({
  providers: [ProductEngagementService],
  controllers: [ProductEngagementController],
})
export class ProductEngagementModule {}
