import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Parcela } from './parcela.entity';
import { ParcelasService } from './parcelas.service';
import { ParcelasController } from './parcelas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Parcela])],
  controllers: [ParcelasController],
  providers: [ParcelasService],
  exports: [ParcelasService],
})
export class ParcelasModule {}
