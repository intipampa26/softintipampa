import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campana } from './campana.entity';
import { CampanasService } from './campanas.service';
import { CampanasController } from './campanas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Campana])],
  controllers: [CampanasController],
  providers: [CampanasService],
  exports: [CampanasService],
})
export class CampanasModule {}
