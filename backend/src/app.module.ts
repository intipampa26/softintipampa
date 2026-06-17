import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { CampanasModule } from './campanas/campanas.module';
import { ProductosModule } from './productos/productos.module';
import { ProductoresModule } from './productores/productores.module';
import { ParcelasModule } from './parcelas/parcelas.module';
import { ClientesModule } from './clientes/clientes.module';
import { EvidenciasModule } from './evidencias/evidencias.module';
import { EvidenciasFamiliaresModule } from './evidencias-familiares/evidencias-familiares.module';
import { FamiliaresProductorModule } from './familiares-productor/familiares-productor.module';
import { ConfiguracionModule } from './configuracion/configuracion.module';
import { ParcelasCampanaModule } from './parcelas-campana/parcelas-campana.module';

import { TiposProductoModule } from './tipos-producto/tipos-producto.module';
import { LotesModule } from './lotes/lotes.module';
import { LotesFinalesModule } from './lotes-finales/lotes-finales.module';
import { TrilladoModule } from './trillado/trillado.module';
import { KardexModule } from './kardex/kardex.module';
import { MuestrasModule } from './muestras/muestras.module';
import { ReportesModule } from './reportes/reportes.module';
import { MermasModule }  from './mermas/mermas.module';
import { Merma }         from './mermas/merma.entity';

import { User } from './users/user.entity';
import { Campana } from './campanas/campana.entity';
import { Producto } from './productos/producto.entity';
import { Productor } from './productores/productor.entity';
import { Parcela } from './parcelas/parcela.entity';
import { Cliente } from './clientes/cliente.entity';
import { Evidencia } from './evidencias/evidencia.entity';
import { EvidenciaFamiliar } from './evidencias-familiares/evidencia-familiar.entity';
import { FamiliarProductor } from './familiares-productor/familiar-productor.entity';
import { Configuracion } from './configuracion/configuracion.entity';
import { ParcelaCampana } from './parcelas-campana/parcela-campana.entity';

import { TipoProducto } from './tipos-producto/tipo-producto.entity';
import { Lote } from './lotes/lote.entity';
import { LoteFinal } from './lotes-finales/lote-final.entity';
import { LoteFinalOrigen } from './lotes-finales/lote-final-origen.entity';
import { Trillado } from './trillado/trillado.entity';
import { MovimientoKardex } from './kardex/movimiento-kardex.entity';
import { Muestra } from './muestras/muestra.entity';
import { EvaluacionFisica } from './muestras/evaluacion-fisica.entity';
import { EvaluacionSensorial } from './muestras/evaluacion-sensorial.entity';

import { AppController } from './app.controller';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { DelayInterceptor } from './common/interceptors/delay.interceptor';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host:     config.get<string>('DATABASE_HOST', 'localhost'),
        port:     config.get<number>('DATABASE_PORT', 5432),
        username: config.get<string>('DATABASE_USER', 'intipampa_user'),
        password: config.get<string>('DATABASE_PASSWORD', 'intipampa_pass'),
        database: config.get<string>('DATABASE_NAME', 'intipampa'),
        entities: [
          
          User, Campana, Producto, Productor, Parcela, Cliente,
          Evidencia, EvidenciaFamiliar, FamiliarProductor,
          Configuracion, ParcelaCampana,
          
          TipoProducto,
          Lote, LoteFinal, LoteFinalOrigen,
          Trillado, MovimientoKardex,
          Muestra, EvaluacionFisica, EvaluacionSensorial,
          Merma,
        ],
        synchronize: true,
        logging: config.get<string>('NODE_ENV') === 'development',
      }),
    }),

    
    AuthModule, UsersModule, DatabaseModule,
    CampanasModule, ProductosModule, ProductoresModule,
    ParcelasModule, ClientesModule,
    EvidenciasModule, EvidenciasFamiliaresModule,
    FamiliaresProductorModule,
    ConfiguracionModule, ParcelasCampanaModule,
    
    TiposProductoModule,
    LotesModule, LotesFinalesModule,
    TrilladoModule, KardexModule,
    MuestrasModule,
    ReportesModule,
    MermasModule,
  ],

  controllers: [AppController],

  providers: [
    { provide: APP_FILTER,      useClass: AllExceptionsFilter  },
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor  },
    { provide: APP_INTERCEPTOR, useClass: DelayInterceptor     },
  ],
})
export class AppModule {}
