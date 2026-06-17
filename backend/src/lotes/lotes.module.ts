import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lote } from './lote.entity';
import { LotesService } from './lotes.service';
import { LotesController } from './lotes.controller';
import { LotesFinalesModule } from '../lotes-finales/lotes-finales.module';
import { KardexModule } from '../kardex/kardex.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lote]),
    LotesFinalesModule,
    KardexModule,
  ],
  controllers: [LotesController],
  providers: [LotesService],
  exports: [LotesService],
})
export class LotesModule {}
