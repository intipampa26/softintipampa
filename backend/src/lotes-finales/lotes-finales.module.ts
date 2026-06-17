import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoteFinal } from './lote-final.entity';
import { LoteFinalOrigen } from './lote-final-origen.entity';
import { Trillado } from '../trillado/trillado.entity';
import { LotesFinalesService } from './lotes-finales.service';
import { LotesFinalesController } from './lotes-finales.controller';
import { KardexModule }   from '../kardex/kardex.module';
import { MermasModule }  from '../mermas/mermas.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LoteFinal, LoteFinalOrigen, Trillado]),
    KardexModule,
    MermasModule,
  ],
  controllers: [LotesFinalesController],
  providers: [LotesFinalesService],
  exports: [TypeOrmModule, LotesFinalesService],
})
export class LotesFinalesModule {}
