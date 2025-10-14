import { Module } from '@nestjs/common';
import { AttributeService } from './attribute.service';
import { AttributeController } from './attribute.controller';

@Module({
  providers: [AttributeService],
  controllers: [AttributeController]
})
export class AttributeModule {}
