import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvidenciaFamiliar } from './evidencia-familiar.entity';
import { EvidenciasFamiliaresService } from './evidencias-familiares.service';
import { EvidenciasFamiliaresController } from './evidencias-familiares.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EvidenciaFamiliar])],
  controllers: [EvidenciasFamiliaresController],
  providers: [EvidenciasFamiliaresService],
  exports: [EvidenciasFamiliaresService],
})
export class EvidenciasFamiliaresModule {}
