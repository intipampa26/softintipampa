import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParcelaCampana } from './parcela-campana.entity';
import { ParcelasCampanaService } from './parcelas-campana.service';
import { ParcelasCampanaController } from './parcelas-campana.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ParcelaCampana])],
  providers: [ParcelasCampanaService],
  controllers: [ParcelasCampanaController],
  exports: [ParcelasCampanaService],
})
export class ParcelasCampanaModule {}
