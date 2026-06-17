
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FamiliarProductor } from './familiar-productor.entity';
import { FamiliaresProductorService } from './familiares-productor.service';
import { FamiliaresProductorController } from './familiares-productor.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FamiliarProductor])],
  controllers: [FamiliaresProductorController],
  providers: [FamiliaresProductorService],
  exports: [FamiliaresProductorService],
})
export class FamiliaresProductorModule {}
