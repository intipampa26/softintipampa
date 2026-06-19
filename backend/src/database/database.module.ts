import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { UsersModule } from '../users/users.module';
import { ClientesModule } from '../clientes/clientes.module';
import { TiposProductoModule } from '../tipos-producto/tipos-producto.module';

import { Campana }             from '../campanas/campana.entity';
import { Productor }           from '../productores/productor.entity';
import { Parcela }             from '../parcelas/parcela.entity';
import { FamiliarProductor }   from '../familiares-productor/familiar-productor.entity';
import { Lote }                from '../lotes/lote.entity';
import { LoteFinal }           from '../lotes-finales/lote-final.entity';
import { LoteFinalOrigen }     from '../lotes-finales/lote-final-origen.entity';
import { Trillado }            from '../trillado/trillado.entity';
import { MovimientoKardex }     from '../kardex/movimiento-kardex.entity';
import { Muestra }             from '../muestras/muestra.entity';
import { EvaluacionFisica }    from '../muestras/evaluacion-fisica.entity';
import { EvaluacionSensorial } from '../muestras/evaluacion-sensorial.entity';
import { OrdenVenta }          from '../ordenes-venta/orden-venta.entity';
import { OrdenPaso }           from '../ordenes-venta/orden-paso.entity';
import { OrdenPreventa }       from '../ordenes-venta/orden-preventa.entity';
import { OrdenCotizacion }     from '../ordenes-venta/orden-cotizacion.entity';
import { OrdenAlistado }       from '../ordenes-venta/orden-alistado.entity';
import { OrdenExportacion }    from '../ordenes-venta/orden-exportacion.entity';
import { OrdenPostVenta }      from '../ordenes-venta/orden-post-venta.entity';
import { Merma }               from '../mermas/merma.entity';

@Module({
  imports: [
    UsersModule,
    ClientesModule,
    TiposProductoModule,
    TypeOrmModule.forFeature([
      Campana, Productor, Parcela, FamiliarProductor,
      Lote, LoteFinal, LoteFinalOrigen,
      Trillado, MovimientoKardex,
      Muestra, EvaluacionFisica, EvaluacionSensorial,
      OrdenVenta, OrdenPaso, OrdenPreventa, OrdenCotizacion,
      OrdenAlistado, OrdenExportacion, OrdenPostVenta,
      Merma,
    ]),
  ],
  providers: [SeedService],
})
export class DatabaseModule {}
