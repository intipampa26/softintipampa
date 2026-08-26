import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KardexService } from './kardex.service';
import { KardexController } from './kardex.controller';
import { MovimientoKardex } from './movimiento-kardex.entity';
import { LoteFinalOrigen } from '../lotes-finales/lote-final-origen.entity';
import { Trillado } from '../trillado/trillado.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MovimientoKardex, LoteFinalOrigen, Trillado])],
  controllers: [KardexController],
  providers: [KardexService],
  exports:   [KardexService],
})
export class KardexModule {}
