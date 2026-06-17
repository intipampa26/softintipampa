import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Productor } from './productor.entity';
import { ProductoresService } from './productores.service';
import { ProductoresController } from './productores.controller';
import { ExcelImportService } from './excel-import.service';
import { CampanasModule } from '../campanas/campanas.module';
import { FamiliarProductor } from '../familiares-productor/familiar-productor.entity';
import { Parcela } from '../parcelas/parcela.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Productor, FamiliarProductor, Parcela]),
    CampanasModule,
  ],
  controllers: [ProductoresController],
  providers: [ProductoresService, ExcelImportService],
  exports: [ProductoresService],
})
export class ProductoresModule {}
