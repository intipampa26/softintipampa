import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sku } from './sku.entity';
import { SkusService } from './skus.service';
import { SkusController } from './skus.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Sku])],
  controllers: [SkusController],
  providers: [SkusService],
  exports: [TypeOrmModule, SkusService],
})
export class SkusModule {}
