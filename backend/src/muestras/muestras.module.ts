import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Muestra } from './muestra.entity';
import { EvaluacionFisica } from './evaluacion-fisica.entity';
import { EvaluacionSensorial } from './evaluacion-sensorial.entity';
import { MuestrasService } from './muestras.service';
import { MuestrasController } from './muestras.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Muestra, EvaluacionFisica, EvaluacionSensorial])],
  controllers: [MuestrasController],
  providers: [MuestrasService],
  exports: [MuestrasService],
})
export class MuestrasModule {}
