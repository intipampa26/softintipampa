import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Campana }   from '../campanas/campana.entity';
import { Productor } from '../productores/productor.entity';
import { Lote }      from '../lotes/lote.entity';
import { LoteFinal } from '../lotes-finales/lote-final.entity';
import { Muestra }   from '../muestras/muestra.entity';

import { ReportesService }    from './reportes.service';
import { ReportesController } from './reportes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Campana, Productor, Lote, LoteFinal, Muestra])],
  controllers: [ReportesController],
  providers:   [ReportesService],
})
export class ReportesModule {}
