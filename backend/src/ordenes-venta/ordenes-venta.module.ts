import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenVenta }           from './orden-venta.entity';
import { OrdenPaso }            from './orden-paso.entity';
import { OrdenPreventa }        from './orden-preventa.entity';
import { OrdenCotizacion }      from './orden-cotizacion.entity';
import { OrdenAlistado }        from './orden-alistado.entity';
import { OrdenExportacion }     from './orden-exportacion.entity';
import { OrdenPostVenta }       from './orden-post-venta.entity';
import { OrdenesVentaService }  from './ordenes-venta.service';
import { OrdenesVentaController } from './ordenes-venta.controller';
import { Muestra }              from '../muestras/muestra.entity';
import { LoteFinal }            from '../lotes-finales/lote-final.entity';
import { KardexModule }         from '../kardex/kardex.module';

@Module({
  imports:     [TypeOrmModule.forFeature([OrdenVenta, OrdenPaso, OrdenPreventa, OrdenCotizacion, OrdenAlistado, OrdenExportacion, OrdenPostVenta, Muestra, LoteFinal]), KardexModule],
  controllers: [OrdenesVentaController],
  providers:   [OrdenesVentaService],
  exports:     [OrdenesVentaService],
})
export class OrdenesVentaModule {}
